"use client";

import { Button, Card, Drawer, Image, Pagination, PaginationProps, Space, Tag, Tooltip } from "antd";
import { PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import ExpandableSearch from "@/components/common/ExpandableSearch";
import { ICatalog } from "@/interfaces/Catalog";
import EmptyState from "../global/emptyState";
import { CatalogEmpty } from "@/images/index";
import { IProduct } from "@/interfaces/Product";
import { useState } from "react";
import CreateProductBasicForm from "@/components/product/basic-product-form";
import { CURRENCY_ICON } from "@/constant";

interface IProps {
    products?: IProduct[];
    loading: boolean;
    setSelectedProductId?: any;
    afterCreated: any;
    catalog: ICatalog;
    productCurrentPage: number;
    setProductCurrentPage: any;
    selectedProductId: number;
    pagination: PaginationProps;
    onSearch: (val: string) => void;
}

const CatalogProducts = (props: IProps) => {
    const { selectedProductId, catalog, products, loading, setSelectedProductId, afterCreated, pagination, onSearch } = props;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleClose = () => setIsDrawerOpen(false);

    return (
        <Card
            className="catalog-sidebar"
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <AppstoreOutlined style={{ color: "#6366f1", fontSize: 13 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
                        {catalog?.name}
                    </span>
                    {pagination.total !== undefined && (
                        <Tag color="blue" style={{ fontSize: 10, margin: 0, padding: "0 5px", lineHeight: "18px", borderRadius: 10 }}>
                            {pagination.total}
                        </Tag>
                    )}
                </div>
            }
            extra={
                <Space size={4}>
                    <ExpandableSearch
                        placeholder="Search product"
                        onSearch={onSearch}
                    />
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => setIsDrawerOpen(true)}
                        style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" }}
                    />
                </Space>
            }
            styles={{ header: { padding: "10px 12px", minHeight: 44 }, body: { padding: 0 } }}
            style={{ overflow: "hidden", border: "none", borderRadius: 0, height: "100%" }}
            loading={loading}
        >
            <div style={{ overflowY: "auto", height: "calc(100vh - 115px)", padding: "10px 10px 0" }}>
                {!products?.length && !loading ? (
                    <EmptyState
                        message={"No Products Yet"}
                        buttonText={"Add Product"}
                        image={CatalogEmpty}
                        onClick={() => setIsDrawerOpen(true)}
                    />
                ) : (
                    <>
                        {products?.map((item) => {
                            const isActive = item.id === selectedProductId;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedProductId(item.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 9,
                                        cursor: "pointer",
                                        borderRadius: 8,
                                        marginBottom: 6,
                                        padding: "7px 8px",
                                        border: isActive ? "1.5px solid #6366f1" : "1px solid #f1f5f9",
                                        background: isActive ? "#eef2ff" : "#fff",
                                        boxShadow: isActive
                                            ? "0 2px 8px rgba(99,102,241,0.1)"
                                            : "0 1px 2px rgba(0,0,0,0.04)",
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    {/* Thumbnail */}
                                    <div style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 6,
                                        overflow: "hidden",
                                        flexShrink: 0,
                                        background: "#f1f5f9",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                width={44}
                                                height={44}
                                                alt={item.name}
                                                style={{ objectFit: "cover" }}
                                                preview={false}
                                            />
                                        ) : (
                                            <AppstoreOutlined style={{ color: "#cbd5e1", fontSize: 16 }} />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
                                        <div style={{
                                            fontWeight: isActive ? 700 : 500,
                                            fontSize: 12,
                                            color: isActive ? "#4338ca" : "#1e293b",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            lineHeight: "16px",
                                        }}>
                                            {item.name}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                                            <span style={{
                                                fontSize: 11,
                                                fontWeight: 600,
                                                color: isActive ? "#6366f1" : "#475569",
                                            }}>
                                                {CURRENCY_ICON}{item.price}
                                            </span>
                                            {item.unit && (
                                                <span style={{ fontSize: 10, color: "#94a3b8" }}>/ {item.unit}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status dot */}
                                    <Tooltip title={item.status ? "Active" : "Inactive"}>
                                        <div style={{
                                            width: 7,
                                            height: 7,
                                            borderRadius: "50%",
                                            background: item.status ? "#22c55e" : "#e2e8f0",
                                            flexShrink: 0,
                                        }} />
                                    </Tooltip>
                                </div>
                            );
                        })}

                        <Pagination
                            {...pagination}
                            size="small"
                            style={{ marginTop: 16, textAlign: "center" }}
                            pageSizeOptions={["10", "20", "30"]}
                        />
                    </>
                )}
            </div>

            <Drawer
                title={`Add Product to "${catalog?.name}"`}
                placement="left"
                width={"50%"}
                onClose={handleClose}
                open={isDrawerOpen}
            >
                <CreateProductBasicForm
                    afterSuccess={() => { afterCreated(); handleClose(); }}
                    catalogId={catalog.id}
                />
            </Drawer>
        </Card>
    );
};

export default CatalogProducts;
