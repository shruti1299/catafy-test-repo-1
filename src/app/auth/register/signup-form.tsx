"use client";

import { BaseSyntheticEvent, useState } from "react";
import { Form, Input, Button, Typography, Select, message } from "antd";
import {
    UserOutlined,
    MailOutlined,
    MobileOutlined,
    LockOutlined,
    ShopOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VerifyPhoneForm from "@/components/auth/verify-phone";
import Cookies from "js-cookie";
import { AUTH_TOKEN } from "@/utils/get-token";
import { useUI } from "@/contexts/ui.context";
import { API_ENDPOINTS } from "@/api/endpoints";
import api from "@/api";
import COUNTRIES from "@/constant/countries";
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

const SignUpForm = () => {
    const router = useRouter();
    const [step, setStep] = useState("register");
    const [btnLoading, setBtnLoading] = useState(false);
    const [formValues, setFormValues] = useState<any>(null);
    const { authorize } = useUI();

    const onFinish = async (values: any) => {
        setBtnLoading(true);
        setFormValues(values);
        try {
            const { data } = await api.post(API_ENDPOINTS.REGISTER, values);
            setStep("vphone");
            message.success(data.message);
        } catch {
            // error already shown by interceptor
        } finally {
            setBtnLoading(false);
        }
    };

    const handleCallback = async () => {
        setBtnLoading(true);
        const { data } = await api.post(API_ENDPOINTS.LOGIN, formValues);
        if (data?.user && data?.token) {
            Cookies.set(AUTH_TOKEN, data.token);
            Cookies.set("user", JSON.stringify(data.user));
            authorize(data.user);
            router.replace("/");
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
            title="Create your account"
            subtitle="Plans start at ₹499 + GST/month. Our team will reach out after signup to walk you through a demo and get you started."
        >
            <Form
                name="signup_form"
                initialValues={{ country_code: "+91" }}
                size="large"
                onFinish={onFinish}
                layout="vertical"
            >
                {/* Full Name */}
                <Form.Item
                    name="name"
                    label={<span style={LABEL_STYLE}>Full Name</span>}
                    rules={[{ required: true, message: "Please enter your full name" }]}
                >
                    <Input
                        prefix={<UserOutlined style={{ color: "#94a3b8" }} />}
                        placeholder="Your full name"
                        style={INPUT_STYLE}
                    />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    name="email"
                    label={<span style={LABEL_STYLE}>Email</span>}
                    rules={[
                        { required: true, message: "Please enter your email" },
                        { pattern: /^[\w-.]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/, message: "Enter a valid email" },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined style={{ color: "#94a3b8" }} />}
                        placeholder="you@company.com"
                        style={INPUT_STYLE}
                    />
                </Form.Item>

                {/* Phone */}
                <Form.Item label={<span style={LABEL_STYLE}>Phone Number</span>} required>
                    <div style={{ display: "flex", gap: 8 }}>
                        <Form.Item
                            name="country_code"
                            noStyle
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Select
                                showSearch
                                style={{ width: 150, height: 44, borderRadius: 10 }}
                                optionFilterProp="label"
                                labelRender={({ value }) => (
                                    <span style={{ fontWeight: 500 }}>{String(value)}</span>
                                )}
                                options={COUNTRIES.map((c) => ({
                                    label: `${c.name} (${c.code})`,
                                    value: c.code,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            noStyle
                            rules={[
                                { required: true, message: "Please enter your phone number" },
                                { pattern: /^[0-9]{7,12}$/, message: "Enter a valid phone number" },
                            ]}
                        >
                            <Input
                                style={{ flex: 1, borderRadius: 10, height: 44 }}
                                maxLength={12}
                                placeholder="Phone number"
                                type="tel"
                                prefix={<MobileOutlined style={{ color: "#94a3b8" }} />}
                                onInput={(e: BaseSyntheticEvent) =>
                                    (e.target.value = e.target.value.slice(0, 12))
                                }
                            />
                        </Form.Item>
                    </div>
                </Form.Item>

                {/* Organization */}
                <Form.Item
                    name="company"
                    label={<span style={LABEL_STYLE}>Business / Organization Name</span>}
                    rules={[{ required: true, message: "Please enter your organization name" }]}
                >
                    <Input
                        prefix={<ShopOutlined style={{ color: "#94a3b8" }} />}
                        placeholder="e.g. SparkSphere Venture PVT LTD"
                        style={INPUT_STYLE}
                    />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    name="password"
                    label={<span style={LABEL_STYLE}>Password</span>}
                    rules={[
                        { required: true, message: "Please enter a password" },
                        {
                            pattern: /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                            message: "Min 8 chars with uppercase, lowercase and a number or symbol",
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                        placeholder="Min 8 characters"
                        style={INPUT_STYLE}
                    />
                </Form.Item>

                {/* Confirm Password */}
                <Form.Item
                    name="c_password"
                    label={<span style={LABEL_STYLE}>Confirm Password</span>}
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
                        placeholder="Re-enter your password"
                        style={INPUT_STYLE}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 16, marginTop: 4 }}>
                    <Button type="primary" htmlType="submit" block loading={btnLoading} style={BTN_STYLE}>
                        Create account
                    </Button>
                </Form.Item>
            </Form>

            {/* Sign in link */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 20px" }}>
                <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Already have an account?</span>
                <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </div>

            <Link href="/auth/login">
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
                    Sign in instead
                </Button>
            </Link>

            <Typography.Text style={{ display: "block", textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 20 }}>
                By creating an account you agree to Catafy's{" "}
                <Link href="#" style={{ color: "#6366f1" }}>Terms of Service</Link> and{" "}
                <Link href="#" style={{ color: "#6366f1" }}>Privacy Policy</Link>.
            </Typography.Text>
        </AuthLayout>
    );
};

export default SignUpForm;
