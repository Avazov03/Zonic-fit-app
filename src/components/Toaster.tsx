import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Bell, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Toast types
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  icon?: React.ReactNode;
  duration?: number;
  description?: string;
}

// Simple internal store
let listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export const toast = Object.assign(
  (msg: string, options?: { icon?: React.ReactNode, duration?: number }) => addToast(msg, 'info', options),
  {
    success: (msg: string, options?: { icon?: React.ReactNode, duration?: number }) => addToast(msg, 'success', options),
    error: (msg: string, options?: { icon?: React.ReactNode, duration?: number }) => addToast(msg, 'error', options),
    info: (msg: string, options?: { icon?: React.ReactNode, duration?: number }) => addToast(msg, 'info', options),
    warning: (msg: string, options?: { icon?: React.ReactNode, duration?: number }) => addToast(msg, 'warning', options),
    dismiss: (id: string) => {
      toasts = toasts.filter(t => t.id !== id);
      emit();
    }
  }
);

function addToast(message: string, type: ToastType, options?: { icon?: React.ReactNode, duration?: number }) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: Toast = { id, message, type, ...options };
  toasts = [newToast, ...toasts].slice(0, 5); 
  emit();
  
  if (options?.duration !== 0) {
    setTimeout(() => toast.dismiss(id), options?.duration || 4000);
  }
  return id;
}

function emit() {
  listeners.forEach(l => l([...toasts]));
}

export function CustomToaster() {
  const [activeToasts, setActiveToasts] = useState<Toast[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    listeners.push(setActiveToasts);
    return () => {
      listeners = listeners.filter(l => l !== setActiveToasts);
    };
  }, []);

  // Limit how many toasts are rendered to keep performance high
  const visibleToasts = activeToasts.slice(0, 5);

  return (
    <div 
      className="fixed top-8 left-0 right-0 z-[1000] flex flex-col items-center pointer-events-none px-6"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onTouchStart={() => setIsExpanded(true)}
    >
      <div 
        className={cn(
          "relative w-full max-w-[380px] transition-all duration-500 ease-out",
          isExpanded ? "h-[400px]" : "h-16"
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleToasts.map((t, index) => {
            const isTop = index === 0;
            
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ 
                  opacity: index > 2 && !isExpanded ? 0 : 1, 
                  y: isExpanded ? index * 74 : index * 10,
                  scale: isExpanded ? 1 : 1 - (index * 0.04),
                  zIndex: activeToasts.length - index,
                  filter: !isExpanded && index > 0 ? `blur(${index * 0.5}px)` : 'blur(0px)',
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  y: -20,
                  transition: { duration: 0.2, ease: "easeIn" } 
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                  mass: 1
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 80) {
                    toast.dismiss(t.id);
                  }
                }}
                className={cn(
                  "absolute top-0 w-full pointer-events-auto cursor-grab active:cursor-grabbing origin-top",
                  !isExpanded && !isTop && "pointer-events-none"
                )}
              >
                <div className="relative group">
                  <div className={cn(
                    "bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-3 px-4 flex items-center gap-3 overflow-hidden",
                    !isExpanded && index > 0 && "after:absolute after:inset-0 after:bg-black/20"
                  )}>
                    {/* Icon Container */}
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/5",
                      t.type === 'success' ? "text-primary" :
                      t.type === 'error' ? "text-red-500" :
                      "text-white/60"
                    )}>
                      {t.icon || (
                        t.type === 'success' ? <Check className="w-4 h-4" /> :
                        t.type === 'error' ? <AlertCircle className="w-4 h-4" /> :
                        <Bell className="w-4 h-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-white leading-tight truncate">
                        {t.message}
                      </p>
                    </div>

                    {/* Close Button - Only visible when expanded or on top */}
                    {(isExpanded || isTop) && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.dismiss(t.id);
                        }}
                        className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all hover:bg-white/10"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
