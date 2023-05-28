import {createTheme, responsiveFontSizes } from '@material-ui/core';
import { Shadows } from '@material-ui/core/styles/shadows';
import consts from 'const';

const LIGHT_GRAY_BORDER = '1px solid lightGray';

let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 850,
      lg: 1200,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      light: "#898389",
      main: "#5D5D61",
      dark: "#333336",
    },
    secondary: {
      light: consts.logoColors.paleBlue,
      main: consts.logoColors.mediumBlue,
      dark: consts.logoColors.veryDarkBlue,
    },
    background: {
      default: "#fff",
    },
    success: {
      light: "#81c784",
      main: "#66bb6a",
      dark: "#388e3c",
    },
  },
  typography: {
    fontFamily: "Helvetica",
    caption: {
      fontSize: 14,
    },
    h1: {
      fontSize: 30,
      lineHeight: 2,
    },
    h2: {
      fontSize: 26,
      fontWeight: 400,
      lineHeight: 2,
    },
    h3: {
      fontSize: 24,
      fontWeight: 500,
      lineHeight: 1,
    },
    h4: {
      fontSize: 22,
      fontWeight: 400,
      lineHeight: 1,
    },
    h5: {
      fontSize: 20,
      fontWeight: 600,
      lineHeight: 1,
    },
  },
  shadows: Array(25).fill('none') as Shadows,
  spacing: 4,
  props: {
    MuiAppBar: {
      color: 'default',
    },
    MuiButtonBase: {
      disableRipple: true // No more ripple, on the whole application!
    },
    MuiButton: {
      disableRipple: true,
      variant: "contained",
      color: 'primary',
      size: 'small',
    },
    MuiSelect: {
      variant: 'outlined'
    },
    MuiList: {
      dense: true,
    },
    MuiMenuItem: {
      dense: true,
    },
    MuiTable: {
      size: 'small',
    },
    MuiButtonGroup: {
      size: 'small',
    },
    MuiCheckbox: {
      size: 'small',
    },
    MuiFab: {
      size: 'small',
    },
    MuiFormControl: {
      margin: 'dense',
      size: 'small',
    },
    MuiFormHelperText: {
      margin: 'dense',
    },
    MuiIconButton: {
      size: 'small',
    },
    MuiInputBase: {
      margin: 'dense',
    },
    MuiInputLabel: {
      margin: 'dense',
    },
    MuiRadio: {
      size: 'small',
    },
    MuiTextField: {
      margin: 'dense',
      size: 'small',
    },
  },
  overrides: {
    MuiSelect: {
      root: {
        padding: '10px',
      }
    },
    MuiCheckbox: {
      root: {
        padding: '2px'
      }
    },
    MuiAppBar: {
      root: {
        outline: LIGHT_GRAY_BORDER,
      },
      colorDefault: {
        backgroundColor: "white"
      }
    },
    MuiMenu: {
      paper: {
        border: LIGHT_GRAY_BORDER
      }
    },
    MuiSwitch: {
      thumb: {
        border: LIGHT_GRAY_BORDER
      }
    }
  },
});
theme = responsiveFontSizes(theme, {factor: 2});
export default theme;