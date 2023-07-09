import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';

export default function PaginationRounded({pageInfo, setPage}: any) {
  const {
    totalPages,
    page
  } = pageInfo || {}

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Pagination
        count={totalPages}
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={(e, value) => setPage(value)}
      />
    </Box>
  );
}