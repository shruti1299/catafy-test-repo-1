"use client";

import { Form, Input, Button, Typography, message } from "antd";
import { MobileOutlined, LockOutlined } from "@ant-design/icons";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useState } from "react";
import VerifyPhoneForm from "./verify-phone";
import { setUserCookies } from "@/utils/get-token";
import Link from "next/link";
import api, { authorizeApi } from "@/api";
import AuthLayout from "./AuthLayout";

const BTN_STYLE = {
    background: "linear-gradient(90deg,#6366f1,#818cf8)",
    border: "none",
    borderRadius: 10,
    height: 48,
    fontWeight: 700,
    fontSize: 15,
};

const INPUT_STYLE = { borderRadius: 10, height: 44 };

const LoginForm = () => {
    const [step, setStep] = useState("login");
    const [formValues, setFormValues] = useState<any>(null);
    const [btnLoading, setBtnLoading] = useState(false);
    const handleCallback = () => onFinish(formValues);

    if (typeof window === undefined) return null;

    const onFinish = async (values: any) => {
        setBtnLoading(true);
        setFormValues(values);
        if (!values.phone) return;
        try {
            const { data } = await api.post(API_ENDPOINTS.LOGIN, values);
            if (data.type === "login_success") {
                authorizeApi(data.token);
                setUserCookies(data.token, data.user);
                message.success("Welcome back!");
                window.location.href = "/";
                return;
            }
            if (data.type === "vphone") {
                setStep("vphone");
                setBtnLoading(false);
                return;
            }
            message.error(data.message || "Login failed. Please try again.");
            setBtnLoading(false);
        } catch {
            setStep("login");
            setBtnLoading(false);
        }
    };

    if (step === "vphone" && formValues) {
        return (
            <AuthLayout title="Verify your phone" subtitle="Enter the OTP sent to your registered number.">
                <VerifyPhoneForm values={formValues} callback={handleCallback} type="vphone" />
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your Catafy account to manage your catalogs."
        >
            <Form
                name="login_form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="phone"
                    label={<span style={{ fontWeight: 600, color: "#374151" }}>Phone Number</span>}
                    rules={[{ required: true, message: "Please enter your phone number" }]}
                >
                    <Input
                        prefix={<MobileOutlined style={{ color: "#94a3b8" }} />}
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        type="tel"
                        style={INPUT_STYLE}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={<span style={{ fontWeight: 600, color: "#374151" }}>Password</span>}
                    rules={[{ required: true, message: "Please enter your password" }]}
                    style={{ marginBottom: 8 }}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                        placeholder="Your password"
                        style={INPUT_STYLE}
                    />
                </Form.Item>

                <div style={{ textAlign: "right", marginBottom: 20 }}>
                    <Link href="/auth/forget-password" style={{ fontSize: 13, color: "#6366f1", fontWeight: 500 }}>
                        Forgot password?
                    </Link>
                </div>

                <Form.Item style={{ marginBottom: 16 }}>
                    <Button type="primary" htmlType="submit" block loading={btnLoading} style={BTN_STYLE}>
                        Sign in
                    </Button>
                </Form.Item>
            </Form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0 20px" }}>
                <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Don't have an account?</span>
                <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </div>

            <Link href="/auth/register">
                <Button
                    block
                    size="large"
                    style={{
                        borderRadius: 10,
                        height: 48,
                        fontWeight: 700,
                        border: "1.5px solid #6366f1",
                        color: "#6366f1",
                        background: "#fff",
                    }}
                >
                    Create a free account
                </Button>
            </Link>

            <Typography.Text style={{ display: "block", textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 20 }}>
                By signing in you agree to Catafy's{" "}
                <Link href="#" style={{ color: "#6366f1" }}>Terms of Service</Link> and{" "}
                <Link href="#" style={{ color: "#6366f1" }}>Privacy Policy</Link>.
            </Typography.Text>
        </AuthLayout>
    );
};

export default LoginForm;
