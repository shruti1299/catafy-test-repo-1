"use client";

import CatalogsList from "./catlogs-list";
import CatalogProducts from "./catalog-products";
import { useEffect, useState } from "react";
import { ICatalog } from "@/interfaces/Catalog";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { IProductList } from "@/interfaces/Product";
import ProductDetail from "@/components/product/product-detail";
import { AppstoreOutlined } from "@ant-design/icons";

const Catalogs = () => {
    const [selectedCatalog, setSelectedCatalog]     = useState({} as ICatalog);
    const [selectedProductId, setSelectedProductId] = useState(0 as number);
    const [loading, setInitLoading]                 = useState(true);
    const [productsData, setProductsData]           = useState({} as IProductList);
    const [isloading, setIsLoading]                 = useState(false);
    const [productCurrentPage, setProductCurrentPage] = useState(1);
    const [productSearch, setProductSearch] = useState("");

    const onClickProductCard = (productId: number) => {
        setIsLoading(true);
        setTimeout(() => {
            setSelectedProductId(productId);
            setIsLoading(false);
        }, 80);
    };

    const getData = async () => {
        setSelectedProductId(0);
        if (!selectedCatalog?.id) return;
        setInitLoading(true);
        const params = new URLSearchParams({
            catalog_id: String(selectedCatalog.id),
            page: String(productCurrentPage),
            page_size: "15",
            ...(productSearch ? { q: productSearch } : {}),
        });
        const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}?${params}`);
        setProductsData(data);
        if (data?.data?.[0]?.id) setSelectedProductId(data?.data?.[0]?.id);
        setInitLoading(false);
    };

    const handleAfterCreated = () => { getData(); };

    useEffect(() => { getData(); }, [selectedCatalog, productCurrentPage, productSearch]);

    const handlePageChange = (page: number) => setProductCurrentPage(page);

    return (
        <div style={{ display: "flex", height: "calc(100vh - 68px)", overflow: "hidden", gap: 0, margin: "-20px", background: "#f7f8fa" }}>

            {/* ── Panel 1: Catalog list ──────────────────── */}
            <div style={{
                width: 320,
                minWidth: 320,
                flexShrink: 0,
                borderRight: "1px solid #e5e7eb",
                overflowY: "auto",
                background: "#fff",
            }}>
                <CatalogsList
                    setSelectedCatalog={setSelectedCatalog}
                    selectedCatalog={selectedCatalog}
                />
            </div>

            {/* ── Panel 2: Product list ─────────────────── */}
            <div style={{
                width: selectedCatalog?.id ? 380 : 0,
                minWidth: selectedCatalog?.id ? 380 : 0,
                flexShrink: 0,
                borderRight: selectedCatalog?.id ? "1px solid #e5e7eb" : "none",
                overflowY: "auto",
                background: "#fff",
                transition: "width 0.2s ease, min-width 0.2s ease",
                overflow: "hidden",
            }}>
                {selectedCatalog?.id > 0 && (
                    <CatalogProducts
                        products={productsData?.data}
                        loading={loading}
                        catalog={selectedCatalog}
                        setSelectedProductId={onClickProductCard}
                        selectedProductId={selectedProductId}
                        afterCreated={handleAfterCreated}
                        productCurrentPage={productCurrentPage}
                        setProductCurrentPage={setProductCurrentPage}
                        onSearch={(val: string) => { setProductSearch(val); setProductCurrentPage(1); }}
                        pagination={{
                            current: productCurrentPage,
                            total: productsData?.total,
                            pageSize: productsData?.per_page,
                            onChange: handlePageChange,
                            size: "small",
                        }}
                    />
                )}
            </div>

            {/* ── Panel 3: Product detail or empty state ── */}
            <div style={{ flex: 1, overflowY: "auto", background: "#f7f8fa", padding: selectedProductId ? 16 : 0 }}>
                {selectedProductId > 0 ? (
                    <ProductDetail
                        isLoading={isloading}
                        productId={selectedProductId}
                        setSelectedProductId={setSelectedProductId}
                    />
                ) : (
                    <div style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#94a3b8",
                        gap: 12,
                    }}>
                        <div style={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <AppstoreOutlined style={{ fontSize: 30, color: "#c7d2fe" }} />
                        </div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#64748b" }}>
                            {selectedCatalog?.id ? "Select a product to preview" : "Select a catalog to start"}
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
                            {selectedCatalog?.id
                                ? "Click any product from the list"
                                : "Choose from the catalog list on the left"}
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Catalogs;
