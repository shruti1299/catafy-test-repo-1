"use client";

import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import PlanCard from '@/components/plans/card';
import { IPlan } from '@/interfaces/Plan';
import { IActivePlan } from '@/interfaces/Store';
import { getUser } from '@/utils/get-token';
import { Row, Col, Card, Divider, Switch } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';

type BillingCycle = 'monthly' | 'yearly';

const AllPlans: FC = () => {
  const user = getUser();
  if (!user) return null;

  const [plans, setPlans] = useState<Record<string, IPlan[]>>({});
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [activePlan, setActivePlan] = useState<IActivePlan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchActivePlan();
  }, []);

  const fetchPlans = async () => {
    const { data } = await api.get<IPlan[]>(API_ENDPOINTS.PLANS);

    // Group by plan name (Starter / Growth / Scale)
    const grouped = data.reduce((acc, plan) => {
      if (!acc[plan.name]) acc[plan.name] = [];
      acc[plan.name].push(plan);
      return acc;
    }, {} as Record<string, IPlan[]>);

    setPlans(grouped);
  };

  const fetchActivePlan = async () => {
    setLoading(true);
    const { data } = await api.get(API_ENDPOINTS.USER);
    setActivePlan(data?.active_plan);
    setLoading(false);
  };

  const getMonthlyPlan = (planName: string) =>
    plans[planName]?.find(p => p.billing_cycle === 'monthly');

  const getYearlyPlan = (planName: string) =>
    plans[planName]?.find(p => p.billing_cycle === 'yearly');

  /* -----------------------------
     BEST VALUE (MAX DISCOUNT)
  -------------------------------- */
  const bestValuePlanName = useMemo(() => {
    let best: string | null = null;
    let maxDiscount = 0;

    Object.keys(plans).forEach((planName) => {
      const monthly = getMonthlyPlan(planName);
      const yearly = getYearlyPlan(planName);
      if (!monthly || !yearly) return;

      const yearlyMRP = Number(monthly.price) * 12;
      const savings = yearlyMRP - Number(yearly.price);
      const discount = (savings / yearlyMRP) * 100;

      if (discount > maxDiscount) {
        maxDiscount = discount;
        best = planName;
      }
    });

    return best;
  }, [plans]);

  return (
    <Card style={{ padding: 50 }} loading={loading}>

      <h1 style={{ textAlign: 'center' }}>Choose Your Plan</h1>

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span style={{ marginRight: 10 }}>Monthly</span>
        <Switch
          checked={billingCycle === 'yearly'}
          onChange={(v) => setBillingCycle(v ? 'yearly' : 'monthly')}
        />
        <span style={{ marginLeft: 10 }}>
          Yearly <strong style={{ color: 'green' }}>(Save up to 20%)</strong>
        </span>
      </div>

      <Row gutter={16} justify="center">
        {Object.keys(plans).map((planName) => {
          const monthlyPlan = getMonthlyPlan(planName);
          const yearlyPlan = getYearlyPlan(planName);

          if (!monthlyPlan || !yearlyPlan) return null;

          const planToShow =
            billingCycle === 'yearly' ? yearlyPlan : monthlyPlan;

          return (
            <Col xs={24} sm={12} md={8} key={planName}>
              <PlanCard
                monthlyPlan={monthlyPlan}
                yearlyPlan={yearlyPlan}
                user={user}
                billingCycle={billingCycle}
                isActive={activePlan?.plan_id === planToShow.id}
                isBestValue={
                  billingCycle === 'yearly' && planName === bestValuePlanName
                }
              />
            </Col>
          );
        })}
      </Row>

      <Divider />

      <p style={{ textAlign: 'center' }}>
        Need to stop, cancel, or upgrade your plan? No worries—your growth, your
        choice. Our team is always happy to help.
      </p>
    </Card>
  );
};

export default AllPlans;
