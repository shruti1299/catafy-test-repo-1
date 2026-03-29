"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, message, Select, Space, TablePaginationConfig, Tabs } from "antd";
import Search, { SearchProps } from "antd/es/input/Search";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { IProduct, IProductList } from "@/interfaces/Product";
import { ICatalog } from "@/interfaces/Catalog";
import ProductList from "./components/product-list";

const ProductsPage = () => {
  const [catalogs, setCatalogs] = useState<ICatalog[]>([]);
  const [productListData, setProductListData] = useState<IProductList | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [catalogId, setCatalogId] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [stockStatus, setStockStatus] = useState<"all" | "low" | "out" | "draft" | "disabled">("all");

  const getAllCatalogs = async () => {
    setCatalogLoading(true);
    try {
      const { data } = await api.get(API_ENDPOINTS.ALL_CATALOGS);
      setCatalogs(data);
    } catch {
      message.error("Failed to load catalogs");
    } finally {
      setCatalogLoading(false);
    }
  };

  const getProducts = async (
    currentPage = 1,
    pageSizeValue = 10,
    q = "",
    catalog_id = 0,
    sortBy = "created_at",
    sortOrder = "desc",
    stock_status: "all" | "low" | "out" | "draft" | "disabled" = "all"
  ) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `${API_ENDPOINTS.PRODUCTS}?page=${currentPage}&page_size=${pageSizeValue}&q=${q}&catalog_id=${catalog_id}&order_by=${sortBy}&order_type=${sortOrder}&stock_status=${stock_status}&is_categories=1`
      );
      setProductListData(data);
    } catch {
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([getAllCatalogs(), getProducts()]);
  }, []);

  const onReload = useCallback(() => {
    getProducts(page, pageSize, keyword, catalogId);
  }, [page, pageSize, keyword, catalogId]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IProduct> | SorterResult<IProduct>[]
  ) => {
    const current = pagination.current || 1;
    const size = pagination.pageSize || 10;
    setPage(current);
    setPageSize(size);
    let sortField = "created_at";
    let sortOrder = "desc";

    if (!Array.isArray(sorter) && sorter.field) {
      sortField = sorter.field as string;
      sortOrder =
        sorter.order === "ascend"
          ? "asc"
          : sorter.order === "descend"
            ? "desc"
            : "desc";
    }
    getProducts(current, size, keyword, catalogId, sortField, sortOrder);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setKeyword(value);
    setPage(1);
    getProducts(1, pageSize, value, catalogId, "created_at", "desc", stockStatus);
  }

  const onChangeCatalog = (value: number) => {
    setCatalogId(value);
    setPage(1);
    getProducts(1, pageSize, keyword, value, "created_at", "desc", stockStatus);
  };

  const onStockTabChange = (key: string) => {
    setStockStatus(key as any);
    setPage(1);
    getProducts(1, pageSize, keyword, catalogId, "created_at", "desc", key as any);
  };

  const catalogOptions = useMemo(() => [
    { label: "All Catalogs", value: 0 },
    ...catalogs.map((c) => ({ label: c.name, value: c.id })),
  ], [catalogs]);

  const actionsNode = useMemo(() => (
    <Space>
      <Search
        style={{ width: 300 }}
        placeholder="Search product name"
        allowClear
        enterButton
        onSearch={onSearch}
      />
      <Select
        value={catalogId}
        style={{ width: 250 }}
        loading={catalogLoading}
        placeholder="Select Catalog"
        options={catalogOptions}
        onChange={onChangeCatalog}
      />
    </Space>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [catalogId, catalogLoading, catalogOptions]);

  return (
    <Card
      className="mb-100"
      loading={!productListData}
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>📦 Inventory</span>}
      extra={actionsNode}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      <Tabs
        activeKey={stockStatus}
        onChange={onStockTabChange}
        size="small"
        items={[
          { key: "all", label: "All" },
          { key: "low", label: "Low Stock" },
          { key: "out", label: "Out of Stock" },
          { key: "draft", label: "Draft" },
          { key: "disabled", label: "Disabled" },
        ]}
      />

      <ProductList
        loading={loading}
        data={productListData?.data || []}
        catalogs={catalogs}
        pagination={{
          current: productListData?.current_page,
          pageSize,
          total: productListData?.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "25", "50"],
        }}
        onRefresh={onReload}
        handleTableChange={handleTableChange}
      />
    </Card>
  );
};

export default ProductsPage;
