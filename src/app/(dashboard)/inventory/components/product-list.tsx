"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Table,
  TableProps,
  Image,
  Space,
  message,
  Button,
  Empty,
  Input,
  InputNumber,
  Drawer,
  Select,
  TreeSelect,
  Popover,
  Checkbox,
  Divider,
  Tag,
} from "antd";
import { IProduct } from "@/interfaces/Product";
import { CURRENCY_ICON } from "@/constant";
import { API_ENDPOINTS } from "@/api/endpoints";
import api from "@/api";
import { EditOutlined, SaveOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { ICatalog } from "@/interfaces/Catalog";
import ProductDetail from "@/components/product/product-detail";
import Link from "next/link";
import { useUserContext } from "@/contexts/UserContext";

interface IProps {
  data: IProduct[];
  loading?: boolean;
  pagination?: TableProps<IProduct>["pagination"];
  handleTableChange: any;
  onRefresh: () => void;
  catalogs: ICatalog[];
}

/* ── Tree builder ────────────────────────────────────────── */
const buildTreeData = (categories: any[]): any[] => {
  if (!Array.isArray(categories)) return [];
  return categories.map((cat) => ({
    title: cat.name,
    value: cat.id,
    key: cat.id,
    children: Array.isArray(cat.children) ? buildTreeData(cat.children) : [],
  }));
};

/* ── Column config definition ─────────────────────────────── */
const ALL_COLUMNS = [
  { key: "image",       label: "Image",      fixed: true  },
  { key: "name",        label: "Name",       fixed: false },
  { key: "catalogs",    label: "Catalogs",   fixed: false },
  { key: "categories",  label: "Categories", fixed: false },
  { key: "price",       label: "Price",      fixed: false },
  { key: "b2c_price",   label: "B2C Price",  fixed: false },
  { key: "mrp_price",   label: "MRP",        fixed: false },
  { key: "stock",       label: "Stock",      fixed: false },
  { key: "min_quantity",label: "MOQ",        fixed: false },
  { key: "action",      label: "Actions",    fixed: true  },
];

const LS_KEY = "inventory_visible_columns";
const DEFAULT_VISIBLE = ["image", "name", "catalogs", "categories", "price", "stock", "min_quantity", "action"];

function loadVisibleColumns(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_VISIBLE;
}

/* ── Component ────────────────────────────────────────────── */
const ProductList = ({
  data,
  loading = false,
  pagination,
  handleTableChange,
  onRefresh,
  catalogs,
}: IProps) => {
  const [editingProducts, setEditingProducts] = useState<Record<number, Partial<IProduct>>>({});
  const [loadingRows, setLoadingRows] = useState<Record<number, boolean>>({});
  const [updating, setUpdating] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [bulkField, setBulkField] = useState<"price" | "name" | "stock" | "b2c_price" | "mrp_price" | "min_quantity" | "catalog_ids" | "category_ids" | null>(null);
  const [bulkValue, setBulkValue] = useState<any>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(loadVisibleColumns);
  const [categoryTreeData, setCategoryTreeData] = useState<any[]>([]);
  const { storeDetail } = useUserContext();
  const isB2CEnabled = storeDetail?.store?.is_b2c;

  /* visibleColumns initialized directly from localStorage via useState(loadVisibleColumns) */

  /* fetch all categories once */
  useEffect(() => {
    api.get(API_ENDPOINTS.CATEGORIES, { params: { tree: true, page_size: 500 } })
      .then(({ data }) => {
        const rows = data?.data ?? data ?? [];
        setCategoryTreeData(buildTreeData(rows));
      })
      .catch(() => message.warning("Could not load categories"));
  }, []);

  const saveVisibleColumns = (keys: string[]) => {
    setVisibleColumns(keys);
    localStorage.setItem(LS_KEY, JSON.stringify(keys));
  };

  /* ── Catalog options ──────────────────────────────────────── */
  const uniqueCatalogOptions = useMemo(() => {
    const seen = new Set<number>();
    return catalogs
      .filter((c) => { if (seen.has(c.id)) return false; seen.add(c.id); return true; })
      .map((c) => ({ label: c.name, value: c.id }));
  }, [catalogs]);

  /* ── Editing helpers ─────────────────────────────────────── */
  const handleEditChange = useCallback((id: number, field: string, value: any) => {
    setEditingProducts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }, []);

  const handleBulkApply = useCallback(() => {
    if (!bulkField) { message.warning("Select field first"); return; }
    if (bulkValue === null || bulkValue === undefined || bulkValue === "") {
      message.warning("Enter value"); return;
    }
    const updates: Record<number, Partial<IProduct>> = {};
    data.forEach((p) => {
      updates[p.id] = { ...editingProducts[p.id], [bulkField]: bulkValue };
    });
    setEditingProducts((prev) => ({ ...prev, ...updates }));
    message.success(`Applied ${bulkField} to all products`);
  }, [bulkField, bulkValue, data, editingProducts]);

  /* ── Single / Bulk save ─────────────────────────────────── */
  const handleSingleUpdate = useCallback(async (id: number) => {
    if (!editingProducts[id]) return;
    setLoadingRows((prev) => ({ ...prev, [id]: true }));
    try {
      await api.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, editingProducts[id]);
      message.success("Product updated");
      setEditingProducts((prev) => { const u = { ...prev }; delete u[id]; return u; });
      onRefresh();
    } catch {
      message.error(`Failed to update product ${id}`);
    }
    setLoadingRows((prev) => ({ ...prev, [id]: false }));
  }, [editingProducts, onRefresh]);

  const handleBulkUpdate = useCallback(async () => {
    if (!Object.keys(editingProducts).length) { message.warning("No changes to update."); return; }
    setUpdating(true);
    const failed: number[] = [];
    await Promise.all(
      Object.entries(editingProducts).map(async ([id, changes]) => {
        try { await api.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, changes); }
        catch { failed.push(Number(id)); }
      })
    );
    if (failed.length) {
      message.error(`Failed: ${failed.join(", ")}`);
    } else {
      message.success("All products updated!");
    }
    onRefresh();
    setEditingProducts({});
    setUpdating(false);
  }, [editingProducts, onRefresh]);

  /* ── Column configurator popover ─────────────────────────── */
  const configuratorContent = useMemo(() => (
    <div style={{ width: 220 }}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>Show / Hide Columns</div>
      <Divider style={{ margin: "6px 0" }} />
      {ALL_COLUMNS.filter((c) => !c.fixed).map((col) => (
        <div key={col.key} style={{ padding: "4px 0" }}>
          <Checkbox
            checked={visibleColumns.includes(col.key)}
            onChange={(e) => {
              const next = e.target.checked
                ? [...visibleColumns, col.key]
                : visibleColumns.filter((k) => k !== col.key);
              saveVisibleColumns(next);
            }}
          >
            {col.label}
          </Checkbox>
        </div>
      ))}
      <Divider style={{ margin: "6px 0" }} />
      <Button
        size="small"
        block
        onClick={() =>
          saveVisibleColumns(ALL_COLUMNS.filter((c) => !c.fixed || c.key === "image" || c.key === "action").map((c) => c.key))
        }
      >
        Show All
      </Button>
    </div>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [visibleColumns]);

  /* ── All column definitions ─────────────────────────────── */
  const allColumnDefs: Record<string, any> = useMemo(() => ({
    image: {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 70,
      render: (text: string) => <Image src={text} height={55} width={60} />,
    },
    name: {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 220,
      render: (_: any, record: IProduct) => (
        <Input.TextArea
          autoSize
          value={editingProducts[record.id]?.name ?? record.name}
          onChange={(e) => handleEditChange(record.id, "name", e.target.value)}
        />
      ),
    },
    catalogs: {
      title: "Catalogs",
      key: "catalogs",
      width: 260,
      render: (_: any, record: IProduct) => {
        const val = [...new Set(
          editingProducts[record.id]?.catalog_ids ??
          record.catalogs?.map((c: any) => c.id) ?? []
        )];
        return (
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Select Catalogs"
            value={val}
            options={uniqueCatalogOptions}
            onChange={(v) => handleEditChange(record.id, "catalog_ids", [...new Set(v)])}
          />
        );
      },
    },
    categories: {
      title: "Categories",
      key: "categories",
      width: 260,
      render: (_: any, record: IProduct) => {
        const val = editingProducts[record.id]?.category_ids as number[] ??
          record.categories?.map((c: any) => c.id) ?? [];
        return (
          <TreeSelect
            treeData={categoryTreeData}
            treeCheckable
            showSearch
            allowClear
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            placeholder="Select categories"
            treeNodeFilterProp="title"
            value={val}
            onChange={(v) => handleEditChange(record.id, "category_ids", v)}
            style={{ width: "100%" }}
          />
        );
      },
    },
    price: {
      title: isB2CEnabled ? "B2B Price" : "Price",
      dataIndex: "price",
      key: "price",
      sorter: true,
      width: 160,
      render: (_: any, record: IProduct) => (
        <InputNumber
          min={0}
          addonBefore={CURRENCY_ICON}
          value={editingProducts[record.id]?.price ?? +record.price}
          onChange={(v) => handleEditChange(record.id, "price", v)}
        />
      ),
    },
    b2c_price: isB2CEnabled
      ? {
          title: "B2C Price",
          dataIndex: "b2c_price",
          key: "b2c_price",
          width: 160,
          render: (_: any, record: IProduct) => (
            <InputNumber
              min={0}
              addonBefore={CURRENCY_ICON}
              value={editingProducts[record.id]?.b2c_price ?? record.b2c_price}
              onChange={(v) => handleEditChange(record.id, "b2c_price", v)}
            />
          ),
        }
      : null,
    mrp_price: {
      title: "MRP",
      dataIndex: "mrp_price",
      key: "mrp_price",
      width: 160,
      render: (_: any, record: IProduct) => (
        <InputNumber
          min={0}
          addonBefore={CURRENCY_ICON}
          value={editingProducts[record.id]?.mrp_price ?? record.mrp_price}
          onChange={(v) => handleEditChange(record.id, "mrp_price", v)}
        />
      ),
    },
    stock: {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: 160,
      render: (_: any, record: IProduct) => (
        <InputNumber
          min={0}
          addonAfter={record.unit}
          value={editingProducts[record.id]?.stock ?? record.stock}
          onChange={(v) => handleEditChange(record.id, "stock", v)}
          style={{ width: 160 }}
        />
      ),
    },
    min_quantity: {
      title: "MOQ",
      dataIndex: "min_quantity",
      key: "min_quantity",
      width: 100,
      render: (_: any, record: IProduct) => (
        <InputNumber
          min={0}
          value={editingProducts[record.id]?.min_quantity ?? record.min_quantity}
          onChange={(v) => handleEditChange(record.id, "min_quantity", v)}
          style={{ width: 90 }}
        />
      ),
    },
    action: {
      title: "#",
      key: "action",
      width: 110,
      render: (_: any, record: IProduct) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => handleSingleUpdate(record.id)}
            disabled={!editingProducts[record.id]}
            loading={!!loadingRows[record.id]}
            icon={<SaveOutlined />}
          />
          <Button
            size="small"
            type="primary"
            onClick={() => { setSelectedProductId(record.id); setIsDrawerOpen(true); }}
            icon={<EditOutlined />}
          />
          <Link href={`/inventory/${record.id}`}>
            <Button size="small" icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [editingProducts, loadingRows, categoryTreeData, uniqueCatalogOptions, isB2CEnabled, handleEditChange, handleSingleUpdate]);

  /* filter + order columns by visibleColumns, always keep image+action */
  const columns = useMemo(() => ALL_COLUMNS
    .filter((c) => c.fixed || visibleColumns.includes(c.key))
    .map((c) => allColumnDefs[c.key])
    .filter(Boolean), [visibleColumns, allColumnDefs]);

  /* pending changes badge */
  const pendingCount = useMemo(() => Object.keys(editingProducts).length, [editingProducts]);

  return (
    <Space direction="vertical" className="w-100">

      {/* ── Toolbar ── */}
      <Space wrap style={{ marginBottom: 8 }}>

        {/* Bulk field selector */}
        <Select
          placeholder="Bulk: Select Field"
          style={{ width: 190 }}
          value={bulkField}
          onChange={(v) => { setBulkField(v); setBulkValue(null); }}
          options={[
            { label: "Name",     value: "name"         },
            { label: "Price",    value: "price"        },
            ...(isB2CEnabled ? [{ label: "B2C Price", value: "b2c_price" }] : []),
            { label: "MRP",      value: "mrp_price"    },
            { label: "Stock",    value: "stock"        },
            { label: "MOQ",      value: "min_quantity" },
            { label: "Catalog",  value: "catalog_ids"  },
            { label: "Category", value: "category_ids" },
          ]}
        />

        {bulkField === "name" && (
          <Input
            placeholder="Enter name"
            value={bulkValue}
            onChange={(e) => setBulkValue(e.target.value)}
            style={{ width: 260 }}
          />
        )}
        {["price", "b2c_price", "mrp_price", "stock", "min_quantity"].includes(bulkField || "") && (
          <InputNumber
            placeholder="Enter value"
            value={bulkValue}
            onChange={(v) => setBulkValue(v)}
            style={{ width: 180 }}
          />
        )}
        {bulkField === "catalog_ids" && (
          <Select
            mode="multiple"
            placeholder="Select Catalogs"
            style={{ width: 300 }}
            value={bulkValue}
            options={uniqueCatalogOptions}
            onChange={(v) => setBulkValue(v)}
          />
        )}
        {bulkField === "category_ids" && (
          <TreeSelect
            treeData={categoryTreeData}
            treeCheckable
            showSearch
            allowClear
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            placeholder="Select categories"
            treeNodeFilterProp="title"
            value={bulkValue}
            onChange={(v) => setBulkValue(v)}
            style={{ width: 300 }}
          />
        )}

        <Button disabled={!bulkValue} type="default" onClick={handleBulkApply}>
          Apply to All
        </Button>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleBulkUpdate}
          loading={updating}
          disabled={pendingCount < 1}
        >
          Save All {pendingCount > 0 && <Tag color="gold" style={{ marginLeft: 4 }}>{pendingCount}</Tag>}
        </Button>

        {/* Column configurator */}
        <Popover
          content={configuratorContent}
          trigger="click"
          placement="bottomRight"
        >
          <Button icon={<SettingOutlined />}>Columns</Button>
        </Popover>
      </Space>

      <Table<IProduct>
        size="small"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ x: "max-content" }}
        locale={{ emptyText: <Empty description="No products found" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width="65%"
      >
        {selectedProductId && (
          <ProductDetail isLoading={false} productId={selectedProductId} />
        )}
      </Drawer>
    </Space>
  );
};

export default ProductList;
