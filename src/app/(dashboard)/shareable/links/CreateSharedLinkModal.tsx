import React, { useState, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Drawer,
  List,
  Avatar,
  Button,
  Space,
  Typography,
  Checkbox,
  Divider,
} from "antd";
import type { Dayjs } from "dayjs";
import {
  DeleteOutlined,
  DragOutlined,
} from "@ant-design/icons";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { createSharedLink } from "./api";
import { IProduct } from "@/interfaces/Product";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useDebounce } from "@/utils/useDebounce";
import { CURRENCY_ICON } from "@/constant";

const { Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  name?: string;
  product_ids: number[];
  expires_at?: Dayjs;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

const CreateSharedLinkModal: React.FC<Props> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSearchIds, setSelectedSearchIds] = useState<number[]>([]);

  /* ------------------ SEARCH (DEBOUNCED) ------------------ */
const searchProducts = async (keyword: string) => {
  if (!keyword) {
    setSearchResults([]);
    return;
  }
  const res = await api.get<PaginatedResponse<IProduct>>(API_ENDPOINTS.PRODUCTS, {
    params: {
      q: keyword,        // 🔑 match backend
      page_size: 20,     // 🔑 paginator
      page: 1,
    },
  });

  // ✅ Laravel paginator → array
  setSearchResults(res.data?.data ?? []);
  setSelectedSearchIds([]);
};

  const debouncedSearch = useCallback(
    useDebounce(searchProducts, 400),
    []
  );

  /* ------------------ ADD PRODUCTS ------------------ */
  const addProducts = (products: IProduct[]) => {
    const merged = [
      ...selectedProducts,
      ...products.filter(
        (p) =>
          !selectedProducts.some((s) => s.id === p.id)
      ),
    ];

    setSelectedProducts(merged);
    form.setFieldValue(
      "product_ids",
      merged.map((p) => p.id)
    );
  };

  const selectAllFromSearch = () => {
    const products = searchResults.filter((p) =>
      selectedSearchIds.includes(p.id)
    );
    addProducts(products);
    message.success(
      `${products.length} products added`
    );
  };

  /* ------------------ REMOVE ------------------ */
  const removeProduct = (id: number) => {
    const updated = selectedProducts.filter(
      (p) => p.id !== id
    );
    setSelectedProducts(updated);
    form.setFieldValue(
      "product_ids",
      updated.map((p) => p.id)
    );
  };

  const removeAll = () => {
    setSelectedProducts([]);
    form.setFieldValue("product_ids", []);
  };

  /* ------------------ SUBMIT ------------------ */
  const submit = async () => {
    const values = await form.validateFields();
    setLoading(true);

    await createSharedLink({
      name: values.name,
      product_ids: values.product_ids,
      expires_at: values.expires_at?.format("YYYY-MM-DD"),
    });

    message.success("Shared link created");
    form.resetFields();
    setSelectedProducts([]);
    onClose();
    onSuccess();
    setLoading(false);
  };

  return (
    <>
      <Modal
        title="Create New Link"
        open={open}
        onCancel={onClose}
        onOk={submit}
        confirmLoading={loading}
        width={720}
      >
        <Divider />
        <Form form={form} layout="vertical">
          <Form.Item label="Link Name" name="name">
            <Input placeholder="Wholesale Toys for Retailer" />
          </Form.Item>

          {/* SEARCH ONLY */}
          <Form.Item
            label={
              <Space>
                Search Products
                {selectedProducts.length > 0 && (
                  <Button
                    size="small"
                    type="link"
                    onClick={() => setDrawerOpen(true)}
                  >
                    Selected ({selectedProducts.length})
                  </Button>
                )}
              </Space>
            }
            name="product_ids"
            rules={[
              { required: true, message: "Add products" },
            ]}
          >
            <Select
              showSearch
              filterOption={false}
              placeholder="Type product name / SKU"
              onSearch={debouncedSearch}
              onChange={(ids) =>
                setSelectedSearchIds(ids as number[])
              }
              mode="multiple"
              value={selectedSearchIds}
              options={searchResults?.map((p) => ({
                value: p.id,
                label: (
                  <Space>
                    <Avatar
                      src={p.image}
                      shape="square"
                      size={32}
                    />
                    <div>
                      <Text>{p.name}</Text>
                      <br />
                      <Text type="secondary">
                        Price: {CURRENCY_ICON}{p.price}
                      </Text>
                    </div>
                  </Space>
                ),
              }))}
            />
          </Form.Item>

          {selectedSearchIds.length > 0 && (
            <Button onClick={selectAllFromSearch} style={{marginBottom:20}}>
              Add Selected from Search
            </Button>
          )}

          <Form.Item label="Expiry Date" name="expires_at">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* DRAWER */}
      <Drawer
        title={
          <Space>
            Selected Products ({selectedProducts.length})
            <Button danger size="small" onClick={removeAll}>
              Remove All
            </Button>
          </Space>
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={450}
      >
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return;
            setSelectedProducts((items) =>
              arrayMove(
                items,
                items.findIndex((i) => i.id === active.id),
                items.findIndex((i) => i.id === over.id)
              )
            );
          }}
        >
          <SortableContext
            items={selectedProducts.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <List
              dataSource={selectedProducts}
              renderItem={(item) => (
                <SortableItem
                  key={item.id}
                  product={item}
                  onRemove={removeProduct}
                />
              )}
            />
          </SortableContext>
        </DndContext>
      </Drawer>
    </>
  );
};

export default CreateSharedLinkModal;

/* ------------------ SORTABLE ITEM ------------------ */
const SortableItem = ({
  product,
  onRemove,
}: {
  product: IProduct;
  onRemove: (id: number) => void;
}) => {

  return (
    <List.Item
      actions={[
        <Button
          danger
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => onRemove(product.id)}
        />,
      ]}
    >
      <List.Item.Meta
        avatar={
          <Avatar src={product.image} shape="square" />
        }
        title={product.name}
        description={`Price: ${CURRENCY_ICON}${product.price}`}
      />
    </List.Item>
  );
};
