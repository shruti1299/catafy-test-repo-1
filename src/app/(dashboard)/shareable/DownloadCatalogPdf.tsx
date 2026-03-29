"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    Typography,
    Space,
    Button,
    message,
    Tag,
    Spin,
    Row,
    Col,
    Select,
    Radio,
} from "antd";
import {
    DownloadOutlined,
    FilePdfOutlined,
} from "@ant-design/icons";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ICatalog } from "@/interfaces/Catalog";
import api from "@/api";
import Image from "next/image";

const { Title, Text } = Typography;

const DownloadCatalogPdf = () => {
    const [isPDFDownloading, setIsPDFDownloading] = useState(false);
    const [catalogs, setCatalogs] = useState<ICatalog[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCatalog, setSelectedCatalog] = useState<number | null>(null);
    const [generating, setGenerating] = useState(false);
    const [pdfFormat, setPdfFormat] = useState<"table" | "grid">("table");

    // ✅ NEW: Options state
    const [selectedOptions, setSelectedOptions] = useState<string[]>([
        "name",
        "price",
        "moq",
        "variations_count",
    ]);

    /* -------------------- Fetch Catalogs -------------------- */
    const getAllCatalogs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(API_ENDPOINTS.ALL_CATALOGS);
            setCatalogs(data);
        } catch {
            message.error("Failed to load catalogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllCatalogs();
    }, []);

    /* -------------------- Actions -------------------- */

    const getOptionsString = () => {
        return selectedOptions.length ? selectedOptions.join(",") : "";
    };

    const downloadAllCatalogs = async () => {
        setGenerating(true);
        try {
            await api.post(API_ENDPOINTS.REPORTS, {
                type: "all_catalogs",
                catalog_id: selectedCatalog,
                options: getOptionsString(),
                pdf_format: pdfFormat,
            });
            message.success("Catalog PDF added in reports. It will take 3-5 min.");
        } finally {
            setGenerating(false);
        }
    };

    const downloadSingleCatalog = async () => {
        if (!selectedCatalog) {
            message.warning("Please select a catalog");
            return;
        }

        setIsPDFDownloading(true);

        try {
            const response = await api({
                url:
                    API_ENDPOINTS.DOWNLOAD_CATALOG_PDF +
                    "/" +
                    selectedCatalog +
                    `?pdf_format=${pdfFormat}&options=${getOptionsString()}`, // ✅ added
                method: "GET",
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `catalog-${selectedCatalog}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading PDF:", error);
        } finally {
            setIsPDFDownloading(false);
        }
    };

    return (
        <Card
            title={
                <Space>
                    <FilePdfOutlined />
                    <span>Download Catalog PDF</span>
                </Space>
            }
        >
            <Space direction="vertical" size="large" style={{ width: "100%", marginBottom: 100 }}>

                <Text type="secondary">
                    Customize your PDF by selecting which fields to include.
                </Text>

                <Row gutter={[20, 20]}>

                    {/* LEFT SIDE */}
                    <Col span={12}>
                        <Card style={{ background: "#fafafa" }}>
                            <Space direction="vertical" size="middle" style={{ width: "100%" }}>

                                {/* FORMAT */}
                                <Title level={5}>PDF Format</Title>
                                <Radio.Group
                                    value={pdfFormat}
                                    onChange={(e) => setPdfFormat(e.target.value)}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Radio.Button value="table" style={{ width: "100%", height: 100 }}>
                                                <Space direction="vertical">
                                                    <Image src="/images/table.png" height={80} width={80} alt="table" />
                                                    <Text>Table</Text>
                                                </Space>
                                            </Radio.Button>
                                        </Col>

                                        <Col span={12}>
                                            <Radio.Button value="grid" style={{ width: "100%", height: 100 }}>
                                                <Space direction="vertical">
                                                    <Image src="/images/grid.png" height={80} width={80} alt="grid" />
                                                    <Text>Grid</Text>
                                                </Space>
                                            </Radio.Button>
                                        </Col>
                                    </Row>
                                </Radio.Group>

                                {/* ✅ NEW OPTIONS UI */}
                                <Title level={5} style={{ marginTop: 30 }}>
                                    Select Fields (Options)
                                </Title>

                                <Select
                                    mode="multiple"
                                    size="large"
                                    style={{ width: "100%" }}
                                    value={selectedOptions}
                                    onChange={setSelectedOptions}
                                    placeholder="Select fields to include"
                                    options={[
                                        { label: "Product Name", value: "name" },
                                        { label: "Price", value: "price" },
                                        { label: "MOQ", value: "moq" },
                                        { label: "Variations Count", value: "variations_count" },
                                    ]}
                                />

                                {/* CATALOG */}
                                <Title level={5} style={{ marginTop: 30 }}>
                                    Select Catalog
                                </Title>

                                <Spin spinning={loading}>
                                    <Select
                                        placeholder="Select a catalog"
                                        style={{ width: "100%" }}
                                        size="large"
                                        showSearch
                                        value={selectedCatalog}
                                        onChange={(value) => setSelectedCatalog(value)}
                                        optionFilterProp="label"
                                    >
                                        {catalogs.map((catalog) => (
                                            <Select.Option
                                                key={catalog.id}
                                                value={catalog.id}
                                                label={catalog.name}
                                            >
                                                <Space>
                                                    <Text>{catalog.name}</Text>
                                                    <Tag color="blue">
                                                        {catalog.products_count ?? 0} products
                                                    </Tag>
                                                </Space>
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Spin>

                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    loading={isPDFDownloading}
                                    disabled={!selectedCatalog}
                                    onClick={downloadSingleCatalog}
                                    block
                                >
                                    Download Selected Catalog
                                </Button>

                            </Space>
                        </Card>
                    </Col>

                    {/* RIGHT SIDE */}
                    <Col span={12}>
                        <Card style={{ background: "#fafafa" }}>
                            <Space direction="vertical" style={{ width: "100%" }}>

                                <Title level={5}>All Catalogs</Title>

                                <Text type="secondary">
                                    Generate one PDF for all catalogs with selected fields.
                                </Text>

                                {/* ✅ NEW OPTIONS UI */}
                                <Title level={5} style={{ marginTop: 30 }}>
                                    Select Fields (Options)
                                </Title>

                                <Select
                                    mode="multiple"
                                    size="large"
                                    style={{ width: "100%" }}
                                    value={selectedOptions}
                                    onChange={setSelectedOptions}
                                    placeholder="Select fields to include"
                                    options={[
                                        { label: "Product Name", value: "name" },
                                        { label: "Price", value: "price" },
                                        { label: "MOQ", value: "moq" },
                                        { label: "Variations Count", value: "variations_count" },
                                    ]}
                                />

                                <Button
                                    style={{ marginTop: 30 }}
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    loading={generating}
                                    onClick={downloadAllCatalogs}
                                >
                                    Generate All Catalogs PDF
                                </Button>

                            </Space>
                        </Card>
                    </Col>

                </Row>
            </Space>
        </Card>
    );
};

export default DownloadCatalogPdf;