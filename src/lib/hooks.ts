import { useState, useEffect } from 'react';

export function useActiveFrame() {
  const [activeFrame, setActiveFrame] = useState<string | null>(localStorage.getItem("activeAvatarFrame"));

  useEffect(() => {
    const handleStorageChange = () => {
      setActiveFrame(localStorage.getItem("activeAvatarFrame"));
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('activeFrameUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('activeFrameUpdate', handleStorageChange);
    };
  }, []);

  return activeFrame;
}
