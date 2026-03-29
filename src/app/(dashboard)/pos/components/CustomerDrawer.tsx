"use client";

import { useState, useEffect, useRef } from "react";
import { Drawer, Input, Button, Form, Spin, message } from "antd";
import { SearchOutlined, UserOutlined, PlusOutlined, ArrowLeftOutlined, CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { ICustomer } from "@/interfaces/Customer";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";

interface IProps {
  open: boolean;
  selectedCustomer: ICustomer | null;
  onClose: () => void;
  onSelect: (c: ICustomer) => void;
}

type View = "list" | "add";

export default function CustomerDrawer({ open, selectedCustomer, onClose, onSelect }: IProps) {
  const [view, setView] = useState<View>("list");
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [keyword, setKeyword] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCustomers = async (kw = "") => {
    setListLoading(true);
    try {
      const { data } = await api.get(
        `${API_ENDPOINTS.CUSTOMERS}?page=1&page_size=25&keyword=${encodeURIComponent(kw)}`
      );
      setCustomers(data.data || data || []);
    } catch {
      // silent
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (!open) { setView("list"); setKeyword(""); form.resetFields(); return; }
    fetchCustomers();
  }, [open]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchCustomers(keyword), 300);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [keyword]);

  const handleSave = async (values: { name: string; phone: string; email?: string }) => {
    if (!values.name || !values.phone) { message.warning("Name and phone are required"); return; }
    setSaving(true);
    try {
      const { data } = await api.post(API_ENDPOINTS.CUSTOMERS, values);
      message.success("Customer added");
      onSelect(data);
      form.resetFields();
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Failed to add customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {view === "add" && (
            <button
              onClick={() => setView("list")}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#6366f1", padding: 0 }}
            >
              <ArrowLeftOutlined />
            </button>
          )}
          <span style={{ fontWeight: 700, fontSize: 14 }}>
            {view === "add" ? "Add New Customer" : "Select Customer"}
          </span>
        </div>
      }
      open={open}
      onClose={onClose}
      width={340}
      styles={{ body: { padding: 0 } }}
    >
      {view === "list" ? (
        <>
          {/* Search */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <Input
              prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
              placeholder="Search by name or phone…"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </div>

          {/* Add customer CTA */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <button
              onClick={() => setView("add")}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 8,
                border: "1.5px dashed #a5b4fc", background: "#eef2ff",
                color: "#6366f1", fontSize: 12, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <PlusOutlined /> Add New Customer
            </button>
          </div>

          {/* Walk-in option */}
          <div
            onClick={() => onSelect({ id: 0, name: "Walk-in Customer", phone: "—", email: null, status: "allowed", created_at: "", state: null, city: null })}
            style={{
              padding: "12px 16px", borderBottom: "1px solid #f1f5f9",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              background: !selectedCustomer ? "#fafafa" : "#fff",
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <UserOutlined style={{ color: "#94a3b8" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Walk-in Customer</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>No account needed</div>
            </div>
            {!selectedCustomer && <CheckOutlined style={{ color: "#6366f1", fontSize: 13 }} />}
          </div>

          {/* Customer list */}
          <div style={{ overflowY: "auto", height: "calc(100vh - 240px)" }}>
            {listLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
                <Spin indicator={<LoadingOutlined style={{ color: "#6366f1" }} spin />} />
              </div>
            ) : customers.length === 0 ? (
              <div style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 13 }}>
                No customers found
              </div>
            ) : (
              customers.map(c => {
                const isSelected = selectedCustomer?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => onSelect(c)}
                    style={{
                      padding: "10px 16px", borderBottom: "1px solid #f8fafc",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                      background: isSelected ? "#eef2ff" : "#fff",
                      transition: "background 0.1s",
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: isSelected ? "#6366f1" : "#e2e8f0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: isSelected ? "#fff" : "#64748b",
                      flexShrink: 0,
                    }}>
                      {c.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.3 }}>{c.phone}</div>
                    </div>
                    {isSelected && <CheckOutlined style={{ color: "#6366f1", fontSize: 13, flexShrink: 0 }} />}
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        /* Add customer form */
        <div style={{ padding: 16 }}>
          <Form form={form} layout="vertical" onFinish={handleSave} size="middle">
            <Form.Item
              label={<span style={{ fontSize: 12, fontWeight: 600 }}>Full Name</span>}
              name="name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="e.g. Rahul Sharma" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item
              label={<span style={{ fontSize: 12, fontWeight: 600 }}>Phone Number</span>}
              name="phone"
              rules={[{ required: true, message: "Phone is required" }]}
            >
              <Input placeholder="e.g. 9876543210" style={{ borderRadius: 8 }} maxLength={15} />
            </Form.Item>
            <Form.Item
              label={<span style={{ fontSize: 12, fontWeight: 600 }}>Email (optional)</span>}
              name="email"
            >
              <Input placeholder="e.g. rahul@email.com" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={saving}
              style={{
                background: "linear-gradient(90deg,#6366f1,#818cf8)",
                border: "none", borderRadius: 8,
                fontWeight: 600, height: 40, marginTop: 8,
              }}
            >
              Save Customer
            </Button>
          </Form>
        </div>
      )}
    </Drawer>
  );
}
