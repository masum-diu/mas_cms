import React from 'react'
import CrmLayout from './components/CrmLayout'
import Colors from './components/Colors'
import { Box } from '@mui/material'

function colors() {
  return (
    <CrmLayout>
      <Box py={2} >
        <Colors />
      </Box>
    </CrmLayout>
  )
}

export default colors
