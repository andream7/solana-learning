import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import * as React from "react";
import { clusterApiUrl } from "@solana/web3.js";
import Header from "../components/header";
import Footer from "../components/footer";
import { SnackbarProvider } from 'notistack';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Layout({ children, customHeaderButton }) {

  return (

    <SnackbarProvider maxSnack={10}>
      <CssBaseline />

      <Header  />

      <div className="container" style={{minHeight: '600px'}}>
        {children}
      </div>

      <Footer />
    </SnackbarProvider>

  );
}
