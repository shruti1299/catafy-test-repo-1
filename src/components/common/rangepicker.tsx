import React from 'react';
import {DatePicker} from 'antd';
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface IProps{
    dates : [Dayjs | null, Dayjs | null] | null;
    setDates: any;
}


const RangePicker = ({dates, setDates}:IProps) => {
    const presets = [
        { label: "Today", value: [dayjs(), dayjs()] as [Dayjs, Dayjs] },
        { label: "This Month", value: [dayjs().startOf("month"), dayjs().endOf("month")] as [Dayjs, Dayjs] },
        { label: "Last 7 Days", value: [dayjs().subtract(7, "day"), dayjs()] as [Dayjs, Dayjs] },
        { label: "Last 30 Days", value: [dayjs().subtract(30, "day"), dayjs()] as [Dayjs, Dayjs] },
        { label: "Last 3 Months", value: [dayjs().subtract(3, "month").startOf("month"), dayjs()] as [Dayjs, Dayjs] },
        { label: "Last 6 Months", value: [dayjs().subtract(6, "month").startOf("month"), dayjs()] as [Dayjs, Dayjs] },
        { label: "This Year", value: [dayjs().startOf("year"), dayjs().endOf("year")] as [Dayjs, Dayjs] },
    ];

    return (
        <DatePicker.RangePicker
            presets={presets}
            value={dates}
            onChange={(value) => setDates(value)}
            format="YYYY-MM-DD"
        />
    )
}
export default RangePicker;