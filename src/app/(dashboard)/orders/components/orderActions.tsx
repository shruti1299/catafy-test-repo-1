import React, { memo, useState } from "react";
import { Button, message, Space, Modal, Input } from "antd";
import { API_ENDPOINTS } from "@/api/endpoints";
import api from "@/api";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { IOrder } from "@/interfaces/Order";
import { getOrderStatus } from "@/utils/orderStatus";

interface IProps {
  order: IOrder;
  reload?: () => {};
}

const OrderActions = ({ order, reload }: IProps) => {
  const [statusChanging, setStatusChanging] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [remark, setRemark] = useState("");

  const changeStatus = async () => {
    if (!selectedStatus) return;
    setStatusChanging(true);
    try {
      await api.post(
        `${API_ENDPOINTS.ORDERS}/${order.id}/change-status`,
        {
          status: selectedStatus,
          remark: remark || null
        }
      );
      setModalVisible(false);
      setRemark("");
      setSelectedStatus(null);
      if (reload) reload();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to update order status");
    } finally {
      setStatusChanging(false);
    }
  };

  const openModal = (status: number) => {
    setSelectedStatus(status);
    setModalVisible(true);
  };

  if (!order) return <></>;

  return (
    <>
      <Space size="middle">
        {order.status == 0 && (
          <>
            <Button
              loading={statusChanging}
              onClick={() => openModal(1)}
              size="small"
              type="primary"
            >
              <CheckCircleOutlined /> ACCEPT
            </Button>

            <Button
              loading={statusChanging}
              onClick={() => openModal(2)}
              size="small"
              type="primary"
              danger
            >
              <CloseCircleOutlined /> REJECT
            </Button>
          </>
        )}

        {order.status == 1 && (
          <>
            <Button
              loading={statusChanging}
              onClick={() => openModal(4)}
              size="small"
              color="green"
              type="primary"
              title="Mark order status to Dispatched"
              style={{
                backgroundColor: "#1439f3ff",
                borderColor: "#1439f3ff",
              }}
            >
              <CheckCircleOutlined /> Mark As Dispatch
            </Button>
          </>
        )}

        {order.status == 4 && (
          <>
            <Button
              loading={statusChanging}
              onClick={() => openModal(9)}
              size="small"
              color="green"
              type="primary"
              title="Mark order status to Delivered"
            >
              <CheckCircleOutlined /> Mark As Delivered
            </Button>
          </>
        )}

      </Space>

      <Modal
        title={"Confirmation"}
        open={modalVisible}
        onOk={changeStatus}
        onCancel={() => setModalVisible(false)}
        confirmLoading={statusChanging}
        okText="Confirm"
      >
        {selectedStatus && <p>Are you sure you want to {getOrderStatus(selectedStatus)?.message} this order?</p>}

        <Input.TextArea
          placeholder="Add remark (optional)"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          rows={4}
        />
      </Modal>
    </>
  );
};

export default memo(OrderActions);
