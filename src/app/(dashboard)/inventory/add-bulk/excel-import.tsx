"use client";

import React, { useState } from "react";
import { Button, Upload, message, Alert, List, Typography } from "antd";
import {
  DownloadOutlined,
  FileExcelOutlined,
  CloudUploadOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  WarningFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import { API_ENDPOINTS } from "@/api/endpoints";
import api from "@/api";

const { Text } = Typography;

const ProductExcelUploader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<any | null>(null);

  const handleDownloadSample = () => {
    const IMAGE_LINK =
      "https://catafy.catafy.com/_next/image?url=https%3A%2F%2Fklogs.blr1.digitaloceanspaces.com%2Fproducts%2Fp_69a0a6d66a3e8.jpg&w=1920&q=100";
    const sampleData = [
      ["catalog_name", "product_name", "price", "mrp", "stock", "moq", "image_link", "category_name"],
      ["Shoes", "Running Shoes", "1000", "1200", "50", "2", IMAGE_LINK, "comma seperated"],
      ["Bags", "Travel Backpack", "2000", "2500", "20", "1", IMAGE_LINK, "comma seperated"],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      sampleData.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "sample_products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!file) {
      message.error("Please select a file before uploading!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      setSummary(null);
      const { data } = await api.post(API_ENDPOINTS.EXCEL_IMPORT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Upload finished ✅");
      if (data?.summary) setSummary(data.summary);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div style={{ padding: "4px 0" }}>

      {/* ── Steps row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {/* Step 1 */}
        <div style={{
          border: "1px solid #e0e7ff", borderRadius: 10,
          padding: "14px 16px", background: "#fafbff",
          display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg,#6366f1,#818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#fff", fontWeight: 700,
          }}>1</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 2 }}>
              Download Sample File
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>
              Use the sample CSV as a template. Fill in your product details following the exact column format.
            </div>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadSample}
              size="small"
              style={{
                borderColor: "#6366f1", color: "#6366f1",
                borderRadius: 6, fontWeight: 600, fontSize: 12,
              }}
            >
              Download Sample
            </Button>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{
          border: "1px solid #e0e7ff", borderRadius: 10,
          padding: "14px 16px", background: "#fafbff",
          display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg,#818cf8,#a5b4fc)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#fff", fontWeight: 700,
          }}>2</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 2 }}>
              Upload Your File
            </div>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
              Upload your filled <Text code style={{ fontSize: 11 }}>.xlsx</Text>, <Text code style={{ fontSize: 11 }}>.xls</Text> or{" "}
              <Text code style={{ fontSize: 11 }}>.csv</Text> file. Products will be created automatically.
            </div>
          </div>
        </div>
      </div>

      {/* ── Columns hint ── */}
      <div style={{
        background: "#f0fdf4", border: "1px solid #bbf7d0",
        borderRadius: 8, padding: "10px 14px", marginBottom: 16,
        fontSize: 12, color: "#166534",
      }}>
        <span style={{ fontWeight: 700 }}>Required columns: </span>
        {["catalog_name", "product_name", "price"].map(col => (
          <code key={col} style={{
            background: "#dcfce7", border: "1px solid #bbf7d0",
            borderRadius: 4, padding: "1px 6px", marginRight: 6, fontSize: 11,
          }}>{col}</code>
        ))}
        <span style={{ fontWeight: 700, marginLeft: 4 }}>Optional: </span>
        {["mrp", "stock", "moq", "image_link", "category_name"].map(col => (
          <code key={col} style={{
            background: "#f1f5f9", border: "1px solid #e2e8f0",
            borderRadius: 4, padding: "1px 6px", marginRight: 6, fontSize: 11, color: "#475569",
          }}>{col}</code>
        ))}
      </div>

      {/* ── Drop zone ── */}
      <Upload.Dragger
        multiple={false}
        maxCount={1}
        accept=".xlsx,.xls,.csv"
        disabled={loading}
        showUploadList={false}
        beforeUpload={(f) => { setFile(f); setSummary(null); return false; }}
        style={{ borderRadius: 10, borderColor: "#a5b4fc" }}
      >
        <div style={{ padding: "24px 16px" }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12, margin: "0 auto 12px",
            background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FileExcelOutlined style={{ fontSize: 24, color: "#6366f1" }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 4 }}>
            Drop your Excel / CSV here
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            or click to browse — .xlsx, .xls, .csv accepted
          </div>
        </div>
      </Upload.Dragger>

      {/* ── Selected file indicator ── */}
      {file && (
        <div style={{
          marginTop: 12, padding: "10px 14px",
          background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileExcelOutlined style={{ color: "#6366f1", fontSize: 16 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1e1b4b" }}>{file.name}</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button
            onClick={() => setFile(null)}
            style={{
              border: "none", background: "transparent", cursor: "pointer",
              color: "#94a3b8", fontSize: 13, padding: 2,
            }}
          >
            <DeleteOutlined />
          </button>
        </div>
      )}

      {/* ── Upload button ── */}
      <Button
        type="primary"
        size="large"
        block
        icon={<CloudUploadOutlined />}
        loading={loading}
        disabled={!file || loading}
        onClick={handleUpload}
        style={{
          marginTop: 16,
          background: file ? "linear-gradient(90deg,#6366f1,#818cf8)" : undefined,
          border: "none", borderRadius: 9,
          fontWeight: 700, height: 44,
        }}
      >
        {loading ? "Uploading…" : "Upload & Import Products"}
      </Button>

      {/* ── Summary ── */}
      {summary && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16,
          }}>
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 10, padding: "12px 16px", textAlign: "center",
            }}>
              <CheckCircleFilled style={{ fontSize: 20, color: "#16a34a", marginBottom: 4 }} />
              <div style={{ fontSize: 22, fontWeight: 800, color: "#16a34a" }}>{summary.success}</div>
              <div style={{ fontSize: 11, color: "#166534", fontWeight: 600 }}>Imported</div>
            </div>
            <div style={{
              background: "#fffbeb", border: "1px solid #fde68a",
              borderRadius: 10, padding: "12px 16px", textAlign: "center",
            }}>
              <WarningFilled style={{ fontSize: 20, color: "#d97706", marginBottom: 4 }} />
              <div style={{ fontSize: 22, fontWeight: 800, color: "#d97706" }}>{summary.skipped}</div>
              <div style={{ fontSize: 11, color: "#92400e", fontWeight: 600 }}>Skipped</div>
            </div>
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 10, padding: "12px 16px", textAlign: "center",
            }}>
              <CloseCircleFilled style={{ fontSize: 20, color: "#dc2626", marginBottom: 4 }} />
              <div style={{ fontSize: 22, fontWeight: 800, color: "#dc2626" }}>{summary.failed}</div>
              <div style={{ fontSize: 11, color: "#991b1b", fontWeight: 600 }}>Failed</div>
            </div>
          </div>

          {summary.errors?.length > 0 && (
            <div style={{
              border: "1px solid #fecaca", borderRadius: 10, overflow: "hidden",
            }}>
              <div style={{
                background: "#fef2f2", padding: "8px 14px",
                fontSize: 12, fontWeight: 700, color: "#991b1b",
                borderBottom: "1px solid #fecaca",
              }}>
                ❌ Error Details ({summary.errors.length})
              </div>
              <List
                size="small"
                dataSource={summary.errors}
                renderItem={(err: string, i: number) => (
                  <List.Item style={{ padding: "6px 14px", fontSize: 12, color: "#dc2626" }}>
                    {i + 1}. {err}
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductExcelUploader;
