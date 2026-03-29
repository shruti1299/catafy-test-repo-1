"use client";

import {
    Badge,
    Button,
    Collapse,
    Drawer,
    Empty,
    message,
    Skeleton,
    Space,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import { useEffect, useState } from "react";
import {
    AppstoreOutlined,
    EditOutlined,
    EyeOutlined,
    LockOutlined,
    PlusOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import api from "@/api";
import { ICatalog } from "@/interfaces/Catalog";
import { API_ENDPOINTS } from "@/api/endpoints";
import SectionsPanel from "./SectionsPanel";

interface ISection {
    id: number;
    name: string;
    description?: string;
    order: number;
    status: boolean;
    catalogs: ICatalog[];
    card_type: string;
}

interface Props {
    selectedCatalog: ICatalog;
    onSelectCatalog: (catalog: ICatalog) => void;
    onEditCatalog: (catalog: ICatalog) => void;
}

export default function SectionsCatalogTree({ selectedCatalog, onSelectCatalog, onEditCatalog }: Props) {
    const [sections, setSections] = useState<ISection[]>([]);
    const [loading, setLoading] = useState(false);
    const [manageOpen, setManageOpen] = useState(false);

    const fetchSections = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`${API_ENDPOINTS.SECTIONS}?per_page=100`);
            const list: ISection[] = Array.isArray(data) ? data : data?.data ?? [];
            setSections(list.sort((a, b) => a.order - b.order));
        } catch {
            message.error("Failed to load sections");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    /* ── Loading ─────────────────────────────────────────────── */
    if (loading) {
        return <Skeleton active paragraph={{ rows: 8 }} style={{ padding: "12px 10px" }} />;
    }

    /* ── Empty ───────────────────────────────────────────────── */
    if (sections.length === 0) {
        return (
            <div style={{ padding: 16 }}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No sections yet" style={{ marginTop: 24 }}>
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setManageOpen(true)}
                        style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" }}
                    >
                        Create First Section
                    </Button>
                </Empty>
                <ManageDrawer open={manageOpen} onClose={() => { setManageOpen(false); fetchSections(); }} />
            </div>
        );
    }

    /* ── Collapse panels ─────────────────────────────────────── */
    const collapseItems = sections.map((sec) => ({
        key: String(sec.id),
        label: (
            <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", minWidth: 0 }}>
                <span
                    style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: sec.status ? "#10b981" : "#cbd5e1",
                    }}
                />
                <span style={{
                    flex: 1,
                    fontWeight: 600,
                    fontSize: 12,
                    color: "#0f172a",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}>
                    {sec.name}
                </span>
                <Badge
                    count={sec.catalogs?.length ?? 0}
                    color="#6366f1"
                    style={{ fontSize: 10, flexShrink: 0 }}
                    overflowCount={99}
                />
            </div>
        ),
        children: sec.catalogs?.length ? (
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
                {sec.catalogs.map((cat) => (
                    <CatalogRow
                        key={cat.id}
                        cat={cat}
                        isActive={cat.id === selectedCatalog?.id}
                        onSelect={() => onSelectCatalog(cat)}
                        onEdit={() => onEditCatalog(cat)}
                    />
                ))}
            </div>
        ) : (
            <Typography.Text type="secondary" style={{ fontSize: 12, padding: "4px 2px", display: "block" }}>
                No catalogs in this section
            </Typography.Text>
        ),
    }));

    return (
        <div>
            {/* ── Top toolbar ────────────────────────────── */}
            <div style={{ paddingBottom: 10, display: "flex", justifyContent: "flex-end" }}>
                <Button
                    size="small"
                    type="text"
                    icon={<SettingOutlined style={{ fontSize: 11 }} />}
                    style={{ color: "#6366f1", fontSize: 11 }}
                    onClick={() => setManageOpen(true)}
                >
                    Manage sections
                </Button>
            </div>

            {/* ── Section → Catalog tree ──────────────────── */}
            <Collapse
                ghost
                defaultActiveKey={sections[0] ? [String(sections[0].id)] : []}
                style={{ padding: "0 6px 12px" }}
                items={collapseItems}
            />

            {/* ── Manage sections drawer ──────────────────── */}
            <ManageDrawer open={manageOpen} onClose={() => { setManageOpen(false); fetchSections(); }} />
        </div>
    );
}

/* ── Catalog row (no drag handle) ────────────────────────── */
function CatalogRow({
    cat,
    isActive,
    onSelect,
    onEdit,
}: {
    cat: ICatalog;
    isActive: boolean;
    onSelect: () => void;
    onEdit: () => void;
}) {
    return (
        <div
            onClick={onSelect}
            style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: isActive ? "1.5px solid #6366f1" : "1px solid #f1f5f9",
                background: isActive ? "#eef2ff" : "#fff",
                boxShadow: isActive ? "0 2px 8px rgba(99,102,241,0.1)" : "0 1px 2px rgba(0,0,0,0.04)",
                cursor: "pointer",
                transition: "all 0.15s ease",
            }}
        >
            {/* Row 1: icon + name + product count */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <AppstoreOutlined style={{ fontSize: 11, color: isActive ? "#6366f1" : "#cbd5e1", flexShrink: 0 }} />
                <span style={{
                    flex: 1,
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 12,
                    color: isActive ? "#4338ca" : "#1e293b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}>
                    {cat.name}
                </span>
                {cat.products_count !== undefined && (
                    <span style={{ fontSize: 11, color: isActive ? "#6366f1" : "#94a3b8", fontWeight: 600, flexShrink: 0 }}>
                        {cat.products_count}
                    </span>
                )}
            </div>

            {/* Row 2: tags + edit */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 5 }}>
                <Space size={4}>
                    <Tag
                        color={cat.status ? "blue" : "default"}
                        style={{ fontSize: 10, margin: 0, padding: "0 5px", lineHeight: "18px", borderRadius: 4 }}
                    >
                        {cat.status ? "Active" : "Off"}
                    </Tag>
                    <Tooltip title={cat.visibilty === 2 ? "Locked" : "Public"}>
                        {cat.visibilty === 2
                            ? <LockOutlined style={{ fontSize: 11, color: "#94a3b8" }} />
                            : <EyeOutlined style={{ fontSize: 11, color: "#94a3b8" }} />}
                    </Tooltip>
                </Space>
                <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined style={{ fontSize: 11 }} />}
                    style={{ color: isActive ? "#6366f1" : "#94a3b8", padding: "0 4px" }}
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                />
            </div>
        </div>
    );
}

/* ── Manage sections drawer ──────────────────────────────── */
function ManageDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <Drawer
            title={<span style={{ fontWeight: 700 }}>Manage Sections</span>}
            open={open}
            onClose={onClose}
            width="55%"
            styles={{ body: { padding: 16 } }}
        >
            <SectionsPanel />
        </Drawer>
    );
}
