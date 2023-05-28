import { Box, Container, Typography, ThemeProvider, CssBaseline, Link } from '@material-ui/core';
import Head from 'next/head';
import theme from 'lib/theme';
import Header from 'components/Header';

export default function Help() {
  return (
    <div>
      <Head>
        <title>Help</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />  
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <main>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header title={'Help'} />
          <Container>
            <Box paddingY={4}>
              <Box paddingY={4}>
              <Typography variant="h2">What is movemap?</Typography>
              <Typography>Movemap is a tool that you can use to figure out where to live next based on your preferences and tastes.  Watch the 1 minute video to learn how to use it.</Typography>
              </Box>
              <Box
                className="video-responsive"
              >
              <iframe
                src="https://www.youtube.com/embed/J1VQE2tGiww"
                title="Movemap help"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </main>
    </div>
  );
}