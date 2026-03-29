"use client";

import React from "react";
import {
    Typography,
    Space,
    Button,
    message,
    Radio,
} from "antd";
import {
    DownloadOutlined,
    LinkOutlined,
} from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { useUserContext } from "@/contexts/UserContext";
import Card from "antd/es/card/Card";

const { Title, Text } = Typography;

const QrCode = ({ storeUrl, title }: { storeUrl: string, title: string }) => {
    const { storeDetail } = useUserContext();
    const [selectedTemplate, setSelectedTemplate] = React.useState("basic");
    const qrWrapperRef = React.useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!qrWrapperRef.current) {
            message.error("QR code not ready");
            return;
        }
        const images = qrWrapperRef.current.getElementsByTagName("img");
        const promises = Array.from(images).map(
            (img) =>
                new Promise((resolve) => {
                    if (img.complete) return resolve(true);
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(true);
                })
        );
        await Promise.all(promises);
        try {
            const canvas = await html2canvas(qrWrapperRef.current, {
                useCORS: true,
            });
            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = "store_qr_code.png";
            a.click();
        } catch (err) {
            message.error("Failed to download QR");
        }
    };

    const QRTemplate = ({ template }: { template: string }) => {
        switch (template) {
            case "style1":
                return (
                    <div
                        style={{
                            width: 300,
                            height: 450,
                            background: "linear-gradient(#0c0e48 50%, #0c0e48 50%)",
                            padding: 16,
                            borderRadius: 12,
                            color: "#fff",
                            fontFamily: "sans-serif",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                background: "#fff",
                                padding: 16,
                                borderRadius: 8,
                                color: "#000",
                            }}
                        >
                            {storeDetail?.store?.logo && (
                                <img
                                    src={storeDetail.store.logo}
                                    width={50}
                                    height={50}
                                    alt="store logo"
                                    crossOrigin="anonymous"
                                    style={{ objectFit: "contain", borderRadius: 4 }}
                                />
                            )}
                            <Title level={3} style={{ margin: 0 }}>
                                <span style={{ color: "#000" }}>{storeDetail?.store?.store_name}</span>
                            </Title>
                            <div style={{ margin: "20px 0" }}>
                                <QRCodeCanvas value={storeUrl} size={200} />
                            </div>
                            <p style={{ marginTop: 10 }}>Scan To Access Our Catalog</p>
                            <Text strong>Powered By : CATAFY</Text>
                        </div>
                    </div>
                );

            case "style2":
                return (
                    <div
                        style={{
                            width: 300,
                            height: 450,
                            background: "linear-gradient(#171717 50%, #171717 50%)",
                            padding: 16,
                            borderRadius: 12,
                            color: "#fff",
                            fontFamily: "sans-serif",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                background: "#fff",
                                padding: 16,
                                borderRadius: 8,
                                color: "#000",
                            }}
                        >
                            {storeDetail?.store?.logo && (
                                <img
                                    src={storeDetail.store.logo}
                                    width={50}
                                    height={50}
                                    alt="store logo"
                                    style={{ objectFit: "contain", borderRadius: 4 }}
                                />
                            )}
                            <Title level={3} style={{ margin: 0 }}>
                                <span style={{ color: "#000" }}>{storeDetail?.store?.store_name}</span>
                            </Title>
                            <div style={{ margin: "20px 0" }}>
                                <QRCodeCanvas value={storeUrl} size={200} />
                            </div>
                            <p style={{ marginTop: 10 }}>Scan To Access Our Catalog</p>
                            <Text strong>Powered By : CATAFY</Text>
                        </div>
                    </div>
                );

            case "style3":
                return (
                    <div
                        style={{
                            width: 300,
                            height: 450,
                            background: "linear-gradient(#01b9f1 50%, #01b9f1 50%)",
                            padding: 16,
                            borderRadius: 12,
                            color: "#fff",
                            fontFamily: "sans-serif",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                background: "#fff",
                                padding: 16,
                                borderRadius: 8,
                                color: "#000",
                            }}
                        >
                            {storeDetail?.store?.logo && (
                                <img
                                    src={storeDetail.store.logo}
                                    width={50}
                                    height={50}
                                    alt="store logo"
                                    style={{ objectFit: "contain", borderRadius: 4 }}
                                />
                            )}
                            <Title level={3} style={{ margin: 0 }}>
                                <span style={{ color: "#000" }}>{storeDetail?.store?.store_name}</span>
                            </Title>
                            <div style={{ margin: "20px 0" }}>
                                <QRCodeCanvas value={storeUrl} size={200} />
                            </div>
                            <p style={{ marginTop: 10 }}>Scan To Access Our Catalog</p>
                            <Text strong>Powered By : CATAFY</Text>
                        </div>
                    </div>
                );
            case "style4":
                return (
                    <div
                        style={{
                            width: 300,
                            height: 450,
                            background: "linear-gradient(#171717 50%, #00B9F1 50%)",
                            padding: 16,
                            borderRadius: 12,
                            color: "#fff",
                            fontFamily: "sans-serif",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                background: "#fff",
                                padding: 16,
                                borderRadius: 8,
                                color: "#000",
                            }}
                        >
                            {storeDetail?.store?.logo && (
                                <img
                                    src={storeDetail.store.logo}
                                    width={50}
                                    height={50}
                                    alt="store logo"
                                    style={{ objectFit: "contain", borderRadius: 4 }}
                                />
                            )}
                            <Title level={3} style={{ margin: 0 }}>
                                <span style={{ color: "#000" }}>{storeDetail?.store?.store_name}</span>
                            </Title>
                            <div style={{ margin: "20px 0" }}>
                                <QRCodeCanvas value={storeUrl} size={200} />
                            </div>
                            <p style={{ marginTop: 10 }}>Scan To Access Our Catalog</p>
                            <Text strong>Powered By : CATAFY</Text>
                        </div>
                    </div>
                );

            case "basic":
            default:
                return <QRCodeCanvas value={storeUrl} size={250} />;
        }
    };

    return (
        <Card title={title}>
            <Space direction="vertical" size="large" className="w-100">
                <Text>
                    This QR Code can be used to share your store link (like Paytm or PhonePe). Print it or send to customers easily.
                </Text>

                <Radio.Group
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                >
                    <Radio.Button value="basic">Basic</Radio.Button>
                    <Radio.Button value="style1">Style 1</Radio.Button>
                    <Radio.Button value="style2">Style 2</Radio.Button>
                    <Radio.Button value="style3">Style 3</Radio.Button>
                    <Radio.Button value="style4">Style 4</Radio.Button>
                </Radio.Group>

                <div ref={qrWrapperRef} style={{ display: "inline-block" }}>
                    <QRTemplate template={selectedTemplate} />
                </div>

                <Space>
                    <Button icon={<LinkOutlined />} type="default" href={storeUrl} target="_blank">
                        Open Store
                    </Button>
                    <Button icon={<DownloadOutlined />} type="primary" onClick={handleDownload}>
                        Download QR
                    </Button>
                </Space>
            </Space>
        </Card>
    );
};

export default QrCode;
