"use client";

import { IProduct } from "@/interfaces/Product";
import { ICatalog } from "@/interfaces/Catalog";
import { CartItem } from "../page";
import { Input, Spin, Empty, Button } from "antd";
import { SearchOutlined, PlusOutlined, MinusOutlined, LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";

interface IProps {
  products: IProduct[];
  catalogs: ICatalog[];
  selectedCatalogId: number | null;
  loading: boolean;
  search: string;
  cart: CartItem[];
  hasMore: boolean;
  onSearch: (s: string) => void;
  onSelectCatalog: (id: number | null) => void;
  onAddToCart: (p: IProduct) => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemoveFromCart: (id: number) => void;
  onLoadMore: () => void;
}

const PLACEHOLDER = "https://placehold.co/120x120/eef2ff/6366f1?text=No+Img";

function ProductCard({
  product, cartItem, onAdd, onInc, onDec,
}: {
  product: IProduct;
  cartItem?: CartItem;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}) {
  const outOfStock = product.is_stock && product.stock <= 0;
  const price = parseFloat(product.price || "0");
  const inCart = !!cartItem;

  return (
    <div
      style={{
        background: "#fff",
        border: inCart ? "1.5px solid #6366f1" : "1px solid #e2e8f0",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.15s ease",
        boxShadow: inCart ? "0 0 0 3px #eef2ff" : "0 1px 3px rgba(0,0,0,0.04)",
        position: "relative",
        cursor: outOfStock ? "not-allowed" : "pointer",
        opacity: outOfStock ? 0.6 : 1,
      }}
    >
      {/* In-cart badge */}
      {inCart && (
        <div style={{
          position: "absolute", top: 6, right: 6, zIndex: 2,
          background: "#6366f1", color: "#fff",
          borderRadius: 10, fontSize: 10, fontWeight: 700,
          padding: "1px 6px", lineHeight: "16px",
        }}>
          {cartItem.cartQty} in cart
        </div>
      )}

      {/* Image */}
      <div style={{
        width: "100%", aspectRatio: "1/1",
        background: "#f8fafc",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <img
          src={product.image || PLACEHOLDER}
          alt={product.name}
          onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: "8px 8px 6px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: "#0f172a",
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          lineHeight: 1.35, minHeight: "2.7em",
        }}>
          {product.name}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e1b4b" }}>
            {price === 0 ? "Enquire" : `₹${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}`}
          </span>
          {product.is_stock ? (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
              background: product.stock > 0 ? "#dcfce7" : "#fee2e2",
              color: product.stock > 0 ? "#16a34a" : "#dc2626",
            }}>
              {product.stock > 0 ? `${product.stock} left` : "OUT"}
            </span>
          ) : null}
        </div>

        {product.min_quantity > 1 && (
          <div style={{ fontSize: 10, color: "#94a3b8" }}>
            Min: {product.min_quantity} {product.unit || "pcs"}
          </div>
        )}
      </div>

      {/* Action */}
      <div style={{ padding: "0 8px 8px" }}>
        {outOfStock ? (
          <div style={{
            textAlign: "center", fontSize: 11, fontWeight: 600,
            color: "#94a3b8", padding: "5px 0",
          }}>
            Out of Stock
          </div>
        ) : inCart ? (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#eef2ff", borderRadius: 7, overflow: "hidden",
          }}>
            <button
              onClick={e => { e.stopPropagation(); onDec(); }}
              style={{
                width: 30, height: 30, border: "none", background: "transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#6366f1", fontSize: 14, fontWeight: 700,
              }}
            >−</button>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5", minWidth: 24, textAlign: "center" }}>
              {cartItem.cartQty}
            </span>
            <button
              onClick={e => { e.stopPropagation(); onInc(); }}
              style={{
                width: 30, height: 30, border: "none",
                background: "#6366f1", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 14, fontWeight: 700, borderRadius: "0 7px 7px 0",
              }}
            >+</button>
          </div>
        ) : (
          <button
            onClick={e => { e.stopPropagation(); onAdd(); }}
            style={{
              width: "100%", padding: "5px 0", border: "1.5px solid #6366f1",
              background: "#fff", color: "#6366f1", borderRadius: 7,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              transition: "all 0.15s",
            }}
          >
            <PlusOutlined style={{ fontSize: 10 }} /> Add
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductGrid({
  products, catalogs, selectedCatalogId, loading, search, cart,
  hasMore, onSearch, onSelectCatalog, onAddToCart, onChangeQty, onRemoveFromCart, onLoadMore,
}: IProps) {
  const cartMap = Object.fromEntries(cart.map(i => [i.id, i]));

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
      borderRight: "1px solid #e0e7ff",
    }}>
      {/* ── Search + Catalog chips ── */}
      <div style={{ padding: "10px 12px 0", background: "#fff", flexShrink: 0 }}>
        <Input
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          placeholder="Search products by name…"
          value={search}
          onChange={e => onSearch(e.target.value)}
          allowClear
          style={{ borderRadius: 8, marginBottom: 10 }}
        />

        {/* Catalog filter chips */}
        {catalogs.length > 0 && (
          <div style={{
            display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10,
            scrollbarWidth: "none",
          }}>
            {[{ id: null, name: "All" }, ...catalogs].map(cat => {
              const active = selectedCatalogId === cat.id;
              return (
                <button
                  key={cat.id ?? "all"}
                  onClick={() => onSelectCatalog(cat.id as number | null)}
                  style={{
                    flexShrink: 0, padding: "4px 12px", borderRadius: 20,
                    border: active ? "1.5px solid #6366f1" : "1px solid #e2e8f0",
                    background: active ? "#6366f1" : "#fff",
                    color: active ? "#fff" : "#64748b",
                    fontSize: 12, fontWeight: active ? 600 : 500,
                    cursor: "pointer", whiteSpace: "nowrap",
                    transition: "all 0.15s",
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Product grid ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px 12px" }}>
        {loading && products.length === 0 ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 28, color: "#6366f1" }} spin />} />
          </div>
        ) : products.length === 0 ? (
          <Empty
            description={<span style={{ color: "#94a3b8", fontSize: 13 }}>No products found</span>}
            style={{ marginTop: 60 }}
          />
        ) : (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 10,
            }}>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartItem={cartMap[product.id]}
                  onAdd={() => onAddToCart(product)}
                  onInc={() => onChangeQty(product.id, product.min_quantity > 1 ? product.min_quantity : 1)}
                  onDec={() => {
                    const item = cartMap[product.id];
                    if (!item) return;
                    const step = product.min_quantity > 1 ? product.min_quantity : 1;
                    if (item.cartQty <= step) {
                      onRemoveFromCart(product.id);
                    } else {
                      onChangeQty(product.id, -step);
                    }
                  }}
                />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Button
                  onClick={onLoadMore}
                  loading={loading}
                  style={{ borderColor: "#6366f1", color: "#6366f1", borderRadius: 8 }}
                >
                  Load more products
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
