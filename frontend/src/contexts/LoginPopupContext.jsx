import React, { createContext, useContext, useState } from 'react';

const LoginPopupContext = createContext();

export const useLoginPopup = () => {
  const context = useContext(LoginPopupContext);
  if (!context) {
    throw new Error('useLoginPopup must be used within a LoginPopupProvider');
  }
  return context;
};

export const LoginPopupProvider = ({ children }) => {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  const openSignupPopup = () => {
    setIsSignupPopupOpen(true);
  };

  const closeSignupPopup = () => {
    setIsSignupPopupOpen(false);
  };

  const value = {
    isLoginPopupOpen,
    openLoginPopup,
    closeLoginPopup,
    isSignupPopupOpen,
    openSignupPopup,
    closeSignupPopup,
  };

  return (
    <LoginPopupContext.Provider value={value}>
      {children}
    </LoginPopupContext.Provider>
  );
};
