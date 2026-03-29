"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Card,
    Table,
    Avatar,
    Typography,
    Space,
    Tag,
    Input,
    message,
    Descriptions,
    Button,
    Drawer,
    Select,
    Form,
    Switch,
    Popconfirm,
    Divider,
    Empty,
    Badge,
} from "antd";
import api from "@/api";
import { IStoreCategory } from "@/interfaces/Category";
import { IProduct } from "@/interfaces/Product";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ICatalog } from "@/interfaces/Catalog";
import BackButton from "@/components/common/back-button";
import { ColumnsType } from "antd/es/table";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeFilled,
} from "@ant-design/icons";
import { useUserContext } from "@/contexts/UserContext";
import { slugify } from "@/utils/helper";

const { Title } = Typography;

export default function CategoryDetailPage() {
    const { storeDetail } = useUserContext();
    const storeLink = `https://${storeDetail?.store?.username}.catafy.com`;
    const params = useParams();
    const categoryId = params?.id;
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState({} as IStoreCategory);
    const [products, setProducts] = useState<IProduct[]>([]);

    // Add products drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<IProduct[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
    const [catalogs, setCatalogs] = useState<ICatalog[]>([]);
    const [selectedCatalog, setSelectedCatalog] = useState<number | null>(null);
    const [adding, setAdding] = useState(false);

    // Edit category drawer
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [editForm] = Form.useForm();
    const [saving, setSaving] = useState(false);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/categories/${categoryId}/show`);
            setCategory(data);
            setProducts(data.products ?? []);
        } catch {
            message.error("Failed to load category");
        } finally {
            setLoading(false);
        }
    };

    const fetchCatalogs = async () => {
        try {
            const { data } = await api.get(API_ENDPOINTS.ALL_CATALOGS);
            setCatalogs(data);
        } catch {
            message.error("Failed to load catalogs");
        }
    };

    useEffect(() => {
        if (categoryId) fetchDetails();
        fetchCatalogs();
    }, [categoryId]);

    const openEditDrawer = () => {
        editForm.setFieldsValue({
            name: category.name,
            slug: category.slug,
            enabled: category.enabled,
        });
        setEditDrawerOpen(true);
    };

    const saveCategory = async () => {
        try {
            const values = await editForm.validateFields();
            setSaving(true);
            await api.put(`${API_ENDPOINTS.CATEGORIES}/${categoryId}`, values);
            message.success("Category updated");
            setEditDrawerOpen(false);
            fetchDetails();
        } catch {
            message.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    /* ── Map products ──────────────────────────────────────── */

    const searchProducts = async (q: string) => {
        if (!q.trim()) return;
        setSearchLoading(true);
        try {
            const { data } = await api.get(API_ENDPOINTS.PRODUCTS, {
                params: { q, catalog_id: selectedCatalog },
            });
            setSearchResults(data.data ?? []);
        } catch {
            message.error("Search failed");
        } finally {
            setSearchLoading(false);
        }
    };

    const closeAddDrawer = () => {
        setDrawerOpen(false);
        setSelectedProducts([]);
        setSearchResults([]);
    };

    const addProducts = async () => {
        if (!selectedProducts.length) {
            message.warning("Select at least one product");
            return;
        }
        setAdding(true);
        try {
            await api.post(`/categories/${categoryId}/products`, {
                product_ids: selectedProducts.map((p) => p.id),
            });
            message.success("Products added");
            closeAddDrawer();
            fetchDetails();
        } catch {
            message.error("Failed to add products");
        } finally {
            setAdding(false);
        }
    };

    const removeProduct = async (productId: number) => {
        try {
            await api.delete(`/categories/${categoryId}/products/${productId}`);
            message.success("Product removed");
            fetchDetails();
        } catch {
            message.error("Failed to remove product");
        }
    };

    /* ── Table columns ─────────────────────────────────────── */

    const columns: ColumnsType<IProduct> = [
        {
            title: "Image",
            dataIndex: "image",
            width: 100,
            render: (image: string) => image ? <Avatar src={image} shape="square" /> : <Avatar shape="square">?</Avatar>,
        },
        {
            title: "Product Name",
            dataIndex: "name",
        },
        {
            title: "Price",
            dataIndex: "price",
        },
        {
            title: "MRP",
            dataIndex: "mrp_price",
        },
        {
            title: "Actions",
            width: 100,
            render: (_, record) => (
                <Space>
                    <a href={`${storeLink}/products/${slugify(record.name)}-${record.id}`} target="_blank">
                        <Button size="small" icon={<EyeFilled />} />
                    </a>
                    <Popconfirm
                        title="Remove this product from the category?"
                        onConfirm={() => removeProduct(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const deleteCategory = async () => {
        if (!category) return;
        try {
            await api.delete(`${API_ENDPOINTS.CATEGORIES}/${category.id}`);
            message.success("Category deleted");
            return router.replace("/categories")
        } catch (e: unknown) {
            const err = e as any;
            message.error(err?.response?.data?.message || "Delete failed");
        }
    };

    return (
        <>
            <BackButton />

            <Card loading={loading} style={{ marginBottom: 20 }}>
                <Descriptions
                    bordered
                    column={1}
                    title={<Title level={4} style={{ margin: 0 }}>{category?.name}</Title>}
                    extra={
                        <Space>
                            <Button icon={<EditOutlined />} onClick={openEditDrawer}>
                                Edit Category
                            </Button>
                            <Popconfirm
                                title="Delete category"
                                description="Are you sure you want to delete this category?"
                                onConfirm={deleteCategory}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger icon={<DeleteOutlined />}>
                                    Delete
                                </Button>
                            </Popconfirm>
                        </Space>
                    }
                >
                    <Descriptions.Item label="Slug">{category?.slug || "-"}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        {category?.enabled ? <Tag color="green">Enabled</Tag> : <Tag color="red">Disabled</Tag>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Parent">
                        {category?.parent_id || "Root Category"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Sub-categories">
                        {category?.children?.length ? (
                            category.children.map((c: any) => (
                                <Tag key={c.id}>{c.name}</Tag>
                            ))
                        ) : (
                            "None"
                        )}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* PRODUCT LIST */}
            <Card
                title={`Mapped Products (${products.length})`}
                loading={loading}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
                        Add Product
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={products}
                    pagination={false}
                    locale={{ emptyText: <Empty description="No products in this category" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                />
            </Card>

            {/* EDIT CATEGORY DRAWER */}
            <Drawer
                title="Edit Category"
                width={480}
                open={editDrawerOpen}
                onClose={() => setEditDrawerOpen(false)}
                footer={
                    <Space style={{ float: "right" }}>
                        <Button onClick={() => setEditDrawerOpen(false)}>Cancel</Button>
                        <Button type="primary" loading={saving} onClick={saveCategory}>Save</Button>
                    </Space>
                }
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="slug" label="Slug">
                        <Input />
                    </Form.Item>
                    <Form.Item name="enabled" label="Enabled" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Drawer>

            {/* ADD PRODUCTS DRAWER */}
            <Drawer
                title={
                    <Space>
                        Add Products to Category
                        {selectedProducts.length > 0 && (
                            <Badge count={selectedProducts.length} color="#1677ff" />
                        )}
                    </Space>
                }
                width="55%"
                open={drawerOpen}
                onClose={closeAddDrawer}
                footer={
                    <Space style={{ float: "right" }}>
                        <Button onClick={closeAddDrawer}>Cancel</Button>
                        <Button
                            type="primary"
                            loading={adding}
                            disabled={!selectedProducts.length}
                            onClick={addProducts}
                        >
                            Save to Category ({selectedProducts.length})
                        </Button>
                    </Space>
                }
            >
                <Space direction="vertical" style={{ width: "100%" }} size="middle">

                    {/* FILTERS */}
                    <Space.Compact style={{ width: "100%" }}>
                        <Select
                            placeholder="Filter by catalog"
                            style={{ width: "40%" }}
                            onChange={(val) => setSelectedCatalog(val)}
                            allowClear
                            options={catalogs.map((c: any) => ({ label: c.name, value: c.id }))}
                        />
                        <Input.Search
                            placeholder="Search products by name"
                            onSearch={searchProducts}
                            enterButton="Search"
                            loading={searchLoading}
                            style={{ width: "60%" }}
                        />
                    </Space.Compact>

                    {/* SEARCH RESULTS WITH CHECKBOXES */}
                    <Table
                        rowKey="id"
                        size="small"
                        loading={searchLoading}
                        dataSource={searchResults}
                        pagination={{ pageSize: 8, size: "small" }}
                        locale={{ emptyText: <Empty description="Search products above" /> }}
                        rowSelection={{
                            selectedRowKeys: selectedProducts.map((p) => p.id),
                            onChange: (_, rows) => setSelectedProducts(rows as IProduct[]),
                        }}
                        columns={[
                            {
                                title: "",
                                dataIndex: "image",
                                width: 50,
                                render: (img: string) => (
                                    <Avatar src={img} shape="square" size={36}>?</Avatar>
                                ),
                            },
                            {
                                title: "Product",
                                dataIndex: "name",
                            },
                            {
                                title: "Price",
                                dataIndex: "price",
                                width: 80,
                            },
                        ]}
                    />

                    {/* SELECTED SUMMARY */}
                    {selectedProducts.length > 0 && (
                        <>
                            <Divider orientation="left" style={{ margin: "8px 0" }}>
                                Selected ({selectedProducts.length})
                            </Divider>
                            <Space wrap>
                                {selectedProducts.map((p) => (
                                    <Tag
                                        key={p.id}
                                        closable
                                        onClose={() =>
                                            setSelectedProducts((prev) =>
                                                prev.filter((x) => x.id !== p.id)
                                            )
                                        }
                                    >
                                        {p.name}
                                    </Tag>
                                ))}
                            </Space>
                        </>
                    )}
                </Space>
            </Drawer>
        </>
    );
}
