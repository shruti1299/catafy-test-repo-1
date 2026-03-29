"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Card,
  Drawer,
  Form,
  Input,
  Switch,
  Typography,
  Empty,
  Alert,
} from "antd";

import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { formatDateTime } from "@/utils/helper";
import RichTextEditor from "@/components/common/RichTextEditor";

const { Text } = Typography;

export default function Page() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [content, setContent] = useState("");
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);

    try {
      const { data } = await api.get(API_ENDPOINTS.STORE_PAGES);
      setPages(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    try {
      await api.delete(`${API_ENDPOINTS.STORE_PAGES}/${id}`);
      message.success("Deleted");
      load();
    } catch {
      message.error("Failed to delete page");
    }
  };

  const openDrawer = (page?: any) => {
    if (page) {
      setEditingPage(page);
      form.setFieldsValue(page);
      setContent(page.content || "");
    } else {
      setEditingPage(null);
      form.resetFields();
      setContent("");
    }

    setDrawerVisible(true);
  };

  const savePage = async (values: any) => {
    const payload = { ...values, content };
    try {
      if (editingPage) {
        await api.put(`${API_ENDPOINTS.STORE_PAGES}/${editingPage.id}`, payload);
        message.success("Updated");
      } else {
        await api.post(API_ENDPOINTS.STORE_PAGES, payload);
        message.success("Created");
      }
      setDrawerVisible(false);
      load();
    } catch {
      message.error("Failed to save page");
    }
  };

  const cols = [
    {
      title: "S.no",
      render: (_: any, __: any, i: number) => i + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: boolean) => s
        ? <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>Published</span>
        : <span style={{ fontSize: 11, color: "#94a3b8" }}>Draft</span>,
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      render: (u: string) => formatDateTime(u),
    },
    {
      title: "",
      render: (_: any, row: any) => (
        <Space size={4}>
          <Button
            size="small"
            onClick={() => openDrawer(row)}
            style={{ fontSize: 11 }}
          >
            Edit
          </Button>
          <Popconfirm title="Delete this page?" onConfirm={() => remove(row.id)} okButtonProps={{ danger: true }}>
            <Button danger size="small" style={{ fontSize: 11 }}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>📄 Store Pages</span>}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
      style={{ borderRadius: 12 }}
      className="mb-100"
      extra={
        <Button
          size="small"
          type="primary"
          onClick={() => openDrawer()}
          style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" }}
        >
          + Add Page
        </Button>
      }
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16, borderRadius: 8 }}
        message="What are Store Pages?"
        description='Create custom pages like "About Us", "Privacy Policy", "Terms & Conditions" etc. These pages appear as links in your store footer and help build buyer trust.'
      />
      <Table
        size="small"
        rowKey="id"
        dataSource={pages}
        columns={cols}
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{ size: "small", showSizeChanger: true }}
        locale={{ emptyText: <Empty description="No pages yet — add your first page above" /> }}
      />

      <Drawer
        width="75%"
        title={<span style={{ fontWeight: 700 }}>{editingPage ? "Edit Page" : "Add Page"}</span>}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        <Form layout="vertical" form={form} onFinish={savePage}>
          <Form.Item
            name="title"
            label="Page Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="desc"
            label="Meta Description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Page Content">
            <RichTextEditor value={content} onChange={setContent} />
          </Form.Item>

          <Form.Item name="status" label="Published" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" }}
          >
            Save Page
          </Button>
        </Form>
      </Drawer>
    </Card>
  );
}