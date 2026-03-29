"use client";

import React, { useEffect } from 'react';
import { Drawer, Form, Input, Select, Divider, Button, Row, Col, message } from 'antd';
import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ICustomerDetail } from '@/interfaces/Customer';

interface IProps {
  open: boolean;
  customer: ICustomerDetail | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditCustomerDrawer = ({ open, customer, onClose, onSuccess }: IProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && customer) {
      form.setFieldsValue({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address?.address,
        city: customer.address?.city,
        state: customer.address?.state,
        pincode: customer.address?.pincode,
        landmark: customer.address?.landmark,
      });
    }
  }, [open, customer]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await api.put(`${API_ENDPOINTS.CUSTOMERS}/${customer?.id}`, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: {
          address: values.address,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
          landmark: values.landmark,
        },
      });
      message.success("Customer updated successfully");
      onClose();
      onSuccess();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to update customer");
    }
  };

  return (
    <Drawer
      title="Edit Customer"
      open={open}
      onClose={onClose}
      width={"50%"}
      footer={
        <Row justify="end">
          <Col>
            <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save</Button>
          </Col>
        </Row>
      }
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="phone" label="Customer Phone Number" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item name="name" label="Customer Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Customer Email" rules={[{ required: false, type: 'email' }]}>
          <Input />
        </Form.Item>

        <Divider orientation="left">Customer Address</Divider>

        <Form.Item name="address" label="Address">
          <Input.TextArea rows={2} />
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
  );
};

export default EditCustomerDrawer;
