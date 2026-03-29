import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Button, message, Modal } from 'antd';
import React, { useState } from 'react';
import { TruckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

export default function ShiprocketBtn({
    orderId,
    shipTxtId,
    onSuccess
}: {
    orderId: number;
    shipTxtId?: string;
    onSuccess?: () => void;
}) {

    const [isShipping, setIsShipping] = useState(false);

    const handleShip = async () => {
        setIsShipping(true);
        try {
            await api.post(`${API_ENDPOINTS.ORDERS}/${orderId}/shiprocket`);
            message.success("Order added to Shiprocket successfully");
            onSuccess?.();
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Failed to add order on Shiprocket";
            message.error(errMsg);
        } finally {
            setIsShipping(false);
        }
    };

    const confirmShip = () => {
        Modal.confirm({
            title: shipTxtId
                ? "Order already added to Shiprocket"
                : "Add order to Shiprocket?",
            icon: <ExclamationCircleOutlined />,
            content: shipTxtId
                ? "This order is already created on Shiprocket. Do you want to create it again?"
                : "Are you sure you want to send this order to Shiprocket?",
            okText: shipTxtId ? "Add Again" : "Yes",
            cancelText: "Cancel",
            onOk: handleShip,
        });
    };

    if (!orderId) return null;

    return (
        <Button
            onClick={confirmShip}
            size="small"
            type={shipTxtId ? "default" : "dashed"}
            loading={isShipping}
        >
            <TruckOutlined /> {shipTxtId ? "Re-Add Shiprocket" : "Add on Shiprocket"}
        </Button>
    );
}