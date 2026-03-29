"use client";

import React, { useState } from "react";
import { Button, Upload, message, List, Typography } from "antd";
import {
  FileExcelOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  WarningFilled,
} from "@ant-design/icons";
import { API_ENDPOINTS } from "@/api/endpoints";
import api from "@/api";

const { Text } = Typography;

const UpdateProductFromExcel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<any | null>(null);

  const beforeUpload = (selectedFile: File) => {
    const isCsv =
      selectedFile.type === "text/csv" ||
      selectedFile.name.endsWith(".csv");

    if (!isCsv) {
      message.error("Only CSV files are supported for bulk update.");
      return Upload.LIST_IGNORE;
    }
    if (selectedFile.size / 1024 / 1024 > 5) {
      message.error("File must be smaller than 5MB.");
      return Upload.LIST_IGNORE;
    }
    setFile(selectedFile);
    setSummary(null);
    return false;
  };

  const handleUpload = async () => {
    if (!file) { message.error("Please select a file before uploading."); return; }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      setSummary(null);
      const { data } = await api.post(API_ENDPOINTS.UPDATE_EXCEL_PRODUCTS, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Upload completed successfully ✅");
      if (data?.summary) setSummary(data.summary);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div style={{ padding: "4px 0" }}>

      {/* ── Instructions ── */}
      <div style={{
        background: "#f8fafc", border: "1px solid #e0e7ff",
        borderRadius: 10, padding: "14px 16px", marginBottom: 20,
      }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 10 }}>
          📋 How to update products in bulk
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { step: "1", text: "Go to Reports and download your current product list as Excel.", highlight: "Reports" },
            { step: "2", text: "Edit the required fields in the spreadsheet (name, price, stock, etc.)." },
            { step: "3", text: "Do NOT modify product_id or store_name columns — they are used to match records.", warn: true },
            { step: "4", text: "Upload the updated file here. Changes will be applied automatically." },
          ].map(({ step, text, warn }) => (
            <div key={step} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: warn ? "#fef2f2" : "linear-gradient(135deg,#6366f1,#818cf8)",
                border: warn ? "1px solid #fecaca" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                color: warn ? "#dc2626" : "#fff",
              }}>{step}</div>
              <div style={{ fontSize: 12, color: warn ? "#dc2626" : "#475569", lineHeight: 1.5, paddingTop: 2 }}>
                {text}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: "#94a3b8" }}>
          Max file size: <Text code style={{ fontSize: 11 }}>5MB</Text> · Accepted format: <Text code style={{ fontSize: 11 }}>.csv</Text>
        </div>
      </div>

      {/* ── Drop zone ── */}
      <Upload.Dragger
        multiple={false}
        maxCount={1}
        accept=".csv"
        disabled={loading}
        showUploadList={false}
        beforeUpload={beforeUpload}
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
            Drop your updated CSV here
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            or click to browse — .csv only (download from Reports to get the right format)
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
        {loading ? "Updating products…" : "Upload & Update Products"}
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
              <div style={{ fontSize: 11, color: "#166534", fontWeight: 600 }}>Updated</div>
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
            <div style={{ border: "1px solid #fecaca", borderRadius: 10, overflow: "hidden" }}>
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

export default UpdateProductFromExcel;
