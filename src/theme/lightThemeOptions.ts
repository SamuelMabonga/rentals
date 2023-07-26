import { ThemeOptions } from '@mui/material/styles';
// import { Satoshi } from 'next/font/google';
import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#7C27D2",
      dark: "#360666",
      light: "#F2EEF6",
      // contrastText: ""
    },
    secondary: {
      main: "#100323",
      light: "#18082F",
      contrastText: "",
      dark: ""
    }
  },
  typography: {
    h1: {
      fontFamily: jakarta.style.fontFamily,
      color: "primary.main",
      
    },
    h2: {
      fontFamily: jakarta.style.fontFamily,
    },
    h3: {
      fontFamily: jakarta.style.fontFamily,
    },
    h4: {
      fontFamily: jakarta.style.fontFamily,
    },
    h5: {
      fontFamily: jakarta.style.fontFamily,
    },
    h6: {
      fontFamily: jakarta.style.fontFamily,
    },
    body1: {
      fontFamily: jakarta.style.fontFamily,
    },
    body2: {
      fontFamily: jakarta.style.fontFamily,
    }
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: {
            backgroundColor: "primary.main",
            fontFamily: jakarta.style.fontFamily,
            fontWeight: "900",
            fontSize: "1rem",
            textTransform: "capitalize"
            // font
          }
        },
        {
          props: { variant: "outlined" },
          style: {
            borderColor: "primary.main",
            fontFamily: jakarta.style.fontFamily,
            fontWeight: "900",
            fontSize: "1rem",
            textTransform: "capitalize"
            // font
          }
        },
        {
          props: { variant: "text" },
          style: {
            borderColor: "primary.main",
            fontFamily: jakarta.style.fontFamily,
            fontWeight: "900",
            fontSize: "1rem",
            textTransform: "capitalize",
            width: "fit-content"
            // font
          }
        }
      ]
    },
    MuiTextField: {
      variants: [
        {
          props: {variant: "outlined"},
          style: {
            "&.MuiTextField-root": {
                color: 'secondary.main',
                borderRadius: "1rem"
            }
          }
        },
      ]
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "&.MuiTabs-root": {
            fontFamily: jakarta.style.fontFamily,
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.MuiTab-root": {
            fontFamily: jakarta.style.fontFamily,
          }
        }
      }
    }
  }
};

export default lightThemeOptions;