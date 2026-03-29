"use client";

import { FloatButton, Modal, Input, List, Image } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import { CURRENCY_ICON } from "@/constant";
import { IProduct } from "@/interfaces/Product";

const ProductSearchFloat = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<IProduct[]>([]);

    const searchProducts = async (query: string) => {
        if (!query) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.get(
                `${API_ENDPOINTS.PRODUCTS}?q=${query}`
            );
            setResults(data?.data || []);
        } finally {
            setLoading(false);
        }
    };

    const onProductClick = (productId: number) => {
        setOpen(false);
        router.push(`/inventory/${productId}`);
    };

    return (
        <>
            <FloatButton
                icon={<SearchOutlined />}
                tooltip="Search Products"
                type="primary"
                onClick={() => setOpen(true)}
                style={{ right: 24, bottom: 15, width: 50, height: 50 }}
            />

            <Modal
                title={
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                        🔍 Search Products
                    </span>
                }
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={520}
            >
                <div style={{ marginBottom: 16, marginTop: 8 }}>
                    <Input.Search
                        placeholder="Search by product name"
                        allowClear
                        enterButton
                        size="large"
                        style={{ borderRadius: 8 }}
                        onSearch={searchProducts}
                    />
                </div>

                <div style={{ maxHeight: 420, overflowY: "auto" }}>
                    {loading ? (
                        <Loader />
                    ) : (
                        <List
                            dataSource={results}
                            locale={{
                                emptyText: (
                                    <div
                                        style={{
                                            padding: "24px 0",
                                            textAlign: "center",
                                            color: "#94a3b8",
                                            fontSize: 13,
                                        }}
                                    >
                                        No products found — try a different name
                                    </div>
                                ),
                            }}
                            renderItem={(item) => (
                                <List.Item
                                    style={{
                                        cursor: "pointer",
                                        padding: "10px 8px",
                                        borderRadius: 8,
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background = "#f8faff")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background = "transparent")
                                    }
                                    onClick={() => onProductClick(item.id)}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            width: "100%",
                                        }}
                                    >
                                        <Image
                                            src={item.image || "/images/placeholder.png"}
                                            alt={item.name}
                                            width={48}
                                            height={48}
                                            preview={false}
                                            style={{
                                                borderRadius: 8,
                                                objectFit: "cover",
                                                border: "1px solid #e2e8f0",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: "#1e293b",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {item.name}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: "#6366f1",
                                                    fontWeight: 500,
                                                    marginTop: 2,
                                                }}
                                            >
                                                {CURRENCY_ICON}
                                                {item.price}
                                            </div>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </Modal>
        </>
    );
};

export default ProductSearchFloat;
