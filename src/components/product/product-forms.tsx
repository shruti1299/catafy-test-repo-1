import { IProduct } from '@/interfaces/Product'
import { Segmented } from 'antd'
import React, { useState } from 'react'
import UpdateProductForm from './update-product-form';
import ProductMedia from './product-media';
import ProductDiscount from './product-discount';
import ProductDeafultImage from './product-default-image';
import ProductVariation from './product-variation';
import { useUserContext } from '@/contexts/UserContext';

interface IProps {
  product: IProduct;
  type?: "default" | "only_content";
  showImage?: boolean;
  onReload?: any;
}

const TAB_HINTS: Record<string, string> = {
  "Basic": "Update product name, price, stock, categories, tags and other core details",
  "Media": "Add gallery photos & a product video — these appear alongside the cover image in the product page (max 4 photos + 1 video)",
  "Discounts": "Set bulk discount rules — reward buyers who order larger quantities",
  "Variations": "Manage size, color and other variants — each with its own price and stock",
};

export default function ProductForms({ product, type, showImage, onReload }: IProps) {
  const [selectedTab, setSelectedTab] = useState("Basic");
  const { storeDetail } = useUserContext();
  const IS_VARIATION_ALLOWED = storeDetail?.store?.is_variation ? true : false;
  const OPTIONS = IS_VARIATION_ALLOWED
    ? [
        { label: "📋 Basic Info", value: "Basic" },
        { label: "📷 Media", value: "Media" },
        { label: "🏷️ Discounts", value: "Discounts" },
        { label: "🎨 Variations", value: "Variations" },
      ]
    : [
        { label: "📋 Basic Info", value: "Basic" },
        { label: "📷 Media", value: "Media" },
        { label: "🏷️ Discounts", value: "Discounts" },
      ];

  return (
    <>
      {showImage == true ? (
        <ProductDeafultImage image={product.image} productId={product.id} onReload={onReload} />
      ) : (
        <></>
      )}

      <Segmented
        value={selectedTab}
        onChange={(value) => setSelectedTab(value)}
        options={OPTIONS}
        block
        style={{ marginBottom: 0 }}
      />

      {/* Tab hint bar */}
      <div
        style={{
          padding: "7px 14px",
          background: "#f8faff",
          border: "1px solid #e0e7ff",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 11, color: "#6366f1" }}>
          {TAB_HINTS[selectedTab]}
        </span>
      </div>

      {selectedTab == "Basic" && (
        <UpdateProductForm product={product} afterSuccess={() => {}} type={type} />
      )}
      {selectedTab == "Media" && (
        <ProductMedia productId={product.id} media={product?.media} />
      )}
      {selectedTab == "Discounts" && (
        <>
          <ProductDiscount product={product} />
        </>
      )}
      {IS_VARIATION_ALLOWED && selectedTab == "Variations" && (
        <>
          <ProductVariation product={product} />
        </>
      )}
    </>
  );
}
