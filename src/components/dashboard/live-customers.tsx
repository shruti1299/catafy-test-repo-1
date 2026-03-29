'use client';

import React from 'react';
import { Button, Card } from "antd";
import useSWR from 'swr';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Legend,
} from 'chart.js';
import api from '@/api';
import { dateTimeHumanize } from '@/utils/helper';
import Link from 'next/link';
import LiveIcon from '../common/liveIcon';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Legend);

const fetcher = (url: string) => api.get(url).then(r => r.data);
const POLL_INTERVAL = 15000;

const LiveStats: React.FC<{ }> = () => {
  const { data: liveData, mutate: mutateLive, isLoading: liveLoading } = useSWR(
    `/live`,
    fetcher,
    { refreshInterval: POLL_INTERVAL }
  );

  return (
    <>
      <Card
        title={<LiveIcon />}
        loading={liveLoading}
        style={{ borderRadius: 8 }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center", justifyContent: "space-between", marginBottom: 15 }}>
          <span style={{ fontSize: 22, fontWeight: 600 }}>
            {liveData?.total_active ?? 0}
            {/* <span style={{ color: "#888", marginLeft:10, fontSize:15 }}> customers </span> */}
          </span>
          <span style={{ color: "#888", fontSize: 12 }}>
            last updated at {liveData?.since ? dateTimeHumanize(liveData.since) : "No activity yet"}
          </span>
        </div>

        <Link href={"/live"}>
          <Button style={{ margin: 0, position: "absolute", right: 10, bottom: 5 }} type="link">View more</Button>
        </Link>
      </Card>
    </>
  );
};

export default LiveStats;
