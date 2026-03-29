"use client";

import React, { useState, useEffect } from "react";
import { Table, Tag, Card, Space, Button, Drawer, Popconfirm, message, Alert, DatePicker, Empty } from "antd";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { FileExcelOutlined, FileTextOutlined } from "@ant-design/icons";
import { API_ENDPOINTS } from "@/api/endpoints";
import api from "@/api";
import { IReport, IReportList } from "@/interfaces/Report";
import CreateReportForm from "@/components/report/create-report-form";

const ReportsTable: React.FC = () => {
  const [reports, setReports] = useState<IReportList>({} as IReportList);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(API_ENDPOINTS.REPORTS, {
        params: {
          page: currentPage,
          pageSize: pageSize,
          created_at: selectedDate,
        },
      });

      setReports(data);
      setTotal(data.total);
    } catch {
      message.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, selectedDate]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`${API_ENDPOINTS.REPORTS}/${id}`);
      message.success("Report deleted");
      fetchData();
    } catch {
      message.error("Delete failed");
    }
  };

  const columns: ColumnsType<IReport> = [
    {
      title: "S.No",
      key: "index",
      render: (_, __, index) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const isExcel = type?.toLowerCase().includes("excel") || type?.toLowerCase().includes("xls");
        return (
          <Tag icon={isExcel ? <FileExcelOutlined /> : <FileTextOutlined />} color={isExcel ? "green" : "blue"}>
            {type || "—"}
          </Tag>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => dayjs(date).format("DD MMM YYYY, HH:mm"),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => (
        <>
          {status === 1 && <Tag color="green">Success</Tag>}
          {status === 0 && <Tag color="orange">Processing</Tag>}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          {record.status === 1 && (
            <Button
              href={record.url}
              target="_blank"
              size="small"
              type="primary"
            >
              Download
            </Button>
          )}

          <Popconfirm
            title="Delete report?"
            description="Are you sure you want to delete this report?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>📋 Your Reports</span>}
      className="mb-100"
      loading={loading}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
      style={{ borderRadius: 12 }}
      extra={
        <Space size={8}>
          <DatePicker
            size="small"
            placeholder="Filter by date"
            allowClear
            onChange={(date) => {
              setSelectedDate(date ? date.format("YYYY-MM-DD") : null);
              setCurrentPage(1);
            }}
          />
          <Button
            size="small"
            type="primary"
            onClick={() => setOpen(true)}
            style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" }}
          >
            + Create New
          </Button>
        </Space>
      }
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16, borderRadius: 8 }}
        message="What are Reports?"
        description="Generate and download data exports for your store — orders, customers, inventory and more. Reports are generated in the background; once ready you can download them as Excel or CSV files."
      />
      <Table
        size="small"
        scroll={{ x: "max-content" }}
        dataSource={reports?.data}
        columns={columns}
        rowKey="id"
        loading={loading}
        locale={{ emptyText: <Empty description="No reports yet — create your first report above" /> }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          size: "small",
          showSizeChanger: true,
          pageSizeOptions: ["10", "20"],
        }}
        onChange={handleTableChange}
      />

      <Drawer
        width={"45%"}
        title={<span style={{ fontWeight: 700 }}>Create New Report</span>}
        onClose={() => setOpen(false)}
        open={open}
      >
        <CreateReportForm />
      </Drawer>
    </Card>
  );
};

export default ReportsTable;