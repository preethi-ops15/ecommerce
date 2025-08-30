import React from 'react';
import { AdminLayout } from '../features/admin/components/AdminLayout';
import { CustomerManagementTable } from '../features/admin/components/CustomerManagementTable';

export const AdminCustomersPage = () => {
  return (
    <AdminLayout>
      <CustomerManagementTable />
    </AdminLayout>
  );
};
