import React, { Suspense } from 'react';
const WebsiteHeader = React.lazy(() => import('../components/website/WebsiteHeader'));
const WebsiteFooter = React.lazy(() => import('../components/website/WebsiteFooter'));
import { Outlet } from 'react-router-dom';
import Loader from '../components/Shared/Loader';

const WebsiteLayout = () => (
  <>
    <Suspense fallback={<Loader />}>
      <WebsiteHeader />
    </Suspense>
    <Outlet />
    <Suspense fallback={<Loader />}>
      <WebsiteFooter />
    </Suspense>
  </>
);

export default WebsiteLayout; 