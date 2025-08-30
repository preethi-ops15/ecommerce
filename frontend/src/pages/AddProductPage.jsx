import React from 'react'
import { AdminLayout } from '../features/admin/components/AdminLayout'
import { AddProduct } from '../features/admin/components/AddProduct'

export const AddProductPage = () => {
  return (
    <AdminLayout>
      <AddProduct/>
    </AdminLayout>
  )
}
