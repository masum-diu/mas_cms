import React from 'react'
import CrmLayout from './components/CrmLayout'
import MediaCoverage from './components/MediaCoverage'
import { Box } from '@mui/material'

function MediaCoveragePage() {
  return (
    <CrmLayout>
      <Box py={2}>
        <MediaCoverage />
      </Box>
    </CrmLayout>
  )
}

export default MediaCoveragePage

