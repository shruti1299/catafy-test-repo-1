"use client";

import React, { useState, useEffect } from "react";
import {
  Form, Radio, Input, Select, Slider, Button, Image,
  message, Card, Row, Col, InputNumber, Switch,
} from "antd";
import {
  EyeOutlined, SaveOutlined, PictureOutlined,
  FontColorsOutlined, SettingOutlined,
} from "@ant-design/icons";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useUserContext } from "@/contexts/UserContext";

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
    marginBottom: 20,
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
const WatermarkSettings = () => {
  const { storeDetail } = useUserContext();
  const STORE_LOGO = storeDetail?.store?.logo;
  const IS_WATERMARK = storeDetail?.store?.watermark;

  const [type, setType] = useState("logo");
  const [text, setText] = useState("");
  const [position, setPosition] = useState("bottom-right");
  const [opacity, setOpacity] = useState(0.7);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWatermark, setIsWatermark] = useState(IS_WATERMARK);
  const [fontConfig, setFontConfig] = useState({
    color: "#000000",
    stroke_color: "#000000",
    stroke_width: 0,
    align: "center",
    valign: "middle",
    angle: 0,
    line_height: 1.5,
    size: 48,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get(API_ENDPOINTS.STORE_WATERMARK);
        setType(data.type || "logo");
        setText(data.text || "");
        setPosition(data.position || "bottom-right");
        setOpacity(data.opacity ?? 0.5);
        if (data.font_config) setFontConfig(data.font_config);
      } catch {/* silent */}
    };
    fetchSettings();
  }, []);

  const handlePreview = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("type", type);
      formData.append("text", text);
      formData.append("position", position);
      formData.append("opacity", opacity.toString());
      formData.append("font_config", JSON.stringify(fontConfig));
      const res = await api.post(API_ENDPOINTS.WATERMARK_PREVIEW, formData, { responseType: "blob" });
      setPreviewUrl(URL.createObjectURL(res.data));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("text", text);
      formData.append("position", position);
      formData.append("opacity", opacity.toString());
      formData.append("font_config", JSON.stringify(fontConfig));
      await api.post(API_ENDPOINTS.STORE_WATERMARK, formData);
      message.success("Watermark settings saved successfully");
    } finally {
      setLoading(false);
    }
  };

  const saveWatermarkToggle = async () => {
    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.STORE_DETAIL, { watermark: !isWatermark });
      message.success("Watermark setting updated. Changes reflect in 5–10 min.");
      setIsWatermark(!isWatermark);
    } catch {
      message.error("Failed to update watermark setting");
    } finally {
      setLoading(false);
    }
  };

  if (!storeDetail) return null;

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>💧 Watermark Settings</span>}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      {/* ── Enable toggle ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 14px", borderRadius: 10,
        background: isWatermark ? "#f0fdf4" : "#fafafa",
        border: `1px solid ${isWatermark ? "#bbf7d0" : "#e2e8f0"}`,
        marginBottom: 20,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>💧 Apply Watermark on Product Images</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>
            Automatically watermarks every product image you upload — protects your brand
          </div>
        </div>
        <Switch
          loading={loading}
          checked={isWatermark}
          onChange={saveWatermarkToggle}
          size="small"
        />
      </div>

      {isWatermark && (
        <Row gutter={[24, 0]}>
          {/* ── Left: Config ── */}
          <Col xs={24} md={14}>

            <Section
              icon={<PictureOutlined />}
              color="#6366f1" bg="#eef2ff"
              title="Watermark Type"
              desc="Choose whether to use your store logo, custom text, or both"
            />

            <Form layout="vertical" size="middle">
              <Form.Item label={<span style={{ fontWeight: 600, fontSize: 13 }}>Type</span>}>
                <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
                  <Radio value="logo">Logo Only</Radio>
                  <Radio value="logo_text">Logo + Text</Radio>
                  <Radio value="text">Text Only</Radio>
                </Radio.Group>
              </Form.Item>

              {(type === "logo" || type === "logo_text") && STORE_LOGO && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                    Your Store Logo
                  </div>
                  <Image
                    src={STORE_LOGO}
                    alt="Logo Preview"
                    width={80}
                    style={{ borderRadius: 6, border: "1px solid #e2e8f0" }}
                    preview={false}
                  />
                </div>
              )}

              {(type === "text" || type === "logo_text") && (
                <>
                  <Section
                    icon={<FontColorsOutlined />}
                    color="#0ea5e9" bg="#f0f9ff"
                    title="Text & Font Settings"
                    desc="Customize the watermark text appearance"
                  />

                  <Row gutter={[12, 0]}>
                    <Col span={24}>
                      <Form.Item label={<span style={{ fontWeight: 600, fontSize: 13 }}>Watermark Text</span>}>
                        <Input
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="e.g., © YourBrand"
                          style={{ borderRadius: 8 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Font Color</span>}>
                        <Input
                          type="color"
                          value={fontConfig.color}
                          onChange={(e) => setFontConfig({ ...fontConfig, color: e.target.value })}
                          style={{ borderRadius: 8, height: 36 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Stroke Color</span>}>
                        <Input
                          type="color"
                          value={fontConfig.stroke_color}
                          onChange={(e) => setFontConfig({ ...fontConfig, stroke_color: e.target.value })}
                          style={{ borderRadius: 8, height: 36 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Stroke Width</span>}>
                        <InputNumber
                          min={0}
                          value={fontConfig.stroke_width}
                          onChange={(v) => v != null && setFontConfig({ ...fontConfig, stroke_width: v })}
                          style={{ width: "100%", borderRadius: 8 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Font Size</span>}>
                        <InputNumber
                          min={8} max={200}
                          value={fontConfig.size}
                          onChange={(v) => v != null && setFontConfig({ ...fontConfig, size: v })}
                          style={{ width: "100%", borderRadius: 8 }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              <Section
                icon={<SettingOutlined />}
                color="#10b981" bg="#f0fdf4"
                title="Position & Opacity"
                desc="Set where the watermark appears and how visible it is"
              />

              <Form.Item label={<span style={{ fontWeight: 600, fontSize: 13 }}>Position</span>}>
                <Select
                  value={position}
                  onChange={setPosition}
                  style={{ borderRadius: 8 }}
                >
                  <Select.Option value="top-left">Top Left</Select.Option>
                  <Select.Option value="top-right">Top Right</Select.Option>
                  <Select.Option value="bottom-left">Bottom Left</Select.Option>
                  <Select.Option value="bottom-right">Bottom Right</Select.Option>
                  <Select.Option value="center">Center</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span style={{ fontWeight: 600, fontSize: 13 }}>
                    Opacity: <b style={{ color: "#6366f1" }}>{Math.round(opacity * 100)}%</b>
                  </span>
                }
              >
                <Slider
                  min={0} max={1} step={0.1}
                  value={opacity}
                  onChange={setOpacity}
                  marks={{ 0: "0%", 0.5: "50%", 1: "100%" }}
                />
              </Form.Item>

              {/* ── Save ── */}
              <div style={{
                padding: "14px 16px",
                background: "linear-gradient(90deg,#f8faff,#eef2ff)",
                borderRadius: 10, border: "1px solid #e0e7ff",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: 10,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Save watermark config</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Applied to all newly uploaded images</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={handlePreview}
                    loading={loading}
                    style={{ borderRadius: 8, fontSize: 12 }}
                  >
                    Preview
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    loading={loading}
                    style={{
                      background: "linear-gradient(90deg,#6366f1,#818cf8)",
                      border: "none", borderRadius: 8, fontWeight: 600,
                    }}
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </Form>
          </Col>

          {/* ── Right: Preview ── */}
          <Col xs={24} md={10}>
            <div style={{
              borderRadius: 10, border: "1px solid #e2e8f0",
              background: "#fafafa", overflow: "hidden",
              minHeight: 200, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              {previewUrl ? (
                <Image src={previewUrl} alt="Watermark Preview" style={{ maxWidth: "100%" }} />
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                  <EyeOutlined style={{ fontSize: 32, display: "block", marginBottom: 8 }} />
                  <div style={{ fontSize: 12 }}>Click <b>Preview</b> to see the watermark here</div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default WatermarkSettings;
