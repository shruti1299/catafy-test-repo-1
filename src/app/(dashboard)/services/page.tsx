"use client"

import React from "react";
import { Card, Tag, Button, Row, Col, Typography, Divider } from "antd";
import { CheckCircleOutlined, DollarOutlined, GiftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

interface AddonService {
  id: number;
  name: string;
  description: string;
  price: number;
  priceType: "onetime" | "monthly" | "yearly";
  isFree: boolean;
}

const addonServices: AddonService[] = [
  {
    id: 1,
    name: "Custom Domain",
    description: "Connect your own branded domain to your store. With free SSL",
    price: 299,
    priceType: "monthly",
    isFree: false,
  },
  {
    id: 1,
    name: "Google & Meta Integration",
    description: "Get fully set up Google Analytics and Facebook Pixel for your store – so you can track visitors, sales and ads without any hassle. 🚀",
    price: 299,
    priceType: "monthly",
    isFree: false,
  },
  {
    id: 2,
    name: "Priority Support",
    description: "Get faster support with priority handling.",
    price: 0,
    priceType: "monthly",
    isFree: true,
  },
  {
    id: 3,
    name: "Watermark Branding",
    description: "Add watermark on your shared product images.",
    price: 0,
    priceType: "onetime",
    isFree: true,
  },
  {
    id: 4,
    name: "Custom Landing Page With CATFAY",
    description: "Create a beautiful website with designed landing page by our team and showcase with catafy.",
    price: 19999,
    priceType: "onetime",
    isFree: false,
  },
  {
    id: 5,
    name: "Digital Marketing",
    description: "Boost your reach with ads on social media, Google, or through top influencers—fully managed by our team.",
    price: 4999,
    priceType: "monthly",
    isFree: false,
  },
  {
    id: 6,
    name: "Social Media",
    description: "We’ll manage your social media posts and creatives—fully handled by the CATAFY Team.",
    price: 4999,
    priceType: "monthly",
    isFree: false,
  },
];

export default function Page() {
  return (
    <Card>
      <Title level={3}>Addons Services</Title>
      <Paragraph type="secondary">
        Enhance your store with optional addons. Choose from free or paid services as per your need.
      </Paragraph>

      <Row gutter={[16, 16]}>
        {addonServices.map((addon) => (
          <Col xs={24} md={12} lg={8} key={addon.id}>
            <Card
              title={addon.name}
              bordered={true}
              style={{ borderRadius: 12 }}
              // actions={[
              //   <Button type="primary" key="buy">
              //     {addon.isFree ? "Activate" : "Buy Now"}
              //   </Button>,
              // ]}
            >
              <Paragraph>{addon.description}</Paragraph>

              <div style={{ marginTop: 12 }}>
                {addon.isFree ? (
                  <Tag color="green" icon={<GiftOutlined />}>
                    Free
                  </Tag>
                ) : (
                  <Tag color="blue">
                    ₹{addon.price} / {addon.priceType}
                  </Tag>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Divider />
        <Paragraph type="secondary">Need to stop, cancel, or upgrade your plan? No worries—your growth, your choice. Whether you want to pause, make changes, or explore a better plan, our friendly team is just a message away and always happy to help. Reach out anytime—we’re here for you!</Paragraph>
    </Card>
  );
}
