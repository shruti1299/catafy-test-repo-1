import React, { useState } from "react";
import { Card, Button, Row, Col, Typography, message } from "antd";
import { useUserContext } from "@/contexts/UserContext";
import { API_ENDPOINTS } from "@/api/endpoints";
import api from "@/api";
import { DoubleArrowIcon } from "@/svg/index";

const { Text } = Typography;

export default function GridLayoutSetting() {
    const { storeDetail } = useUserContext();
    const { store } = storeDetail || {};
    const [productGrid, setProductGrid] = useState(store?.product_grid || 4);
    const [catalogGrid, setCatalogGrid] = useState(store?.catalog_grid || 4);
    const [homeWidth, setHomeWidth] = useState(store?.container_size || "container");
    const [searchWidth, setSearchWidth] = useState(store?.cc_size || "container");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSubmit = async () => {
        setIsUpdating(true);
        try {
            await api.post(API_ENDPOINTS.STORE_DETAIL, {
                product_grid: productGrid,
                catalog_grid: catalogGrid,
                container_size: homeWidth,
                cc_size: searchWidth,
            });
            message.success("Layout updated successfully. It will reflect in 5-10 min.");
        } catch (error) {
            message.error("Something went wrong!");
        } finally {
            setIsUpdating(false);
        }
    };

    const GridOption = ({ value, selected, onClick }: any) => (
        <Button
            type={selected ? "primary" : "default"}
            shape="round"
            onClick={onClick}
            style={{ minWidth: 60, marginTop: 10 }}
        >
            {value}
        </Button>
    );

    const WidthOption = ({ label, selected, onClick }: any) => (
        <Button
            type={selected ? "primary" : "default"}
            shape="round"
            onClick={onClick}
            style={{ marginTop: 10 }}
        >
            {label}
        </Button>
    );

    return (
        <>
            <Text type="secondary">
                Customize your store appearance and layout preferences.
            </Text>

            <Row gutter={[20, 20]}>
                <Col span={12}>
                    <Card style={{ margin: "20px 0" }} bordered title="Product Screen Grid">
                        <Text type="secondary">Choose how many products to show per row.</Text>
                        <Row gutter={[12, 12]}>
                            {[3, 4, 5, 6].map((num) => (
                                <Col key={num}>
                                    <GridOption
                                        value={num}
                                        selected={productGrid === num}
                                        onClick={() => setProductGrid(num)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card style={{ margin: "20px 0" }} bordered title="Home Screen Width">
                        <Text type="secondary">Adjust how content fits on your home screen.</Text>
                        <Row gutter={[12, 12]}>
                            <Col>
                                <WidthOption
                                    label="Contain"
                                    selected={homeWidth === "container"}
                                    onClick={() => setHomeWidth("container")}
                                />
                            </Col>
                            <Col>
                                <WidthOption
                                    label="Full Screen"
                                    selected={homeWidth === "full"}
                                    onClick={() => setHomeWidth("full")}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card style={{ margin: "20px 0" }} bordered title="Catalog Grid Size">
                        <Text type="secondary">Choose grid size for catalog view.</Text>
                        <Row gutter={[12, 12]}>
                            {[3, 4, 5, 6].map((num) => (
                                <Col key={num}>
                                    <GridOption
                                        value={num}
                                        selected={catalogGrid === num}
                                        onClick={() => setCatalogGrid(num)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card style={{ margin: "20px 0" }} bordered title="Home Screen Search Bar">
                        <Text type="secondary">Set the search bar width.</Text>
                        <Row gutter={[12, 12]}>
                            <Col>
                                <WidthOption
                                    label="Container"
                                    selected={searchWidth === "container"}
                                    onClick={() => setSearchWidth("container")}
                                />
                            </Col>
                            <Col>
                                <WidthOption
                                    label="Full Width"
                                    selected={searchWidth === "full"}
                                    onClick={() => setSearchWidth("full")}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Button
                type="primary"
                size="large"
                shape="round"
                loading={isUpdating}
                onClick={handleSubmit}
            >
                {isUpdating ? "Saving..." : "Save Now"}
            </Button>
        </>
    );
}
