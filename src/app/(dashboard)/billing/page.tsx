"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Col,
  message,
  Progress,
  Row,
  Segmented,
  Typography,
  List,
  Space,
  Tag,
  Skeleton,
} from "antd";
import { useUserContext } from "@/contexts/UserContext";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { IPlanUsages } from "@/interfaces/Plan";
import ActiveSubscription from "./subscription";
import { formatDateOnly } from "@/utils/helper";
import Transactions from "./transactions";
import AllPlans from "@/components/plans/all-plans";

const { Title, Text } = Typography;

export default function BillingUsageScreen() {
  const [planUsages, setPlanUsages] = useState<IPlanUsages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState("Current period");
  const { storeDetail } = useUserContext();
  const activePlan = storeDetail?.active_plan;

  const getPlanUsages = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(API_ENDPOINTS.PLAN_USAGES);
      setPlanUsages(data);
    } catch {
      message.error("Failed to load billing data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPlanUsages();
  }, []);

  const productLimit = planUsages?.active_plan?.products ?? 0;
  const usedProducts = planUsages?.products ?? 0;

  const productUsagePercent = useMemo(() => {
    if (!productLimit) return 0;
    return Math.min(Math.round((usedProducts / productLimit) * 100), 100);
  }, [usedProducts, productLimit]);

  const remainingProducts = Math.max(productLimit - usedProducts, 0);

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>💳 Billing &amp; Plans</span>}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
      style={{ borderRadius: 12 }}
      className="mb-100"
    >
      <Segmented
        options={["Current period", "Subscription", "Invoices", "Plans"]}
        size="small"
        value={tab}
        onChange={setTab}
        style={{ background: "#f1f5f9" }}
      />

      <div style={{ marginTop: 24 }}>
        {tab === "Current period" && (
          <>
            <Card bordered={false} style={{ borderRadius: 10, background: "#f8faff", border: "1px solid #e0e7ff" }}>
              <Row justify="space-between" align="middle" wrap>
                <Col>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>
                    Platform usage — current billing period
                    <Tag color="purple" style={{ marginLeft: 8, fontSize: 11, borderRadius: 4 }}>{activePlan?.plan_name} Plan</Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Your total platform usage to be billed in the current billing period.
                  </Text>
                </Col>
                <Col>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatDateOnly(activePlan?.start_at)} – {formatDateOnly(activePlan?.end_at)}
                  </Text>
                </Col>
              </Row>
            </Card>

            <Card
              title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>📊 Plan Consumption</span>}
              styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
              bordered={false}
              style={{ borderRadius: 12, marginTop: 16 }}
            >
              {isLoading ? (
                <Skeleton active />
              ) : (
                <>
                  <Progress
                    percent={productUsagePercent}
                    status={productUsagePercent >= 100 ? "exception" : "active"}
                  />

                  <Space style={{ marginTop: 8 }}>
                    <Text>Plan Usage {planUsages?.products} / {planUsages?.active_plan?.products} products</Text>
                    <Text type="secondary">Remaining free usage {remainingProducts} products</Text>
                  </Space>
                </>
              )}
            </Card>

            <Card
              title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>📦 Usage Breakdown</span>}
              styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
              bordered={false}
              style={{ borderRadius: 12, marginTop: 16 }}
            >
              <Progress
                percent={productUsagePercent}
                strokeColor="#6366f1"
                showInfo={false}
              />

              <List
                style={{ marginTop: 16 }}
                loading={isLoading}
                dataSource={[
                  { name: "Products", amount: planUsages?.products ?? 0 },
                  { name: "Catalogs", amount: planUsages?.catalogs ?? 0 },
                  { name: "Categories", amount: planUsages?.categories ?? 0 },
                  { name: "Orders", amount: planUsages?.orders ?? 0 },
                  { name: "Teams", amount: planUsages?.teams ?? 0 },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Text>{item.name}</Text>
                    <Text >
                      <Tag>{item.amount}</Tag> {item.name}</Text>
                  </List.Item>
                )}
              />
            </Card>
          </>
        )}

        {tab == "Subscription" && (
          <ActiveSubscription />
        )}

        {tab == "Invoices" && (
          <Transactions />
        )}

        {tab == "Plans" && (
          <AllPlans />
        )}
      </div>
    </Card>
  );
}
