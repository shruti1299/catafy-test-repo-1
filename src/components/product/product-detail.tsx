"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  message,
  Modal,
  Row,
  Space,
  Switch,
} from "antd";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { IProduct } from "@/interfaces/Product";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import ProductForms from "./product-forms";
import Loader from "../loader";
import ProductDeafultImage from "./product-default-image";

interface IProp {
  productId: number;
  setSelectedProductId?: any;
  isLoading?: boolean;
  type?: "default" | "only_content" | "show_image_desc";
  showImage?: boolean;
}

const { confirm } = Modal;

const ProductDetail = ({
  productId,
  type,
  setSelectedProductId,
  showImage = true,
}: IProp) => {
  const [product, setProduct] = useState({} as IProduct);
  const [loading, setLoading] = useState(false);
  const [statusChaning, setStatusChaning] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getData = async () => {
    setLoading(true);
    const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
    setProduct(data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [productId]);

  const showDeletConfirm = () => {
    confirm({
      title: "Do you want to delete this product?",
      icon: <ExclamationCircleFilled />,
      content: "It will be permanently deleted from our records.",
      onOk() {
        Deleteproduct();
      },
      onCancel() {},
    });
  };

  const Deleteproduct = async () => {
    setDeleting(true);
    try {
      await api.delete(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
      if (setSelectedProductId) setSelectedProductId(0);
      setDeleting(false);
      message.success("Product Deleted Successfully!");
    } catch (error) {
      setDeleting(false);
    }
  };

  const changeStatus = async () => {
    setStatusChaning(true);
    try {
      await api.post(`${API_ENDPOINTS.PRODUCTS}/${productId}/change-status`, {
        status: !product.status,
      });
      setStatusChaning(false);
    } catch (error) {
      setStatusChaning(false);
    }
  };

  if (type == "only_content")
    return loading ? (
      <Loader />
    ) : (
      <ProductForms product={product} type={type} />
    );

  return (
    <Card
      loading={loading}
      title={
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#0f172a",
            display: "block",
            maxWidth: 220,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={product?.name}
        >
          {product?.name}
        </span>
      }
      style={{ overflow: "hidden", borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
      className="catlog-sidebar"
      extra={
        <Space size={6}>
          {product.status != undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Switch
                onChange={changeStatus}
                loading={statusChaning}
                defaultChecked={product.status ? true : false}
                checkedChildren={"Live"}
                unCheckedChildren="Hidden"
                style={
                  product.status
                    ? { background: "#10b981" }
                    : { background: "#94a3b8" }
                }
              />
            </div>
          )}
          <Button
            danger
            type="primary"
            size="small"
            title="Delete product"
            onClick={showDeletConfirm}
            loading={deleting}
            icon={<DeleteOutlined />}
            style={{ borderRadius: 6 }}
          />
        </Space>
      }
    >
      {type == "show_image_desc" ? (
        <Row gutter={[20, 20]}>
          <Col span={8}>
            <div className="w-100">
              <ProductDeafultImage
                image={product.image}
                productId={product.id}
                onReload={getData}
              />
            </div>
          </Col>
          <Col span={16}>
            <div
              className="px-1"
              style={{ overflowY: "scroll", height: "calc(100vh - 165px)" }}
            >
              {product && (
                <ProductForms
                  product={product}
                  showImage={showImage}
                  onReload={getData}
                />
              )}
            </div>
          </Col>
        </Row>
      ) : (
        <div
          className="px-1"
          style={{ overflowY: "scroll", height: "calc(100vh - 165px)" }}
        >
          {product && (
            <ProductForms
              product={product}
              showImage={showImage}
              onReload={getData}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default ProductDetail;
