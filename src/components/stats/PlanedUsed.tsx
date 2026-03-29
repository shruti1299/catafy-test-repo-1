"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Card,
    Col,
    Progress,
    Row,
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
import { formatDateOnly } from "@/utils/helper";

const { Title, Text } = Typography;

export default function PlanedUsed() {
    const [planUsages, setPlanUsages] = useState<IPlanUsages | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { storeDetail } = useUserContext();
    const activePlan = storeDetail?.active_plan;

    const getPlanUsages = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get(API_ENDPOINTS.PLAN_USAGES);
            setPlanUsages(data);
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
        <>
            <Card bordered={false} style={{ borderRadius: 12 }}>
                <Row justify="space-between">
                    <Col>
                        <Title level={5}>
                            Platform usage in current billing period (Plan):{" "}
                            <Tag color="blue">{activePlan?.plan_name} Plan</Tag>
                        </Title>
                        <Text type="secondary">
                            This is your total platform usage to be billed in the current
                            billing period.
                        </Text>
                    </Col>
                    <Col>
                        <Text type="secondary">
                            {formatDateOnly(activePlan?.start_at)} – {formatDateOnly(activePlan?.end_at)}
                        </Text>
                    </Col>
                </Row>
            </Card>

            <Card
                title="Plan consumption"
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
                title="Platform usage breakdown by services"
                bordered={false}
                style={{ borderRadius: 12, marginTop: 16 }}
            >
                <Progress
                    percent={productUsagePercent}
                    strokeColor="#722ed1"
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
    )
}
