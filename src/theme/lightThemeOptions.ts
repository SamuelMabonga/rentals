import { ThemeOptions } from '@mui/material/styles';
// import { Satoshi } from 'next/font/google';

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
      fontFamily: "Satoshi",
      color: "primary.main"
    },
    h2: {
      fontFamily: "Satoshi"
    },
    h3: {
      fontFamily: "Satoshi"
    },
    h4: {
      fontFamily: "Satoshi"
    },
    h5: {
      fontFamily: "Satoshi"
    },
    h6: {
      fontFamily: "Satoshi"
    },
    body1: {
      fontFamily: "Satoshi"
    },
    body2: {
      fontFamily: "Satoshi"
    }
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: {
            backgroundColor: "primary.main",
            fontFamily: "Satoshi",
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
            fontFamily: "Satoshi",
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
            fontFamily: "Satoshi",
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
        }
      ]
    }
  }
};

export default lightThemeOptions;