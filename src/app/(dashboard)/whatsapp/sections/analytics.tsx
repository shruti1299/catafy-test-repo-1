"use client";

import { Card, Row, Col } from "antd";
import { IWhatsappData } from "@/interfaces/Whatsapp";

export default function Analytics({ data }: { data: IWhatsappData }) {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Messages Sent">
          {data?.credit.balance}
        </Card>
      </Col>

      <Col span={8}>
        <Card title="Credits Balance">
          {data?.credit.used}
        </Card>
      </Col>

      <Col span={8}>
        <Card title="Campaigns">
          Track broadcast performance
        </Card>
      </Col>
    </Row>
  );

}