import React, { useEffect, useState } from "react";
import {
  Upload,
  Button,
  Table,
  Image,
  Input,
  message,
  Select,
  InputNumber,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  PictureOutlined,
  CloudUploadOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ICatalog } from "@/interfaces/Catalog";
import { useUserContext } from "@/contexts/UserContext";

interface ProductFile extends UploadFile {
  customName?: string;
  price?: number;
  catalog?: number;
  b2c_price?: number;
}

const BulkProductUpload: React.FC = () => {
  const [fileList, setFileList] = useState<ProductFile[]>([]);
  const [catalogs, setCatalogs] = useState<ICatalog[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [globalCatalog, setGlobalCatalog] = useState<number | null>(null);
  const [globalPrice, setGlobalPrice] = useState<number | null>(null);
  const [globalB2CPrice, setGlobalB2CPrice] = useState<number | null>(null);
  const { storeDetail } = useUserContext();
  const isB2CEnabled = storeDetail?.store?.is_b2c;

  const getAllCatalogs = async () => {
    const { data } = await api.get(API_ENDPOINTS.ALL_CATALOGS);
    setCatalogs(data);
  };

  useEffect(() => {
    getAllCatalogs();
  }, []);

  const handleUpload: UploadProps["onChange"] = ({ fileList }) => {
    const updatedList = fileList.map((file) => {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      let customName = nameWithoutExt;
      let price: number | undefined = undefined;
      if (nameWithoutExt.includes("#")) {
        const [namePart, pricePart] = nameWithoutExt.split("#");
        customName = namePart || nameWithoutExt;
        const parsedPrice = Number(pricePart);
        if (!isNaN(parsedPrice)) price = parsedPrice;
      }
      return { ...file, customName, price };
    });
    setFileList(updatedList);
  };

  const handleRemove = (file: ProductFile) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
  };

  const handleChangeData = (
    uid: string,
    label: "customName" | "price" | "catalog" | "b2c_price",
    value: string | number | null
  ) => {
    setFileList(fileList.map((file) => (file.uid === uid ? { ...file, [label]: value } : file)));
  };

  const handleApplyB2CPriceToAll = (price: number | null) => {
    setGlobalB2CPrice(price);
    setFileList((prev) => prev.map((file) => ({ ...file, b2c_price: price ?? undefined })));
  };

  const handleImageChange = (uid: string, newFile: UploadFile) => {
    setFileList(
      fileList.map((file) =>
        file.uid === uid ? { ...newFile, uid, customName: newFile.name } : file
      )
    );
  };

  const handleApplyCatalogToAll = (catalogId: number) => {
    setGlobalCatalog(catalogId);
    setFileList((prev) => prev.map((file) => ({ ...file, catalog: catalogId })));
  };

  const handleApplyPriceToAll = (price: number | null) => {
    setGlobalPrice(price);
    setFileList((prev) => prev.map((file) => ({ ...file, price: price ?? undefined })));
  };

  const isValidCatalog = (catalogId?: number) => {
    if (!catalogId || typeof catalogId !== "number") return false;
    return catalogs.some((c) => c.id === catalogId);
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.warning("Please upload at least one image.");
      return;
    }
    const invalidCatalogRows = fileList.filter((file) => !isValidCatalog(file.catalog));
    if (invalidCatalogRows.length > 0) {
      message.error(`Please select a valid catalog for all products (${invalidCatalogRows.length} missing).`);
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file.originFileObj as Blob);
      formData.append("customNames[]", file.customName || file.name);
      formData.append("prices[]", file.price?.toString() || "0");
      formData.append("catalogs[]", file.catalog?.toString() || "null");
      if (isB2CEnabled) {
        formData.append("b2c_prices[]", file.b2c_price?.toString() || "0");
      }
    });
    try {
      await api.post(API_ENDPOINTS.UPLOAD_PRODUCTS, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Products uploaded successfully!");
      setFileList([]);
      setGlobalCatalog(null);
      setGlobalPrice(null);
    } catch {
      message.error("Failed to upload products. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const columns = [
    {
      title: "Image",
      key: "image",
      width: 64,
      render: (_: any, record: ProductFile) => (
        <Upload
          showUploadList={false}
          beforeUpload={(file) => { handleImageChange(record.uid, file); return false; }}
        >
          <div style={{ cursor: "pointer", borderRadius: 8, overflow: "hidden", border: "1px solid #e0e7ff" }}>
            <Image
              src={URL.createObjectURL(record.originFileObj as Blob)}
              width={48}
              height={48}
              style={{ objectFit: "cover", display: "block" }}
              preview={false}
            />
          </div>
        </Upload>
      ),
    },
    {
      title: "Catalog",
      dataIndex: "catalog",
      key: "catalog",
      width: 180,
      render: (value: number, record: ProductFile) => (
        <Select
          value={value}
          style={{ width: "100%" }}
          placeholder="Select catalog"
          size="small"
          options={catalogs?.map((m) => ({ label: m.name, value: m.id }))}
          onChange={(val) => handleChangeData(record.uid, "catalog", val)}
          status={!isValidCatalog(value) ? "error" : undefined}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "customName",
      key: "customName",
      render: (value: string, record: ProductFile) => (
        <Input
          value={value}
          size="small"
          onChange={(e) => handleChangeData(record.uid, "customName", e.target.value)}
          style={{ borderRadius: 6 }}
        />
      ),
    },
    {
      title: "Price (₹)",
      dataIndex: "price",
      key: "price",
      width: 110,
      render: (value: number, record: ProductFile) => (
        <InputNumber
          min={1}
          value={value}
          size="small"
          style={{ width: "100%", borderRadius: 6 }}
          onChange={(val) => handleChangeData(record.uid, "price", val)}
        />
      ),
    },
    ...(isB2CEnabled
      ? [{
          title: "B2C Price (₹)",
          dataIndex: "b2c_price",
          key: "b2c_price",
          width: 120,
          render: (value: number, record: ProductFile) => (
            <InputNumber
              min={1}
              value={value}
              size="small"
              style={{ width: "100%", borderRadius: 6 }}
              onChange={(val) => handleChangeData(record.uid, "b2c_price", val)}
            />
          ),
        }]
      : []),
    {
      title: "",
      key: "action",
      width: 40,
      render: (_: any, record: ProductFile) => (
        <button
          onClick={() => handleRemove(record)}
          style={{
            border: "none", background: "transparent", cursor: "pointer",
            color: "#fca5a5", fontSize: 14, padding: 2,
          }}
        >
          <DeleteOutlined />
        </button>
      ),
    },
  ];

  return (
    <div style={{ padding: "4px 0" }}>

      {/* ── Tip banner ── */}
      <div style={{
        background: "#fffbeb", border: "1px solid #fde68a",
        borderRadius: 8, padding: "10px 14px", marginBottom: 16,
        display: "flex", gap: 8, alignItems: "flex-start",
      }}>
        <BulbOutlined style={{ color: "#d97706", fontSize: 14, marginTop: 1, flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700 }}>Pro tip — auto-fill from filename: </span>
          Name your image <code style={{ background: "#fef9c3", borderRadius: 4, padding: "1px 5px" }}>product_name#price.jpg</code>
          {" "}and name + price will be filled automatically.{" "}
          <span style={{ color: "#d97706" }}>Example: </span>
          <code style={{ background: "#fef9c3", borderRadius: 4, padding: "1px 5px" }}>tshirt#499.jpg</code>
        </div>
      </div>

      {/* ── Drop zone ── */}
      <Upload.Dragger
        multiple
        fileList={fileList}
        beforeUpload={() => false}
        onChange={handleUpload}
        showUploadList={false}
        accept="image/*"
        style={{ borderRadius: 10, borderColor: "#a5b4fc", marginBottom: 0 }}
      >
        <div style={{ padding: "28px 20px" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: "0 auto 14px",
            background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <PictureOutlined style={{ fontSize: 26, color: "#6366f1" }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 4 }}>
            Drop product images here
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            or click to browse — JPG, PNG, WebP accepted · multiple files allowed
          </div>
        </div>
      </Upload.Dragger>

      {fileList.length > 0 && (
        <>
          {/* ── Bulk actions bar ── */}
          <div style={{
            marginTop: 16,
            background: "#f8fafc", border: "1px solid #e0e7ff",
            borderRadius: 10, padding: "12px 14px",
            display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>
              Apply to all:
            </span>
            <Select
              placeholder="Set catalog for all"
              value={globalCatalog ?? undefined}
              style={{ width: 220 }}
              size="small"
              allowClear
              options={catalogs?.map((m) => ({ label: m.name, value: m.id }))}
              onChange={handleApplyCatalogToAll}
            />
            <InputNumber
              placeholder="Set price for all"
              value={globalPrice ?? undefined}
              min={1}
              size="small"
              style={{ width: 160 }}
              prefix="₹"
              onChange={handleApplyPriceToAll}
            />
            {isB2CEnabled && (
              <InputNumber
                placeholder="Set B2C price for all"
                value={globalB2CPrice ?? undefined}
                min={1}
                size="small"
                style={{ width: 180 }}
                prefix="₹"
                onChange={handleApplyB2CPriceToAll}
              />
            )}
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8" }}>
              {fileList.length} image{fileList.length !== 1 ? "s" : ""} selected
            </span>
          </div>

          {/* ── Products table ── */}
          <div style={{ marginTop: 12, border: "1px solid #e0e7ff", borderRadius: 10, overflow: "hidden" }}>
            <Table
              size="small"
              columns={columns}
              dataSource={fileList.map((file) => ({ key: file.uid, ...file }))}
              pagination={false}
              style={{ borderRadius: 10 }}
            />
          </div>

          {/* ── Upload button ── */}
          <Button
            type="primary"
            size="large"
            block
            icon={<CloudUploadOutlined />}
            onClick={handleSubmit}
            loading={isUploading}
            style={{
              marginTop: 16,
              background: "linear-gradient(90deg,#6366f1,#818cf8)",
              border: "none", borderRadius: 9,
              fontWeight: 700, height: 44,
            }}
          >
            {isUploading ? "Uploading…" : `Upload ${fileList.length} Product${fileList.length !== 1 ? "s" : ""}`}
          </Button>
        </>
      )}
    </div>
  );
};

export default BulkProductUpload;
