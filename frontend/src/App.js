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
import { CartPage, CheckoutPage, ForgotPasswordPage, HomePage, LoginPage, OrderSuccessPage, OtpVerificationPage, ProductDetailsPage, ResetPasswordPage, SignupPage, UserOrdersPage, UserProfilePage, WishlistPage, AboutPage, ContactPage, UserDashboardPage, AdminPage, AddProductPage, ProductUpdatePage } from './pages';
import ChitPlansPage from './features/chit-plans/ChitPlansPage';
import ShopPage from './features/shop/ShopPage';
import TestPage from './pages/TestPage';
import { Navbar } from './features/navigation/components/Navbar';
import { Footer } from './features/footer/Footer';

function App() {

  const isAuthChecked = useSelector(selectIsAuthChecked);
  const loggedInUser = useSelector(selectLoggedInUser);

  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  const Layout = () => {
    const location = useLocation();

    useEffect(() => {
      // Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        <Footer />
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
        <Route path="/chit-plans/*" element={<ChitPlansPage />} />
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
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    )
  );

  const protectedRoutes = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/chit-plans/*" element={<ChitPlansPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product-details/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<Protected><CartPage /></Protected>} />
        <Route path="/profile" element={<Protected><UserProfilePage /></Protected>} />
        <Route path="/user-dashboard" element={<Protected><UserDashboardPage /></Protected>} />
        <Route path="/checkout" element={<Protected><CheckoutPage /></Protected>} />
        <Route path="/order-success/:id" element={<Protected><OrderSuccessPage /></Protected>} />
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
    <>
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
    </>
  );
}

export default App;
