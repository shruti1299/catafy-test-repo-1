"use client";

import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import {
    Button,
    Col,
    Collapse,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    TreeSelect,
    message,
    Typography,
} from "antd";
import { SaveOutlined, InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { IProduct } from "@/interfaces/Product";
import { useUserContext } from "@/contexts/UserContext";
import { IStoreCategory } from "@/interfaces/Category";
import RichTextEditor from "../common/RichTextEditor";

type FieldType = {
    name: string;
    price: number;
    mrp_price?: number;
    stock: number;
    min_quantity?: number;
    tax?: any;
    video?: string;
    unit_value?: number;
    category_ids?: number[];
    tags?: string[];
    desc?: string;
    sku?: string;
    hsn_code?: string;
};

interface IProps {
    product: IProduct;
    afterSuccess: () => void;
    type?: "default" | "only_content";
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

const UpdateProductForm = ({ afterSuccess, type, product }: IProps) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [unit, setUnit] = useState(product.unit || "piece");
    const [categories, setCategories] = useState<IStoreCategory[]>([]);
    const { storeDetail } = useUserContext();
    const [description, setDescription] = useState(storeDetail.detail?.description || "");
    const isB2CEnabled = storeDetail?.store?.is_b2c;
    const isInvoiceActive = !!storeDetail?.detail?.is_invoice;


    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get(API_ENDPOINTS.CATEGORIES, {
                params: { tree: true },
            });

            const list = Array.isArray(data?.data) ? data.data : [];
            setCategories(list);

            form.setFieldsValue({
                category_ids: product?.categories?.map(c => c.id) || [],
            });
        } catch {
            message.error("Failed to load categories");
        }
    };

    const buildTreeData = (items?: IStoreCategory[]): any[] =>
        items?.map(cat => ({
            title: cat.name,
            value: cat.id,
            key: cat.id,
            children: buildTreeData(cat.children),
        })) || [];

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsLoading(true);
        try {
            await api.put(`${API_ENDPOINTS.PRODUCTS}/${product.id}`, {
                ...values,
                unit,
                desc:description,
                unit_value: values.unit_value || 1,
            });

            message.success("Product updated successfully");
            afterSuccess?.();
        } finally {
            setIsLoading(false);
        }
    };

    const SelectUnitValue = () => (
        <Select value={unit} onChange={setUnit}>
            <Select.Option value="piece">piece</Select.Option>
            <Select.Option value="carton">carton</Select.Option>
            <Select.Option value="kg">kg</Select.Option>
            <Select.Option value="gram">gram</Select.Option>
        </Select>
    );

    return (
        <Form
            form={form}
            layout="vertical"
            size="middle"
            initialValues={{
                ...product,
                tags: product?.tags?.map(t => t.name) || []
            }}
            onFinish={onFinish}
            style={{ marginTop: "20px" }}
        >
            {/* PRODUCT NAME */}
            <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true }]}
                extra={
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                        Use clear, specific names buyers would search for
                    </span>
                }
                tooltip={{ title: "A good product name improves discoverability in search", icon: <InfoCircleOutlined style={{ color: "#6366f1" }} /> }}
            >
                <Input style={{ borderRadius: 8 }} />
            </Form.Item>

            {/* PRICING SECTION */}
            <Section
                icon="💰"
                color="#10b981"
                bg="#f0fdf4"
                title="Pricing"
                desc="Set your selling price and MRP for this product"
            />

            <Row gutter={16}>
                {/* PRICE */}
                <Col span={12}>
                    <Form.Item
                        label={`${isB2CEnabled ? "B2B " : ""}Price (INR)`}
                        name="price"
                        rules={[{ required: true }]}
                        extra={
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                {isB2CEnabled
                                    ? "Your B2B wholesale price for bulk buyers"
                                    : "Your selling price visible to buyers"}
                            </span>
                        }
                    >
                        <InputNumber addonBefore="₹" style={{ width: "100%", borderRadius: 8 }} />
                    </Form.Item>
                </Col>

                {isB2CEnabled ? (
                    <Col span={12}>
                        <Form.Item
                            label="B2C Price (INR)"
                            name="b2c_price"
                            rules={[{ required: true }]}
                            extra={
                                <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                    Retail price shown on your B2C storefront — typically higher than wholesale
                                </span>
                            }
                        >
                            <InputNumber addonBefore="₹" style={{ width: "100%", borderRadius: 8 }} />
                        </Form.Item>
                    </Col>
                ) : (
                    <></>
                )}

                {/* MRP */}
                <Col span={12}>
                    <Form.Item
                        label="MRP Price (INR)"
                        name="mrp_price"
                        extra={
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                Maximum Retail Price — must be ≥ selling price. Shows crossed-out price to buyers
                            </span>
                        }
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || value >= getFieldValue("price")) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("MRP must be greater than or equal to Price")
                                    );
                                },
                            }),
                        ]}
                    >
                        <InputNumber addonBefore="₹" style={{ width: "100%", borderRadius: 8 }} />
                    </Form.Item>
                </Col>
            </Row>

            {/* INVENTORY SECTION */}
            <Section
                icon="📦"
                color="#f97316"
                bg="#fff7ed"
                title="Inventory & Quantity"
                desc="Manage stock levels, MOQ and product SKU"
            />

            <Row gutter={16}>
                {/* STOCK */}
                <Col span={12}>
                    <Form.Item
                        label="Stock"
                        name="stock"
                        extra={
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                Available units — set 999 for unlimited stock
                            </span>
                        }
                    >
                        <InputNumber
                            style={{ width: "100%", borderRadius: 8 }}
                            addonAfter={<SelectUnitValue />}
                        />
                    </Form.Item>
                </Col>

                {/* MIN QTY */}
                <Col span={12}>
                    <Form.Item
                        label="Minimum Order Quantity"
                        name="min_quantity"
                        rules={[{ required: true }]}
                        extra={
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                Minimum units a buyer must order (MOQ). e.g. 5 = buyer must order at least 5 pieces
                            </span>
                        }
                    >
                        <InputNumber style={{ width: "100%", borderRadius: 8 }} />
                    </Form.Item>
                </Col>

                {/* SKU */}
                <Col span={12}>
                    <Form.Item
                        label="SKU"
                        name="sku"
                        extra={
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                Your internal product code for tracking (optional)
                            </span>
                        }
                    >
                        <Input placeholder="e.g. PROD-001" style={{ borderRadius: 8 }} />
                    </Form.Item>
                </Col>
            </Row>

            {/* ADVANCED SETTINGS — collapsed by default */}
            <Collapse
                ghost
                style={{
                    marginBottom: 16,
                    border: "1px solid #ede9fe",
                    borderRadius: 10,
                    background: "#f5f3ff",
                    overflow: "hidden",
                }}
                items={[{
                    key: "advanced",
                    label: (
                        <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: "#7c3aed", fontSize: 13 }}>
                            <SettingOutlined />
                            Advanced Settings
                            <Typography.Text type="secondary" style={{ fontSize: 11, fontWeight: 400 }}>
                                — video, tags, categories, tax &amp; more
                            </Typography.Text>
                        </span>
                    ),
                    children: (
                        <div style={{ paddingTop: 8 }}>
                            <Form.Item
                                label="Youtube Video URL"
                                name="video"
                                extra={
                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                        YouTube link for product demo video — helps buyers understand the product better
                                    </span>
                                }
                            >
                                <Input placeholder="https://youtube.com/..." style={{ borderRadius: 8 }} />
                            </Form.Item>

                            <Form.Item
                                label="Tags"
                                name="tags"
                                extra={
                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                        Keywords buyers might search (e.g. cotton, blue, casual) — improves discoverability
                                    </span>
                                }
                            >
                                <Select mode="tags" placeholder="Add tags" style={{ borderRadius: 8 }} />
                            </Form.Item>

                            <Form.Item
                                label="Categories"
                                name="category_ids"
                                extra={
                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                        Assign to categories so buyers can find this product while browsing
                                    </span>
                                }
                            >
                                <TreeSelect
                                    treeData={buildTreeData(categories)}
                                    treeCheckable
                                    showSearch
                                    allowClear
                                    showCheckedStrategy={TreeSelect.SHOW_PARENT}
                                    placeholder="Select categories"
                                    treeNodeFilterProp="name"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Tax"
                                name="tax"
                                extra={
                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                        GST rate applicable on this product — printed on invoices
                                    </span>
                                }
                            >
                                <Select>
                                    <Select.Option value="">Select Tax</Select.Option>
                                    <Select.Option value="1">Including All Taxes</Select.Option>
                                    <Select.Option value="5">GST 5%</Select.Option>
                                    <Select.Option value="12">GST 12%</Select.Option>
                                    <Select.Option value="18">GST 18%</Select.Option>
                                    <Select.Option value="28">GST 28%</Select.Option>
                                </Select>
                            </Form.Item>

                            {isInvoiceActive && (
                                <Form.Item
                                    label="HSN / SAC Code"
                                    name="hsn_code"
                                    extra={
                                        <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                            HSN/SAC code required for GST invoices (e.g. 711319 for gold jewellery)
                                        </span>
                                    }
                                >
                                    <Input placeholder="e.g. 711319" maxLength={8} style={{ borderRadius: 8 }} />
                                </Form.Item>
                            )}

                            <Form.Item
                                label="Include in MOA Calculation"
                                name="is_moa"
                                tooltip={{ title: "MOA (Minimum Order Amount) calculation will include this product price when enabled.", icon: <InfoCircleOutlined style={{ color: "#6366f1" }} /> }}
                                extra={
                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                        Count this product&apos;s price towards the Minimum Order Amount — disable for free samples
                                    </span>
                                }
                            >
                                <Select>
                                    <Select.Option value={1}>Yes - Count in MOA</Select.Option>
                                    <Select.Option value={0}>No - Ignore in MOA</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="desc"
                                extra={
                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                        Detailed product description — mention material, size, color, usage etc.
                                    </span>
                                }
                            >
                                <RichTextEditor value={description} onChange={setDescription} />
                            </Form.Item>
                        </div>
                    ),
                }]}
            />

            {type === "default" && <div style={{ height: 90 }} />}

            <Form.Item style={{ marginTop: 10 }} className={type === "default" ? "fixed-bottom" : ""}>
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
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Save Changes</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Updates will be reflected in your catalog immediately</div>
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
            </Form.Item>
        </Form>
    );
};

export default UpdateProductForm;
