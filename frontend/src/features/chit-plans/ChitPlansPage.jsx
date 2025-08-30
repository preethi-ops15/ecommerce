import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../auth/AuthSlice';
import ChitPlanSelection from './components/ChitPlanSelection';
import ChitPlanPayment from './components/ChitPlanPayment';
import ChitPlanSummary from './components/ChitPlanSummary';

const ChitPlansPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectLoggedInUser);
  const isPaymentPage = location.pathname.includes('payment');
  const isSummaryPage = location.pathname.includes('summary');

  // Check if user is logged in for payment pages
  useEffect(() => {
    if (isPaymentPage && !user) {
      navigate('/login?redirect=/chit-plans/payment' + location.search);
      return;
    }
    
    // For summary page, check if plan parameter exists
    if (isSummaryPage) {
      const searchParams = new URLSearchParams(location.search);
      const planId = searchParams.get('plan');
      if (!planId || !['1', '2', '3'].includes(planId)) {
        navigate('/chit-plans');
        return;
      }
    }
    
    // For payment page, check if plan parameter exists
    if (isPaymentPage) {
      const searchParams = new URLSearchParams(location.search);
      const planId = searchParams.get('plan');
      if (!planId || !['1', '2', '3'].includes(planId)) {
        navigate('/chit-plans');
        return;
      }
    }
  }, [location.pathname, location.search, user, navigate, isPaymentPage, isSummaryPage]);

  return (
    <Routes>
      <Route index element={<ChitPlanSelection />} />
      <Route path="summary" element={<ChitPlanSummary />} />
      <Route path="payment" element={<ChitPlanPayment />} />
    </Routes>
  );
};

export default ChitPlansPage;
