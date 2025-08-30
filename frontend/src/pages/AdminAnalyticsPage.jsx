import React from 'react';
import { AdminLayout } from '../features/admin/components/AdminLayout';
import { RealAnalytics } from '../features/admin/components/RealAnalytics';

export const AdminAnalyticsPage = () => {
  return (
    <AdminLayout>
      <RealAnalytics />
    </AdminLayout>
  );
};
