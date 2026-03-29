import React from 'react';
import { Card, Typography, Steps, Divider } from 'antd';
import { DoubleArrowIcon } from '@/svg/index';

const {Text, Paragraph } = Typography;
const { Step } = Steps;

const steps = [
  {
    title: 'Buy a Domain',
    description: 'Purchase your domain from GoDaddy, Namecheap, or Google Domains.',
  },
  {
    title: 'Add Your Domain in Catafy',
    description: 'Open Web Catafy Panel → Settings → Custom Domain → Enter your domain (e.g., catafy.com).',
  },
  {
    title: 'Update DNS Records',
    description: 'Login to your domain provider and create the following DNS record:',
    dns: {
      type: 'CNAME',
      name: 'www',
      value: 'CATAFY DNS IP',
    },
  },
  {
    title: 'Wait for DNS to Propagate',
    description: 'This takes 10–30 minutes. You can check on dnschecker.org.',
  },
  {
    title: 'Done!',
    description: 'SSL is automatically enabled. Visit your domain to see your live store.',
  },
];

export default function HowToMapDomain() {
  return (
    <Card title={<><DoubleArrowIcon /> {" "}🛠 How to Map Your Own Domain</>}>
      <Paragraph type="warning" style={{ fontSize: 16, marginBottom: 24 }}>
        💡 <strong>Custom domain mapping costs ₹299/month</strong> — billed annually (₹3,588/year).
        ✅ <strong>Includes FREE SSL for lifetime.</strong>
      </Paragraph>
      <Steps direction="vertical" size="small" current={5}>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.title}
            description={
              <div>
                <Paragraph style={{ marginBottom: 4 }}>{step.description}</Paragraph>
                {step.dns && (
                  <Card type="inner" style={{ marginTop: 8 }}>
                    <Text><strong>Type:</strong> {step.dns.type}</Text><br />
                    <Text><strong>Host:</strong> {step.dns.name}</Text><br />
                    <Text><strong>Points to:</strong> {step.dns.value}</Text>
                  </Card>
                )}
              </div>
            }
          />
        ))}
      </Steps>
      <Divider />
      <Text type="secondary">
        Need help? Contact support or send a screenshot of your DNS settings.
      </Text>
    </Card>
  );
}
