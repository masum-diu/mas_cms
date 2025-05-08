import { useRouter } from 'next/router';
import {
  Box, InputAdornment, Stack, TextField, Typography, IconButton, MenuItem, Menu,
  List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
// import { useAuth } from '../authcontext/AuthContext'; // Uncomment if using context

import { useState } from 'react';

const selectedBackgroundImage = '/assets/Setting.png'; // Make sure this file exists and has transparency

const menuItems = [
  { id: 'home', icon: <DashboardIcon />, text: 'Home' },
  // Add more menu items here
];

const CrmLayout = ({ children }) => {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  // const { signOut, token } = useAuth(); // Uncomment if using context

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    // signOut(); // Uncomment if using context
    console.log('Signed out');
  };

  const handleItemClick = (id) => {
    router.push(`/${id}`);
  };

  const isSelected = (id) => router.pathname.includes(id);

  return (
    <Box sx={{ width: "98%", maxWidth: "1500px", margin: "0 auto" }}>
      <Stack direction="row" spacing={2.5} sx={{ mt: 2 }}>
        {/* Sidebar */}
        <List sx={{
          position: "sticky",
          top: 20,
          backgroundColor: "#073064",
          width: '248px',
          borderRadius: "32px",
          px: 3.5,
          py: 5,
          height: { lg: 760, xl: 850 },
        }}>
          {/* Logo */}
          <Stack direction="row" justifyContent="center" pb={4}>
            <img src="/assets/logo.png" alt="Logo" width={120} />
          </Stack>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                width: '100%',
                height: '48px',
                color: isSelected(item.id) ? '#073064' : '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
              onClick={() => handleItemClick(item.id)}
            >
              {isSelected(item.id) && (
                <Box
                  component="img"
                  src={selectedBackgroundImage}
                  alt="Selected"
                  sx={{
                    position: 'absolute',
                    top: '-8px',
                    left: '-12px',
                    width: '222px',
                    zIndex: 0,
                  }}
                />
              )}
              <ListItemIcon sx={{ color: isSelected(item.id) ? '#073064' : '#fff', zIndex: 1 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography fontWeight="500" fontSize={14} zIndex={1}>
                    {item.text}
                  </Typography>
                }
                sx={{ zIndex: 1 }}
              />
            </ListItem>
          ))}
        </List>

        {/* Main Content */}
        <Box pt={2} width="100%">
          {/* Top Bar */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', pr: 3 }}>
            <TextField
              size="small"
              placeholder="Search..."
              sx={{ width: "342px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Stack spacing={4} direction="row" alignItems="center">
              <IconButton>
                <img src="/assets/Group102.png" alt="Notif" width={30} />
              </IconButton>
              <IconButton>
                <img src="/assets/Group101.png" alt="Message" width={30} />
              </IconButton>
              <Stack spacing={3} direction="row" alignItems="center">
                <img src="/assets/user.png" alt="User" width={40} />
                <Stack direction="column" alignItems="flex-start" pt={1}>
                  <Typography fontWeight="500" fontSize={16} color="#073064">
                    John Doe
                  </Typography>
                  <Typography fontSize={12} color="#5A5A5A">
                    Admin
                  </Typography>
                </Stack>
                {auth && (
                  <Box>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <img src="/assets/angle-circle-right.png" alt="Expand" width={20} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                    </Menu>
                  </Box>
                )}
              </Stack>
            </Stack>
          </Stack>

          {/* Page Content */}
          <Box mt={4}>
            {children}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default CrmLayout;
