import { createMuiTheme } from '@material-ui/core';
import {colors, responsiveFontSizes} from '@material-ui/core';

export const NoteTakerTheme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: colors.purple,
    secondary: colors.green,
  },
  typography: {
    fontFamily: '"Helvetica Neue", "Raleway"'
  },
  props: {
    MuiCard: {
      raised: true
    },
    MuiAppBar: {
      position: 'sticky',
    },
    MuiContainer: {
      disableGutters: true
    },
    MuiTypography: {
      gutterBottom: true
    }
  }
}));