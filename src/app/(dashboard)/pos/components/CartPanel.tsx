"use client";

import { CartItem, PaymentMethod } from "../page";
import { ICustomer } from "@/interfaces/Customer";
import { Button, Empty } from "antd";
import { UserOutlined, CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Link from "next/link";

interface IProps {
  cart: CartItem[];
  customer: ICustomer | null;
  paymentMethod: PaymentMethod;
  cartTotal: number;
  cartCount: number;
  checkoutLoading: boolean;
  onRemoveItem: (id: number) => void;
  onChangeQty: (id: number, delta: number) => void;
  onOpenCustomerDrawer: () => void;
  onClearCustomer: () => void;
  onSetPaymentMethod: (m: PaymentMethod) => void;
  onCheckout: () => void;
}

const PLACEHOLDER = "https://placehold.co/48x48/eef2ff/6366f1?text=P";

export default function CartPanel({
  cart, customer, paymentMethod, cartTotal, cartCount,
  checkoutLoading, onRemoveItem, onChangeQty,
  onOpenCustomerDrawer, onClearCustomer, onSetPaymentMethod, onCheckout,
}: IProps) {
  return (
    <div style={{
      width: 320, flexShrink: 0,
      display: "flex", flexDirection: "column",
      background: "#fff", overflow: "hidden",
    }}>
      {/* ── Cart header ── */}
      <div style={{
        padding: "12px 14px 10px",
        borderBottom: "1px solid #f1f5f9",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <ShoppingCartOutlined style={{ fontSize: 15, color: "#6366f1" }} />
          <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>
            Order Cart
          </span>
          {cart.length > 0 && (
            <span style={{
              marginLeft: "auto",
              fontSize: 10, fontWeight: 700,
              background: "#eef2ff", color: "#6366f1",
              borderRadius: 10, padding: "1px 7px",
            }}>
              {cartCount} item{cartCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Customer selector */}
        <div
          onClick={onOpenCustomerDrawer}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 10px", borderRadius: 8, cursor: "pointer",
            border: customer ? "1.5px solid #6366f1" : "1.5px dashed #cbd5e1",
            background: customer ? "#eef2ff" : "#f8fafc",
            transition: "all 0.15s",
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: customer ? "#6366f1" : "#e2e8f0",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <UserOutlined style={{ fontSize: 13, color: customer ? "#fff" : "#94a3b8" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: customer ? "#1e1b4b" : "#94a3b8", lineHeight: 1.2 }}>
              {customer ? customer.name : "Select Customer"}
            </div>
            {customer && (
              <div style={{ fontSize: 10, color: "#6366f1", lineHeight: 1.2 }}>{customer.phone}</div>
            )}
          </div>
          {customer ? (
            <button
              onClick={e => { e.stopPropagation(); onClearCustomer(); }}
              style={{
                border: "none", background: "transparent", cursor: "pointer",
                color: "#94a3b8", padding: 2, fontSize: 11,
              }}
            >
              <CloseOutlined />
            </button>
          ) : (
            <span style={{ fontSize: 10, color: "#6366f1", fontWeight: 600 }}>+ Select</span>
          )}
        </div>
      </div>

      {/* ── Cart items ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {cart.length === 0 ? (
          <div style={{ padding: "40px 20px" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  No items in cart.<br />Add products from the left.
                </span>
              }
            />
          </div>
        ) : (
          cart.map(item => {
            const step = item.min_quantity > 1 ? item.min_quantity : 1;
            const price = parseFloat(item.price || "0");
            const lineTotal = price * item.cartQty;

            return (
              <div
                key={item.id}
                style={{
                  display: "flex", gap: 8,
                  padding: "8px 14px",
                  borderBottom: "1px solid #f8fafc",
                  alignItems: "flex-start",
                }}
              >
                {/* Image */}
                <img
                  src={item.image || PLACEHOLDER}
                  onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                  alt={item.name}
                  style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover", flexShrink: 0, border: "1px solid #e2e8f0" }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: "#0f172a",
                    lineHeight: 1.3, marginBottom: 4,
                    overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                  }}>
                    {item.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Stepper */}
                    <div style={{
                      display: "inline-flex", alignItems: "center",
                      border: "1px solid #e0e7ff", borderRadius: 6, overflow: "hidden",
                    }}>
                      <button
                        onClick={() => {
                          if (item.cartQty <= step) onRemoveItem(item.id);
                          else onChangeQty(item.id, -step);
                        }}
                        style={{
                          width: 24, height: 24, border: "none",
                          background: "#f8fafc", cursor: "pointer",
                          fontSize: 14, color: "#6366f1", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >−</button>
                      <span style={{
                        minWidth: 24, textAlign: "center",
                        fontSize: 12, fontWeight: 700, color: "#1e1b4b",
                        padding: "0 2px",
                      }}>{item.cartQty}</span>
                      <button
                        onClick={() => onChangeQty(item.id, step)}
                        style={{
                          width: 24, height: 24, border: "none",
                          background: "#6366f1", cursor: "pointer",
                          fontSize: 14, color: "#fff", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >+</button>
                    </div>

                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1e1b4b" }}>
                      ₹{lineTotal % 1 === 0 ? lineTotal.toFixed(0) : lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  style={{
                    border: "none", background: "transparent", cursor: "pointer",
                    color: "#cbd5e1", padding: 2, fontSize: 12, marginTop: 2, flexShrink: 0,
                  }}
                >
                  <CloseOutlined />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* ── Footer: payment + totals + checkout ── */}
      {cart.length > 0 && (
        <div style={{
          borderTop: "1px solid #e0e7ff", padding: "12px 14px", flexShrink: 0,
          background: "#fff",
        }}>
          {/* Payment method */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Payment Method
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["cod", "online"] as PaymentMethod[]).map(m => (
                <button
                  key={m}
                  onClick={() => onSetPaymentMethod(m)}
                  style={{
                    flex: 1, padding: "7px 6px", borderRadius: 8,
                    border: paymentMethod === m ? "1.5px solid #6366f1" : "1px solid #e2e8f0",
                    background: paymentMethod === m ? "#eef2ff" : "#f8fafc",
                    color: paymentMethod === m ? "#4f46e5" : "#64748b",
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {m === "cod" ? "💵 Cash" : "💳 Online"}
                </button>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div style={{
            background: "#f8fafc", borderRadius: 8,
            padding: "10px 12px", marginBottom: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Subtotal</span>
              <span style={{ fontSize: 12, color: "#0f172a", fontWeight: 600 }}>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Total</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#6366f1" }}>₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout button */}
          <Button
            type="primary"
            block
            size="large"
            loading={checkoutLoading}
            onClick={onCheckout}
            style={{
              background: "linear-gradient(90deg,#6366f1,#818cf8)",
              border: "none", borderRadius: 9,
              fontWeight: 700, fontSize: 14, height: 44,
            }}
          >
            {checkoutLoading ? "Placing Order…" : `Place Order · ₹${cartTotal.toFixed(2)}`}
          </Button>
        </div>
      )}
    </div>
  );
}
