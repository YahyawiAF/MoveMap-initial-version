import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 760,
      lg: 1080,
      xl: 1620,
    },
  },
})

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <header className="App-header">
        </header>
      </ThemeProvider>
    </div>
  );
}

export default App;