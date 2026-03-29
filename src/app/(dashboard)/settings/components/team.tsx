"use client";

import React, { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Input, message, Popconfirm, Card, Tag, Space,
} from "antd";
import {
  TeamOutlined, UserAddOutlined, DeleteOutlined, CrownOutlined,
} from "@ant-design/icons";
import { API_ENDPOINTS } from "@/api/endpoints";
import { IUser } from "@/interfaces/Store";
import api from "@/api";
import { useUserContext } from "@/contexts/UserContext";
import OverlayCard from "@/components/upgrade/overlay-card";

const ROLE_MAP: Record<string, { label: string; color: string }> = {
  o: { label: "Owner",       color: "gold"    },
  e: { label: "Editor",      color: "blue"    },
  s: { label: "Sales Agent", color: "green"   },
  v: { label: "Viewer",      color: "default" },
};

/* ── Section header ─────────────────────────────────────────── */
const Section = ({
  icon, color = "#6366f1", bg = "#eef2ff", title, desc,
}: {
  icon: React.ReactNode; color?: string; bg?: string; title: string; desc: string;
}) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 14px", borderRadius: 10,
    background: bg, border: `1px solid ${color}22`,
    marginBottom: 16,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
      background: `${color}18`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color, fontSize: 17,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{title}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>{desc}</div>
    </div>
  </div>
);

/* ── Main component ─────────────────────────────────────────── */
const TeamMembers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<IUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { storeDetail } = useUserContext();
  const [form] = Form.useForm();

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get(API_ENDPOINTS.STORE_TEAM);
      setMembers(res.data.data);
    } catch {
      message.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAdd = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      await api.post(API_ENDPOINTS.STORE_TEAM, values);
      message.success("Team member added!");
      setIsModalOpen(false);
      form.resetFields();
      fetchMembers();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsSubmitting(true);
      await api.delete(`${API_ENDPOINTS.STORE_TEAM}/${id}`);
      message.success("Team member removed!");
      fetchMembers();
    } catch {
      message.error("Failed to remove member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name: string) => (
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{name}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email: string) => (
        <span style={{ fontSize: 12, color: "#64748b" }}>{email}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (phone: string) => (
        <span style={{ fontSize: 12, color: "#64748b" }}>{phone}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role: string) => {
        const r = ROLE_MAP[role];
        return r ? (
          <Tag color={r.color} style={{ fontSize: 11, borderRadius: 4 }}>
            {role === "o" && <CrownOutlined style={{ marginRight: 3 }} />}
            {r.label}
          </Tag>
        ) : <span style={{ fontSize: 12 }}>{role}</span>;
      },
    },
    {
      title: "",
      render: (_: any, record: IUser) => record.role !== "o" ? (
        <Popconfirm
          title="Remove this team member?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes, Remove"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
        >
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            style={{ fontSize: 11 }}
          >
            Remove
          </Button>
        </Popconfirm>
      ) : <></>,
    },
  ];

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>👥 Team Members</span>}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
      extra={
        <Button
          size="small"
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{
            background: "linear-gradient(90deg,#6366f1,#818cf8)",
            border: "none", fontSize: 12,
          }}
        >
          Add Member
        </Button>
      }
    >
      {storeDetail?.active_plan?.plan_id === 1 && <OverlayCard />}

      <Section
        icon={<TeamOutlined />}
        color="#6366f1" bg="#eef2ff"
        title="Your Team"
        desc="Invite staff or partners to manage products, orders, and customers together"
      />

      <Table
        size="small"
        columns={columns}
        dataSource={members}
        rowKey="id"
        loading={loading}
        pagination={{ size: "small", pageSize: 10, showSizeChanger: false }}
        scroll={{ x: "max-content" }}
        locale={{
          emptyText: (
            <div style={{ padding: "32px 0", textAlign: "center", color: "#94a3b8" }}>
              <TeamOutlined style={{ fontSize: 28, display: "block", marginBottom: 6 }} />
              No team members yet — add your first member
            </div>
          ),
        }}
      />

      <Modal
        title={
          <span style={{ fontWeight: 700 }}>
            <UserAddOutlined style={{ color: "#6366f1", marginRight: 8 }} />
            Add Team Member
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAdd}
        okText="Add Member"
        okButtonProps={{
          loading: isSubmitting,
          style: { background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" },
        }}
        width="45%"
      >
        <Form layout="vertical" form={form} size="middle" style={{ marginTop: 8 }}>
          <Form.Item
            name="name"
            label={<span style={{ fontWeight: 600 }}>Full Name</span>}
            rules={[{ required: true, message: "Full name is required" }]}
          >
            <Input placeholder="Enter full name" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="email"
            label={<span style={{ fontWeight: 600 }}>Email Address</span>}
            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input placeholder="Enter email" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={<span style={{ fontWeight: 600 }}>Phone Number</span>}
            rules={[{ required: true, message: "Phone is required" }]}
          >
            <Input maxLength={10} placeholder="10-digit phone number" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span style={{ fontWeight: 600 }}>Password</span>}
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Set a password" style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TeamMembers;
