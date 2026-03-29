"use client";

import React, { useEffect, useState } from "react";
import {
  Form, Input, InputNumber, Button, Switch, Radio,
  Image, Row, Col, message, Typography, Tag, Tooltip,
} from "antd";
import {
  ShopOutlined, EyeOutlined, ShoppingCartOutlined,
  PictureOutlined, AppstoreOutlined, LinkOutlined,
  InfoCircleOutlined, CheckCircleFilled, LockOutlined,
  TeamOutlined, SaveOutlined,
} from "@ant-design/icons";
import { CURRENCY_ICON } from "@/constant";
import UploadPhoto from "@/components/common/upload-image";
import { IStore, IStoreMoreDetail } from "@/interfaces/Store";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useUserContext } from "@/contexts/UserContext";

const { Text } = Typography;

/* ── Section header ─────────────────────────────────────────── */
const Section = ({
  icon, color = "#6366f1", bg = "#eef2ff",
  title, desc,
}: {
  icon: React.ReactNode; color?: string; bg?: string;
  title: string; desc: string;
}) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 14px", borderRadius: 10,
    background: bg, border: `1px solid ${color}22`,
    marginBottom: 20,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
      background: `${color}18`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color, fontSize: 17,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{title}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>{desc}</div>
    </div>
  </div>
);

/* ── Visibility option card ─────────────────────────────────── */
const VisibilityCard = ({
  value, icon, title, desc, selected,
}: {
  value: number; icon: React.ReactNode; title: string; desc: string; selected: boolean;
}) => (
  <div style={{
    flex: 1, padding: "12px 14px", borderRadius: 10, cursor: "pointer",
    border: `2px solid ${selected ? "#6366f1" : "#e2e8f0"}`,
    background: selected ? "#eef2ff" : "#fff",
    transition: "all 0.15s",
    position: "relative",
  }}>
    <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontSize: 12, fontWeight: 700, color: selected ? "#4338ca" : "#1e293b" }}>{title}</div>
    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, lineHeight: "15px" }}>{desc}</div>
    {selected && (
      <CheckCircleFilled style={{
        position: "absolute", top: 8, right: 8,
        color: "#6366f1", fontSize: 14,
      }} />
    )}
  </div>
);

/* ── Order type card ────────────────────────────────────────── */
const OrderTypeCard = ({
  value, icon, title, desc, selected,
}: {
  value: string; icon: React.ReactNode; title: string; desc: string; selected: boolean;
}) => (
  <div style={{
    flex: 1, padding: "12px 14px", borderRadius: 10, cursor: "pointer",
    border: `2px solid ${selected ? "#6366f1" : "#e2e8f0"}`,
    background: selected ? "#eef2ff" : "#fff",
    transition: "all 0.15s",
    position: "relative",
  }}>
    <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontSize: 12, fontWeight: 700, color: selected ? "#4338ca" : "#1e293b" }}>{title}</div>
    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, lineHeight: "15px" }}>{desc}</div>
    {selected && (
      <CheckCircleFilled style={{
        position: "absolute", top: 8, right: 8,
        color: "#6366f1", fontSize: 14,
      }} />
    )}
  </div>
);

/* ── Main component ─────────────────────────────────────────── */
const MyStoreSetting = ({
  store, detail, loading,
}: {
  store: IStore; detail: IStoreMoreDetail; loading: boolean;
}) => {
  const { storeDetail } = useUserContext();
  const [form] = Form.useForm();
  const [logo, setLogo]                     = useState(store?.logo || "");
  const [isUpdating, setIsUpdating]         = useState(false);
  const [enquiryType, setEnquiryType]       = useState(store?.enquiry_type || "order");
  const [visibility, setVisibility]         = useState<number>(store?.access_type ?? 1);
  const [showDescription, setShowDescription] = useState(!!detail?.description);

  const storeUrl = `https://${storeDetail?.store?.username}.catafy.com`;

  useEffect(() => {
    if (store) {
      form.setFieldsValue({
        ...store,
        description: detail?.description || "",
        is_variation: store?.is_variation ?? false,
        is_section: store?.is_section ?? false,
      });
      setEnquiryType(store.enquiry_type || "order");
      setVisibility(store.access_type ?? 1);
    }
    if (store?.logo) setLogo(store.logo);
    if (detail?.description) setShowDescription(true);
  }, [store, detail, form]);

  const onFinish = async (values: any) => {
    setIsUpdating(true);
    try {
      await api.post(API_ENDPOINTS.STORE_DETAIL, {
        ...values,
        logo,
        enquiry_type: enquiryType,
        access_type: visibility,
      });
      message.success("Store updated! Changes reflect in 5–10 minutes.");
    } catch {
      message.error("Something went wrong. Please try again.");
    }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ height: 20, background: "#f1f5f9", borderRadius: 6, marginBottom: 12, width: "60%" }} />
        <div style={{ height: 14, background: "#f1f5f9", borderRadius: 6, width: "40%" }} />
      </div>
    );
  }

  return (
    <div>
      {/* ── Live store banner ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 14px", borderRadius: 10, marginBottom: 24,
        background: "linear-gradient(90deg,#f0fdf4,#dcfce7)",
        border: "1px solid #bbf7d0", flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 10, fontWeight: 700, color: "#16a34a",
            background: "#dcfce7", border: "1px solid #86efac",
            borderRadius: 20, padding: "2px 8px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
            LIVE
          </span>
          <Text style={{ fontSize: 12, color: "#15803d", fontWeight: 500 }}>
            Your store is live at{" "}
            <a href={storeUrl} target="_blank" rel="noreferrer" style={{ color: "#16a34a", fontWeight: 700, textDecoration: "underline" }}>
              {storeUrl}
            </a>
          </Text>
        </div>
        <a href={storeUrl} target="_blank" rel="noreferrer">
          <Button
            size="small"
            icon={<LinkOutlined />}
            style={{ fontSize: 11, borderColor: "#86efac", color: "#16a34a", background: "#fff" }}
          >
            Preview Store
          </Button>
        </a>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} size="middle">

        {/* ════════════ 1. Store Identity ════════════ */}
        <Section
          icon={<ShopOutlined />}
          color="#6366f1" bg="#eef2ff"
          title="Store Identity"
          desc="How your store appears to buyers — name, logo, and description"
        />

        {/* Store Name */}
        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 13 }}>Store Display Name</span>}
          name="store_name"
          rules={[{ required: true, message: "Store name is required" }]}
          extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Shown on your catalog, invoices, and storefront header</span>}
        >
          <Input
            prefix={<ShopOutlined style={{ color: "#94a3b8" }} />}
            placeholder="e.g. Krishna Textiles, ABC Wholesale"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        {/* Logo */}
        <Form.Item label={<span style={{ fontWeight: 600, fontSize: 13 }}>Store Logo</span>}>
          <div style={{
            padding: "14px 16px", borderRadius: 10,
            border: "1px dashed #c7d2fe", background: "#fafafe",
            display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          }}>
            {logo ? (
              <div style={{ position: "relative" }}>
                <Image
                  src={logo} width={72} height={72}
                  style={{ borderRadius: 10, objectFit: "cover", border: "1px solid #e0e7ff" }}
                  preview={false}
                />
                <Tag
                  color="green"
                  style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", fontSize: 10, margin: 0, borderRadius: 4 }}
                >
                  Current
                </Tag>
              </div>
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: 10,
                background: "#f1f5f9", display: "flex", alignItems: "center",
                justifyContent: "center", border: "1px dashed #cbd5e1",
              }}>
                <PictureOutlined style={{ fontSize: 22, color: "#94a3b8" }} />
              </div>
            )}
            <div>
              <UploadPhoto setValue={setLogo} value="" type="logo" />
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
                PNG or JPG recommended · Appears on your storefront header
              </div>
            </div>
          </div>
        </Form.Item>

        {/* Description */}
        <Form.Item label={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Store Description</span>
            <Switch
              size="small"
              checked={showDescription}
              onChange={setShowDescription}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
            <span style={{ fontSize: 11, color: "#94a3b8" }}>Optional — shown on your homepage</span>
          </div>
        }>
          {showDescription && (
            <Form.Item
              name="description"
              noStyle
              rules={[{ max: 120, message: "Max 120 characters allowed" }]}
            >
              <Input.TextArea
                rows={2} maxLength={120} showCount
                placeholder="e.g. India's leading wholesale textile supplier — quality fabrics at factory prices"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          )}
        </Form.Item>

        {/* ════════════ 2. Store Visibility ════════════ */}
        <div style={{ marginTop: 8, marginBottom: 4 }}>
          <Section
            icon={<EyeOutlined />}
            color="#0ea5e9" bg="#f0f9ff"
            title="Who Can Access Your Store?"
            desc="Control which buyers can browse your catalog and place orders"
          />
        </div>

        <Form.Item name="access_type" noStyle>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            {[
              {
                value: 1, icon: "🌍", title: "Public",
                desc: "Anyone with the link can browse and order. Best for B2C / open wholesale.",
              },
              {
                value: 2, icon: "🔒", title: "Private",
                desc: "Buyers must request access. You approve each customer manually.",
              },
              {
                value: 3, icon: "👤", title: "Semi-Private",
                desc: "Buyers must log in to see your catalog but don't need approval.",
              },
            ].map(opt => (
              <div key={opt.value} style={{ flex: "1 1 140px" }} onClick={() => {
                setVisibility(opt.value);
                form.setFieldValue("access_type", opt.value);
              }}>
                <VisibilityCard {...opt} selected={visibility === opt.value} />
              </div>
            ))}
          </div>
        </Form.Item>

        {/* ════════════ 3. How Buyers Order ════════════ */}
        <Section
          icon={<ShoppingCartOutlined />}
          color="#10b981" bg="#f0fdf4"
          title="How Do Buyers Place Orders?"
          desc="Choose the interaction model that fits your sales workflow"
        />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {[
            {
              value: "order", icon: "🛒", title: "Direct Orders",
              desc: "Buyers add to cart and place orders. You confirm or reject.",
            },
            {
              value: "single", icon: "📩", title: "Single Enquiry",
              desc: "Buyer submits one enquiry with a product list. No cart.",
            },
            {
              value: "multiple", icon: "📋", title: "Multiple Enquiries",
              desc: "Buyer can send separate enquiries for individual products.",
            },
          ].map(opt => (
            <div key={opt.value} style={{ flex: "1 1 140px" }} onClick={() => setEnquiryType(opt.value)}>
              <OrderTypeCard {...opt} selected={enquiryType === opt.value} />
            </div>
          ))}
        </div>

        {/* MOA — only for direct orders */}
        {enquiryType === "order" && (
          <Form.Item
            name="moa"
            label={
              <span style={{ fontWeight: 600, fontSize: 13 }}>
                Minimum Order Amount
                <Tooltip title="Buyers cannot checkout below this amount">
                  <InfoCircleOutlined style={{ color: "#94a3b8", marginLeft: 6, fontSize: 12 }} />
                </Tooltip>
              </span>
            }
            extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Leave 0 to disable minimum order requirement</span>}
          >
            <InputNumber
              style={{ width: 200, borderRadius: 8 }}
              min={0}
              placeholder="0"
              addonBefore={CURRENCY_ICON}
            />
          </Form.Item>
        )}

        {/* ════════════ 4. Advanced Features ════════════ */}
        <Section
          icon={<AppstoreOutlined />}
          color="#f97316" bg="#fff7ed"
          title="Advanced Features"
          desc="Powerful add-ons to enhance your storefront experience"
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {[
            {
              name: "is_variation",
              icon: "🎨",
              title: "Product Variations",
              desc: "Allow products to have options like Size, Color, Weight, etc. Buyers pick a variant before ordering.",
              color: "#8b5cf6",
            },
            {
              name: "is_section",
              icon: "🗂️",
              title: "Section Homepage",
              desc: "Replace the default product grid with a section-based homepage — banners, featured categories, highlighted products.",
              color: "#f97316",
            },
          ].map(feat => (
            <div key={feat.name} style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              padding: "14px 16px", borderRadius: 10,
              background: "#fafafa", border: "1px solid #f1f5f9",
            }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{feat.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{feat.title}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 3, lineHeight: "16px" }}>{feat.desc}</div>
              </div>
              <Form.Item name={feat.name} valuePropName="checked" noStyle>
                <Switch size="small" />
              </Form.Item>
            </div>
          ))}
        </div>

        {/* ── Save ── */}
        <div style={{
          padding: "14px 16px",
          background: "linear-gradient(90deg,#f8faff,#eef2ff)",
          borderRadius: 10, border: "1px solid #e0e7ff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Ready to publish changes?</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Updates reflect on your live store in 5–10 minutes</div>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            loading={isUpdating}
            icon={<SaveOutlined />}
            style={{
              background: "linear-gradient(90deg,#6366f1,#818cf8)",
              border: "none", borderRadius: 8,
              fontWeight: 600, minWidth: 140,
            }}
          >
            Save Store Settings
          </Button>
        </div>

      </Form>
    </div>
  );
};

export default MyStoreSetting;
