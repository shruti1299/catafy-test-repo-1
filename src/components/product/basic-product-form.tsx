import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import UploadPhoto from '../common/upload-image';
import { IProduct } from '@/interfaces/Product';

type FieldType = {
  name: string;
  cover?: string;
  price: number;
  stock: number;
  desc?: string;
  min_quantity?: number;
};

interface IProps {
  product?: IProduct;
  afterSuccess: any;
  catalogId: number;
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

const CreateProductBasicForm = ({ afterSuccess, catalogId, product }: IProps) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.image || "");

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const params = {
      ...values,
      catalog_id: catalogId,
      image_url: imageUrl,
    };
    setIsLoading(true);
    try {
      const data = await api.post(API_ENDPOINTS.PRODUCTS, params);
      if (data.status) {
        form.resetFields();
        setImageUrl("");
        message.success("Product Added Successfully");
        setIsLoading(false);
        if (afterSuccess) afterSuccess();
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Form
      form={form}
      initialValues={{ ...product }}
      name="basic-form"
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      size="middle"
      style={{ marginTop: "20px" }}
    >
      {/* Upload hint */}
      <div
        style={{
          padding: "10px 14px",
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 12,
          color: "#92400e",
        }}
      >
        📸 Start by uploading a product photo — buyers are 3x more likely to order products with images
      </div>

      <UploadPhoto
        value={imageUrl}
        setValue={setImageUrl}
        productId={product ? product.id : 0}
      />

      {imageUrl && (
        <>
          <Section
            icon="📝"
            color="#6366f1"
            bg="#eef2ff"
            title="Product Details"
            desc="Fill in the basic information about this product"
          />

          <Form.Item<FieldType>
            label="Product Name"
            name="name"
            rules={[{ required: true, message: 'Please input product name!' }]}
            extra={
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                Use the exact name buyers would search for — be specific (e.g. &apos;Cotton Kurta Set - Blue&apos;)
              </span>
            }
          >
            <Input placeholder="Enter Product Name" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item<FieldType>
                label="Price (in INR)"
                name="price"
                rules={[{ required: true, message: 'Please input product price!' }]}
                extra={
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    Your wholesale selling price shown to buyers
                  </span>
                }
              >
                <InputNumber style={{ width: "100%", borderRadius: 8 }} addonBefore="₹" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item<FieldType>
                label="Stock"
                name="stock"
                initialValue={999}
                extra={
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    Available inventory — set to 999 if stock is unlimited
                  </span>
                }
              >
                <InputNumber style={{ width: "100%", borderRadius: 8 }} addonAfter="unit" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item<FieldType>
                label="Minimum Order Quantity"
                name="min_quantity"
                initialValue={1}
                rules={[{ required: true, message: 'Please input min_quantity!' }]}
                extra={
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    Minimum number of units a buyer must order (e.g. 5 means buyer must order at least 5 pieces)
                  </span>
                }
              >
                <InputNumber style={{ width: "100%", borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          {/* <Form.Item<FieldType>
            label="Description"
            name="desc"
            extra={
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                Describe fabric, material, size, colors, or any key features
              </span>
            }
          >
            <Input.TextArea style={{ borderRadius: 8 }} rows={3} />
          </Form.Item> */}

          {/* Save footer bar */}
          <div
            style={{
              padding: "14px 16px",
              background: "linear-gradient(90deg,#f8faff,#eef2ff)",
              borderRadius: 10,
              border: "1px solid #e0e7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Add Product</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Product will be added to your catalog</div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              style={{
                background: "linear-gradient(90deg,#6366f1,#818cf8)",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                minWidth: 140,
              }}
            >
              Save Product
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default CreateProductBasicForm;
