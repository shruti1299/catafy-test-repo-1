import { Tooltip } from 'antd';
import React from 'react'
import { UserOutlined, FireFilled } from "@ant-design/icons";

export default function LiveIcon({ title }: { title?: string }) {

    const isLive = true;

    const blinkStyle: React.CSSProperties = {
        color: "red",
        animation: "blink 1.5s infinite",
    };

    const styleSheet = `
    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.3; }
      100% { opacity: 1; }
    }
  `;
    return (
        <>
            <style>{styleSheet}</style>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {isLive ? (
                    <Tooltip title="Active in last 15 min">
                        <FireFilled style={blinkStyle} />
                    </Tooltip>
                ) : (
                    <Tooltip title="No recent activity">
                        <UserOutlined style={{ color: "#999" }} />
                    </Tooltip>
                )}
                {title || "Live Visitors"}
            </span>
        </>
    )
}
