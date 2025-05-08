import { Stack, TextField, Typography } from '@mui/material'
import React from 'react'

const FormField = ({ title, value, placeholder, onChange,type }) => {
    return (
        <Stack direction={"column"} spacing={1} width={"100%"}>
            <Typography color="#B5B5B5" className='Medium' fontSize={14}>{title}</Typography>
            <TextField
                placeholder={placeholder}
                variant="outlined"
                fullWidth
                size='small'
                value={value}
                onChange={onChange}
                type={type}
            />
        </Stack>
    )
}

export default FormField
