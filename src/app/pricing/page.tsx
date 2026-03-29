
import BackButton from '@/components/common/back-button';
import AllPlans from '@/components/plans/all-plans';
import { Card } from 'antd';
import { FC} from 'react';

const PricingPage: FC = () => {
  return (
    <Card>
      <BackButton />
      <AllPlans />
    </Card>
  );
};

export default PricingPage;
