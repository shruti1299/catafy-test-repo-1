import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Button, message, Modal, Space, Tag, Tooltip } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FileTextOutlined,
    DownloadOutlined,
    ExclamationCircleOutlined,
    SyncOutlined,
    EyeOutlined,
} from "@ant-design/icons";

interface IProps {
    orderId: number;
    invoiceNo?: string | null;
    onSuccess?: () => void;
}

export default function InvoiceBtn({ orderId, invoiceNo, onSuccess }: IProps) {
    const [loading, setLoading] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const prevBlobRef = useRef<string | null>(null);

    /* revoke old blob URL on unmount */
    useEffect(() => {
        return () => { if (prevBlobRef.current) window.URL.revokeObjectURL(prevBlobRef.current); };
    }, []);

    const fetchBlob = useCallback(async (params: Record<string, any> = {}) => {
        const response = await api({
            url: `${API_ENDPOINTS.ORDERS}/${orderId}/${API_ENDPOINTS.DOWNLOAD_INVOICE}`,
            method: "GET",
            responseType: "blob",
            params,
        });
        return new Blob([response.data], { type: 'application/pdf' });
    }, [orderId]);

    const downloadInvoice = async (regenerate = false) => {
        setLoading(true);
        try {
            const blob = await fetchBlob(regenerate ? { regenerate: true } : {});
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice-${invoiceNo ?? orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            if (!invoiceNo || regenerate) {
                message.success(regenerate ? "Invoice regenerated" : "Invoice generated");
                onSuccess?.();
            }
        } catch (error: any) {
            message.error(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Failed to generate invoice"
            );
        } finally {
            setLoading(false);
        }
    };

    const openPreview = async () => {
        setPreviewing(true);
        try {
            const blob = await fetchBlob({ stream: true });
            if (prevBlobRef.current) window.URL.revokeObjectURL(prevBlobRef.current);
            const url = window.URL.createObjectURL(blob);
            prevBlobRef.current = url;
            setBlobUrl(url);
            setPreviewOpen(true);
            if (!invoiceNo) {
                message.info("Invoice number assigned — refresh to see it.");
                onSuccess?.();
            }
        } catch (error: any) {
            message.error(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Failed to load preview"
            );
        } finally {
            setPreviewing(false);
        }
    };

    const closePreview = () => {
        setPreviewOpen(false);
    };

    const confirmRegenerate = () => {
        Modal.confirm({
            title: "Regenerate Invoice?",
            icon: <ExclamationCircleOutlined />,
            content: `Invoice ${invoiceNo} already exists. Regenerating will create a new PDF.`,
            okText: "Regenerate",
            cancelText: "Cancel",
            onOk: () => downloadInvoice(true),
        });
    };

    if (!orderId) return null;

    return (
        <>
            <Space size={4}>
                {/* {invoiceNo && (
                    <Tooltip title="Invoice generated">
                        <Tag color="green" icon={<FileTextOutlined />} style={{ cursor: "default" }}>
                            {invoiceNo}
                        </Tag>
                    </Tooltip>
                )} */}

                <Tooltip title="Preview invoice">
                    <Button
                        size="small"
                        type="default"
                        loading={previewing}
                        onClick={openPreview}
                        icon={<EyeOutlined />}
                    >
                        {!invoiceNo ? "Preview & Generate" : "Preview"} Invoice
                    </Button>
                </Tooltip>

                {invoiceNo && (
                    <Button
                        size="small"
                        type="primary"
                        ghost
                        loading={loading}
                        onClick={() => downloadInvoice(false)}
                        icon={<DownloadOutlined />}
                    >
                        Download Invoice
                    </Button>
                )}

                {!invoiceNo && (
                    <Button
                        size="small"
                        type="dashed"
                        loading={loading}
                        onClick={() => downloadInvoice(false)}
                        icon={<FileTextOutlined />}
                    >
                        Generate
                    </Button>
                )}

                {invoiceNo && (
                    <Tooltip title="Regenerate invoice PDF">
                        <Button
                            size="small"
                            type="text"
                            loading={loading}
                            onClick={confirmRegenerate}
                            icon={<SyncOutlined />}
                        />
                    </Tooltip>
                )}
            </Space>

            <Modal
                open={previewOpen}
                onCancel={closePreview}
                title={invoiceNo ? `Invoice — ${invoiceNo}` : "Invoice Preview"}
                width="80vw"
                style={{ top: 20 }}
                footer={[
                    <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={() => { closePreview(); downloadInvoice(false); }}>
                        Download Invoice
                    </Button>,
                    <Button key="close" onClick={closePreview}>Close</Button>,
                ]}
            >
                {blobUrl && (
                    <iframe
                        src={blobUrl}
                        style={{ width: "100%", height: "75vh", border: "none" }}
                        title="Invoice Preview"
                    />
                )}
            </Modal>
        </>
    );
}
