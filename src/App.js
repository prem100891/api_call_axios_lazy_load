// App.js
import React, { Suspense, useState } from "react"; // Core React imports
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // React Router for navigation

// MUI components for building the app layout and responsiveness
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
} from "@mui/material";

// Icons from MUI Icons library
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

// Lazy-loaded pages using React.lazy() for performance (code splitting)
const ProductList = React.lazy(() => import("./ProductList")); // Loads only when needed
const About = React.lazy(() => import("./pages/About"));

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false); // Sidebar drawer toggle state
  const isMobile = useMediaQuery('(max-width:600px)'); // Check if screen size is mobile

  // Toggle drawer open/close
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Sidebar drawer content for mobile view
  const drawerContent = (
    <List>
      {/* Home link */}
      <ListItem button component={Link} to="/" onClick={toggleDrawer}>
        <HomeIcon sx={{ mr: 1 }} />
        <ListItemText primary="Home" />
      </ListItem>
      {/* About link */}
      <ListItem button component={Link} to="/about" onClick={toggleDrawer}>
        <InfoIcon sx={{ mr: 1 }} />
        <ListItemText primary="About" />
      </ListItem>
    </List>
  );

  return (
    <Router>
      {/* Top navigation bar */}
      <AppBar position="static">
        <Toolbar>
          {/* Show hamburger menu icon on mobile */}
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}

          {/* App title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🛒 Lazy Loaded Product List
          </Typography>

          {/* Show navigation buttons on desktop */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button color="inherit" component={Link} to="/">
                <HomeIcon sx={{ mr: 0.5 }} /> Home
              </Button>
              <Button color="inherit" component={Link} to="/about">
                <InfoIcon sx={{ mr: 0.5 }} /> About
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar drawer for mobile menu */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        {drawerContent}
      </Drawer>

      {/* Lazy-loaded route rendering with fallback loader */}
      <Suspense fallback={<p style={{ padding: '20px' }}>Loading Page...</p>}>
        <Routes>
          {/* Home route loads ProductList */}
          <Route path="/" element={<ProductList />} />
          {/* About route loads About page */}
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App; // Export App component
