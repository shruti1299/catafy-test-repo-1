"use client";

import React from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Collapse,
  Divider,
  Space,
  Tag,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import SupportWPButton from "@/components/common/SupportWPButton";
import BackButton from "@/components/common/back-button";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const HelpSupportPage = () => {
  return (
    <>
    <BackButton />
    <Card className="mb-100" title="Help & Support">
      {/* Page Header */}
      <Space direction="vertical" size="small" style={{ marginBottom: 24 }}>
        <Text>
          Need help with Catafy? Contact our team or browse FAQs below.
        </Text>
      </Space>

      {/* Contact Section */}
      <Row gutter={[16, 16]}>
        {/* Sales */}
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical">
              <Tag color="blue">Sales</Tag>
              <Space>
                <MailOutlined />
                <Text>sales@catafy.com</Text>
              </Space>
              <Space>
                <PhoneOutlined />
                <Text>+91 9211776130</Text>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* Support */}
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical">
              <Tag color="green">Support</Tag>
              <Space>
                <CustomerServiceOutlined />
                <Text>+91 9211776130</Text>
              </Space>
              <Paragraph type="secondary">
                Available Mon–Sat | 10:00 AM – 7:00 PM
              </Paragraph>
            </Space>
          </Card>
        </Col>

        {/* Office Address */}
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical">
              <Tag color="purple">Instant Support</Tag>
                <SupportWPButton />
             </Space>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* FAQ Section */}
      <Title level={3} style={{ marginBottom: 16 }}>
        Frequently Asked Questions
      </Title>

      {/* SALES FAQ */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>Sales</Title>
        <Collapse accordion>
          <Panel header="How can I upgrade my plan?" key="1">
            You can upgrade your subscription plan from the Billing section in
            your Control Panel dashboard.
          </Panel>
          <Panel header="Can I request a custom enterprise plan?" key="2">
            Yes. Please contact our sales team at sales@catafy.com for custom
            pricing and enterprise solutions.
          </Panel>
        </Collapse>
      </Card>

      {/* BILLING FAQ */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>Billing & Payments</Title>
        <Collapse accordion>
          <Panel header="What payment methods are accepted?" key="3">
            We accept UPI, credit/debit cards, and net banking via Razorpay.
          </Panel>
          <Panel header="How do I download invoices?" key="4">
            Invoices can be downloaded from the Billing History section in your
            dashboard.
          </Panel>
          <Panel header="What happens if my payment fails?" key="5">
            Your subscription will remain active for a short grace period.
            Please retry payment from your dashboard.
          </Panel>
        </Collapse>
      </Card>

      {/* TECHNICAL FAQ */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>Technical Support</Title>
        <Collapse accordion>
          <Panel header="My catalog is not loading. What should I do?" key="6">
            Clear your browser cache and try again. If the issue persists,
            contact support.
          </Panel>
          <Panel header="Images are not appearing in my PDF export." key="7">
            Make sure your product image URLs are public and use absolute URLs
            (https://).
          </Panel>
          <Panel header="How do I connect my custom domain?" key="8">
            You can configure your domain from Settings → Domain. Follow the
            DNS instructions provided.
          </Panel>
        </Collapse>
      </Card>

      {/* CATALOG & ORDERS FAQ */}
      <Card>
        <Title level={4}>Catalog & Orders</Title>
        <Collapse accordion>
          <Panel header="How do I create a new catalog?" key="9">
            Navigate to Catalogs → Create New Catalog and add products.
          </Panel>
          <Panel header="Can I export my catalog as a PDF?" key="10">
            Yes. Go to Catalogs → Select Catalog → Download PDF.
          </Panel>
          <Panel header="How do I track orders?" key="11">
            Orders can be tracked in the Orders section where you can update
            status and add remarks.
          </Panel>
        </Collapse>
      </Card>
    </Card>
    </>
  );
};

export default HelpSupportPage;
