"use client";

import React, { useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Select,
  InputNumber,
  Table,
  message,
  Card,
  Checkbox,
  Input,
} from "antd";
import { PlusOutlined, SaveOutlined, ThunderboltOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { IProduct } from "@/interfaces/Product";
import UploadPhoto from "../common/upload-image";
import { useUserContext } from "@/contexts/UserContext";

interface VariationRow {
  price: number;
  b2c_price?: number;
  mrp_price: number;
  stock: number;
  image?: string;
  min_quantity: number;
  [key: string]: any; // dynamic attributes (Size, Color, etc)
}

const GenerateVariations = ({
  product,
  attributes,
  reload,
}: {
  product: IProduct;
  attributes: any;
  reload: any;
}) => {
  if (!product) return <></>;
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [variations, setVariations] = useState<VariationRow[]>([]);
  const [customAttributes, setCustomAttributes] = useState<any[]>([]);
  const { storeDetail } = useUserContext();
  const isB2CEnabled = storeDetail?.store?.is_b2c;
  const SelectImage = [...(product?.media?.length ? product.media : [])];

  /* ---------------------------------- */
  /* Generate Attribute Combinations    */
  /* ---------------------------------- */

  const generateCombinations = (attrs: Record<string, string[]>) => {
    const keys = Object.keys(attrs);
    if (!keys.length) return [];
    const recurse = (idx: number, current: any): any[] => {
      if (idx === keys.length) return [current];
      const key = keys[idx];
      return attrs[key].flatMap((val) =>
        recurse(idx + 1, { ...current, [key]: val })
      );
    };
    return recurse(0, {});
  };

  const handleGenerate = (values: any) => {
    const selected: Record<string, string[]> = {};

    for (const attrId in values.values || {}) {
      const attr = attributes?.find((a: any) => a.id == +attrId);
      const enabled = values.enabled?.[attrId];
      const chosenValues = values.values?.[attrId];
      if (attr && enabled && chosenValues?.length > 0) {
        selected[attr.name] = chosenValues;
      }
    }

    customAttributes.forEach((attr) => {
      if (attr.name && attr.values?.length) {
        selected[attr.name] = attr.values;
      }
    });
    const combos = generateCombinations(selected);
    setVariations(
      combos.map((combo) => ({
        ...combo,
        price: product.price,
        b2c_price: product.b2c_price || 0,
        mrp_price: product.mrp_price,
        stock: product.stock,
        min_quantity: product.min_quantity,
        image: undefined,
      }))
    );
  };

  /* ---------------------------------- */
  /* Save Variations                    */
  /* ---------------------------------- */

  const handleSave = async () => {
    try {
      const payload = {
        product_id: product.id,
        variations: variations.map((v) => {
          const attributesObj: Record<string, string> = {};
          Object.keys(v).forEach((k) => {
            if (
              !["price", "stock", "image", "b2c_price", "mrp_price", "min_quantity"].includes(k)
            ) {
              attributesObj[k] = v[k];
            }
          });
          return {
            price: v.price,
            stock: v.stock,
            b2c_price: v.b2c_price,
            mrp_price: v.mrp_price,
            min_quantity: v.min_quantity,
            attributes: attributesObj,
            selected_image: v.image || null,
          };
        }),
      };
      await api.post(API_ENDPOINTS.VARIATIONS, payload);
      message.success("Variations saved successfully!");
      reload();
      setOpen(false);
      setVariations([]);
      form.resetFields();
    } catch (err) {
      message.error("Failed to save variations");
    }
  };

  /* ---------------------------------- */
  /* Table Columns                      */
  /* ---------------------------------- */

  const attributeColumns: ColumnsType<VariationRow> = Object.keys(variations[0] || {})
    .filter(
      (k) =>
        !["price", "stock", "image", "b2c_price", "mrp_price", "min_quantity"].includes(k)
    )
    .map((attr) => ({
      title: attr,
      dataIndex: attr,
      render: (value: string) => (
        <span style={{ fontWeight: 500 }}>{value}</span>
      ),
    }));

  const columns: ColumnsType<VariationRow> = [
    ...attributeColumns,
    {
      title: "Price",
      dataIndex: "price",
      render: (_, record, idx) => (
        <InputNumber
          value={record.price}
          min={0}
          style={{ width: 100 }}
          onChange={(val) => {
            const updated = [...variations];
            updated[idx].price = val || 0;
            setVariations(updated);
          }}
        />
      ),
    },
    {
      title: "MRP Price",
      dataIndex: "mrp_price",
      render: (_, record, idx) => (
        <InputNumber
          value={record.mrp_price}
          min={0}
          style={{ width: 100 }}
          onChange={(val) => {
            const updated = [...variations];
            updated[idx].mrp_price = val || 0;
            setVariations(updated);
          }}
        />
      ),
    },
    {
      title: "MOQ",
      dataIndex: "min_quantity",
      render: (_, record, idx) => (
        <InputNumber
          value={record.min_quantity}
          min={1}
          style={{ width: 100 }}
          onChange={(val) => {
            const updated = [...variations];
            updated[idx].min_quantity = val || 0;
            setVariations(updated);
          }}
        />
      ),
    },
    ...(isB2CEnabled
      ? [
          {
            title: "B2C Price",
            dataIndex: "b2c_price",
            key: "b2c_price",
            render: (_: any, record: any, idx: any) => (
              <InputNumber
                value={record.b2c_price}
                min={0}
                style={{ width: 100 }}
                onChange={(val) => {
                  const updated = [...variations];
                  updated[idx].b2c_price = val || 0;
                  setVariations(updated);
                }}
              />
            ),
          },
        ]
      : []),
    {
      title: "Stock",
      dataIndex: "stock",
      render: (_, record, idx) => (
        <InputNumber
          value={record.stock}
          min={0}
          style={{ width: 100 }}
          onChange={(val) => {
            const updated = [...variations];
            updated[idx].stock = val || 0;
            setVariations(updated);
          }}
        />
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (_, record, idx) => {
        const updateImage = (val?: string) => {
          const updated = [...variations];
          updated[idx].image = val;
          setVariations(updated);
        };

        return (
          <div
            style={{ width: 240, display: "flex", flexDirection: "column", gap: 8 }}
          >
            {SelectImage.length ? (
              <>
                <Select
                  placeholder="Select from product"
                  allowClear
                  value={record.image}
                  onChange={(val) => updateImage(val)}
                  options={SelectImage?.map((m: any) => ({
                    label: (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <img
                          src={m.small}
                          style={{
                            width: 45,
                            height: 45,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    ),
                    value: m.small,
                  }))}
                />
                <div style={{ textAlign: "center", fontSize: 12 }}>OR</div>
              </>
            ) : (
              <></>
            )}

            {/* Upload new image */}
            <UploadPhoto
              value={record.image}
              setValue={(val: string) => updateImage(val)}
              size="default"
              type="product_main_image"
              productId={product.id}
            />
          </div>
        );
      },
    },
  ];

  /* ---------------------------------- */
  /* UI                                 */
  /* ---------------------------------- */

  return (
    <>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        style={{
          background: "linear-gradient(90deg,#6366f1,#818cf8)",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
        }}
      >
        + Add Variations
      </Button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        width={"65%"}
        title={
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
            🎨 Generate Product Variations
          </span>
        }
      >
        {/* Step guide */}
        <div
          style={{
            padding: "10px 14px",
            background: "#eef2ff",
            border: "1px solid #e0e7ff",
            borderRadius: 10,
            marginBottom: 20,
            fontSize: 12,
            color: "#3730a3",
            fontWeight: 500,
          }}
        >
          <span style={{ marginRight: 8 }}>Step 1: Select attributes</span>
          <span style={{ color: "#94a3b8", marginRight: 8 }}>→</span>
          <span style={{ marginRight: 8 }}>Step 2: Preview combinations</span>
          <span style={{ color: "#94a3b8", marginRight: 8 }}>→</span>
          <span>Step 3: Set prices &amp; Save</span>
        </div>

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          style={{
            marginBottom: 16,
            borderRadius: 8,
            borderColor: "#6366f1",
            color: "#6366f1",
          }}
          onClick={() =>
            setCustomAttributes([...customAttributes, { name: "", values: [] }])
          }
        >
          Add Custom Attribute
        </Button>

        <Form form={form} onFinish={handleGenerate} layout="vertical" size="small">
          {attributes?.map((attr: any) => (
            <Card
              key={attr.id}
              size="small"
              style={{ marginBottom: 12, borderRadius: 10, border: "1px solid #e2e8f0" }}
            >
              <Form.Item
                name={["enabled", attr.id]}
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox>
                  <span style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>
                    {attr.name}
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item
                shouldUpdate={(prev, cur) =>
                  prev.enabled?.[attr.id] !== cur.enabled?.[attr.id]
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue(["enabled", attr.id]) ? (
                    <Form.Item
                      name={["values", attr.id]}
                      rules={[
                        {
                          required: true,
                          message: `Select ${attr.name}`,
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder={`Select ${attr.name}`}
                        options={attr.values?.map((v: any) => ({
                          label: v.value,
                          value: v.value,
                        }))}
                      />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Card>
          ))}

          {customAttributes.map((attr, index) => (
            <Card
              key={index}
              size="small"
              style={{ marginBottom: 12, borderRadius: 10, border: "1px solid #e2e8f0" }}
            >
              <Form.Item label="Attribute Name">
                <Input
                  placeholder="Example: Style"
                  value={attr.name}
                  style={{ borderRadius: 8 }}
                  onChange={(e) => {
                    const updated = [...customAttributes];
                    updated[index].name = e.target.value;
                    setCustomAttributes(updated);
                  }}
                />
              </Form.Item>

              <Form.Item label="Values">
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Type values (Modern, Classic...)"
                  value={attr.values}
                  onChange={(vals) => {
                    const updated = [...customAttributes];
                    updated[index].values = vals;
                    setCustomAttributes(updated);
                  }}
                />
              </Form.Item>

              <Button
                danger
                size="small"
                style={{ borderRadius: 6 }}
                onClick={() => {
                  const updated = customAttributes.filter((_, i) => i !== index);
                  setCustomAttributes(updated);
                }}
              >
                Remove
              </Button>
            </Card>
          ))}

          <Button
            type="primary"
            htmlType="submit"
            icon={<ThunderboltOutlined />}
            style={{
              background: "linear-gradient(90deg,#6366f1,#818cf8)",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Generate Variations
          </Button>
        </Form>

        {variations.length > 0 && (
          <>
            <Table<VariationRow>
              rowKey={(_, i) => String(i)}
              columns={columns}
              dataSource={variations}
              pagination={false}
              style={{ marginTop: 20 }}
              scroll={{ x: true }}
            />

            <Button
              type="primary"
              block
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{
                marginTop: 20,
                background: "linear-gradient(90deg,#6366f1,#818cf8)",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                height: 44,
              }}
            >
              Save All Variations
            </Button>
          </>
        )}
      </Drawer>
    </>
  );
};

export default GenerateVariations;
