"use client";

import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/api/endpoints';
import api from '@/api';
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Empty,
  message,
  Row,
  Segmented,
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag
} from 'antd';
import dayjs from 'dayjs';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { WhatsAppOutlined } from '@ant-design/icons';
import Link from 'next/link';

const DateFormat = "DD-MM-YYYY";

const EnquiryList = () => {
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([] as any[]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [orderBy, setOrderBy] = useState("created_at");
  const [orderType, setOrderType] = useState("desc");

  const ENQUIRY_STATUS = [
    { value: "", label: "All" },
    { value: 2, label: "New Enquiry" },
    { value: 1, label: "Solved" },
  ];

  const fetchEnquiry = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const { data } = await api.get(API_ENDPOINTS.ENQUIRES, {
        params: {
          page,
          pageSize,
          q: keyword,
          enquiry_date: selectedDate,
          status: selectedTab !== "All" ? ENQUIRY_STATUS.find(f => f.label === selectedTab)?.value : "",
          order_by: orderBy,
          order_type: orderType
        },
      });
      setOrders(data.data);
      setTotal(data.total);
    } catch {
      message.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiry(currentPage, pageSize);
  }, [currentPage, pageSize, keyword, selectedTab, selectedDate]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[]
  ) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 20);

    if (!Array.isArray(sorter)) {
      const sortField = sorter.field as string;
      const sortOrder = sorter.order === "ascend" ? "asc" : sorter.order === "descend" ? "desc" : undefined;
      if (sortField) setOrderBy(sortField);
      if (sortOrder) setOrderType(sortOrder);
    }
  };

  const columns: TableProps<any>['columns'] = [
    {
      title: 'S.No.',
      key: 'serial',
      render: (_, __, index) => ((currentPage - 1) * pageSize) + index + 1,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <Space direction="vertical">
          <b>{record.customer?.name}</b>
          <span>{record.customer?.phone}</span>
        </Space>
      ),
    },
    {
      title: 'Total Products',
      key: 'product_ids',
      dataIndex: 'product_ids',
      render: (product_ids) => (
        <Space>
          <span>{product_ids?.length} items</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 2) return <Tag color="blue">New Enquiry</Tag>;
        if (status === 1) return <Tag color="green">Solved</Tag>;
        return <Tag>Unknown</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const phone = record.customer?.phone;
        const name = record.customer?.name || '';
        const message = `Hi ${encodeURIComponent(name)}`;
        const whatsappURL = `https://wa.me/91${phone}?text=${message}`;
        return (
        <Space>
          <Link href={`/enquiry/${record.id}`}> <Button type="link">View more</Button></Link>
          <Button
            icon={<WhatsAppOutlined style={{ color: 'green' }} />}
            onClick={() => window.open(whatsappURL, "_blank")}
          />
          </Space>
        );
      }
    },
  ];

  const onChange: DatePickerProps['onChange'] = (date) => {
    if (date) {
      setSelectedDate(date.format(DateFormat));
    } else {
      setSelectedDate("");
    }
  };

  const disabledDate = (current: dayjs.Dayjs) => current && current > dayjs().endOf('day');

  return (
    <Space direction="vertical" className="w-100" size="large">
      <Row justify="space-between" gutter={[20, 20]}>
        <Col xs={24} md={16}>
          <Segmented<string>
            options={ENQUIRY_STATUS.map(m => m.label)}
            size="large"
            value={selectedTab}
            onChange={(value) => setSelectedTab(value)}
            className="order-status-segment"
          />
        </Col>
        <Col xs={24} md={8}>
          <DatePicker
            value={selectedDate ? dayjs(selectedDate, DateFormat) : null}
            style={{ width: "100%" }}
            onChange={onChange}
            disabledDate={disabledDate}
            allowClear={true}
          />
        </Col>
      </Row>

      <Table<any>
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: <Empty description="No enquiries found" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />
    </Space>
  );
};

export default EnquiryList;
