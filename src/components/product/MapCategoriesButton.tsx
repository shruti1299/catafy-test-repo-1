"use client";

import { useEffect, useState } from "react";
import { Button, Modal, Form, TreeSelect, message } from "antd";
import { TagsOutlined } from "@ant-design/icons";

import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { IProduct } from "@/interfaces/Product";
import type { IStoreCategory } from "@/interfaces/Category";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const buildTreeData = (categories?: IStoreCategory[]): any[] => {
  if (!Array.isArray(categories)) return [];

  return categories.map((cat) => ({
    title: cat.name,
    value: cat.id,
    key: cat.id,
    children: buildTreeData(cat.children as any),
  }));
};

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface MapCategoriesButtonProps {
  product?: IProduct;
  buttonText?: string;
  buttonType?: "primary" | "default" | "link" | "text" | "dashed";
  onSuccess?: () => void;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function MapCategoriesButton({
  product,
  buttonText = "Map Categories",
  buttonType = "default",
  onSuccess,
}: MapCategoriesButtonProps) {
  if (!product) return null;

  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState<IStoreCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<{ category_ids: number[] }>();

  /* ------------------------------------------------------------------------ */
  /* Fetch categories only when modal opens                                    */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!visible) return;

    const fetchCategories = async () => {
      try {
        const { data } = await api.get(API_ENDPOINTS.CATEGORIES, {
          params: { tree: true },
        });

        const list = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.data?.data)
          ? data.data.data
          : [];

        setCategories(list);
        form.setFieldsValue({
          category_ids: product.categories?.map((cat) => cat.id) || [],
        });
      } catch {
        message.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [visible, product, form]);

  /* ------------------------------------------------------------------------ */
  /* Save mapping                                                             */
  /* ------------------------------------------------------------------------ */

  const saveCategories = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await api.post(
        `${API_ENDPOINTS.PRODUCTS}/${product.id}/categories`,
        values
      );

      message.success("Categories mapped successfully");
      setVisible(false);
      onSuccess?.();
    } catch {
      message.error("Failed to map categories");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <Button
        type={buttonType}
        icon={<TagsOutlined />}
        onClick={() => setVisible(true)}
        style={{ borderRadius: 8 }}
      >
        {buttonText}
      </Button>

      <Modal
        title={
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
            Map Categories — {product.name}
          </span>
        }
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={saveCategories}
        confirmLoading={loading}
        okButtonProps={{
          style: {
            background: "linear-gradient(90deg,#6366f1,#818cf8)",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
          },
        }}
        okText="Save Categories"
      >
        {/* Hint */}
        <div
          style={{
            padding: "10px 14px",
            background: "#eef2ff",
            border: "1px solid #e0e7ff",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 12,
            color: "#3730a3",
          }}
        >
          Assign this product to categories so buyers can find it while browsing your store
        </div>

        <Form form={form} layout="vertical" size="middle">
          <Form.Item
            name="category_ids"
            label="Categories"
            rules={[{ required: true }]}
            extra={
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                Select one or more categories — buyers will find this product while browsing
              </span>
            }
          >
            <TreeSelect
              treeData={buildTreeData(categories)}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              placeholder="Select categories"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
