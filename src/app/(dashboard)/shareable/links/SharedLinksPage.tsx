"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Space,
    Typography,
    Popconfirm,
    message,
    Tag,
    Card,
    Alert,
    Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    PlusOutlined,
    DeleteOutlined,
    CopyOutlined,
    LinkOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { getSharedLinks, deleteSharedLink } from "./api";
import CreateSharedLinkModal from "./CreateSharedLinkModal";
import { ISharedLink } from "@/interfaces/SharedLink";
import { useUserContext } from "@/contexts/UserContext";

const { Title } = Typography;

const SharedLinksPage: React.FC = () => {
    const { storeDetail } = useUserContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [links, setLinks] = useState<ISharedLink[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const StoreLink = `https://${storeDetail?.store?.username}.catafy.com`;
    

    const fetchLinks = async (page = 1) => {
        setLoading(true);
        try {
            const res = await getSharedLinks(page);

            setLinks(res.data.data);
            setCurrentPage(res.data.current_page);
            setTotal(res.data.total);
        } catch {
            message.error("Failed to load shared links");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const copyLink = (slug: string) => {
        navigator.clipboard.writeText(`${StoreLink}/l/${slug}`);
        message.success("Link copied");
    };

    const columns: ColumnsType<ISharedLink> = [
        {
            title: "Link Name",
            dataIndex: "name",
            render: (value: string | null) =>
                value || <Tag>Untitled</Tag>,
        },
        {
            title: "Link",
            dataIndex: "slug",
            render: (value: string | null) =>
                <a target="_blank" href={`${StoreLink}/l/${value}`}>
                    <Tag color="blue">{`${StoreLink}/l/${value}`}</Tag>
                </a>,
        },
        {
            title: "Products",
            dataIndex: "products_count",
            align: "center",
        },
        {
            title: "Views",
            dataIndex: "view_count",
            align: "center",
        },
        {
            title: "Created",
            dataIndex: "created_at",
            render: (value: string) =>
                dayjs(value).format("DD MMM YYYY"),
        },
        {
            title: "Actions",
            render: (_, row) => (
                <Space>
                    <Button
                        icon={<CopyOutlined />}
                        onClick={() => copyLink(row.slug)}
                    />
                    <Popconfirm
                        title="Delete this link?"
                        onConfirm={async () => {
                            await deleteSharedLink(row.id);
                            message.success("Link deleted");
                            fetchLinks();
                        }}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}><LinkOutlined style={{ marginRight: 6 }} />Shared Links</span>}
            styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
            style={{ borderRadius: 12 }}
            extra={
                <Button
                    size="small"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setOpen(true)}
                    style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" }}
                >
                    Create New Link
                </Button>
            }
        >
            <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16, borderRadius: 8 }}
                message="What are Shared Links?"
                description="Create curated, trackable links with a specific set of products. Share them with customers or partners instead of your full catalog — you control what they see. Each link tracks how many times it was viewed."
            />

            <Table<ISharedLink>
                rowKey="id"
                size="small"
                loading={loading}
                columns={columns}
                dataSource={links}
                locale={{ emptyText: <Empty description="No shared links yet — create your first link above" /> }}
                pagination={{
                    current: currentPage,
                    total,
                    pageSize: 20,
                    onChange: (page) => fetchLinks(page),
                    showSizeChanger: false,
                    size: "small",
                }}
            />

            <CreateSharedLinkModal
                open={open}
                onClose={() => setOpen(false)}
                onSuccess={fetchLinks}
            />
        </Card>
    );
};

export default SharedLinksPage;
