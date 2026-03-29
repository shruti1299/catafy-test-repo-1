"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  Button,
  Empty,
  Modal,
  Form,
  Input,
  Switch,
  Space,
  Tag,
  message,
  TreeSelect,
  Card,
  Popconfirm,
  Alert,
} from "antd";
import {
  PlusOutlined,
  EyeFilled,
  FolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ICategoryData, IStoreCategory } from "@/interfaces/Category";
import Link from "next/link";

const buildTreeData = (categories?: IStoreCategory[]): any[] => {
  if (!Array.isArray(categories)) return [];
  return categories.map((cat) => ({
    title: cat.name,
    value: cat.id,
    key: cat.id,
    children: Array.isArray(cat.children) ? buildTreeData(cat.children as any) : [],
  }));
};

export default function CategoryList() {
  const [data, setData] = useState<ICategoryData>({} as ICategoryData);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IStoreCategory | null>(null);
  const [form] = Form.useForm<IStoreCategory>();

  // Prevent double-fetch in React 18 Strict Mode
  const fetchedRef = useRef(false);

  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get<ICategoryData>(API_ENDPOINTS.CATEGORIES, {
        params: { page, tree: true },
      });
      setData(data);
      setPagination({
        current: data.current_page,
        pageSize: data.per_page,
        total: data.total,
      });
    } catch {
      message.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Run once on mount — no dependency on fetchCategories ref to avoid Strict Mode double-call
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchCategories();
  }, []);

  /* ── Category CRUD ─────────────────────────────────────────────────── */

  const openModal = (record?: IStoreCategory) => {
    setEditing(record ?? null);
    setModalOpen(true);
    form.setFieldsValue(record ?? { enabled: true });
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const deleteCategory = useCallback(async (id: number) => {
    try {
      await api.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
      message.success("Category deleted");
      fetchCategories(pagination.current);
    } catch {
      message.error("Failed to delete category");
    }
  }, [pagination.current]);

  const submitForm = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await api.put(`${API_ENDPOINTS.CATEGORIES}/${editing.id}`, values);
        message.success("Category updated");
      } else {
        await api.post(API_ENDPOINTS.CATEGORIES, values);
        message.success("Category created");
      }
      closeModal();
      fetchCategories(pagination.current);
    } catch {
      message.error("Save failed");
    }
  };

  /* ── Columns ───────────────────────────────────────────────────────── */

  const columns: ColumnsType<IStoreCategory> = useMemo(() => [
    {
      title: "Category",
      dataIndex: "name",
      render: (name: string, record: IStoreCategory) => (
        <Space>
          <FolderOutlined style={{ color: record.parent_id ? "#818cf8" : "#6366f1" }} />
          <span style={{ fontWeight: record.parent_id ? 400 : 600 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      render: (slug: string) => (
        <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{slug}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "enabled",
      render: (v: boolean) => (
        <Tag color={v ? "blue" : "default"} style={{ fontSize: 11, borderRadius: 4 }}>
          {v ? "Enabled" : "Disabled"}
        </Tag>
      ),
    },
    {
      title: "Products",
      dataIndex: "products",
      align: "center" as const,
      render: (products: any[]) => (
        <Tag color="blue" style={{ fontSize: 11, borderRadius: 4 }}>
          {products?.length ?? 0}
        </Tag>
      ),
    },
    {
      title: "Actions",
      width: 160,
      render: (_, record) => (
        <Space size={4}>
          <Button
            size="small"
            type="text"
            icon={<EyeFilled style={{ fontSize: 12 }} />}
            style={{ color: "#6366f1" }}
            onClick={() => openModal(record)}
          >
            Edit
          </Button>
          <Link href={`/categories/${record.id}`}>
            <Button size="small" type="link" style={{ padding: "0 4px", fontSize: 12 }}>
              View
            </Button>
          </Link>
          <Popconfirm
            title="Delete category?"
            description="This will permanently remove the category."
            onConfirm={() => deleteCategory(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" type="text" danger icon={<DeleteOutlined style={{ fontSize: 12 }} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ], [deleteCategory]);

  /* ── Render ─────────────────────────────────────────────────────────── */

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🗂️ Categories</span>}
      extra={
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" }}
        >
          Add Category
        </Button>
      }
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16, borderRadius: 8 }}
        message="Organise your catalog"
        description="Categories help buyers navigate your store. You can nest categories (parent → child) and assign products to them. Use the View button to see all products in a category."
      />
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data?.data}
        size="small"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          size: "small",
          onChange: (page) => fetchCategories(page),
        }}
        expandable={{ childrenColumnName: "children" }}
        locale={{ emptyText: <Empty description="No categories yet" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />

      <Modal
        title={editing ? `Edit — ${editing.name}` : "Add Category"}
        open={modalOpen}
        onCancel={closeModal}
        onOk={submitForm}
        okText={editing ? "Update" : "Create"}
        okButtonProps={{ style: { background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Electronics" />
          </Form.Item>

          <Form.Item name="slug" label="Slug (optional)">
            <Input placeholder="e.g. electronics" />
          </Form.Item>

          <Form.Item name="parent_id" label="Parent Category">
            <TreeSelect
              treeData={buildTreeData(data.data)}
              allowClear
              placeholder="Select parent (leave empty for root)"
            />
          </Form.Item>

          <Form.Item name="enabled" label="Enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
