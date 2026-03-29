"use client";

import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  Card,
  Col,
  ColorPicker,
  Divider,
  Drawer,
  Form,
  Input,
  Button,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Typography,
  message,
  Alert,
} from "antd";
import { useEffect, useState } from "react";
import FeatureBanner from "@/components/common/FeatureBanner";
import {
  FileTextOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  SignatureOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  CheckCircleFilled,
  FileDoneOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import UploadPhoto from "@/components/common/upload-image";
import { useUserContext } from "@/contexts/UserContext";
import OverlayCard from "@/components/upgrade/overlay-card";

const { Text, Title, Paragraph } = Typography;

/* ── Invoice Preview — backend PDF rendered in iframe ─────── */
function InvoiceMockup({ blobUrl, loading }: { blobUrl: string | null; loading: boolean }) {
  if (loading) {
    return (
      <div style={{ width: "100%", height: "900px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <FileTextOutlined style={{ fontSize: 40, color: "#9ca3af", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "#6b7280" }}>Generating preview…</p>
        </div>
      </div>
    );
  }
  if (!blobUrl) return null;
  return (
    <iframe
      src={blobUrl}
      style={{ width: "100%", height: "900px", border: "none" }}
      title="Invoice Preview"
    />
  );
}

/* ══════════════════════════════════════════════════════════
   TEMPLATE OPTIONS
══════════════════════════════════════════════════════════ */
const TEMPLATE_OPTIONS = [
  { value: "classic",   label: "Classic  (Tax Invoice — IGST / CGST+SGST)"       },
  { value: "modern",    label: "Modern  (Minimal — CGST+SGST, payment tracking)"  },
  { value: "corporate", label: "Corporate  (Professional — branded colour header)" },
];

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function InvoiceConfig() {
  const { storeDetail, setStoreDetail } = useUserContext();
  const [form]            = Form.useForm();
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [togglingFeature, setTogglingFeature] = useState(false);
  const [showBank,        setShowBank]        = useState(false);
  const [showSignature,   setShowSignature]   = useState(false);
  const [showTerms,       setShowTerms]       = useState(true);
  const [previewOpen,     setPreviewOpen]     = useState(false);
  const [previewBlobUrl,  setPreviewBlobUrl]  = useState<string | null>(null);
  const [previewLoading,  setPreviewLoading]  = useState(false);

  const isInvoiceActive = !!storeDetail?.detail?.is_invoice;

  const toggleInvoiceFeature = async (enabled: boolean) => {
    setTogglingFeature(true);
    try {
      await api.post(API_ENDPOINTS.STORE_DETAIL, { is_invoice: enabled ? 1 : 0 });
      // update context so header/orders page also reflect immediately
      setStoreDetail((prev: any) => ({
        ...prev,
        detail: { ...prev.detail, is_invoice: enabled ? 1 : 0 },
      }));
      message.success(enabled ? "Invoice feature activated!" : "Invoice feature disabled");
    } catch {
      message.error("Failed to update feature status");
    } finally {
      setTogglingFeature(false);
    }
  };

  useEffect(() => {
    api.get(API_ENDPOINTS.INVOICE_CONFIG)
      .then(({ data }) => {
        const cfg = data?.data ?? {};
        form.setFieldsValue({ ...cfg, primary_color: cfg.primary_color ?? "#000000" });
        setShowBank(!!cfg.show_bank_details);
        setShowSignature(!!cfg.show_signature);
        setShowTerms(cfg.show_terms !== false);
      })
      .catch(() => message.error("Failed to load invoice config"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      const color = typeof values.primary_color === "string"
        ? values.primary_color
        : values.primary_color?.toHexString?.() ?? "#000000";

      await api.post(API_ENDPOINTS.INVOICE_CONFIG, {
        ...values,
        primary_color:     color,
        show_bank_details: showBank,
        show_signature:    showSignature,
        show_terms:        showTerms,
      });
      message.success("Invoice configuration saved");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  /** POST current form values → backend renders PDF → display as blob URL */
  const fetchPreview = async () => {
    setPreviewLoading(true);
    // revoke previous blob to avoid memory leaks
    if (previewBlobUrl) window.URL.revokeObjectURL(previewBlobUrl);
    setPreviewBlobUrl(null);
    try {
      const values = form.getFieldsValue(true);
      const color  = typeof values.primary_color === "string"
        ? values.primary_color
        : values.primary_color?.toHexString?.() ?? "#000000";

      const response = await api({
        url:          API_ENDPOINTS.INVOICE_CONFIG_PREVIEW,
        method:       "POST",
        responseType: "blob",
        data: {
          ...values,
          primary_color:     color,
          show_bank_details: showBank,
          show_signature:    showSignature,
          show_terms:        showTerms,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      setPreviewBlobUrl(url);
    } catch {
      message.error("Failed to generate preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewOpen(false);
  };

  /** Open drawer and immediately fetch preview */
  const openPreview = () => {
    setPreviewOpen(true);
    fetchPreview();
  };

  if (loading) return <Card loading />;

  return (
    <Form form={form} layout="vertical" onFinish={handleSave}>

      {/* ── Feature announcement banner ── */}
      <FeatureBanner
        id="invoice-beta-mar2026"
        icon={<FileTextOutlined style={{ fontSize: 17, color: "#6366f1" }} />}
        title="GST Invoice generation is now available!"
        description="Auto-generate branded PDF invoices with your logo, signature, HSN codes & full tax breakdowns. Enable the feature below to add invoices to every order."
        ctaText="Learn what's included"
        ctaHref="https://catafy.com"
        accentColor="#6366f1"
      />

      {/* ══ FEATURE ACTIVATION CARD ═══════════════════════ */}
      <Card
        style={{
          marginBottom: 20,
          border: isInvoiceActive ? "1.5px solid #22c55e" : "1.5px solid #e5e7eb",
          borderRadius: 12,
          background: isInvoiceActive ? "#f0fdf4" : "#fafafa",
        }}
        styles={{ body: { padding: "20px 24px" } }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          {/* Left: title + feature list */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <FileDoneOutlined style={{ fontSize: 22, color: isInvoiceActive ? "#16a34a" : "#6b7280" }} />
              <Title level={4} style={{ margin: 0, color: isInvoiceActive ? "#15803d" : "#374151" }}>
                GST Invoice Feature
              </Title>
              {isInvoiceActive
                ? <Tag color="success" icon={<CheckCircleFilled />}>Active</Tag>
                : <Tag color="default">Inactive</Tag>
              }
            </div>
            <Paragraph style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>
              Enable this to generate GST-compliant tax invoices for your orders. Once active:
            </Paragraph>

            <div style={{ display: "flex", gap: 32, marginTop: 12, flexWrap: "wrap" }}>
              {/* Orders column */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <ShoppingOutlined style={{ color: "#3b82f6" }} />
                  <Text strong style={{ fontSize: 13, color: "#1d4ed8" }}>Orders</Text>
                </div>
                {[
                  "Download GST invoice per order",
                  "Invoice number auto-assigned",
                  "IGST / CGST+SGST tax breakdowns",
                  "Reset & regenerate invoice",
                ].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <CheckCircleFilled style={{ fontSize: 11, color: isInvoiceActive ? "#22c55e" : "#d1d5db" }} />
                    <Text style={{ fontSize: 12, color: "#4b5563" }}>{f}</Text>
                  </div>
                ))}
              </div>

              {/* Products column */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <FileTextOutlined style={{ color: "#8b5cf6" }} />
                  <Text strong style={{ fontSize: 13, color: "#6d28d9" }}>Products / Inventory</Text>
                </div>
                {[
                  "HSN / SAC code per product",
                  "Tax rate field on each item",
                  "HSN printed on invoice",
                  "IRN & E-Way bill support",
                ].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <CheckCircleFilled style={{ fontSize: 11, color: isInvoiceActive ? "#22c55e" : "#d1d5db" }} />
                    <Text style={{ fontSize: 12, color: "#4b5563" }}>{f}</Text>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: toggle */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 90 }}>
            <Switch
              checked={isInvoiceActive}
              loading={togglingFeature}
              onChange={toggleInvoiceFeature}
              style={{ transform: "scale(1.3)" }}
            />
            <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
              {isInvoiceActive ? "Turn off" : "Activate"}
            </Text>
          </div>
        </div>
      </Card>

      {/* Gate: only show config when feature is active */}
      {!isInvoiceActive && (
        <Alert
          type="info"
          showIcon
          message="Activate the Invoice Feature above to configure templates, GSTIN, bank details and more."
          style={{ marginBottom: 20, borderRadius: 8 }}
        />
      )}

      {isInvoiceActive && <>

      {/* ── Template & Branding ─────────────────────────── */}
      <Card
        title={<><FileTextOutlined style={{ marginRight: 8 }} />Template &amp; Branding</>}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Template" name="template">
              <Select options={TEMPLATE_OPTIONS} placeholder="Select template" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Invoice Title" name="invoice_title">
              <Input placeholder="TAX INVOICE" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Invoice Prefix" name="invoice_prefix" extra="e.g. INV → INV-2026-0001">
              <Input placeholder="INV" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Primary Color" name="primary_color">
              <ColorPicker
                showText
                format="hex"
                onChange={(color) => form.setFieldValue("primary_color", color.toHexString())}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* ── Tax & GST ───────────────────────────────────── */}
      <Card
        title={<><SafetyCertificateOutlined style={{ marginRight: 8 }} />Tax &amp; GST</>}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="GSTIN" name="gstin">
              <Input placeholder="22AAAAA0000A1Z5" maxLength={20} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tax Type" name="tax_type">
              <Select
                options={[
                  { value: "igst",      label: "IGST (Inter-state / Integrated)" },
                  { value: "cgst_sgst", label: "CGST + SGST (Intra-state)"       },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col>
            <Form.Item label="Show HSN Code" name="show_hsn" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="Show IRN" name="show_irn" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="Show E-Way Bill" name="show_eway_bill" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* ── Bank Details ────────────────────────────────── */}
      <Card
        title={<><BankOutlined style={{ marginRight: 8 }} />Bank Details</>}
        style={{ marginBottom: 16 }}
        extra={
          <Switch checked={showBank} onChange={setShowBank}
            checkedChildren="Shown" unCheckedChildren="Hidden" />
        }
      >
        {showBank ? (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Bank Name" name="bank_name">
                <Input placeholder="e.g. HDFC Bank" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Account Number" name="account_no">
                <Input placeholder="Account number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="IFSC Code" name="ifsc_code">
                <Input placeholder="e.g. HDFC0001234" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Branch Name" name="branch_name">
                <Input placeholder="Branch name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="UPI ID" name="upi_id">
                <Input placeholder="yourname@bank" />
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <Text type="secondary">Enable to show bank details on invoice</Text>
        )}
      </Card>

      {/* ── Signature ───────────────────────────────────── */}
      <Card
        title={<><SignatureOutlined style={{ marginRight: 8 }} />Signature</>}
        style={{ marginBottom: 16 }}
        extra={
          <Switch checked={showSignature} onChange={setShowSignature}
            checkedChildren="Shown" unCheckedChildren="Hidden" />
        }
      >
        {showSignature ? (
          <Form.Item name="signature_image" noStyle>
            <UploadPhoto
              type="logo"
              value={form.getFieldValue("signature_image")}
              setValue={(url: string) => form.setFieldValue("signature_image", url)}
              cardSize="small"
            />
          </Form.Item>
        ) : (
          <Text type="secondary">Enable to add a signature image on invoice</Text>
        )}
      </Card>

      {/* ── Notes, Terms & Footer ───────────────────────── */}
      <Card
        title={<><InfoCircleOutlined style={{ marginRight: 8 }} />Notes, Terms &amp; Footer</>}
        style={{ marginBottom: 16 }}
      >
        <Form.Item label="Notes" name="notes" extra="Shown at the bottom of invoice">
          <Input.TextArea rows={3} placeholder="e.g. Thank you for your business!" />
        </Form.Item>

        <Divider />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Title level={5} style={{ margin: 0 }}>Terms &amp; Conditions</Title>
          <Switch checked={showTerms} onChange={setShowTerms}
            checkedChildren="Shown" unCheckedChildren="Hidden" />
        </div>

        {showTerms && (
          <Form.Item name="terms" extra="One term per line">
            <Input.TextArea
              rows={4}
              placeholder={"Goods once sold will not be taken back.\nPayment due within 30 days.\nInterest @24% p.a. will be charged for uncleared bills beyond 15 days.\nSubject to local Jurisdiction."}
            />
          </Form.Item>
        )}

        <Divider />

        <Form.Item label="Footer Text" name="footer_text">
          <Input placeholder="e.g. Catafy — Digital Cataloguing" maxLength={500} />
        </Form.Item>
      </Card>

      {/* ── Actions ─────────────────────────────────────── */}
      <Space>
        <Button type="primary" htmlType="submit" loading={saving}
          style={{ minWidth: 160, borderRadius: 8 }}>
          Save Configuration
        </Button>
        <Button icon={<EyeOutlined />} onClick={openPreview}
          style={{ borderRadius: 8 }}>
          Preview Template
        </Button>
      </Space>

      {/* ── Preview Drawer ──────────────────────────────── */}
      </>} {/* end isInvoiceActive gate */}

      <Drawer
        title={
          <Space>
            <EyeOutlined />
            Invoice Preview
            <Tag color="blue">{form.getFieldValue("template") || "classic"}</Tag>
          </Space>
        }
        open={previewOpen}
        onClose={closePreview}
        width="60vw"
        styles={{ body: { padding: 0, background: "#e5e7eb" } }}
        extra={
          <Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Your real store branding · sample order data
            </Text>
            <Button
              size="small"
              icon={<EyeOutlined />}
              loading={previewLoading}
              onClick={fetchPreview}
            >
              Refresh
            </Button>
          </Space>
        }
      >
        <div style={{ padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <InvoiceMockup blobUrl={previewBlobUrl} loading={previewLoading} />
          </div>
        </div>
      </Drawer>
    </Form>
  );
}
