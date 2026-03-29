"use client";
import React, { useState, useEffect } from "react";
import { Joyride } from "react-joyride";

const OnboardingTour = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seenTour");
    if (!seen) {
      setRun(true);
      localStorage.setItem("seenTour", "true");
    }
  }, []);

  const startTour = () => {
    setRun(false); // reset
    setTimeout(() => setRun(true), 100);
  };

  const steps = [
    {
      target: ".tour-dashboard",
      content: "View your business performance and quick stats here.",
      placement: "right",
    },
    {
      target: ".tour-catalog",
      content: "Manage your catalogs and organize products.",
      placement: "right",
    },
    {
      target: ".tour-inventory",
      content: "Track stock levels and inventory updates.",
      placement: "right",
    },
    {
      target: ".tour-orders",
      content: "View and manage all customer orders.",
      placement: "right",
    },
    {
      target: ".tour-customers",
      content: "Access and manage your customer data.",
      placement: "right",
    },
    {
      target: ".tour-analytics",
      content: "Analyze performance and growth trends.",
      placement: "right",
    },
    {
      target: ".tour-settings",
      content: "Update your account and application settings.",
      placement: "right",
    },
  ];

  return (
    <>
      {/* 🔘 Take a Tour Button */}
      <button
        onClick={startTour}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          background: "#1677ff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 16px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        Take a Tour
      </button>

      {/* 🎯 Tour */}
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        showProgress
        disableScrolling
        styles={{
          options: {
            primaryColor: "#1677ff",
            textColor: "#333",
            zIndex: 1000,
          },
          tooltip: {
            borderRadius: "10px",
            padding: "12px",
          },
          buttonNext: {
            backgroundColor: "#1677ff",
          },
          buttonBack: {
            color: "#555",
          },
        }}
      />
    </>
  );
};

export default OnboardingTour;