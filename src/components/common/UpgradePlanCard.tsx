"use client";

import React from "react";
import { Card, Typography, Button, Space } from "antd";
import { useRouter } from "next/navigation";
import { IActivePlan } from "@/interfaces/Store";

const { Title, Text } = Typography;

interface UpgradePlanCardProps {
    message?: string;
    imageUrl?: string;
    buttonText?: string;
    activePlan:IActivePlan;
}

const UpgradePlanCard: React.FC<UpgradePlanCardProps> = ({
    message = "You’ve reached the maximum limit for your current plan. Upgrade to unlock more features and continue working without interruptions.",
    imageUrl = "/svg/plan/plan-2.svg",
    buttonText = "Upgrade Plan",
    activePlan
}) => {
    const router = useRouter();

    const handleUpgrade = () => {
        router.push(`/pricing?active_plan=${activePlan?.plan_id}`);
    };

    return (
        <Card
            style={{
                margin: "auto",
                textAlign: "center",
            }}
        >
        <Space direction="vertical" size="middle">
            <img
                src={imageUrl}
                alt="Upgrade Plan"
                style={{ width: 320, marginBottom: 16 }}
            />
            <Title level={2}>Plan Limit Reached</Title>
            <Text style={{ fontSize: "1.5em" }} type="secondary">{message}</Text>
            <Button className="mt-2 mb-2" size="large" type="primary" onClick={handleUpgrade} block>
                {buttonText}
            </Button>
        </Space>
        </Card>
    );
};

export default UpgradePlanCard;
