import React, { useState } from "react";
import { Form, InputNumber, Button, message, Radio, List, Card, Space, Col, Row, Tag } from "antd";
import { IProduct, IProductDiscount } from "@/interfaces/Product";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toTitleCase } from "@/utils/helper";
import { useUserContext } from "@/contexts/UserContext";

interface IProps {
  product: IProduct;
}

const Section = ({
  icon,
  color = "#6366f1",
  bg = "#eef2ff",
  title,
  desc,
}: {
  icon: React.ReactNode;
  color?: string;
  bg?: string;
  title: string;
  desc: string;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      borderRadius: 10,
      background: bg,
      border: `1px solid ${color}22`,
      marginBottom: 20,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        flexShrink: 0,
        background: `${color}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        fontSize: 17,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{title}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>{desc}</div>
    </div>
  </div>
);

const ProductDiscount = ({ product }: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [discounts, setDiscounts] = useState<Array<IProductDiscount>>(
    product.discounts as IProductDiscount[]
  );
  const [form] = Form.useForm<{
    discount_type: string;
    min_quantity: number;
    discount_value: number;
  }>();
  const selectedDiscountType = Form.useWatch("discount_type", form);
  const { storeDetail } = useUserContext();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await api.post(
        `${API_ENDPOINTS.PRODUCTS}/${product.id}/discounts`,
        {
          ...values,
          product_id: product.id,
        }
      );

      if (response?.data?.data) {
        setDiscounts((prevDiscounts) => [...prevDiscounts, response.data.data]);
        message.success("Bulk discount added successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Error adding discount");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (discount_id: number) => {
    try {
      setLoading(true);
      await api.delete(
        `${API_ENDPOINTS.PRODUCTS}/${product.id}/discounts/${discount_id}`
      );
      setDiscounts(discounts?.filter((f) => f.id != discount_id));
      message.success("Deleted successfully!");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" className="w-100" style={{ width: "100%" }}>
      {/* Bulk discount info box */}
      <div
        style={{
          padding: "12px 14px",
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 10,
          fontSize: 12,
          color: "#166534",
          lineHeight: 1.6,
        }}
      >
        💡 <strong>Bulk Discount</strong> — Reward buyers who order more! e.g. &apos;10+ pieces = 5% off&apos; automatically applies when buyer orders in bulk.
      </div>

      <Card
        title={
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
            ➕ Add Bulk Discount Rule
          </span>
        }
        style={{ borderRadius: 12 }}
        styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
      >
        <Form
          layout="vertical"
          size="middle"
          onFinish={onFinish}
          style={{ marginTop: 8 }}
          form={form}
        >
          <Row gutter={[10, 10]}>
            <Col span={8}>
              <Form.Item
                name="min_quantity"
                label="Minimum Quantity"
                rules={[{ required: true, message: "Enter minimum quantity!" }]}
                extra={
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    Minimum quantity to trigger this discount (e.g. 10 = applies when buyer orders 10+ pieces)
                  </span>
                }
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%", borderRadius: 8 }}
                  placeholder="e.g. 10"
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="discount_type"
                label="Discount Type"
                rules={[{ required: true, message: "Select discount type!" }]}
                initialValue={"percentage"}
                extra={
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    Percentage = % off price | Fixed = flat ₹ amount off per unit
                  </span>
                }
              >
                <Radio.Group defaultValue="percentage" style={{ width: "100%" }}>
                  <Radio.Button value="percentage">Percentage</Radio.Button>
                  <Radio.Button value="fixed">Fixed Amount</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="discount_value"
                label={`${toTitleCase(selectedDiscountType)}`}
                rules={[{ required: true, message: "Enter discount value!" }]}
                extra={
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    {selectedDiscountType === "fixed"
                      ? "e.g. 50 = ₹50 off per unit"
                      : "e.g. 5 = 5% off"}
                  </span>
                }
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%", borderRadius: 8 }}
                  placeholder={
                    selectedDiscountType === "fixed"
                      ? "Enter Fixed Discount Amount"
                      : "Enter Discount Percentage"
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
              style={{
                background: "linear-gradient(90deg,#6366f1,#818cf8)",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Add Discount
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {discounts.length ? (
        <Card
          title={
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
              🏷️ Active Discounts
            </span>
          }
          style={{ borderRadius: 12 }}
          styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
        >
          <List
            loading={!product}
            itemLayout="horizontal"
            dataSource={discounts}
            renderItem={(d) => (
              <List.Item
                style={{
                  padding: "12px 8px",
                  borderRadius: 8,
                  marginBottom: 4,
                }}
                actions={[
                  <Button
                    key="1"
                    danger
                    size="small"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(d.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Tag
                        color="green"
                        style={{ borderRadius: 6, fontWeight: 600, fontSize: 12 }}
                      >
                        {d.min_quantity}+ {product.unit}
                      </Tag>
                      <Tag
                        color="blue"
                        style={{ borderRadius: 6, fontWeight: 600, fontSize: 12 }}
                      >
                        {d.discount_type === "percentage"
                          ? `${d.discount_value}% OFF`
                          : `₹${d.discount_value} OFF`}
                      </Tag>
                    </div>
                  }
                  description={
                    <span style={{ fontSize: 11, color: "#64748b" }}>
                      Get {d.discount_value}{" "}
                      {d.discount_type === "percentage" ? "%" : "₹"} discount on
                      orders of {d.min_quantity}+ {product?.unit}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      ) : (
        <></>
      )}
    </Space>
  );
};

export default ProductDiscount;
