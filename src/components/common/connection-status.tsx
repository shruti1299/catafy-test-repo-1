"use client";
import React, { useEffect, useState } from "react";

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [fade, setFade] = useState<boolean>(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        setFade(true);
        setTimeout(() => setIsOnline(true), 300);
      } else {
        setIsOnline(false);
        setFade(false);
      }
    };

    setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 font-medium text-center p-4 z-50 transition-opacity duration-300 ease-in ${
        isOnline ? "opacity-0 hidden " : "bg-red-700 text-white opacity-100 "
      }`}
      style={{ opacity: fade ? 0 : 1 }}
    >
      {isOnline ? null : "You are currently offline. Please check your internet connection."}
    </div>
  );
};

export default ConnectionStatus;
