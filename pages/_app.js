import '../styles/globals.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../lib/theme';
import { AuthProvider } from '../contexts/AuthContext';


export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
