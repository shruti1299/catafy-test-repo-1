"use client";

import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/api/endpoints';
import api from '@/api';
import { DatePicker, DatePickerProps, Empty, message, Segmented, Space, Table, TablePaginationConfig, TableProps, Tag } from 'antd';
import { IOrder } from '@/interfaces/Order';
import { CURRENCY_ICON } from '@/constant';
import dayjs from 'dayjs';
import Link from 'next/link';
import OrderActions from './orderActions';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { getOrderStatus, ORDER_STATUS } from '@/utils/orderStatus';
import { useUserContext } from '@/contexts/UserContext';
import { formatDateTimeAMPM } from '@/utils/helper';
import OrderPdf from './OrderPdf';

const DateFormat = "DD-MM-YYYY";

const OrderList = () => {
  const [total, setTotal]               = useState(0);
  const [currentPage, setCurrentPage]   = useState<number | undefined>(1);
  const [pageSize, setPageSize]         = useState<number | undefined>(20);
  const [keyword, setKeyword]           = useState("");
  const [loading, setLoading]           = useState(false);
  const [orders, setOrders]             = useState<IOrder[]>([]);
  const [selectedTab, setSelectedTab]   = useState("New");
  const [selectedDate, setSelectedDate] = useState("");
  const [orderBy, setOrderBy]           = useState("created_at");
  const [orderType, setOrderType]       = useState("desc");
  const { storeDetail }                 = useUserContext();
  const isB2CEnabled                    = storeDetail?.store?.is_b2c;

  const fetchOrders = async (page = currentPage) => {
    setLoading(true);
    try {
      const { data } = await api.get(API_ENDPOINTS.ORDERS, {
        params: {
          page,
          pageSize,
          q: keyword,
          order_date: selectedDate,
          status: selectedTab !== "All" ? ORDER_STATUS?.find(f => f.label === selectedTab)?.value : "",
          order_by: orderBy,
          setOrder_type: orderType,
        },
      });
      setOrders(data.data);
      setTotal(data.total);
    } catch {
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, pageSize, keyword, selectedTab, selectedDate]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IOrder> | SorterResult<IOrder>[]
  ) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    if (!Array.isArray(sorter) && sorter.field) {
      setOrderBy(sorter.field as string);
      setOrderType(sorter.order === "ascend" ? "asc" : "desc");
    }
  };

  const columns: TableProps<IOrder>['columns'] = [
    {
      title: 'Order',
      dataIndex: 's_no',
      sorter: true,
      render: (text, { id }) => (
        <Link href={`/orders/${id}`}>
          <span style={{ fontWeight: 600, fontSize: 12, color: '#6366f1' }}>#{text}</span>
        </Link>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      render: (c) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: '#eef2ff', color: '#6366f1',
            fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {c?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', lineHeight: '16px' }}>{c?.name}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{c?.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'order_datetime',
      render: (v) => (
        <span style={{ fontSize: 11, color: '#64748b' }}>{formatDateTimeAMPM(v)}</span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      render: (total) => (
        <span style={{ fontWeight: 700, fontSize: 13, color: '#10b981' }}>{CURRENCY_ICON}{total}</span>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items_count',
      render: (n) => (
        <span style={{ fontSize: 11, color: '#64748b' }}>{n} item{n !== 1 ? 's' : ''}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'tags',
      render: (_, { status, channel }) => (
        <Space size={4}>
          {isB2CEnabled && (
            <Tag
              color={channel === 'b2b' ? 'default' : 'geekblue'}
              style={{ fontSize: 10, borderRadius: 4, margin: 0, padding: '0 5px', lineHeight: '18px' }}
            >
              {channel}
            </Tag>
          )}
          <Tag
            color={getOrderStatus(status).tagColor}
            style={{ fontSize: 10, borderRadius: 4, margin: 0, padding: '0 5px', lineHeight: '18px' }}
          >
            {getOrderStatus(status).message}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'PDF',
      render: (_, record) => <OrderPdf order={record} />,
    },
    {
      title: '',
      render: (_, record) => (
        <OrderActions order={record} reload={() => fetchOrders(currentPage)} />
      ),
    },
  ];

  const onDateChange: DatePickerProps['onChange'] = (date) => {
    setSelectedDate(date ? date.format(DateFormat) : "");
  };

  return (
    <div>
      {/* Filter bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 14, flexWrap: 'wrap',
      }}>
        <Segmented<string>
          options={ORDER_STATUS.map(m => m.label)}
          size="small"
          value={selectedTab}
          onChange={setSelectedTab}
          className="order-status-segment"
          style={{ background: '#f1f5f9' }}
        />
        <DatePicker
          value={selectedDate ? dayjs(selectedDate, DateFormat) : null}
          onChange={onDateChange}
          disabledDate={(d) => d && d > dayjs().endOf('day')}
          allowClear
          size="small"
          style={{ width: 160 }}
          placeholder="Filter by date"
        />
      </div>

      <Table<IOrder>
        size="small"
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          size: 'small',
          pageSizeOptions: ['10', '20', '50'],
        }}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: <Empty description="No orders found" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />
    </div>
  );
};

export default OrderList;
