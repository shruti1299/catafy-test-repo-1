"use client";

import { Modal, Form, Input, Button } from "antd";
import { AddressForm } from "../page";

interface IProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSave: (form: AddressForm) => void;
}

export default function AddressModal({ open, loading, onClose, onSave }: IProps) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch {
      // validation failed — AntD shows inline errors
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>📍</span>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Delivery Address</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={420}
      destroyOnClose
      afterClose={() => form.resetFields()}
    >
      <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
        Enter a delivery address to complete the order.
      </p>

      <Form form={form} layout="vertical" size="middle">
        <Form.Item
          label={<span style={{ fontSize: 12, fontWeight: 600 }}>Street Address</span>}
          name="address"
          rules={[{ required: true, message: "Address is required" }]}
        >
          <Input.TextArea rows={2} placeholder="House / flat no., street, area" style={{ borderRadius: 8 }} />
        </Form.Item>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Form.Item
            label={<span style={{ fontSize: 12, fontWeight: 600 }}>City</span>}
            name="city"
            rules={[{ required: true, message: "City is required" }]}
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="e.g. Mumbai" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            label={<span style={{ fontSize: 12, fontWeight: 600 }}>State</span>}
            name="state"
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="e.g. Maharashtra" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            label={<span style={{ fontSize: 12, fontWeight: 600 }}>Pincode</span>}
            name="pincode"
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="e.g. 400001" maxLength={6} style={{ borderRadius: 8 }} />
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <Button
            block
            onClick={onClose}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            block
            loading={loading}
            onClick={handleOk}
            style={{
              background: "linear-gradient(90deg,#6366f1,#818cf8)",
              border: "none", borderRadius: 8, fontWeight: 700,
            }}
          >
            Save & Place Order
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
