import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import { IOrder } from '@/interfaces/Order';
import { Button } from 'antd'
import React, { useState } from 'react'
import { DownloadOutlined } from "@ant-design/icons";

export default function OrderPdf({ order }: { order: IOrder }) {
    const [isPDFDownloading, setIsPDFDownloading] = useState(false);

    const handleDownload = async (orderID: number, s_no?: string) => {
        setIsPDFDownloading(true);
        try {
            const response = await api({
                url: API_ENDPOINTS.DOWNLOAD_ORDER_PDF + "/" + orderID,
                method: "GET",
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `order-${s_no}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading the PDF:", error);
        } finally {
            setIsPDFDownloading(false);
        }
    };

    if (!order) return <></>;
    return (
        <Button
            onClick={() => handleDownload(order.id, order.s_no)}
            size="small"
            type="dashed"
            loading={isPDFDownloading}
        >
            <DownloadOutlined /> PDF
        </Button>)
}
