import React, { useState } from 'react';
import type { FormProps } from 'antd';
import {
    Button,
    Col,
    Collapse,
    Form,
    Input,
    Row,
    Select,
    Switch,
    Typography,
    message,
} from 'antd';
import {
    GlobalOutlined,
    LockOutlined,
    SaveOutlined,
    SettingOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';
import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ICatalog } from '@/interfaces/Catalog';

interface IProps {
    afterSuccess: any;
    catalog: ICatalog;
}

const VISIBILITY_OPTIONS = [
    {
        value: 1,
        icon: <GlobalOutlined />,
        label: 'Public',
        desc: 'Anyone with the link can view this catalog',
        color: '#10b981',
        bg: '#f0fdf4',
        border: '#10b981',
    },
    {
        value: 2,
        icon: <LockOutlined />,
        label: 'Locked',
        desc: 'Customers must request access before viewing',
        color: '#f59e0b',
        bg: '#fffbeb',
        border: '#f59e0b',
    },
];

const CreateCatalog = ({ afterSuccess, catalog }: IProps) => {
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [visibility, setVisibility] = useState<number>(catalog?.visibilty ?? 1);
    const descriptionValue = Form.useWatch('description', form);
    const isEdit = !!catalog?.id;

    const onFinish: FormProps<ICatalog>['onFinish'] = async (values) => {
        setUploading(true);
        try {
            if (isEdit) {
                await api.put(`${API_ENDPOINTS.CATALOGS}/${catalog.id}`, values);
            } else {
                await api.post(API_ENDPOINTS.CATALOGS, values);
            }
            form.resetFields();
            message.success(`Catalog ${isEdit ? 'updated' : 'created'} successfully`);
            if (afterSuccess) afterSuccess();
        } catch {
            message.error(`Failed to ${isEdit ? 'update' : 'create'} catalog`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Form
            form={form}
            name="catalog-form"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="middle"
            initialValues={catalog ?? {}}
        >
            {/* ── Catalog Name ─────────────────────────────── */}
            <Form.Item<ICatalog>
                label="Catalog Name"
                name="name"
                rules={[{ required: true, message: 'Please enter a catalog name' }]}
                extra={
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        <UnorderedListOutlined style={{ marginRight: 4 }} />
                        This name is shown to customers and appears in the catalog URL
                    </span>
                }
            >
                <Input
                    placeholder="e.g. Summer Collection 2025"
                    style={{ borderRadius: 8 }}
                />
            </Form.Item>

            {/* ── Visibility ───────────────────────────────── */}
            <Form.Item<ICatalog>
                label="Visibility"
                name="visibilty"
            >
                <div style={{ display: 'flex', gap: 10 }}>
                    {VISIBILITY_OPTIONS.map((opt) => {
                        const selected = visibility === opt.value;
                        return (
                            <div
                                key={opt.value}
                                onClick={() => {
                                    setVisibility(opt.value);
                                    form.setFieldValue('visibilty', opt.value);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '12px 14px',
                                    borderRadius: 10,
                                    border: `2px solid ${selected ? opt.border : '#e5e7eb'}`,
                                    background: selected ? opt.bg : '#fff',
                                    cursor: 'pointer',
                                    transition: 'all 0.18s',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ color: selected ? opt.color : '#94a3b8', fontSize: 15 }}>
                                        {opt.icon}
                                    </span>
                                    <span style={{ fontWeight: 600, fontSize: 13, color: selected ? opt.color : '#374151' }}>
                                        {opt.label}
                                    </span>
                                </div>
                                <Typography.Text style={{ fontSize: 11, color: '#64748b' }}>
                                    {opt.desc}
                                </Typography.Text>
                            </div>
                        );
                    })}
                </div>
            </Form.Item>

            {/* ── Status ───────────────────────────────────── */}
            <Form.Item<ICatalog>
                label="Status"
                name="status"
                valuePropName="checked"
                extra={
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        Disabled catalogs are hidden from customers — useful for drafts
                    </span>
                }
                getValueProps={(val) => ({ checked: val === 1 || val === true })}
                getValueFromEvent={(checked: boolean) => (checked ? 1 : 0)}
            >
                <Switch
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                    style={{ minWidth: 90 }}
                />
            </Form.Item>

            {/* ── Description ──────────────────────────────── */}
            <Form.Item<ICatalog>
                label="Description"
                name="description"
                extra={
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        Shown on the catalog page — briefly describe what buyers will find here (max 200 chars)
                    </span>
                }
                rules={[{ max: 200, message: 'Maximum 200 characters allowed' }]}
            >
                <Input.TextArea
                    rows={3}
                    placeholder="e.g. Our latest summer collection featuring lightweight fabrics and vibrant colors."
                    maxLength={220}
                    showCount
                    style={{ borderRadius: 8 }}
                />
            </Form.Item>

            {descriptionValue && descriptionValue.trim().length > 0 && (
                <Form.Item<ICatalog>
                    label="Show short excerpt on catalog card"
                    name="is_excerpt"
                    valuePropName="checked"
                    extra={
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                            Displays a one-line summary on the catalog card in your store listing
                        </span>
                    }
                >
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                </Form.Item>
            )}

            {/* ── Advanced / Sort Settings ──────────────────── */}
            <Collapse
                ghost
                style={{
                    marginBottom: 16,
                    border: '1px solid #ede9fe',
                    borderRadius: 10,
                    background: '#f5f3ff',
                    overflow: 'hidden',
                }}
                items={[{
                    key: 'sort',
                    label: (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#7c3aed', fontSize: 13 }}>
                            <SettingOutlined />
                            Sort Settings
                            <Typography.Text type="secondary" style={{ fontSize: 11, fontWeight: 400 }}>
                                — control product order in this catalog
                            </Typography.Text>
                        </span>
                    ),
                    children: (
                        <Row gutter={12} style={{ paddingTop: 8 }}>
                            <Col span={12}>
                                <Form.Item
                                    label="Sort By"
                                    name="sort_by"
                                    extra={
                                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                                            Default order products are displayed in
                                        </span>
                                    }
                                >
                                    <Select placeholder="Select field" style={{ borderRadius: 8 }}>
                                        <Select.Option value="position">Manual Order</Select.Option>
                                        <Select.Option value="name">Name</Select.Option>
                                        <Select.Option value="price">Price</Select.Option>
                                        <Select.Option value="created_at">Created Date</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Sort Direction"
                                    name="sort_direction"
                                    extra={
                                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                                            Ascending = A→Z / low→high
                                        </span>
                                    }
                                >
                                    <Select placeholder="Select direction" style={{ borderRadius: 8 }}>
                                        <Select.Option value="asc">↑ Ascending</Select.Option>
                                        <Select.Option value="desc">↓ Descending</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    ),
                }]}
            />

            {/* ── Save ─────────────────────────────────────── */}
            <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
                <div
                    style={{
                        padding: '14px 16px',
                        background: 'linear-gradient(90deg,#f8faff,#eef2ff)',
                        borderRadius: 10,
                        border: '1px solid #e0e7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                    }}
                >
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                            {isEdit ? 'Save Changes' : 'Create Catalog'}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            {isEdit
                                ? 'Updates will be visible to customers immediately'
                                : 'Your new catalog will be available right away'}
                        </div>
                    </div>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={uploading}
                        style={{
                            background: 'linear-gradient(90deg,#6366f1,#818cf8)',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 600,
                            minWidth: 140,
                        }}
                    >
                        {isEdit ? 'Save Changes' : 'Create Catalog'}
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default CreateCatalog;
