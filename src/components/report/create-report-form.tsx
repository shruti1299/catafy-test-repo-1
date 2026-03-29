import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Card, DatePicker, Form, Radio, message } from 'antd';
import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

type FieldType = {
    type: string;
    range?: [Dayjs, Dayjs];
};

const CreateReportForm = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [reportType, setReportType] = useState<string>('orders'); // default selected

    const presets = [
        { label: "Today", value: [dayjs(), dayjs()] as [Dayjs, Dayjs] },
        { label: "This Month", value: [dayjs().startOf("month"), dayjs().endOf("month")] as [Dayjs, Dayjs] },
        { label: "Last 7 Days", value: [dayjs().subtract(7, "day"), dayjs()] as [Dayjs, Dayjs] },
        { label: "Last 30 Days", value: [dayjs().subtract(30, "day"), dayjs()] as [Dayjs, Dayjs] },
        { label: "Last 3 Months", value: [dayjs().subtract(3, "month").startOf("month"), dayjs()] as [Dayjs, Dayjs] },
    ];

    const onValuesChange = (changedValues: Partial<FieldType>) => {
        if (changedValues.type) {
            setReportType(changedValues.type);
            if (changedValues.type !== 'orders') {
                form.setFieldsValue({ range: undefined });
            }
        }
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const params: any = {
            type: values.type,
        };
        if (values.type === 'orders' && values.range) {
            params.start_at = values.range[0]?.format("DD-MM-YYYY");
            params.end_at = values.range[1]?.format("DD-MM-YYYY");
        }
        setIsLoading(true);
        try {
            const data = await api.post(`${API_ENDPOINTS.REPORTS}`, params);
            if (data.status) {
                message.success("Report Added to Queue");
            }
        } catch (error) {
            message.error("Failed to queue report");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <Form
                form={form}
                name="report-form"
                onFinish={onFinish}
                onValuesChange={onValuesChange}
                autoComplete="off"
                layout="vertical"
                size="large"
                style={{ marginTop: "20px" }}
                initialValues={{ type: 'orders' }}
            >
                <Form.Item
                    label="Select Report"
                    name="type"
                >
                    <Radio.Group
                        style={{ width: "100%" }}
                        buttonStyle="solid"
                        optionType="button"
                        options={[
                            { value: "orders", label: "Orders Report" },
                            { value: "products", label: "Products Report" },
                        ]}
                    />
                </Form.Item>

                {reportType === 'orders' && (
                    <Form.Item
                        label="Select Date Range"
                        name="range"
                        rules={[{ required: true, message: 'Please select range!' }]}
                    >
                        <DatePicker.RangePicker
                            style={{ width: "100%" }}
                            presets={presets}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={isLoading}>
                        Generate Now
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default CreateReportForm;
