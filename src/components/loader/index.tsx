import React from 'react';
import { Spin, Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './Loader.css';

interface LoaderProps {
  isPageLoader?: boolean;
  size?: 'small' | 'default' | 'large';
  tip?: string;
}

const Loader = ({ isPageLoader = false, size = "large", tip = "" }:LoaderProps) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  if (isPageLoader) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Content
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Spin indicator={antIcon} size={size} tip={tip} />
        </Layout.Content>
      </Layout>
    );
  } else {
    return (
      <div className="child-loader">
        <Spin indicator={antIcon} size={size} tip={tip} />
      </div>
    );
  }
};

export default Loader;