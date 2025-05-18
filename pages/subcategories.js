import React from 'react'
import CrmLayout from './components/CrmLayout'
import SubCategories from './components/SubCategories'
import { Box } from '@mui/material'

function subcategories() {
  return (
    <CrmLayout>
      <Box py={2} >
        <SubCategories />
      </Box>
     
    </CrmLayout>
  )
}

export default subcategories
