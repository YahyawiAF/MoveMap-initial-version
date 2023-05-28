import React from 'react';
import Link from 'next/link';
import { Box, Link as MUILink } from '@material-ui/core';

export default function Footer() {
  return (
    <Box display="flex" justifyContent="center" paddingTop={10} paddingBottom={10}>
      <Link href='/about/data'>
        <a target="_blank">
          <MUILink>
            About the data
          </MUILink>
        </a>
      </Link>
    </Box>
  );
}
