"use client";

import React, { useState, useEffect } from 'react';
import {
  Button, Col, Divider, Drawer, Empty, Form, Input,
  Row, Select, Space, Table, TableProps, Tag, message,
} from 'antd';
import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import { SearchProps } from 'antd/es/input/Search';
import CustomerActions from './customerActions';
import Link from 'next/link';
import { ICustomer } from '@/interfaces/Customer';
import { formatDateTimeAMPM } from '@/utils/helper';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ExpandableSearch from '@/components/common/ExpandableSearch';

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  pending:  { color: 'orange', label: 'Pending'  },
  allowed:  { color: 'green',  label: 'Allowed'  },
  rejected: { color: 'red',    label: 'Rejected' },
};

const CustomerList = () => {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [keyword, setKeyword]   = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form]                  = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchUsers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const { data } = await api.get(API_ENDPOINTS.CUSTOMERS, {
        params: { page, page_size: limit, keyword },
      });
      setUsers(data.data);
      setPagination({ current: page, pageSize: limit, total: data.total });
    } catch {
      message.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [keyword]);

  const handleAddCustomer = async () => {
    try {
      const values = await form.validateFields();
      await api.post(API_ENDPOINTS.CUSTOMERS, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        access_type: values.access_type,
        address: {
          address:  values.address,
          city:     values.city,
          state:    values.state,
          pincode:  values.pincode,
          landmark: values.landmark,
        },
      });
      message.success("Customer added");
      setIsDrawerOpen(false);
      form.resetFields();
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to add customer");
    }
  };

  const columns: TableProps<ICustomer>['columns'] = [
    {
      title: '#',
      key: 'index',
      width: 44,
      render: (_: any, __: any, i: number) => (
        <span style={{ fontSize: 11, color: '#94a3b8' }}>
          {(pagination.current - 1) * pagination.pageSize + i + 1}
        </span>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'name',
      render: (name: string, record: ICustomer) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: '#eef2ff', color: '#6366f1',
            fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', lineHeight: '16px' }}>{name}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (v: string) => (
        <span style={{ fontSize: 11, color: '#475569' }}>{v || '—'}</span>
      ),
    },
    {
      title: 'Location',
      render: (_: any, r: ICustomer) => (
        <span style={{ fontSize: 11, color: '#64748b' }}>
          {[r.city, r.state].filter(Boolean).join(', ') || '—'}
        </span>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'created_at',
      render: (v: string) => (
        <span style={{ fontSize: 11, color: '#94a3b8' }}>{formatDateTimeAMPM(v)}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s: string) => {
        const st = STATUS_STYLE[s];
        return st ? (
          <Tag
            color={st.color}
            style={{ fontSize: 10, borderRadius: 4, margin: 0, padding: '0 6px', lineHeight: '18px' }}
          >
            {st.label}
          </Tag>
        ) : null;
      },
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: ICustomer) => (
        <Space size={4}>
          <CustomerActions
            customerID={record.id}
            status={record.status}
            isShowBlock={record.status !== "allowed"}
            isShowAllow={true}
          />
          <Link href={`/customers/${record.id}`}>
            <Button
              size="small"
              type="primary"
              style={{ fontSize: 11, background: 'linear-gradient(90deg,#6366f1,#818cf8)', border: 'none' }}
            >
              View
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14, gap: 8, flexWrap: 'wrap',
      }}>
        <ExpandableSearch
          placeholder="Search name, phone or email"
          onSearch={(v) => setKeyword(v)}
        />
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setIsDrawerOpen(true)}
          style={{ background: 'linear-gradient(90deg,#6366f1,#818cf8)', border: 'none' }}
        >
          Add Customer
        </Button>
      </div>

      <Table
        size="small"
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        locale={{ emptyText: <Empty description="No customers found" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          size: 'small',
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '25'],
          onChange: (page, size) => fetchUsers(page, size),
        }}
      />

      {/* Add Customer Drawer */}
      <Drawer
        title={<span style={{ fontWeight: 700 }}>Add Customer</span>}
        open={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); form.resetFields(); }}
        width="50%"
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setIsDrawerOpen(false); form.resetFields(); }}>Cancel</Button>
              <Button
                type="primary"
                onClick={handleAddCustomer}
                style={{ background: 'linear-gradient(90deg,#6366f1,#818cf8)', border: 'none' }}
              >
                Save Customer
              </Button>
            </Space>
          </div>
        }
      >
        <Form layout="vertical" form={form}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input placeholder="+91 XXXXX XXXXX" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input placeholder="Customer name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
            <Input placeholder="customer@email.com" />
          </Form.Item>

          <Form.Item name="access_type" label="Access Type" initialValue="allowed" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Public (Auto Allow)',          value: 'allowed'  },
                { label: 'Private (Approval Required)',  value: 'pending'  },
              ]}
            />
          </Form.Item>

          <Divider orientation="left" style={{ fontSize: 12, color: '#94a3b8' }}>Address</Divider>

          <Form.Item name="address" label="Street Address">
            <Input.TextArea rows={2} placeholder="Building, street, area" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="city" label="City">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="state" label="State">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="pincode" label="Pincode">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="landmark" label="Landmark">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default CustomerList;
