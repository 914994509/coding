import React, { Suspense } from 'react';
import { Spin } from 'antd';

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <Spin size="large" />
  </div>
);

export const withLoading = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithLoadingComponent(props: P) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <WrappedComponent {...props} />
      </Suspense>
    );
  };
};

export default withLoading; 