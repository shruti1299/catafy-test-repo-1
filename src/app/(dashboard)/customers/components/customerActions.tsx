import React, { memo, useState } from "react";
import { Button, message, Space, Popconfirm } from "antd";
import { API_ENDPOINTS } from "@/api/endpoints";
import api from "@/api";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

interface IProps {
  status: "allowed" | "rejected" | "pending";
  customerID: number;
  isShowAllow?:boolean;
  isShowBlock?:boolean;
}

const CustomerActions = ({ status, customerID, isShowAllow = true, isShowBlock = true}: IProps) => {
  if (!status) return <></>;
  if (!customerID) return <></>;

  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleUserAccess = async (status: "allowed" | "rejected") => {
    setIsLoading(true);
    try {
      const { data } = await api.post(
        `${API_ENDPOINTS.CUSTOMERS}/${customerID}/status`,
        { status }
      );

      if (data.status) setIsDone(true);
      setIsLoading(false);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Action failed");
      setIsLoading(false);
    }
  };

  if (isDone) return <></>;

  return (
    <Space size="middle">
      {status !== "allowed" && isShowAllow === true && (
        <Popconfirm
          title="Allow this customer?"
          description="The customer will be able to place orders."
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleUserAccess("allowed")}
        >
          <Button
            loading={isLoading}
            title="ACCEPT"
            size="small"
            type="primary"
          >
            <CheckCircleOutlined /> Allow
          </Button>
        </Popconfirm>
      )}

      {status !== "rejected" && isShowBlock === true && (
        <Popconfirm
          title="Block this customer?"
          description="The customer will not be able to place orders."
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleUserAccess("rejected")}
        >
          <Button
            loading={isLoading}
            title="REJECT"
            size="small"
            type="primary"
            danger
          >
            <CloseCircleOutlined /> Block
          </Button>
        </Popconfirm>
      )}
    </Space>
  );
};

export default memo(CustomerActions);