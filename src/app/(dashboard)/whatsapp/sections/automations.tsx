"use client";

import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Table, Switch } from "antd";
import { useEffect, useState } from "react";

export default function Automations(){

  const [data,setData] = useState([]);

  const load = async()=>{
  };

  useEffect(()=>{
    load();
  },[]);

  const toggle = async(record:any)=>{
    load();
  };

  const columns = [
    {
      title:"Event",
      dataIndex:"event_key"
    },

    {
      title:"Template",
      dataIndex:"template_name"
    },

    {
      title:"Enabled",
      render:(_:any,record:any)=>(
        <Switch
          checked={record.enabled}
          onChange={()=>toggle(record)}
        />
      )
    }

  ];

  return <Table rowKey="id" columns={columns} dataSource={data}/>;

}