"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Tag,
  Space,
  message,
  Card,
  Popconfirm,
  Empty,
  Row,
  Col,
  Typography,
  Badge,
  Image,
  Modal,
  Form,
  InputNumber,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { IProduct, IVariation } from "@/interfaces/Product";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import GenerateVariations from "./generate-variations";
import Loader from "../loader";
import { CURRENCY_ICON } from "@/constant";
import { useUserContext } from "@/contexts/UserContext";

const { Text } = Typography;

const ProductVariation = ({ product }: { product: IProduct }) => {
  const [variations, setVariations] = useState<IVariation[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { storeDetail } = useUserContext();
  const isB2CEnabled = storeDetail?.store?.is_b2c;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingVariation, setEditingVariation] = useState<IVariation | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  /* -------------------- LOAD DATA -------------------- */
  const getAttributes = async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.ATTRIBUTES);
      setAttributes(data || []);
    } catch {
      message.error("Failed to load attributes");
    }
  };

  const getProductVariations = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(
        `${API_ENDPOINTS.PRODUCTS}/${product.id}`
      );
      setVariations(data?.variations || []);
    } catch {
      message.error("Failed to load variations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (product?.id) {
      getProductVariations();
      getAttributes();
    }
  }, [product?.id]);

  /* -------------------- DELETE -------------------- */
  const handleDelete = async (id: number) => {
    try {
      setDeleteLoadingId(id);
      await api.delete(`${API_ENDPOINTS.VARIATIONS}/${id}`);
      message.success("Variation deleted");
      setVariations((prev) => prev.filter((v) => v.id !== id));
    } catch {
      message.error("Delete failed");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  /* -------------------- EDIT -------------------- */
  const openEditModal = (variation: IVariation) => {
    setEditingVariation(variation);
    form.setFieldsValue({
      price: variation.price,
      stock: variation.stock,
      b2c_price: variation.b2c_price,
      mrp_price: variation.mrp_price,
      min_quantity: variation.min_quantity,
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingVariation) return;

    try {
      const values = await form.validateFields();
      setUpdateLoading(true);

      await api.put(
        `${API_ENDPOINTS.VARIATIONS}/${editingVariation.id}`,
        values
      );

      message.success("Variation updated");

      // Optimistic update (no reload required)
      setVariations((prev) =>
        prev.map((v) =>
          v.id === editingVariation.id ? { ...v, ...values } : v
        )
      );

      setEditModalOpen(false);
      form.resetFields();
    } catch {
      message.error("Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const getImage = (v_id: number) => {
    if (!product.media?.length) return "";
    return product.media.find((f) => f.variation_id === v_id)?.small || "";
  };

  /* ====================================================== */

  return (
    <>
      {/* Hint banner */}
      <div
        style={{
          padding: "10px 14px",
          background: "#f5f3ff",
          border: "1px solid #ddd6fe",
          borderRadius: 8,
          marginBottom: 12,
          fontSize: 12,
          color: "#5b21b6",
        }}
      >
        Variations let you create different versions of the same product (e.g. Size S/M/L, Color Red/Blue) — each with its own price and stock
      </div>

      <Card
        title={
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
            🎨 Product Variations
          </span>
        }
        size="small"
        style={{ marginTop: 8, borderRadius: 12 }}
        styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
        extra={
          attributes?.length ? (
            <GenerateVariations
              product={product}
              reload={getProductVariations}
              attributes={attributes}
            />
          ) : null
        }
      >
        {isLoading ? (
          <Loader />
        ) : variations.length === 0 ? (
          <Empty description="No variations yet — click '+ Add Variations' to get started" />
        ) : (
          <Row gutter={[12, 12]}>
            {variations.map((variation) => (
              <Col xs={24} sm={12} md={8} lg={8} key={variation.id}>
                <Card
                  size="small"
                  style={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    margin: "4px 0",
                  }}
                >
                  {/* IMAGE + ACTIONS */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    {variation?.image && (
                      <Image
                        src={getImage(variation.id)}
                        alt="variation"
                        width={80}
                        preview
                        style={{ borderRadius: 8, objectFit: "cover" }}
                      />
                    )}

                    <Space>
                      <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(variation)}
                      />

                      <Popconfirm
                        title="Delete this variation?"
                        onConfirm={() => handleDelete(variation.id)}
                      >
                        <Button
                          size="small"
                          danger
                          type="text"
                          loading={deleteLoadingId === variation.id}
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </Space>
                  </div>

                  {/* ATTRIBUTES */}
                  <Space wrap size={[4, 4]} style={{ marginTop: 8 }}>
                    {variation.attributes &&
                      Object.entries(variation.attributes).map(([key, value]) => (
                        <Tag
                          key={key}
                          color="geekblue"
                          style={{ fontSize: 11, borderRadius: 6, fontWeight: 500 }}
                        >
                          {value as string}
                        </Tag>
                      ))}
                  </Space>

                  {/* PRICE + STOCK */}
                  <div style={{ marginTop: 8 }}>
                    <Text strong style={{ fontSize: 13, color: "#1e293b" }}>
                      {CURRENCY_ICON}
                      {variation.price}
                    </Text>
                    <br />
                    <Badge
                      status={variation.stock > 0 ? "success" : "error"}
                      text={
                        <span style={{ fontSize: 11, color: "#64748b" }}>
                          {variation.stock > 0
                            ? `${variation.stock} in stock`
                            : "Out of stock"}
                        </span>
                      }
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* ================= EDIT MODAL ================= */}
      <Modal
        title="Edit Variation"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          form.resetFields();
        }}
        onOk={handleUpdate}
        confirmLoading={updateLoading}
        okText="Update"
        okButtonProps={{
          style: {
            background: "linear-gradient(90deg,#6366f1,#818cf8)",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
          },
        }}
        destroyOnClose
      >
        <Form layout="vertical" size="middle" form={form}>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Required" }]}
            extra={
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                Selling price for this specific variation
              </span>
            }
          >
            <InputNumber
              style={{ width: "100%", borderRadius: 8 }}
              min={0}
              addonBefore={CURRENCY_ICON}
            />
          </Form.Item>

          <Form.Item
            label="MRP Price"
            name="mrp_price"
            rules={[{ required: true, message: "Required" }]}
            extra={
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                MRP for this variation
              </span>
            }
          >
            <InputNumber
              style={{ width: "100%", borderRadius: 8 }}
              min={0}
              addonBefore={CURRENCY_ICON}
            />
          </Form.Item>

          <Form.Item
            label="MOQ"
            name="min_quantity"
            extra={
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                MOQ — minimum units for this variation
              </span>
            }
          >
            <InputNumber style={{ width: "100%", borderRadius: 8 }} min={1} />
          </Form.Item>

          {isB2CEnabled ? (
            <Form.Item
              label="B2C Price"
              name="b2c_price"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                style={{ width: "100%", borderRadius: 8 }}
                min={0}
                addonBefore={CURRENCY_ICON}
              />
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Required" }]}
            extra={
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                Available stock for this variation
              </span>
            }
          >
            <InputNumber style={{ width: "100%", borderRadius: 8 }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductVariation;
