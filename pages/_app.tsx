import React, { useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import 'styles.css';
import { useRouter } from 'next/router';
import { initGA, logPageView } from "utils/analytics"


function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const handleRouteChange = (url, { shallow }) => {
    if (!shallow) { // if it's a shallow route change it was just url params change, not a new page
      logPageView(window.location.pathname);
    }
  }


  useEffect(() => {
    if (typeof (window) === undefined) return; // don't do anything on server, only
    
    if (!(window as any).GA_INITIALIZED) {
      initGA();
      (window as any).GA_INITIALIZED = true;
    }
    logPageView(window.location.pathname); // log the initial pageview

    router.events.on("routeChangeComplete", handleRouteChange); // listen for other router changes and log subsequent pageviews
  
    return () => {
      if (typeof (window) === undefined) return
      router.events.off("routeChangeComplete", handleRouteChange); // on unmount, stop listening
    };
  
  }, [router.events]);

  return (
    <React.Fragment>
      <CssBaseline />
      <Component {...pageProps} />
    </React.Fragment>
  )
}

export default MyApp;