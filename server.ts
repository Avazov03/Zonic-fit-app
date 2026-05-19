import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import { GoogleGenAI, Modality } from "@google/genai";

import multer from "multer";
import fs from "fs";

const upload = multer({ dest: "uploads/" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Client (Primary)
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // OpenAI Client (Optional/Fallback)
  let openai: OpenAI | null = null;
  const getOpenAI = () => {
    if (!openai && process.env.OPENAI_API_KEY) {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return openai;
  };

  // API Routes
  app.post("/api/stt", upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      // Try OpenAI Whisper First
      try {
        const client = getOpenAI();
        if (client) {
          const transcription = await client.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: "whisper-1",
            language: "uz",
          });
          fs.unlinkSync(req.file.path);
          return res.json({ text: transcription.text });
        }
      } catch (openaiError: any) {
        const isQuotaError = openaiError.status === 429 || openaiError.statusCode === 429 || 
                            (openaiError.message && openaiError.message.includes('429')) ||
                            (openaiError.message && openaiError.message.includes('quota'));
        
        if (!isQuotaError) {
          throw openaiError;
        }
        console.warn("OpenAI Quota Exceeded, falling back to Gemini for STT...");
      }

      // Fallback to Gemini for STT
      const geminiSTTModels = ["gemini-flash-latest", "gemini-3-flash-preview", "gemini-3.1-flash-lite"];
      let sttAttemptError: any = null;

      for (const modelName of geminiSTTModels) {
        try {
          const audioBuffer = fs.readFileSync(req.file.path);
          const result = await genAI.models.generateContent({
            model: modelName,
            contents: {
              parts: [
                {
                  inlineData: {
                    data: audioBuffer.toString("base64"),
                    mimeType: "audio/webm",
                  },
                },
                { text: "Transcribe this audio exactly into Uzbek text. Return ONLY the transcription. If the audio is completely silent, contains only background noise, or no human speech is detected, return EXACTLY the string '[SILENT]'. Do not hallucinate greetings, thanks, or random subtitles. Do not explain or add anything else." }
              ],
            },
          });

          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          return res.json({ text: result.text || "" });
        } catch (geminiError: any) {
          sttAttemptError = geminiError;
          const isQuota = geminiError.status === 429 || geminiError.statusCode === 429 || 
                         (geminiError.message && (geminiError.message.includes('429') || geminiError.message.includes('quota')));
          
          if (isQuota) {
            console.warn(`Gemini STT Model ${modelName} hit quota, trying next...`);
            continue;
          }

          // If not found (404), try next
          if (geminiError.status === 404) {
            console.warn(`Gemini STT Model ${modelName} not found, trying next...`);
            continue;
          }
          
          console.error(`Gemini STT Error with ${modelName}:`, geminiError.message);
          // For other errors, we might still want to try the next model if it's transient, 
          // but if it's a structural error we should probably log it.
          continue; 
        }
      }

      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      console.error("All Gemini STT models failed. Final error:", sttAttemptError?.message);
      return res.status(500).json({ 
        error: "All AI STT services failed", 
        details: sttAttemptError?.message 
      });
    } catch (error: any) {
      console.error("STT Error:", error);
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      const status = error.status || 500;
      res.status(status).json({ error: "Speech-to-text failed", details: error.message });
    }
  });

  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    const models = ["gemini-3-flash-preview", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let lastError: any = null;

    for (const modelName of models) {
      try {
        // Mapping messages for Gemini
        const geminiMessages = messages.map((m: any) => ({
          role: m.role === 'system' ? 'system' : (m.role === 'model' || m.role === 'assistant' ? 'model' : 'user'),
          parts: [{ text: m.content || m.text || "" }]
        }));

        // Extract system message
        const systemIdx = geminiMessages.findIndex((m: any) => m.role === 'system');
        let systemInstruction = "";
        if (systemIdx !== -1) {
          systemInstruction = geminiMessages[systemIdx].parts[0].text;
          geminiMessages.splice(systemIdx, 1);
        }

        // Ensure alternating user/model
        const conversation = geminiMessages.filter((m: any) => m.role === 'user' || m.role === 'model');

        const stream = await genAI.models.generateContentStream({
          model: modelName,
          contents: conversation,
          config: {
            systemInstruction: systemInstruction || undefined,
          }
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        for await (const chunk of stream) {
          const dataChunk = {
            choices: [{
              delta: {
                content: chunk.text
              }
            }]
          };
          res.write(`data: ${JSON.stringify(dataChunk)}\n\n`);
        }
        res.write("data: [DONE]\n\n");
        return res.end();
      } catch (error: any) {
        lastError = error;
        const isQuotaError = error.status === 429 || error.statusCode === 429 ||
                            (error.message && (error.message.includes('429') || error.message.includes('quota')));
        
        const isNotFoundError = error.status === 404;
        const isUnavailableError = error.status === 503;

        if (isQuotaError || isNotFoundError || isUnavailableError) {
          console.warn(`Model ${modelName} ${isQuotaError ? 'quota' : (isNotFoundError ? 'not found' : 'unavailable')}, trying next model...`);
          continue;
        }
        // For other errors, also try next but log it
        console.error(`Error with model ${modelName}:`, error.message);
        continue;
      }
    }

    console.error("All Chat models failed:", lastError);
    res.status(503).json({ error: "All Gemini models are temporarily unavailable or failing.", details: lastError?.message });
  });

   app.post("/api/tts", async (req, res) => {
    const { text, voice = "alloy" } = req.body;
    
    // Try OpenAI first, but handle failure gracefully
    const maxRetries = 2;
    let lastError: any = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const client = getOpenAI();
        if (client) {
          const mp3 = await client.audio.speech.create({
            model: "tts-1",
            voice: voice as any,
            input: text,
          }, { timeout: 8000 }); // 8s timeout
          const buffer = Buffer.from(await mp3.arrayBuffer());
          res.set("Content-Type", "audio/mpeg");
          return res.send(buffer);
        }
        break; // No client
      } catch (openaiErr: any) {
        lastError = openaiErr;
        const isQuota = openaiErr.status === 429 || (openaiErr.message && openaiErr.message.includes('quota'));
        if (isQuota) {
          console.warn("OpenAI TTS Quota Exceeded, switching to Gemini...");
          break;
        }
        console.warn(`OpenAI TTS attempt ${i+1} failed:`, openaiErr.message);
        if (i < maxRetries - 1) await new Promise(r => setTimeout(r, 400));
      }
    }

    // Gemini TTS Fallback
    for (let i = 0; i < maxRetries; i++) {
        try {
          const response = await genAI.models.generateContent({
            model: "gemini-3.1-flash-tts-preview",
            contents: [{ parts: [{ text }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
              },
            },
          });
    
          const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            const samples = Buffer.from(base64Audio, 'base64');
            const wavBuffer = encodeWAV(samples, 24000);
            res.set("Content-Type", "audio/wav");
            return res.send(wavBuffer);
          }
          break;
        } catch (geminiErr: any) {
          lastError = geminiErr;
          const isQuota = geminiErr.status === 429 || (geminiErr.message && geminiErr.message.includes('quota'));
          if (isQuota) {
             console.warn("Gemini TTS Quota Exceeded");
             break;
          }
          console.warn(`Gemini TTS attempt ${i+1} failed:`, geminiErr.message);
          if (i < maxRetries - 1) await new Promise(r => setTimeout(r, 400));
        }
    }

    if (lastError?.status === 429) {
      return res.status(429).json({ error: "TTS Quota Exceeded" });
    }
    console.error("All Cloud TTS providers failed:", lastError?.message);
    res.status(500).json({ error: "Cloud TTS generation failed" });
  });

  function encodeWAV(samples: Buffer, sampleRate: number) {
    const buffer = Buffer.alloc(44 + samples.length);
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + samples.length, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20); // PCM
    buffer.writeUInt16LE(1, 22); // Mono
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28); // 16-bit mono byte rate
    buffer.writeUInt16LE(2, 32); // Block align
    buffer.writeUInt16LE(16, 34); // Bits per sample
    buffer.write('data', 36);
    buffer.writeUInt32LE(samples.length, 40);
    samples.copy(buffer, 44);
    return buffer;
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
