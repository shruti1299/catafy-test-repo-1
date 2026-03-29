import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import { RZ_KEY, RZ_TEST_PLAN } from '@/constant/payment-key';
import { IPlan } from '@/interfaces/Plan';
import { IUser } from '@/interfaces/Store';
import { Button, message } from 'antd';
import React, { useState } from 'react';

interface IProps {
    user: IUser;
    plan: IPlan;
}

export default function SubscribeRZButton({ user, plan }: IProps) {
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const isTestAccount = user.id == 1 ? true : false;

    if (!plan || !user) return null;
    if (+plan.price === 0) return <Button block type="dashed">Subscribe Now</Button>;

    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            if (document.getElementById('razorpay-script')) {
                return resolve(true); // already loaded
            }
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => reject('Failed to load Razorpay script');
            document.body.appendChild(script);
        });
    };

    const handlePaymentSuccess = async (resData: any) => {
        console.log(resData, "rz_success");
        try {
            await api.post(API_ENDPOINTS.RECORD_PAYMENT, resData);
            message.success("Subscription Activated Successfully!");
            setIsPaymentLoading(false);
        } catch (error) {
            setIsPaymentLoading(false);
            console.log(error)
        }
    };

    const subscribeToPlan = async (userId: number, razorpayPlanId: string | undefined) => {
        if (!razorpayPlanId) return;

        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert('Razorpay SDK failed to load. Are you online?');
                return;
            }
            setIsPaymentLoading(true);
            const { data } = await api.post(API_ENDPOINTS.CREATE_SUBSCRIPTION, {
                user_id: userId,
                rz_plan_id: isTestAccount ? RZ_TEST_PLAN : razorpayPlanId,
            });

            const options = {
                key: RZ_KEY,
                name: 'Catafy - Digital Catalog Maker',
                description: 'Catafy Yearly Subscription Payment',
                subscription_id: data.subscription_id,
                handler: function (response: any) {
                    handlePaymentSuccess(response);
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "void@catafy.com",
                    contact: user?.phone,
                },
                theme: {
                    color: '#0C0E48',
                },
            };

            // @ts-ignore
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Subscription error:', err);
            alert('Failed to initiate subscription');
            setIsPaymentLoading(false);
        }
    };

    return (
        <Button
            type="primary"
            onClick={() => subscribeToPlan(user.id, plan.rz_plan_id)}
            block
            loading={isPaymentLoading}
        >
            Subscribe Now
        </Button>
    );
}
