import { useRouter } from "next/router";
import {
  Box,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import CategoryIcon from "@mui/icons-material/Category";
import WidgetsIcon from "@mui/icons-material/Widgets"; // For subcategories
import PaletteIcon from "@mui/icons-material/Palette"; // For colors
import StraightenIcon from "@mui/icons-material/Straighten"; // For sizes
import LocalOfferIcon from "@mui/icons-material/LocalOffer"; // For tags
import RuleIcon from "@mui/icons-material/Rule"; // For size guide
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket"; // For product
import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon from "@mui/icons-material/Search";
// import { useAuth } from '../authcontext/AuthContext'; // Uncomment if using context

import { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";

const menuItems = [
  { id: "home", icon: <HomeIcon />, text: "Home" },
  { id: "about", icon: <InfoIcon />, text: "About" },
  { id: "contact", icon: <ContactMailIcon />, text: "Contact" },
  { id: "categories", icon: <CategoryIcon />, text: "Categories" },
  { id: "subcategories", icon: <WidgetsIcon />, text: "Subcategories" },
  { id: "colors", icon: <PaletteIcon />, text: "Colors" },
  { id: "sizes", icon: <StraightenIcon />, text: "Sizes" },
  { id: "tags", icon: <LocalOfferIcon />, text: "Tags" },
  { id: "sizeGuide", icon: <RuleIcon />, text: "Size Guide" },
  { id: "product", icon: <ShoppingBasketIcon />, text: "Product" },
  { id: "productLists", icon: <ListAltIcon />, text: "Product Lists" },
];

const CrmLayout = ({ children }) => {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    // signOut(); // Uncomment if using context
    console.log("Signed out");
  };

  const handleItemClick = (id) => {
    console.log(id);
    router.push(`/${id}`);
  };

  const isSelected = (id) => router.pathname === `/${id}`;

  return (
    <Box sx={{ width: "98%", maxWidth: "1500px", margin: "0 auto" }}>
      <Stack direction="row" spacing={2.5} sx={{ mt: 2 }}>
        {/* Sidebar */}
        <List
          sx={{
            position: "sticky",
            top: 20,
            backgroundColor: "#073064",
            width: "248px",
            borderRadius: "32px",
            px: 3.5,
            py: 5,
            height: { lg: 760, xl: 850 },
          }}
        >
          {/* Logo */}
          <Stack
            direction="column"
            spacing={1}
            justifyContent="center"
            alignItems={"center"}
            mb={2}
          >
            <img src="/maslogo.png" alt="Logo" width={100} />
            <Typography
              fontSize={12}
              className="light"
              textAlign={"center"}
              sx={{ color: "#fff" }}
            >
              MAS Content Management System
            </Typography>
          </Stack>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                cursor: "pointer",
                width: "100%",
                height: "48px",
                color: isSelected(item.id) ? "#fff" : "#fff",
                borderRadius: "12px",
                mb: 1,
                backgroundColor: isSelected(item.id)
                  ? "#940f25"
                  : "transparent",
                "&:hover": {
                  backgroundColor: isSelected(item.id)
                    ? "#940f25"
                    : "rgba(255, 255, 255, 0.1)",
                },
              }}
              onClick={() => handleItemClick(item.id)}
            >
              <ListItemIcon
                sx={{
                  color: isSelected(item.id) ? "#fff" : "#fff",
                  minWidth: "40px",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    className={isSelected(item.id) ? "light" : "Medium"}
                    style={{ fontSize: 14 }}
                  >
                    {item.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        {/* Main Content */}
        <Box pt={2} width="100%">
          {/* Top Bar */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", pr: 3 }}
          >
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
                {/* <img src="/assets/Group102.png" alt="Notif" width={30} /> */}
              </IconButton>
              <IconButton>
                {/* <img src="/assets/Group101.png" alt="Message" width={30} /> */}
              </IconButton>
              <Stack spacing={3} direction="row" alignItems="center">
                {/* <img src="/assets/user.png" alt="User" width={40} /> */}
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
                      <img
                        src="/assets/angle-circle-right.png"
                        alt="Expand"
                        width={20}
                      />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
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

          <Box mt={4}>{children}</Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default CrmLayout;
