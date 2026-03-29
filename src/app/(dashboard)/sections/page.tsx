"use client";

import { Card } from "antd";
import BackButton from "@/components/common/back-button";
import SectionsPanel from "@/components/catalog/SectionsPanel";

export default function SectionsPage() {
    return (
        <>
            <BackButton />
            <Card
                title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🗂️ Catalog Sections</span>}
                styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
                style={{ borderRadius: 12 }}
            >
                <SectionsPanel />
            </Card>
        </>
    );
}
