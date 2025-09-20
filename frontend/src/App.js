import { useSelector } from 'react-redux';
import { 
  Navigate, 
  Outlet,
  Route, 
  RouterProvider, 
  createBrowserRouter, 
  createRoutesFromElements, 
  useLocation 
} from "react-router-dom";
import { selectIsAuthChecked, selectLoggedInUser } from './features/auth/AuthSlice';
import { Logout } from './features/auth/components/Logout';
import { Protected } from './features/auth/components/Protected';
import { useAuthCheck } from "./hooks/useAuth/useAuthCheck";
import { useFetchLoggedInUserDetails } from "./hooks/useAuth/useFetchLoggedInUserDetails";
import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { CartPage, CheckoutPage, ForgotPasswordPage, HomePage, LoginPage, OrderSuccessPage, OtpVerificationPage, ProductDetailsPage, ResetPasswordPage, SignupPage, UserOrdersPage, UserProfilePage, WishlistPage, AboutPage, ContactPage, UserDashboardPage, AdminPage } from './pages';
import TermsPage from './pages/TermsPage';
import ChitPlansPage from './features/chit-plans/ChitPlansPage';
import ShopPage from './features/shop/ShopPage';
import TestPage from './pages/TestPage';
import { Navbar } from './features/navigation/components/Navbar';
import { Footer } from './features/footer/Footer';
import { LoginPopupProvider, useLoginPopup } from './contexts/LoginPopupContext';
import { LoginPopup } from './features/auth/components/LoginPopup';
import { SignupPopup } from './features/auth/components/SignupPopup';

function App() {

  const isAuthChecked = useSelector(selectIsAuthChecked);
  const loggedInUser = useSelector(selectLoggedInUser);

  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  const Layout = () => {
    const location = useLocation();
    const { isLoginPopupOpen, closeLoginPopup, isSignupPopupOpen, closeSignupPopup } = useLoginPopup();
    const { openLoginPopup, openSignupPopup } = useLoginPopup();

    useEffect(() => {
      // Scroll behavior on route change
      if (location.hash) {
        // Defer until DOM updates
        setTimeout(() => {
          const id = location.hash.replace('#', '');
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Intercept auth routes to show popups instead of pages
      if (location.pathname === '/login') {
        if (!isLoginPopupOpen) openLoginPopup();
        // replace navigation to home so the URL doesn't stay on /login
        window.history.replaceState(null, '', '/');
      } else if (location.pathname === '/signup') {
        if (!isSignupPopupOpen) openSignupPopup();
        window.history.replaceState(null, '', '/');
      }
    }, [location.pathname, isLoginPopupOpen, isSignupPopupOpen]);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {location.pathname !== '/shop' && location.pathname !== '/cart' && location.pathname !== '/wishlist' && location.pathname !== '/checkout' && !location.pathname.startsWith('/product-details') && !location.pathname.startsWith('/chit-plans') && !location.pathname.startsWith('/terms') && location.pathname !== '/user-dashboard' && <Navbar />}
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        {!location.pathname.startsWith('/chit-plans') && !location.pathname.startsWith('/terms') && <Footer />}
        <LoginPopup open={isLoginPopupOpen} onClose={closeLoginPopup} />
        <SignupPopup open={isSignupPopupOpen} onClose={closeSignupPopup} />
      </Box>
    );
  };

  const AdminLayout = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    );
  };

  const publicRoutes = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product-details/:id" element={<ProductDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:userId/:passwordResetToken" element={<ResetPasswordPage />} />
        <Route path="/cart" element={<Protected><CartPage /></Protected>} />
        <Route path="/wishlist" element={<Protected><WishlistPage /></Protected>} />
        <Route path="/logout" element={<Protected><Logout /></Protected>} />
        <Route path="/user-dashboard" element={<Protected><UserDashboardPage /></Protected>} />
        <Route path="/profile" element={<Protected><UserProfilePage /></Protected>} />
        <Route path="/orders" element={<Protected><UserOrdersPage /></Protected>} />
        <Route path="/checkout" element={<Protected><CheckoutPage /></Protected>} />
        <Route path="/order-success/:id" element={<Protected><OrderSuccessPage /></Protected>} />
        <Route path="/chit-plans/*" element={<ChitPlansPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    )
  );

  const protectedRoutes = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product-details/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<Protected><CartPage /></Protected>} />
        <Route path="/profile" element={<Protected><UserProfilePage /></Protected>} />
        <Route path="/user-dashboard" element={<Protected><UserDashboardPage /></Protected>} />
        <Route path="/checkout" element={<Protected><CheckoutPage /></Protected>} />
        <Route path="/order-success/:id" element={<Protected><OrderSuccessPage /></Protected>} />
        <Route path="/chit-plans/*" element={<ChitPlansPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/orders" element={<Protected><UserOrdersPage /></Protected>} />
        <Route path="/wishlist" element={<Protected><WishlistPage /></Protected>} />
        <Route path="/logout" element={<Protected><Logout /></Protected>} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    )
  );

  const adminRoutes = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AdminLayout />}>
        <Route path="/" element={<AdminPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/dashboard" element={<AdminPage />} />
        <Route path="/admin/add-product" element={<AdminPage />} />
        <Route path="/admin/product-update/:id" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    )
  );



  return (
    <LoginPopupProvider>
      {!isAuthChecked ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : !loggedInUser ? (
        <RouterProvider router={publicRoutes} />
      ) : loggedInUser?.isAdmin ? (
        <RouterProvider router={adminRoutes} />
      ) : (
        <RouterProvider router={protectedRoutes} />
      )}
    </LoginPopupProvider>
  );
}

export default App;
