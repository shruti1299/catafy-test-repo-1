"use client";

import { Table } from "antd";

interface AnalyticsTableProps {
  loading: boolean;
  data: any[];
  columns: any[];
  rowKey: string;
}

export const AnalyticsTable = ({ loading, data, columns, rowKey }: AnalyticsTableProps) => {
  return (
    <>
      <Table
        loading={loading}
        dataSource={data}
        columns={columns}
        rowKey={rowKey}
        pagination={false}
      />
    </>
  );
};
