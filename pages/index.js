import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Stack, Typography, TextField, Button, Grid, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        router.push('/home')
        e.preventDefault();
        setLoading(true);
        try {
            const response = await instance.post(
                '/auth/signin?for=login-request',
                { email, password },

            );

            localStorage.setItem('token', response?.data?.token)





        } catch (error) {
            // toast.error('Login failed. Please try again.');
            console.error('Authentication failed:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Grid container spacing={0} >
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <Stack direction={"column"} sx={{ width: '100%', maxWidth: '400px', mx: 'auto' }}>
                    <Stack mb={3} direction={"column"} justifyContent={"center"} alignItems={"center"} spacing={1} >
                        <img src="/logo.png" alt="" style={{ width: "100px" }} />
                        <Typography variant="h6" className='bold' sx={{  color: 'primary.main' }}>
                        MAS Content Management System
                        </Typography>

                    </Stack>
                    <Typography pb={4} fontSize={36} className='bold' color="initial" textAlign="center">Login Account</Typography>
                    <form onSubmit={handleLogin} style={{ width: "100%" }}>
                        <Stack direction={"column"} spacing={1}>
                            <label>Email address</label>
                            <TextField
                                size='small'
                                placeholder='Enter email address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                            />
                            <label></label>
                            <label>Password</label>
                            <TextField
                                size='small'
                                placeholder='Enter password'
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <label></label>
                            {
                                loading ? <CircularProgress style={{ width: '100%', display: "flex", justifyContent: "center" }} size={20} /> : <Button variant="contained" className='SemiBold' sx={{ textTransform: "capitalize", fontSize: 18 }} type='submit' color="background2" disabled={loading}>
                                    Login
                                </Button>
                            }

                        </Stack>
                    </form>
                </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ height: '100vh', display: { xs: 'none', lg: 'block' }, overflow: 'hidden' }}>
                <Box
                    component="img"
                    src="/shirt-mockup-concept-with-plain-clothing.jpg"
                    alt="Login background"
                    sx={{
                        height: "100%",
                        width: "100%",
                        overflowY: "hidden",
                        objectFit: "cover",
                        objectPosition: "center",
                    }}
                />
            </Grid>

        </Grid>
    );
};

export default Login;
