"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { message } from "antd";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { IProduct } from "@/interfaces/Product";
import { ICatalog } from "@/interfaces/Catalog";
import { ICustomer, ICustomerDetail } from "@/interfaces/Customer";
import ProductGrid from "./components/ProductGrid";
import CartPanel from "./components/CartPanel";
import CustomerDrawer from "./components/CustomerDrawer";
import AddressModal from "./components/AddressModal";
import OrderSuccessModal from "./components/OrderSuccessModal";

export interface CartItem extends IProduct {
  cartQty: number;
}

export type PaymentMethod = "cod" | "online";

export interface AddressForm {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const POS_PAGE_SIZE = 24;

export default function POSPage() {
  // ── Products ───────────────────────────────────────
  const [catalogs, setCatalogs] = useState<ICatalog[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productPage, setProductPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ── Cart ───────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([]);

  // ── Customer ───────────────────────────────────────
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);

  // ── Checkout ───────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSubmitting  = useRef(false);

  // ── Fetch catalogs once ────────────────────────────
  useEffect(() => {
    api.get(`${API_ENDPOINTS.CATALOGS}?per_page=50`).then(({ data }) => {
      setCatalogs(data.data || []);
    }).catch(() => {});
  }, []);

  // ── Fetch products ─────────────────────────────────
  const fetchProducts = useCallback(async (page = 1, append = false) => {
    setProductLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(POS_PAGE_SIZE),
        order_by: "name",
        order_type: "asc",
      });
      if (search) params.set("q", search);
      if (selectedCatalogId) params.set("catalog_id", String(selectedCatalogId));

      const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}?${params}`);
      const items: IProduct[] = data.data || [];
      setProducts(prev => append ? [...prev, ...items] : items);
      setHasMore(page < (data.last_page || 1));
      setProductPage(page);
    } catch {
      // silent
    } finally {
      setProductLoading(false);
    }
  }, [search, selectedCatalogId]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchProducts(1, false), 300);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [fetchProducts]);

  // ── Cart helpers ───────────────────────────────────
  const getStep = (p: IProduct) => (p.min_quantity > 1 ? p.min_quantity : 1);
  const getMax  = (p: IProduct) => {
    const stockMax = p.is_stock && p.stock > 0 ? p.stock : 9999;
    const fieldMax = p.max_quantity > 0 ? p.max_quantity : 9999;
    return Math.min(stockMax, fieldMax);
  };

  const addToCart = (product: IProduct) => {
    if (product.is_stock && product.stock <= 0) {
      message.warning("This product is out of stock");
      return;
    }
    setCart(prev => {
      if (prev.find(i => i.id === product.id)) return prev;
      return [...prev, { ...product, cartQty: getStep(product) }];
    });
  };

  const changeQty = (productId: number, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id !== productId) return item;
        const step = getStep(item);
        const max  = getMax(item);
        const next = Math.max(step, Math.min(max, item.cartQty + delta));
        return { ...item, cartQty: next };
      })
    );
  };

  const removeFromCart = (productId: number) => setCart(prev => prev.filter(i => i.id !== productId));
  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((s, i) => s + parseFloat(i.price || "0") * i.cartQty, 0);
  const cartCount = cart.reduce((s, i) => s + i.cartQty, 0);

  // ── Checkout flow ──────────────────────────────────
  const handleCheckout = async () => {
    if (cart.length === 0) { message.warning("Cart is empty"); return; }
    if (isSubmitting.current) return;
    setCheckoutLoading(true);

    try {
      // Real customer (not walk-in) — check for existing address
      if (customer && customer.id > 0) {
        const { data } = await api.get<ICustomerDetail>(`${API_ENDPOINTS.CUSTOMERS}/${customer.id}`);
        if (data.address?.id) {
          await submitOrder(data.address.id);
          return;
        }
      }
      // Walk-in or no address → prompt for address
      setAddressModalOpen(true);
    } catch {
      message.error("Checkout failed, please try again");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleAddressSave = async (form: AddressForm) => {
    setCheckoutLoading(true);
    try {
      let customerId = customer?.id;

      // Walk-in customer: create one on the fly
      if (!customerId) {
        const { data } = await api.post(API_ENDPOINTS.CUSTOMERS, {
          name: "Walk-in Customer",
          phone: "0000000000",
        });
        customerId = data.id;
        setCustomer(data);
      }

      const { data: addr } = await api.post(
        `${API_ENDPOINTS.CUSTOMERS}/${customerId}/addresses`,
        { name: customer?.name || "Walk-in", phone: customer?.phone || "0000000000", ...form }
      );

      setAddressModalOpen(false);
      await submitOrder(addr.id, customerId);
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Failed to save address");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const submitOrder = async (addressId: number, overrideCustomerId?: number) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    try {
      const cid = overrideCustomerId ?? (customer && customer.id > 0 ? customer.id : undefined);
      const payload: Record<string, any> = {
        shipping_id: addressId,
        billing_id: addressId,
        payment_method: paymentMethod,
        channel: "pos",
        products: cart.map(item => ({
          product_id: item.id,
          variation_id: null,
          quantity: item.cartQty,
          msg: "",
        })),
      };
      if (cid) payload.customer_id = cid;

      const { data } = await api.post(API_ENDPOINTS.ORDERS, payload);
      setSuccessOrderId(data?.order?.id ?? data?.id ?? null);
      setSuccessModalOpen(true);
      clearCart();
      setCustomer(null);
      setPaymentMethod("cod");
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleNewOrder = () => {
    setSuccessModalOpen(false);
    setCustomer(null);
    setPaymentMethod("cod");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", overflow: "hidden", background: "#f8fafc" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", background: "#fff", borderBottom: "1px solid #e0e7ff",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg,#6366f1,#818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, color: "#fff", flexShrink: 0,
          }}>🖥️</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", lineHeight: 1.2 }}>Point of Sale</div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.3 }}>Create counter & walk-in orders instantly</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              style={{
                border: "1px solid #fca5a5", background: "#fef2f2",
                color: "#ef4444", borderRadius: 7, padding: "5px 12px",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              🗑 Clear Cart
            </button>
          )}
          <div style={{
            fontSize: 11, color: "#6366f1", background: "#eef2ff",
            border: "1px solid #c7d2fe", borderRadius: 6,
            padding: "4px 10px", fontWeight: 600,
          }}>
            {cart.length} item{cart.length !== 1 ? "s" : ""} · ₹{cartTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <ProductGrid
          products={products}
          catalogs={catalogs}
          selectedCatalogId={selectedCatalogId}
          loading={productLoading}
          search={search}
          cart={cart}
          hasMore={hasMore}
          onSearch={v => { setSearch(v); }}
          onSelectCatalog={id => { setSelectedCatalogId(id); }}
          onAddToCart={addToCart}
          onChangeQty={changeQty}
          onRemoveFromCart={removeFromCart}
          onLoadMore={() => fetchProducts(productPage + 1, true)}
        />

        <CartPanel
          cart={cart}
          customer={customer}
          paymentMethod={paymentMethod}
          cartTotal={cartTotal}
          cartCount={cartCount}
          checkoutLoading={checkoutLoading}
          onRemoveItem={removeFromCart}
          onChangeQty={changeQty}
          onOpenCustomerDrawer={() => setCustomerDrawerOpen(true)}
          onClearCustomer={() => setCustomer(null)}
          onSetPaymentMethod={setPaymentMethod}
          onCheckout={handleCheckout}
        />
      </div>

      <CustomerDrawer
        open={customerDrawerOpen}
        selectedCustomer={customer}
        onClose={() => setCustomerDrawerOpen(false)}
        onSelect={c => { setCustomer(c); setCustomerDrawerOpen(false); }}
      />

      <AddressModal
        open={addressModalOpen}
        loading={checkoutLoading}
        onClose={() => { setAddressModalOpen(false); setCheckoutLoading(false); }}
        onSave={handleAddressSave}
      />

      <OrderSuccessModal
        open={successModalOpen}
        orderId={successOrderId}
        onNewOrder={handleNewOrder}
        onClose={handleNewOrder}
      />
    </div>
  );
}
