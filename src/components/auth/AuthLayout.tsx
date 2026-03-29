"use client";

import Image from "next/image";
import { Logo } from "@/images/index";
import React from "react";

const FEATURES = [
    {
        icon: "📱",
        title: "Share in seconds",
        desc: "Send your catalog link via WhatsApp, SMS or email — customers browse instantly without downloading an app.",
    },
    {
        icon: "🛒",
        title: "Collect orders directly",
        desc: "Buyers add to cart and place orders right inside your catalog — no separate checkout needed.",
    },
    {
        icon: "📊",
        title: "Real-time visitor tracking",
        desc: "See who opened your catalog, which products they viewed, and when — all live.",
    },
    {
        icon: "🎨",
        title: "Beautiful, branded pages",
        desc: "Customise colours, logo and layout to match your brand in minutes.",
    },
];

interface Props {
    children: React.ReactNode;
    /** Shown as the right-panel heading */
    title: string;
    /** Subtext below the title */
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: Props) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>

            {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
            <div style={{
                width: "42%",
                minHeight: "100vh",
                background: "linear-gradient(155deg, #1e1b4b 0%, #3730a3 45%, #4f46e5 75%, #6366f1 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "48px 44px",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
            }}
                className="auth-left-panel"
            >
                {/* Decorative blobs */}
                <div style={{
                    position: "absolute", width: 320, height: 320,
                    borderRadius: "50%", background: "rgba(99,102,241,0.25)",
                    top: -80, right: -80, filter: "blur(60px)",
                }} />
                <div style={{
                    position: "absolute", width: 240, height: 240,
                    borderRadius: "50%", background: "rgba(139,92,246,0.2)",
                    bottom: 60, left: -60, filter: "blur(50px)",
                }} />

                {/* Logo */}
                <div style={{ marginBottom: 20, position: "relative" }}>
                    <Image
                        src={Logo}
                        width={130}
                        height={130}
                        style={{ height: "auto" }}
                        alt="Catafy"
                    />
                </div>

                {/* Hero headline */}
                <h1 style={{
                    color: "#fff",
                    fontSize: 28,
                    fontWeight: 800,
                    lineHeight: 1.3,
                    margin: "0 0 10px",
                    position: "relative",
                }}>
                    Grow your business<br />with digital catalogs
                </h1>
                <p style={{
                    color: "rgba(199,210,254,0.85)",
                    fontSize: 15,
                    margin: "0 0 36px",
                    lineHeight: 1.6,
                    position: "relative",
                }}>
                    Join 1,000+ businesses using Catafy to share products, collect orders and track buyers — all from one link.
                </p>

                {/* Feature list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
                    {FEATURES.map((f) => (
                        <div key={f.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                            <div style={{
                                width: 38, height: 38,
                                borderRadius: 10,
                                background: "rgba(255,255,255,0.12)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 18, flexShrink: 0,
                            }}>
                                {f.icon}
                            </div>
                            <div>
                                <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{f.title}</div>
                                <div style={{ color: "rgba(199,210,254,0.7)", fontSize: 12, lineHeight: 1.5 }}>{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust badge */}
                <div style={{
                    marginTop: 44,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    position: "relative",
                }}>
                    <div style={{ fontSize: 22 }}>⭐</div>
                    <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Loved by businesses across India</div>
                        <div style={{ color: "rgba(199,210,254,0.7)", fontSize: 11 }}>4.8 / 5 average rating · 1,000+ active stores</div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ────────────────────────────────────────────── */}
            <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 48px",
                overflowY: "auto",
            }}>
                <div style={{ width: "100%", maxWidth: 520 }}>
                    {/* Mobile logo */}
                    <div className="auth-mobile-logo" style={{ marginBottom: 24, display: "none" }}>
                        <Image src={Logo} width={100} height={32} style={{ height: "auto" }} alt="Catafy" />
                    </div>

                    {/* Heading */}
                    <div style={{ marginBottom: 28 }}>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>{title}</h2>
                        {subtitle && (
                            <p style={{ fontSize: 14, color: "#64748b", margin: "6px 0 0" }}>{subtitle}</p>
                        )}
                    </div>

                    {/* Form content */}
                    {children}
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .auth-left-panel { display: none !important; }
                    .auth-mobile-logo { display: block !important; }
                }
            `}</style>
        </div>
    );
}
