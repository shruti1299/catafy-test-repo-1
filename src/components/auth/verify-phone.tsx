"use client";
import { Form, Input, Button, Typography, message } from "antd";
import { useState } from "react";
import { API_ENDPOINTS } from "@/api/endpoints";
import api from "@/api";

interface IProps{
    values:{
        phone: number|string;
        password:string;
    };
    callback:() => {};
    type:string;
}

const VerifyPhoneForm = ({values, callback, type}:IProps) => {
    const {phone, password} = values;
    
    const [btnLoading, setBtnLoading] = useState(false);

    const onFinish = async (values: any) => {
        setBtnLoading(true);
        const params = {
            otp : values.otp,
            type: type,
            phone: phone
        }
        try {
            const { data } = await api.post(API_ENDPOINTS.VERIFY_PHONE, params);
            setBtnLoading(false);
            if(data && data.status){
                message.success("Phone verified successfully!")
                return callback();
            }
        } catch (e) {
            setBtnLoading(false);
        }
    }

    return (
        <div className="w-80">
            <Typography.Title level={4}>Verify Phone Number</Typography.Title>
            <Typography.Paragraph>
                Type the verification code we’ve sent on your number {phone}.
            </Typography.Paragraph>
            <Form
                name="very_phone_form"
                size="large"
                onFinish={(values) => onFinish(values)}
                layout="vertical"
            >
                <Form.Item
                className="w-100"
                    name="otp"
                    rules={[
                        {
                            required: true,
                            message: "Please input OTP!",
                        },
                    ]}
                    label="Phone Number"
                >
                    <Input.OTP length={4} size="large" />
                </Form.Item>

                 <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="user-form-button"
                        size="large"
                        loading={btnLoading}
                    >
                        Verify Phone Number
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default VerifyPhoneForm;
