"use client";

import React from 'react';
import { Card, Typography} from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { DoubleArrowIcon } from '@/svg/index';

const { Title, Paragraph } = Typography;

const CommingSoon = () => {
    return (
        <Card
            title={<><DoubleArrowIcon /> Comming Soon</>}
        >
            <Typography style={{textAlign:"center", padding:"20px 0"}}>
            <ClockCircleOutlined style={{ fontSize: '60px', color: '#1890ff' }} />
            <Title level={1} style={{ marginTop: '20px' }}>
                Coming Soon
            </Title>
            <Paragraph style={{ fontSize: '16px' }}>
                We're working hard to bring something awesome. Stay tuned for updates!
            </Paragraph>
            </Typography>
        </Card>
    );
};

export default CommingSoon;