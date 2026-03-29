"use client";

import {
    Badge,
    Button,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Popconfirm,
    Select,
    Space,
    Switch,
    Tag,
    Typography,
    Empty,
} from "antd";
import { useEffect, useState } from "react";
import {
    AppstoreOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    RadiusSettingOutlined,
} from "@ant-design/icons";
import api from "@/api";
import { ICatalog } from "@/interfaces/Catalog";
import { API_ENDPOINTS } from "@/api/endpoints";

interface ISection {
    id: number;
    name: string;
    description?: string;
    order: number;
    status: boolean;
    catalogs: ICatalog[];
    card_type: "card" | "circle";
}

const CARD_TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
    card: { label: "Rectangle", icon: <AppstoreOutlined /> },
    circle: { label: "Circle", icon: <RadiusSettingOutlined /> }
};

const CARD_TYPE_OPTIONS = [
    { value: "card", label: "Rectangle Card" },
    { value: "circle", label: "Circle Card" }
];

interface Props {
    /** When embedded in the catalog sidebar (320px), compact=true trims padding */
    compact?: boolean;
}

export default function SectionsPanel({ compact = false }: Props) {
    const [sections, setSections] = useState<ISection[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ISection | null>(null);
    const [saving, setSaving] = useState(false);
    const [catalogs, setCatalogs] = useState<ICatalog[]>([]);
    const [form] = Form.useForm();

    const fetchSections = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(API_ENDPOINTS.SECTIONS);
            setSections(data);
        } catch {
            message.error("Failed to fetch sections");
        } finally {
            setLoading(false);
        }
    };

    const fetchCatalogs = async () => {
        try {
            const { data } = await api.get(API_ENDPOINTS.ALL_CATALOGS);
            setCatalogs(data);
        } catch {
            message.error("Failed to fetch catalogs");
        }
    };

    useEffect(() => {
        fetchSections();
        fetchCatalogs();
    }, []);

    const openDrawer = (section?: ISection) => {
        setEditing(section ?? null);
        form.setFieldsValue(
            section
                ? { ...section, catalog_ids: section.catalogs?.map((c) => c.id) }
                : { status: true, card_type: "card", order: sections.length + 1 }
        );
        setOpen(true);
    };

    const closeDrawer = () => {
        setOpen(false);
        setEditing(null);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);

            const payload = {
                name: values.name,
                description: values.description,
                order: values.order,
                status: values.status,
                card_type: values.card_type,
                catalogs: (values.catalog_ids ?? []).map((id: number, i: number) => ({
                    id,
                    order: i + 1,
                })),
            };

            if (editing) {
                await api.put(`${API_ENDPOINTS.SECTIONS}/${editing.id}`, payload);
                message.success("Section updated");
            } else {
                await api.post(API_ENDPOINTS.SECTIONS, payload);
                message.success("Section created");
            }

            closeDrawer();
            fetchSections();
        } catch {
            message.error("Failed to save section");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setDeleteLoading(id);
            await api.delete(`${API_ENDPOINTS.SECTIONS}/${id}`);
            message.success("Section deleted");
            fetchSections();
        } catch {
            message.error("Failed to delete section");
        } finally {
            setDeleteLoading(null);
        }
    };

    return (
        <>
            {/* ── Add button row ─────────────────────────── */}
            <div style={{ padding: compact ? "8px 10px 4px" : "0 0 12px", display: "flex", justifyContent: "flex-end" }}>
                <Button
                    size="small"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openDrawer()}
                    style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none", borderRadius: 6 }}
                >
                    Add Section
                </Button>
            </div>

            {/* ── Section cards ──────────────────────────── */}
            {loading ? (
                <div style={{ padding: 20, textAlign: "center" }}>
                    <Typography.Text type="secondary">Loading…</Typography.Text>
                </div>
            ) : sections.length === 0 ? (
                <Empty
                    description="No sections yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ marginTop: 32 }}
                />
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: compact ? "0 8px 12px" : 0 }}>
                    {sections
                        .sort((a, b) => a.order - b.order)
                        .map((sec) => {
                            const cardMeta = CARD_TYPE_LABELS[sec.card_type] ?? CARD_TYPE_LABELS.card;
                            return (
                                <div
                                    key={sec.id}
                                    style={{
                                        padding: "10px 12px",
                                        borderRadius: 8,
                                        border: "1px solid #e5e7eb",
                                        background: "#fff",
                                        position: "relative",
                                    }}
                                >
                                    {/* Header row */}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                                                #{sec.order}
                                            </span>
                                            <Typography.Text strong style={{ fontSize: 13 }}>
                                                {sec.name}
                                            </Typography.Text>
                                            <Badge
                                                dot
                                                color={sec.status ? "#10b981" : "#94a3b8"}
                                                title={sec.status ? "Active" : "Inactive"}
                                            />
                                        </div>
                                        <Space size={2}>
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<EditOutlined style={{ fontSize: 12 }} />}
                                                style={{ color: "#6366f1" }}
                                                onClick={() => openDrawer(sec)}
                                            />
                                            <Popconfirm
                                                title="Delete this section?"
                                                onConfirm={() => handleDelete(sec.id)}
                                                okButtonProps={{ danger: true, loading: deleteLoading === sec.id }}
                                                okText="Delete"
                                            >
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    danger
                                                    icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                                                />
                                            </Popconfirm>
                                        </Space>
                                    </div>

                                    {/* Meta row */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                        <Tag
                                            icon={cardMeta.icon}
                                            color="purple"
                                            style={{ fontSize: 10, margin: 0 }}
                                        >
                                            {cardMeta.label}
                                        </Tag>
                                        <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
                                            {sec.catalogs?.length ?? 0} catalog{(sec.catalogs?.length ?? 0) !== 1 ? "s" : ""}
                                        </Tag>
                                    </div>

                                    {sec.description && (
                                        <Typography.Text
                                            type="secondary"
                                            style={{ fontSize: 11, display: "block", marginTop: 4 }}
                                            ellipsis
                                        >
                                            {sec.description}
                                        </Typography.Text>
                                    )}

                                </div>
                            );
                        })}
                </div>
            )}

            {/* ── Create / Edit Drawer ───────────────────── */}
            <Drawer
                title={
                    <span style={{ fontWeight: 700 }}>
                        {editing ? `Edit — ${editing.name}` : "New Section"}
                    </span>
                }
                width="50%"
                open={open}
                onClose={closeDrawer}
                footer={
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={closeDrawer}>Cancel</Button>
                        <Button
                            type="primary"
                            loading={saving}
                            onClick={handleSubmit}
                            style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" }}
                        >
                            {editing ? "Update" : "Create"}
                        </Button>
                    </div>
                }
            >
                <Form layout="vertical" form={form} size="middle">
                    <Form.Item
                        name="name"
                        label="Section Name"
                        rules={[{ required: true, message: "Name is required" }]}
                        extra={
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                This title is shown above the catalog group on your store home page (e.g. "Stationery", "Best Sellers")
                            </span>
                        }
                    >
                        <Input placeholder="e.g. Summer Collection" style={{ borderRadius: 8 }} />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        extra={
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                Optional subtitle shown below the section heading
                            </span>
                        }
                    >
                        <Input.TextArea rows={2} placeholder="Optional description" style={{ borderRadius: 8 }} />
                    </Form.Item>

                    <Form.Item
                        name="card_type"
                        label="Card Style"
                        rules={[{ required: true, message: "Select a card style" }]}
                        extra={
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                Controls how catalog thumbnails look inside this section on the store
                            </span>
                        }
                    >
                        <Select options={CARD_TYPE_OPTIONS} placeholder="Select card style" style={{ borderRadius: 8 }} />
                    </Form.Item>

                    <Form.Item
                        name="catalog_ids"
                        label="Attach Catalogs"
                        extra={
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                Choose which catalogs appear under this section — order here = display order on store
                            </span>
                        }
                    >
                        <Select
                            mode="multiple"
                            placeholder="Search and select catalogs"
                            showSearch
                            optionFilterProp="label"
                            style={{ borderRadius: 8 }}
                            options={catalogs.map((c) => ({ value: c.id, label: c.name }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="order"
                        label="Display Order"
                        extra={
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                Lower number = appears first on the home page
                            </span>
                        }
                    >
                        <InputNumber min={1} style={{ width: "100%", borderRadius: 8 }} />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Active"
                        valuePropName="checked"
                        extra={
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                Inactive sections are hidden from your store home page
                            </span>
                        }
                    >
                        <Switch checkedChildren="Active" unCheckedChildren="Hidden" />
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
}
