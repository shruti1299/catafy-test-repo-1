"use client";

import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Button, Form, Input, message, Typography } from "antd";
import { MobileOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";

const BTN_STYLE = {
    background: "linear-gradient(90deg,#6366f1,#818cf8)",
    border: "none",
    borderRadius: 10,
    height: 48,
    fontWeight: 700,
    fontSize: 15,
};

const INPUT_STYLE = { borderRadius: 10, height: 44 };
const LABEL_STYLE = { fontWeight: 600, color: "#374151" };

const STEPS = {
    FORGOT: "forgot",
    VERIFY: "verify-and-reset",
};

const ResetPasswordForm = () => {
    const router = useRouter();
    const [step, setStep] = useState(STEPS.FORGOT);
    const [btnLoading, setBtnLoading] = useState(false);
    const [phone, setPhone] = useState("");

    async function handleFormSubmit(values: any) {
        try {
            setBtnLoading(true);

            if (step === STEPS.FORGOT) {
                const { data } = await api.post(API_ENDPOINTS.FORGET_PASSWORD, {
                    phone: values.phone,
                    type: "forgot",
                });
                if (data?.status) {
                    message.success(data.message);
                    setPhone(values.phone);
                    setStep(STEPS.VERIFY);
                }
                return;
            }

            if (step === STEPS.VERIFY) {
                const { data } = await api.post(API_ENDPOINTS.RESET_PASSWORD, {
                    phone: values.phone,
                    password: values.password,
                    otp: values.otp,
                });
                if (data?.status) {
                    message.success("Password reset successfully! Please log in.");
                    router.replace("/auth/login");
                }
            }
        } catch {
            // interceptor handles errors
        } finally {
            setBtnLoading(false);
        }
    }

    const isForgot = step === STEPS.FORGOT;

    return (
        <AuthLayout
            title={isForgot ? "Reset your password" : "Enter the OTP"}
            subtitle={
                isForgot
                    ? "Enter your registered phone number and we'll send you a one-time OTP to reset your password."
                    : `We sent an OTP to +91 ${phone}. Enter it below along with your new password.`
            }
        >
            <Form
                name="forget_form"
                onFinish={handleFormSubmit}
                layout="vertical"
                size="large"
                initialValues={{ phone }}
            >
                {/* Phone */}
                <Form.Item
                    name="phone"
                    label={<span style={LABEL_STYLE}>Phone Number</span>}
                    rules={[
                        { required: true, message: "Please enter your phone number" },
                        { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                    ]}
                >
                    <Input
                        prefix={<MobileOutlined style={{ color: "#94a3b8" }} />}
                        maxLength={10}
                        disabled={!isForgot}
                        placeholder="10-digit mobile number"
                        type="tel"
                        style={INPUT_STYLE}
                        onInput={(e: BaseSyntheticEvent) =>
                            (e.target.value = e.target.value.slice(0, 10))
                        }
                    />
                </Form.Item>

                {/* OTP + new password — shown after OTP sent */}
                {!isForgot && (
                    <>
                        <Form.Item
                            name="otp"
                            label={<span style={LABEL_STYLE}>OTP</span>}
                            rules={[{ required: true, message: "Please enter the OTP" }]}
                        >
                            <Input.OTP length={4} size="large" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={<span style={LABEL_STYLE}>New Password</span>}
                            rules={[{ required: true, message: "Please enter a new password" }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                                placeholder="Min 8 characters"
                                style={INPUT_STYLE}
                            />
                        </Form.Item>

                        <Form.Item
                            name="c_password"
                            label={<span style={LABEL_STYLE}>Confirm New Password</span>}
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Please confirm your password" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) return Promise.resolve();
                                        return Promise.reject(new Error("Passwords do not match"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                                placeholder="Re-enter new password"
                                style={INPUT_STYLE}
                            />
                        </Form.Item>
                    </>
                )}

                <Form.Item style={{ marginTop: 8 }}>
                    <Button type="primary" htmlType="submit" block loading={btnLoading} style={BTN_STYLE}>
                        {isForgot ? "Send OTP" : "Reset Password"}
                    </Button>
                </Form.Item>
            </Form>

            <Link href="/auth/login">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    style={{ color: "#6366f1", fontWeight: 500, padding: 0 }}
                >
                    Back to sign in
                </Button>
            </Link>

            {!isForgot && (
                <Typography.Text style={{ display: "block", fontSize: 12, color: "#94a3b8", marginTop: 16 }}>
                    Didn't receive the OTP?{" "}
                    <button
                        type="button"
                        style={{ color: "#6366f1", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        onClick={() => setStep(STEPS.FORGOT)}
                    >
                        Try again
                    </button>
                </Typography.Text>
            )}
        </AuthLayout>
    );
};

export default ResetPasswordForm;
