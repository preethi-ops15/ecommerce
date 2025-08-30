import React from 'react';
import { AdminLayout } from '../features/admin/components/AdminLayout';
import { AdminProductsTable } from '../features/admin/components/AdminProductsTable';

export const AdminProductsPage = () => {
  return (
    <AdminLayout>
      <AdminProductsTable />
    </AdminLayout>
  );
};
