"use client";

import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Button } from "antd";
import React, { useState } from "react";
import { FileExcelOutlined } from "@ant-design/icons";

export default function DownloadExcelButton({ orderId, orderSno}: { orderId: number, orderSno:string|undefined}) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if(!orderId) return;
        if(!orderSno) return;
        try {
            setLoading(true);
            const response = await api({
                url: `${API_ENDPOINTS.ORDERS}/${orderId}/excel`,
                method: "GET",
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `order-${orderSno}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setLoading(false);
        } catch (error) {
            console.error(error);
            alert("Failed to download file");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleDownload}
            size="small"
            type="dashed"
            loading={loading}
            icon={<FileExcelOutlined />}
        >
            {loading ? "Downloading..." : "Download Excel"}
        </Button>
    );
}