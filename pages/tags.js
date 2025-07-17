import React from 'react'
import CrmLayout from './components/CrmLayout'
import Tags from './components/Tags'
import { Box } from '@mui/material'

function tags() {
  return (
    <CrmLayout>
      <Box py={2} > 
        <Tags />
        </Box>
    </CrmLayout>
  )
}

export default tags
