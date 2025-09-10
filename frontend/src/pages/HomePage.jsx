import React from 'react';
import { LandingSection } from '../features/landing/LandingSection';
import { FeaturedProductsSection } from '../features/landing/FeaturedProductsSection';
import { ChitPlansSection } from '../features/landing/ChitPlansSection';
import { BenefitsCalculator } from '../features/landing/BenefitsCalculator';
import { ProductShowcaseSection } from '../features/landing/ProductShowcaseSection';
import { TestimonialsSection } from '../features/landing/TestimonialsSection';
import StoreDetailsPage from './StoreDetailsPage';

export const HomePage = () => {
  return (
    <>
      <LandingSection />
      <BenefitsCalculator />
      <ChitPlansSection />
      <FeaturedProductsSection />
      <ProductShowcaseSection />
      <TestimonialsSection />
      <StoreDetailsPage />
    </>
  );
};
