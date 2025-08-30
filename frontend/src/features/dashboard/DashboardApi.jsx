import { axiosi as axios } from '../../config/axios';

// User Profile APIs
export const getUserProfile = async () => {
  try {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }
    const response = await axios.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    // Return mock data if API fails
    return {
      name: 'DEV',
      email: 'devprasanth.e@gmail.com',
      phone: '9677547529',
      dateOfBirth: '2004-03-04'
    };
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }
    const response = await axios.patch(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    // Return the updated data if API fails
    return userData;
  }
};

// Address APIs
export const getUserAddresses = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }
    const response = await axios.get(`/address/user/${userId}`);
    return response.data;
  } catch (error) {
    // Return mock data if API fails
    return [
      {
        _id: '1',
        street: '123 Main Street, Apartment 4B',
        phoneNumber: '9677547529',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600001',
        country: 'India',
        type: 'Home',
        isDefault: true
      }
    ];
  }
};

export const createAddress = async (addressData) => {
  try {
    const response = await axios.post('/address', addressData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await axios.put(`/address/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const response = await axios.delete(`/address/${addressId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Order APIs
export const getUserOrders = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }
    const response = await axios.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    // Return mock data if API fails
    return [
      {
        _id: 'order1',
        items: [
          {
            product: {
              _id: 'prod1',
              title: 'Gold Diamond Ring',
              price: 45000
            },
            quantity: 1,
            price: 45000
          }
        ],
        totalAmount: 45000,
        status: 'Delivered',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'order2',
        items: [
          {
            product: {
              _id: 'prod2',
              title: 'Silver Necklace',
              price: 25000
            },
            quantity: 2,
            price: 25000
          }
        ],
        totalAmount: 50000,
        status: 'Processing',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Chit Plan APIs (if they exist)
export const getUserChitPlans = async () => {
  try {
    const response = await axios.get('/chit-plans/user');
    return response.data;
  } catch (error) {
    // Return mock data if API doesn't exist
    return [
      {
        _id: 'chit1',
        name: 'Gold Savings Plan',
        monthlyAmount: 5000,
        duration: 12,
        totalSaved: 60000,
        jewelryValue: 75000,
        status: 'Active'
      },
      {
        _id: 'chit2',
        name: 'Diamond Investment Plan',
        monthlyAmount: 10000,
        duration: 24,
        totalSaved: 120000,
        jewelryValue: 150000,
        status: 'Active'
      }
    ];
  }
};

export const createChitPlan = async (planData) => {
  try {
    const response = await axios.post('/chit-plans', planData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Wishlist APIs (already exists, but adding for completeness)
export const getUserWishlist = async () => {
  try {
    const response = await axios.get('/wishlist');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromWishlist = async (wishlistId) => {
  try {
    const response = await axios.delete(`/wishlist/${wishlistId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToCartFromWishlist = async (productId, quantity = 1) => {
  try {
    const response = await axios.post('/cart', {
      product: productId,
      quantity: quantity
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 