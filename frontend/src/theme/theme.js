import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      light: '#000000',
      dark: '#000000',
      contrastText: '#ffffff',
      customBlack:"#191919"
    },
    secondary: {
      main: '#000000',
      contrastText: '#ffffff'
    },
    text: {
      primary: '#000000',
      secondary: '#000000'
    },
    action: {
      active: '#000000',
      hover: 'rgba(0, 0, 0, 0.08)',
      selected: 'rgba(0, 0, 0, 0.16)',
      disabled: '#000000'
    },
  },


  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily:"Poppins, sans-serif",
    h1: {  // -1rem rule
      fontSize: "6rem",

      "@media (max-width:960px)": {
        fontSize: "5rem",
      },
      "@media (max-width:600px)": {
        fontSize: "4rem",
      },
      "@media (max-width:414px)": {
        fontSize: "2.5rem",
      },
    },
    h2: {  // -7 formula
      fontSize: "3.75rem",
      "@media (max-width:960px)": {
        fontSize: "3rem",
      },

      "@media (max-width:662px)": {
        fontSize: "2.3rem",
      },
      "@media (max-width:414px)": {
        fontSize: "2.2rem",
      },
    },
    h3: {  // -6 formula
      fontSize: "3rem",
      "@media (max-width:960px)": {
        fontSize: "2.4rem",
      },
      
      "@media (max-width:662px)": {
        fontSize: "2rem",
      },
      "@media (max-width:414px)": {
        fontSize: "1.7rem",
      },

    },
    h4: {
       fontSize: "2.125rem",
      "@media (max-width:960px)": {
        fontSize: "1.5rem",
      },
      "@media (max-width:600px)": {
        fontSize: "1.25rem",
      },
    },
    h5: {
      fontSize: "1.5rem",
      "@media (max-width:960px)": {
        fontSize: "1.25rem",
      },
      "@media (max-width:600px)": {
        fontSize: "1.1rem",
      },
    },
    h6: {
      fontSize: "1.25rem",
      "@media (max-width:960px)": {
        fontSize: "1.1rem",
      },
      "@media (max-width:600px)": {
        fontSize: "1rem",
      },
    },
    body1: {
      fontSize: "1rem",
      "@media (max-width:960px)": {
        fontSize: "1rem",
      },
      "@media (max-width:600px)": {
        fontSize: ".9rem",
      },
    },
    body2: {
      fontSize: "1rem",
      "@media (max-width:960px)": {
        fontSize: "1rem",
      },
      "@media (max-width:600px)": {
        fontSize: "1rem",
      },
      "@media (max-width:480px)": {
        fontSize: ".97rem",
      },
    },
  },
});

export default theme;