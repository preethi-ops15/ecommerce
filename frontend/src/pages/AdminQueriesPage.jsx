import React from 'react';
import { AdminLayout } from '../features/admin/components/AdminLayout';
import { CustomerQueriesTable } from '../features/admin/components/CustomerQueriesTable';

export const AdminQueriesPage = () => {
  return (
    <AdminLayout>
      <CustomerQueriesTable />
    </AdminLayout>
  );
}; 