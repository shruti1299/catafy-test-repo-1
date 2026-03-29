"use client";

import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Table } from "antd";
import { useEffect, useState } from "react";

export default function Messages() {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
  };

  const columns = [

    { title: "Phone", dataIndex: "customer_phone" },

    { title: "Template", dataIndex: "template_name" },

    { title: "Status", dataIndex: "status" },

    { title: "Created", dataIndex: "created_at" }

  ];

  return <Table rowKey="id" columns={columns} dataSource={data} />;

}