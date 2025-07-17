import React from 'react'
import CrmLayout from './components/CrmLayout'
import Products from './components/Products'
import { Box } from '@mui/material'

function product() {
  return (
    <CrmLayout>
      <Box py={2} >
        <Products />
      </Box>

    </CrmLayout>
  )
}

export default product
