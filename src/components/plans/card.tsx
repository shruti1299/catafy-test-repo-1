"use client";

import { Badge, Button, Card } from 'antd';
import SubscribeRZButton from '../payment/subscribe-rz-button';
import { IPlan } from '@/interfaces/Plan';
import { IUser } from '@/interfaces/Store';
import { CURRENCY_ICON } from '@/constant';

interface IProps {
  monthlyPlan: IPlan;
  yearlyPlan: IPlan;
  user: IUser;
  billingCycle: 'monthly' | 'yearly';
  isActive?: boolean;
  isBestValue?: boolean;
}

export default function PlanCard({
  monthlyPlan,
  yearlyPlan,
  user,
  billingCycle,
  isActive = false,
  isBestValue = false,
}: IProps) {

  const isRecommended = monthlyPlan.name === 'Growth';

  const monthlyPrice = Number(monthlyPlan.price);
  const yearlyPrice = Number(yearlyPlan.price);
  const yearlyMRP = monthlyPrice * 12;
  const savings = yearlyMRP - yearlyPrice;
  const discountPercent = Math.round((savings / yearlyMRP) * 100);

  const CardContent = (
    <Card
      title={monthlyPlan.name}
      style={{
        textAlign: 'center',
        borderRadius: 10,
        border: isRecommended ? '1px solid #1677ff' : undefined,
      }}
    >
      {/* PRICE */}
      {billingCycle === 'yearly' ? (
        <>
          <h2>
            {CURRENCY_ICON} {(yearlyPrice/1.18).toFixed(0)}  / year
          </h2>

          <div style={{ color: 'green', fontWeight: 600 }}>
            You save {CURRENCY_ICON} {savings} ({discountPercent}%)
          </div>
        </>
      ) : (
        <h2>
          {monthlyPrice === 0
            ? 'FREE'
            : `${CURRENCY_ICON} ${(monthlyPrice / 1.18).toFixed(0)} / month`}
        </h2>
      )}
      <div style={{ color: 'green', fontWeight: 600 }}>
            + 18% GST
      </div>

      <p>{monthlyPlan.description}</p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>{monthlyPlan.catalogs} Catalogs</li>
        <li>{monthlyPlan.products} Products</li>
        <li>{monthlyPlan.categories} Categories</li>
        <li>{monthlyPlan.devices} Devices</li>
      </ul>

      {isActive ? (
        <Button block disabled>
          Active Plan
        </Button>
      ) : (
        <SubscribeRZButton 
          user={user} 
          plan={billingCycle === 'yearly' ? yearlyPlan : monthlyPlan} 
        />
      )}
    </Card>
  );

  if (isActive) {
    return <Badge.Ribbon text="Active">{CardContent}</Badge.Ribbon>;
  }

  if (isBestValue) {
    return (
      <Badge.Ribbon color="purple" text="Best Value">
        {CardContent}
      </Badge.Ribbon>
    );
  }

  if (isRecommended) {
    return <Badge.Ribbon text="Recommended">{CardContent}</Badge.Ribbon>;
  }

  return CardContent;
}
