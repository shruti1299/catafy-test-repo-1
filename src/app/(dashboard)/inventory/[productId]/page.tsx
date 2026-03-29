"use client";

import BackButton from "@/components/common/back-button";
import ProductDetail from "@/components/product/product-detail";
import { useParams } from "next/navigation";

const ProductPage = () => {
  const { productId = 0} = useParams();

  return (
    <div>
      <BackButton />
      <ProductDetail
        isLoading={false}
        showImage={false}
        productId={+productId}
        type="show_image_desc"
      />
    </div>
  );
};

export default ProductPage;
