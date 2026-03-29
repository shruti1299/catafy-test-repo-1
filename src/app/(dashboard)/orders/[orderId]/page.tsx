"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Image,
  InputNumber,
  Popconfirm,
  Row,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  CarOutlined,
  InboxOutlined,
  PercentageOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useParams } from "next/navigation";
import { IOrder } from "@/interfaces/Order";
import api from "@/api";
import { CURRENCY_ICON } from "@/constant";
import { Skeleton } from "antd";
import BackButton from "@/components/common/back-button";
import OrderActions from "../components/orderActions";
import { API_ENDPOINTS } from "@/api/endpoints";
import { getOrderStatus } from "@/utils/orderStatus";
import TextArea from "antd/es/input/TextArea";
import { formatDateTimeAMPM } from "@/utils/helper";
import OrderPdf from "../components/OrderPdf";
import DownloadExcelButton from "@/components/common/DownloadExcelButton";
import ShiprocketBtn from "../components/ShiprocketBtn";
import InvoiceBtn from "../components/InvoiceBtn";
import { useUserContext } from "@/contexts/UserContext";

const { Text, Title } = Typography;

/* ── helpers ───────────────────────────────────────────────── */
const fmt = (v: number | string) =>
  Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ── item row ───────────────────────────────────────────────── */
interface EditItem {
  id: number;
  quantity: number;
  price: number;
}

/* ══════════════════════════════════════════════════════════ */
const OrderPage = () => {
  const { orderId } = useParams();
  const { storeDetail } = useUserContext();

  const [order, setOrder]         = useState<IOrder | null>(null);
  const [loading, setLoading]     = useState(false);
  const [remarks, setRemarks]       = useState(order?.remarks || "");
  const [savingRemark, setSavingRemark] = useState(false);

  /* item editing */
  const [editItems, setEditItems] = useState<Record<number, EditItem>>({});
  const [savingItems, setSavingItems] = useState(false);

  /* fees */
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [packingFee, setPackingFee]   = useState<number>(0);
  const [useShipping, setUseShipping] = useState(false);
  const [usePacking,  setUsePacking]  = useState(false);
  const [savingFees, setSavingFees]   = useState(false);

  /* edit mode toggles */
  const [editingItems, setEditingItems] = useState(false);
  const [editingFees,  setEditingFees]  = useState(false);

  const IS_SHIPROCKET = storeDetail?.detail?.is_shiprocket || 0;
  const IS_INVOICE    = storeDetail?.detail?.is_invoice    || 0;

  /* ── fetch ─────────────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`${API_ENDPOINTS.ORDERS}/${orderId}`);
      setOrder(data);
      setRemarks(data?.remark || "");

      const sc = Number(data?.shipping_charge || 0);
      const pc = Number((data as any)?.packing_charge || 0);
      setShippingFee(sc);
      setPackingFee(pc);
      setUseShipping(sc > 0);
      setUsePacking(pc > 0);

      /* seed edit state */
      const seed: Record<number, EditItem> = {};
      (data?.items ?? []).forEach((item: any) => {
        seed[item.id] = { id: item.id, quantity: item.quantity, price: Number(item.price) };
      });
      setEditItems(seed);
    } catch {
      message.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── computed totals ────────────────────────────────────── */
  const subtotal = (order?.items ?? []).reduce((acc, item) => {
    const e = editItems[item.id];
    const qty   = e?.quantity ?? item.quantity;
    const price = e?.price    ?? Number(item.price);
    return acc + qty * price;
  }, 0);
  const discount  = Number(order?.discount || 0);
  const shipping  = useShipping ? shippingFee : 0;
  const packing   = usePacking  ? packingFee  : 0;
  const grandTotal = subtotal - discount + shipping + packing;

  /* ── handlers ───────────────────────────────────────────── */
  const handleItemChange = (id: number, field: "quantity" | "price", val: number) => {
    setEditItems(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      await api.delete(`${API_ENDPOINTS.ORDERS}/${orderId}/items/${itemId}`);
      message.success("Item removed");
      fetchData();
    } catch (e: any) {
      message.error(e?.response?.data?.error || "Failed to remove item");
    }
  };

  const handleCancelItems = () => {
    /* reset to original order values */
    const seed: Record<number, EditItem> = {};
    (order?.items ?? []).forEach((item: any) => {
      seed[item.id] = { id: item.id, quantity: item.quantity, price: Number(item.price) };
    });
    setEditItems(seed);
    setEditingItems(false);
  };

  const handleSaveItems = async () => {
    setSavingItems(true);
    try {
      const payload = Object.values(editItems).map(i => ({
        id: i.id,
        quantity: i.quantity,
        price: i.price,
      }));
      await api.patch(`${API_ENDPOINTS.ORDERS}/${orderId}/items`, { items: payload });
      message.success("Items updated");
      setEditingItems(false);
      fetchData();
    } catch (e: any) {
      message.error(e?.response?.data?.error || "Failed to update items");
    } finally {
      setSavingItems(false);
    }
  };

  const handleSaveFees = async () => {
    setSavingFees(true);
    try {
      await api.patch(`${API_ENDPOINTS.ORDERS}/${orderId}/fees`, {
        shipping_charge: useShipping ? shippingFee : 0,
        packing_charge:  usePacking  ? packingFee  : 0,
      });
      message.success("Fees updated");
      setEditingFees(false);
      fetchData();
    } catch (e: any) {
      message.error(e?.response?.data?.error || "Failed to update fees");
    } finally {
      setSavingFees(false);
    }
  };

  const handleSaveRemark = async () => {
    if (!order?.id) return;
    setSavingRemark(true);
    try {
      await api.post(`${API_ENDPOINTS.ORDERS}/${order.id}/change-status`, {
        status: order.status,
        remarks: remarks || null,
      });
      message.success("Remark saved");
      fetchData();
    } catch {
      message.error("Failed to save remark");
    } finally {
      setSavingRemark(false);
    }
  };

  if (!order) return (
    <div style={{ paddingBottom: 80 }}>
      <Skeleton active paragraph={{ rows: 8 }} />
    </div>
  );

  const status = getOrderStatus(order.status);

  return (
    <div style={{ paddingBottom: 80 }}>
      <BackButton backTo="/orders" />

      {/* ── header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Title level={4} style={{ margin: 0 }}>Order #{order.s_no}</Title>
          <Tag color={status.color} style={{ fontSize: 13, padding: "2px 10px" }}>{status.message}</Tag>
          <Tag color={order.channel === "b2b" ? "default" : "geekblue"} style={{ textTransform: "uppercase" }}>
            {order.channel}
          </Tag>
          {order.is_seller_modified ? (
            <Tag color="orange" style={{ fontSize: 11 }}>✏️ Seller Edited</Tag>
          ): <></>}
        </div>
        <Space wrap>
          <OrderPdf order={order} />
          <DownloadExcelButton orderId={order.id} orderSno={order.s_no} />
          {IS_SHIPROCKET ? (
            <ShiprocketBtn orderId={order.id} shipTxtId={order.shipping_txt_id} onSuccess={fetchData} />
          ) : null}
          {IS_INVOICE ? (
            <InvoiceBtn orderId={order.id} invoiceNo={order.invoice_no} onSuccess={fetchData} />
          ) : null}
        </Space>
      </div>

      <Row gutter={[16, 16]}>

        {/* ══════════ LEFT — meta cards ══════════ */}
        <Col xs={24} lg={9}>

          {/* Order Info */}
          <Card
            size="small"
            title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}><InfoCircleOutlined style={{ color: "#6366f1", marginRight: 6 }} />Order Info</span>}
            styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
            style={{ marginBottom: 16, borderRadius: 12 }}
          >
            <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600, color: "#6b7280" }}>
              <Descriptions.Item label="Order Date">
                {formatDateTimeAMPM(order.order_datetime)}
              </Descriptions.Item>

              {order.invoice_no && (
                <Descriptions.Item label="Invoice #">{order.invoice_no}</Descriptions.Item>
              )}

              {order.shipping_txt_id && (
                <Descriptions.Item label="Shipping ID">{order.shipping_txt_id}</Descriptions.Item>
              )}

              {order.gatway_id && (
                <>
                  <Descriptions.Item label="Payment">
                    {order.payment_method === 1 ? "COD" : "Razorpay"}
                    <Badge
                      status={order.payment_status === 1 ? "success" : "error"}
                      text={order.payment_status === 1 ? "Paid" : "Unpaid"}
                      style={{ marginLeft: 10 }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Paid At">
                    {formatDateTimeAMPM(order.payment_at)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Transaction ID">
                    <Text copyable style={{ fontSize: 12 }}>{order.payment_tid}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Gateway ID">
                    <Text copyable style={{ fontSize: 12 }}>{order.gatway_id}</Text>
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>

            <Divider style={{ margin: "12px 0" }} />
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Remarks : 

              {order.remarks && <Tag style={{marginLeft:10}} color="red">{order?.remarks}</Tag>}
            </div>
            <TextArea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Add order remark…"
              rows={2}
              style={{ marginBottom: 8 }}
            />
            <Button
              size="small"
              type="primary"
              loading={savingRemark}
              onClick={handleSaveRemark}
              style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" }}
            >
              Save Remark
            </Button>
          </Card>

          {/* Customer */}
          <Card
            size="small"
            title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}><UserOutlined style={{ color: "#6366f1", marginRight: 6 }} />Customer</span>}
            styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
            style={{ marginBottom: 16, borderRadius: 12 }}
          >
            <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600, color: "#6b7280" }}>
              <Descriptions.Item label="Name">{order.customer?.name || "—"}</Descriptions.Item>
              <Descriptions.Item label="Email">{order.customer?.email || "—"}</Descriptions.Item>
              <Descriptions.Item label="Phone">{order.customer?.phone || "—"}</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Shipping Address */}
          <Card
            size="small"
            title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}><EnvironmentOutlined style={{ color: "#6366f1", marginRight: 6 }} />Shipping Address</span>}
            styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
            style={{ marginBottom: 16, borderRadius: 12 }}
          >
            {order.order_address ? (
              <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600, color: "#6b7280" }}>
                <Descriptions.Item label="Name">{order.order_address.name}</Descriptions.Item>
                <Descriptions.Item label="Phone">{order.order_address.phone}</Descriptions.Item>
                {order.order_address.email && (
                  <Descriptions.Item label="Email">{order.order_address.email}</Descriptions.Item>
                )}
                <Descriptions.Item label="Address">{order.order_address.address}</Descriptions.Item>
                <Descriptions.Item label="City">{order.order_address.city}</Descriptions.Item>
                <Descriptions.Item label="State">{order.order_address.state}</Descriptions.Item>
                <Descriptions.Item label="Pincode">{order.order_address.pincode}</Descriptions.Item>
                <Descriptions.Item label="Country">{order.order_address.country || "India"}</Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="No address" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          {/* ── Order Actions ── */}
          <Card
            size="small"
            title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>⚡ Order Actions</span>}
            styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
            style={{ borderRadius: 12 }}
          >
            <OrderActions order={order} reload={fetchData} />
          </Card>

        </Col>

        {/* ══════════ RIGHT — items + summary ══════════ */}
        <Col xs={24} lg={15}>

          {/* Products */}
          <Card
            size="small"
            style={{ marginBottom: 16, borderRadius: 12 }}
            styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🛒 Products ({order.items?.length ?? 0} items)</span>
                {!editingItems ? (
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => setEditingItems(true)}
                  >
                    Edit Items
                  </Button>
                ) : (
                  <Space size={6}>
                    <Button
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={handleCancelItems}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      icon={<SaveOutlined />}
                      loading={savingItems}
                      onClick={handleSaveItems}
                    >
                      Save Changes
                    </Button>
                  </Space>
                )}
              </div>
            }
          >
            {!order.items?.length ? (
              <Empty description="No items" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div>
                {/* column headers */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `52px 1fr ${editingItems ? "110px 90px" : "100px 60px"} 80px 36px`,
                  gap: 8,
                  padding: "0 4px 8px",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                }}>
                  <div />
                  <div>Product</div>
                  <div style={{ textAlign: "right" }}>Unit Price</div>
                  <div style={{ textAlign: "center" }}>Qty</div>
                  <div style={{ textAlign: "right" }}>Total</div>
                  <div />
                </div>

                {/* rows */}
                {order.items!.map((item: any) => {
                  const e      = editItems[item.id];
                  const qty    = e?.quantity ?? item.quantity;
                  const price  = e?.price    ?? Number(item.price);
                  const total  = qty * price;
                  const attrs  = item?.variation_data?.attrs || item?.variation?.attributes || null;

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: `52px 1fr ${editingItems ? "110px 90px" : "100px 60px"} 80px 36px`,
                        gap: 8,
                        alignItems: "center",
                        padding: "10px 4px",
                        borderBottom: "1px solid #fafafa",
                        background: editingItems ? "#fffbeb" : "transparent",
                        borderRadius: editingItems ? 6 : 0,
                        marginBottom: editingItems ? 2 : 0,
                        transition: "background 0.2s",
                      }}
                    >
                      {/* image */}
                      <Image
                        src={item.thumb}
                        width={48}
                        height={48}
                        style={{ objectFit: "cover", borderRadius: 6, border: "1px solid #f0f0f0" }}
                        preview={false}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                      />

                      {/* name + attrs */}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name}
                        </div>
                        {attrs && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                            {Object.entries(attrs).map(([k, v]: any) => (
                              <Tag key={k} style={{ fontSize: 11, margin: 0 }}>
                                {k}: <b>{v}</b>
                              </Tag>
                            ))}
                          </div>
                        )}
                        {item.msg && (
                          <Tag color="warning" style={{ fontSize: 11, marginTop: 4 }}>{item.msg}</Tag>
                        )}
                        {item.unit && (
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{item.unit}</div>
                        )}
                      </div>

                      {/* price — input in edit mode, text (+ original) in view mode */}
                      {editingItems ? (
                        <InputNumber
                          value={price}
                          min={0}
                          precision={2}
                          prefix={CURRENCY_ICON}
                          size="small"
                          style={{ width: "100%" }}
                          onChange={v => handleItemChange(item.id, "price", v ?? 0)}
                        />
                      ) : (
                        <div style={{ textAlign: "right", fontSize: 13 }}>
                          {item.original_price && Number(item.original_price) !== price && (
                            <div style={{ fontSize: 11, color: "#9ca3af", textDecoration: "line-through" }}>
                              {CURRENCY_ICON}{fmt(Number(item.original_price))}
                            </div>
                          )}
                          <span style={{ fontWeight: item.original_price ? 600 : 400, color: item.original_price ? "#d97706" : "inherit" }}>
                            {CURRENCY_ICON}{fmt(price)}
                          </span>
                        </div>
                      )}

                      {/* qty — input in edit mode, text (+ original) in view mode */}
                      {editingItems ? (
                        <InputNumber
                          value={qty}
                          min={1}
                          size="small"
                          style={{ width: "100%" }}
                          onChange={v => handleItemChange(item.id, "quantity", v ?? 1)}
                        />
                      ) : (
                        <div style={{ textAlign: "center", fontSize: 13 }}>
                          {item.original_quantity && item.original_quantity !== qty && (
                            <div style={{ fontSize: 11, color: "#9ca3af", textDecoration: "line-through" }}>
                              {item.original_quantity}
                            </div>
                          )}
                          <span style={{ fontWeight: item.original_quantity ? 600 : 400, color: item.original_quantity ? "#d97706" : "inherit" }}>
                            {qty}
                          </span>
                          {item.unit ? <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 2 }}>{item.unit}</span> : null}
                        </div>
                      )}

                      {/* row total */}
                      <div style={{ textAlign: "right", fontWeight: 600, fontSize: 13 }}>
                        {CURRENCY_ICON}{fmt(total)}
                      </div>

                      {/* delete — only visible in edit mode */}
                      {editingItems ? (
                        <Popconfirm
                          title="Remove this item?"
                          description="This cannot be undone."
                          onConfirm={() => handleDeleteItem(item.id)}
                          okText="Remove"
                          okButtonProps={{ danger: true }}
                        >
                          <Tooltip title="Remove item">
                            <Button danger icon={<DeleteOutlined />} size="small" type="text" />
                          </Tooltip>
                        </Popconfirm>
                      ) : <div />}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* ── Fees card ── */}
          <Card
            size="small"
            style={{ marginBottom: 16, borderRadius: 12 }}
            styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>💸 Additional Charges</span>
                {!editingFees ? (
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => setEditingFees(true)}
                  >
                    Edit Fees
                  </Button>
                ) : (
                  <Space size={6}>
                    <Button
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => setEditingFees(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      icon={<SaveOutlined />}
                      loading={savingFees}
                      onClick={handleSaveFees}
                    >
                      Save Fees
                    </Button>
                  </Space>
                )}
              </div>
            }
          >
            {!editingFees ? (
              /* ── read-only view ── */
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CarOutlined style={{ color: "#6b7280" }} />
                    <span style={{ color: "#6b7280", fontSize: 13 }}>Shipping Fee</span>
                    <span style={{ marginLeft: "auto", fontWeight: 600 }}>
                      {shippingFee > 0 ? `${CURRENCY_ICON}${fmt(shippingFee)}` : <span style={{ color: "#9ca3af" }}>Not set</span>}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <InboxOutlined style={{ color: "#6b7280" }} />
                    <span style={{ color: "#6b7280", fontSize: 13 }}>Packing Fee</span>
                    <span style={{ marginLeft: "auto", fontWeight: 600 }}>
                      {packingFee > 0 ? `${CURRENCY_ICON}${fmt(packingFee)}` : <span style={{ color: "#9ca3af" }}>Not set</span>}
                    </span>
                  </div>
                </Col>
              </Row>
            ) : (
              /* ── edit mode ── */
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Switch
                      size="small"
                      checked={useShipping}
                      onChange={v => { setUseShipping(v); if (!v) setShippingFee(0); }}
                    />
                    <CarOutlined />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>Shipping Fee</span>
                  </div>
                  <InputNumber
                    disabled={!useShipping}
                    value={shippingFee}
                    min={0}
                    precision={2}
                    prefix={CURRENCY_ICON}
                    placeholder="0.00"
                    style={{ width: "100%" }}
                    onChange={v => setShippingFee(v ?? 0)}
                  />
                </Col>
                <Col span={12}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Switch
                      size="small"
                      checked={usePacking}
                      onChange={v => { setUsePacking(v); if (!v) setPackingFee(0); }}
                    />
                    <InboxOutlined />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>Packing Fee</span>
                  </div>
                  <InputNumber
                    disabled={!usePacking}
                    value={packingFee}
                    min={0}
                    precision={2}
                    prefix={CURRENCY_ICON}
                    placeholder="0.00"
                    style={{ width: "100%" }}
                    onChange={v => setPackingFee(v ?? 0)}
                  />
                </Col>
              </Row>
            )}
          </Card>

          {/* ── Order Summary ── */}
          <Card
            size="small"
            title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🧾 Order Summary</span>}
            styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
            style={{ marginBottom: 16, borderRadius: 12 }}
          >
            <div style={{ fontSize: 14 }}>
              {[
                { label: "Subtotal", icon: <TagOutlined />, value: subtotal, bold: false },
                ...(discount > 0 ? [{ label: "Discount", icon: <PercentageOutlined />, value: -discount, bold: false, color: "#16a34a" }] : []),
                ...(shipping > 0 ? [{ label: "Shipping Fee", icon: <CarOutlined />, value: shipping, bold: false }] : []),
                ...(packing > 0  ? [{ label: "Packing Fee",  icon: <InboxOutlined />, value: packing,  bold: false }] : []),
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: (row as any).color || "inherit" }}>
                  <Space size={6} style={{ color: "#6b7280" }}>
                    {row.icon}
                    <span>{row.label}</span>
                  </Space>
                  <span style={{ fontWeight: row.bold ? 700 : 400 }}>
                    {row.value < 0 ? `- ${CURRENCY_ICON}${fmt(Math.abs(row.value))}` : `${CURRENCY_ICON}${fmt(row.value)}`}
                  </span>
                </div>
              ))}

              <Divider style={{ margin: "10px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
                <span>Grand Total</span>
                <span style={{ color: "#10b981" }}>{CURRENCY_ICON}{fmt(grandTotal)}</span>
              </div>
            </div>
          </Card>

        </Col>
      </Row>
    </div>
  );
};

export default OrderPage;
