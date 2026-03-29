"use client";

import React from "react";
import {Col, Row} from "antd";
import { useUserContext } from "@/contexts/UserContext";
import QrCode from "./QrCode";


const StoreQRCodeSetting = () => {
  const { storeDetail } = useUserContext();
  const storeUrl = `https://${storeDetail?.store?.username}.catafy.com`;
  const isB2CEnabled = storeDetail?.store?.is_b2c;
  const storeB2cUrl = `https://${storeDetail?.store?.b2c_domain}-b2c.catafy.com`

  return (
      <Row gutter={[10, 10]}>
        <Col span={isB2CEnabled ? 12 : 24}>
          <QrCode storeUrl={storeUrl} title={isB2CEnabled ? "B2B Store QR Code" : "Store QR Code"} />
        </Col>
        {isB2CEnabled ? <Col span={12}>
          <QrCode storeUrl={storeB2cUrl} title="B2C Store QR Code" />
        </Col> : <></>}
      </Row>
  );
};

export default StoreQRCodeSetting;
