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
      color: "primary.main",
    },
    h3: {
      fontFamily: jakarta.style.fontFamily,
      color: "primary.main",
    },
    h4: {
      fontFamily: jakarta.style.fontFamily,
      color: "primary.main",
    },
    h5: {
      fontFamily: jakarta.style.fontFamily,
      color: "primary.main",
    },
    h6: {
      fontFamily: jakarta.style.fontFamily,
      color: "primary.main",
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
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
        },
      },
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
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            borderRadius: "0.5rem",
            "& .MuiInputLabel-root": {
              color: "gray",
            }
            
          }
        }
      },
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
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "1rem",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: "0.5rem",
        },
      },
    },
    
    
  }
};

export default lightThemeOptions;