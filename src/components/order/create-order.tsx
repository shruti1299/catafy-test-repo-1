"use client";

import { Drawer } from 'antd'
import React from 'react'
import { Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';

type FieldType = {
    customer?: string;
    password?: string;
    remember?: string;
};

interface IProps{
    isOpen:boolean;
    onClose:any;
}

export default function CreateOrder({isOpen, onClose}:IProps) {
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Drawer title="Create New Order" open={isOpen} onClose={onClose} width={"50%"} >
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item<FieldType>
                    label="Select Customer"
                    name="customer"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Select Product"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}
