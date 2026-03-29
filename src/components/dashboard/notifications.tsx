"use client";

import React, { useMemo, useState } from "react";
import {
    Drawer,
    List,
    Avatar,
    Badge,
    Button,
    Typography,
    Space,
    Tag,
    Tooltip,
    Empty,
    Segmented,
    message,
    Collapse,
    Skeleton,
} from "antd";
import {
    UserAddOutlined,
    LockOutlined,
    EyeOutlined,
    ShoppingCartOutlined,
    CheckCircleOutlined,
    DeleteOutlined,
    ReloadOutlined,
    BellOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { API_ENDPOINTS } from "@/api/endpoints";
import api from "@/api";

dayjs.extend(relativeTime);

export type INotificationType =
    | "customer_signup"
    | "access_request"
    | "catalog_opened"
    | "new_order";

export interface IStoreNotification {
    id: number;
    store_id: number;
    type: INotificationType;
    data: Record<string, any> | null;
    is_read: boolean;
    created_at: string; // ISO
}

interface NotificationsDrawerProps {

}

const typeMeta: Record<INotificationType, { icon: React.ReactNode; label: string; color: string }> = {
    customer_signup: {
        icon: <UserAddOutlined />,
        label: "New Customer",
        color: "blue",
    },
    access_request: {
        icon: <LockOutlined />,
        label: "Access Request",
        color: "gold",
    },
    catalog_opened: {
        icon: <EyeOutlined />,
        label: "Catalogue Opened",
        color: "purple",
    },
    new_order: {
        icon: <ShoppingCartOutlined />,
        label: "New Order",
        color: "green",
    },
};

const buildText = (n: IStoreNotification) => {
    const d = n.data || {};
    switch (n.type) {
        case "customer_signup":
            return {
                title: d.customer_name || "New customer",
                desc: [d.customer_phone, d.customer_email].filter(Boolean).join(" • "),
            };
        case "access_request":
            return {
                title: `${d.customer_name || "Someone"} requested access`,
                desc: [d.catalog_name, d.customer_phone, d.customer_email].filter(Boolean).join(" • "),
            };
        case "catalog_opened":
            return {
                title: `${d.customer_name || "Someone"} opened your catalogue`,
                desc: [d.customer_phone].filter(Boolean).join(" • "),
            };
        case "new_order":
            return {
                title: `Order #${d.order_id ?? ""} placed by ${d.customer_name ?? "Buyer"}`.trim(),
                desc: typeof d.total_amount !== "undefined" ? `Total: ₹${d.total_amount}` : "",
            };
        default:
            return { title: "Notification", desc: "" };
    }
};

function useNotifications(filter: INotificationType | "all") {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<IStoreNotification[]>([]);

    const load = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`${API_ENDPOINTS.NOTIFICATIONS}`);
            if (!data) throw new Error("Failed to load notifications");
            setList(data);
        } catch (e: any) {
            message.error(e.message || "Could not load notifications");
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        if (filter === "all") return list;
        return list.filter((n) => n.type === filter);
    }, [list, filter]);

    const unreadCount = useMemo(() => list.filter((n) => !n.is_read).length, [list]);

    const markRead = async (id: number) => {
        try {
            await api.patch(`${API_ENDPOINTS.NOTIFICATIONS}/${id}/read`);
            setList((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
        } catch (e: any) {
            message.error(e.message || "Could not update notification");
        }
    };

    const markAllRead = async () => {
        try {
            await api.post(`${API_ENDPOINTS.NOTIFICATIONS}/mark-all-read`);
            setList((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch (e: any) {
            message.error(e.message || "Could not update notifications");
        }
    };

    const remove = async (id: number) => {
        try {
            await api.delete(`${API_ENDPOINTS.NOTIFICATIONS}/${id}`);
            setList((prev) => prev.filter((n) => n.id !== id));
        } catch (e: any) {
            message.error(e.message || "Could not delete notification");
        }
    };

    return { loading, list: filtered, unreadCount, load, markRead, markAllRead, remove };
}

export default function NotificationsDrawer({  }: NotificationsDrawerProps) {
    const [filter, setFilter] = useState<INotificationType | "all">("all");
    const { loading, list, unreadCount, load, markRead, markAllRead, remove } = useNotifications(filter);
    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        load();
    }, [open]);

    const header = (
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                <Space>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        Notifications
                    </Typography.Title>
                    <Badge count={unreadCount} overflowCount={99} size="small" />
                </Space>
                <Space>
                    <Tooltip title="Refresh">
                        <Button icon={<ReloadOutlined />} onClick={load} />
                    </Tooltip>
                    <Tooltip title="Mark all as read">
                        <Button icon={<CheckCircleOutlined />} onClick={markAllRead} />
                    </Tooltip>
                </Space>
            </Space>
        </Space>
    );

    return (
        <>
            <Badge count={unreadCount} overflowCount={99} size="small">
                <Button className='navbar-btn' size="small" htmlType="button" onClick={() => setOpen(!open)} icon={<BellOutlined />} type="link" />
            </Badge>
            <Drawer
                title={header}
                open={open}
                onClose={onClose}
                width={"45%"}
                styles={{ header: { paddingBottom: 0 } }}
            >
                <Segmented
                    block
                    options={[
                        { label: "All", value: "all" },
                        {
                            label: (
                                <Space>
                                    <UserAddOutlined /> Customer
                                </Space>
                            ), value: "customer_signup"
                        },
                        {
                            label: (
                                <Space>
                                    <EyeOutlined /> Store
                                </Space>
                            ), value: "catalog_opened"
                        },
                        {
                            label: (
                                <Space>
                                    <ShoppingCartOutlined /> Orders
                                </Space>
                            ), value: "new_order"
                        },
                        {
                            label: (
                                <Space>
                                    <LockOutlined /> Access
                                </Space>
                            ), value: "access_request"
                        },
                    ]}
                    value={filter}
                    onChange={(v) => setFilter(v as any)}
                />
                {/* Info panel explaining notification types */}
                <Collapse
                    ghost
                    size="small"
                    style={{ marginTop: 12, marginBottom: 4 }}
                    items={[{
                        key: "info",
                        label: (
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                <InfoCircleOutlined style={{ marginRight: 5 }} />
                                What are these notifications?
                            </Typography.Text>
                        ),
                        children: (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingBottom: 4 }}>
                                {[
                                    { color: typeMeta.customer_signup.color, icon: <UserAddOutlined />, label: "New Customer", desc: "Fired when a new customer registers or is added to your store." },
                                    { color: typeMeta.new_order.color, icon: <ShoppingCartOutlined />, label: "New Order", desc: "Triggered every time a buyer places an order in your catalog." },
                                    { color: typeMeta.catalog_opened.color, icon: <EyeOutlined />, label: "Catalogue Opened", desc: "Sent once per day per customer who views your catalogue." },
                                    { color: typeMeta.access_request.color, icon: <LockOutlined />, label: "Access Request", desc: "A customer requested access to a private or protected catalogue." },
                                ].map(({ color, icon, label, desc }) => (
                                    <div key={label} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                        <Tag color={color} icon={icon} style={{ marginTop: 2, flexShrink: 0 }}>{label}</Tag>
                                        <Typography.Text type="secondary" style={{ fontSize: 11, lineHeight: "16px" }}>{desc}</Typography.Text>
                                    </div>
                                ))}
                            </div>
                        ),
                    }]}
                />

                {loading ? (
                    <Skeleton active paragraph={{ rows: 6 }} style={{ marginTop: 16 }} />
                ) : list.length === 0 ? (
                    <Empty description="No notifications" style={{ marginTop: 40 }} />
                ) : (
                    <List
                        size="small"
                        style={{ marginTop: 8 }}
                        itemLayout="horizontal"
                        dataSource={list}
                        renderItem={(item) => {
                            const meta = typeMeta[item.type];
                            const text = buildText(item);
                            const borderColor: Record<string, string> = {
                                blue: "#1677ff", gold: "#faad14", purple: "#722ed1", green: "#52c41a",
                            };
                            return (
                                <List.Item
                                    style={{
                                        background: item.is_read ? "transparent" : "rgba(99,102,241,0.04)",
                                        borderLeft: `3px solid ${borderColor[meta.color] ?? "#d9d9d9"}`,
                                        paddingLeft: 12,
                                        marginBottom: 4,
                                        borderRadius: "0 6px 6px 0",
                                        cursor: item.is_read ? "default" : "pointer",
                                        transition: "background 0.2s",
                                    }}
                                    onClick={() => { if (!item.is_read) markRead(item.id); }}
                                    actions={[
                                        !item.is_read ? (
                                            <Tooltip title="Mark as read" key="read">
                                                <Button type="link" size="small" onClick={(e) => { e.stopPropagation(); markRead(item.id); }}>
                                                    Read
                                                </Button>
                                            </Tooltip>
                                        ) : null,
                                        <Tooltip title="Delete" key="delete">
                                            <Button type="link" danger size="small" icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); remove(item.id); }} />
                                        </Tooltip>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Badge dot={!item.is_read} color="blue">
                                                <Avatar
                                                    icon={meta.icon}
                                                    style={{
                                                        background: `${borderColor[meta.color] ?? "#d9d9d9"}22`,
                                                        color: borderColor[meta.color] ?? "#555",
                                                    }}
                                                />
                                            </Badge>
                                        }
                                        title={
                                            <Space size={6} wrap>
                                                <Tag color={meta.color} style={{ margin: 0 }}>{meta.label}</Tag>
                                                <Typography.Text strong style={{ fontSize: 13 }}>{text.title}</Typography.Text>
                                            </Space>
                                        }
                                        description={
                                            <Space direction="vertical" size={1}>
                                                {text.desc && <Typography.Text type="secondary" style={{ fontSize: 12 }}>{text.desc}</Typography.Text>}
                                                <Typography.Text type="secondary" style={{ fontSize: 11 }}>{dayjs(item.created_at).fromNow()}</Typography.Text>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            );
                        }}
                    />
                )}
            </Drawer>
        </>
    );
}

