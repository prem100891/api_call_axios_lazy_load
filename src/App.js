// App.js
import React, { Suspense, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

// Lazy-loaded pages
const ProductList = React.lazy(() => import("./ProductList"));
const About = React.lazy(() => import("./pages/About"));

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerContent = (
    <List>
      <ListItem button component={Link} to="/" onClick={toggleDrawer}>
        <HomeIcon sx={{ mr: 1 }} />
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/about" onClick={toggleDrawer}>
        <InfoIcon sx={{ mr: 1 }} />
        <ListItemText primary="About" />
      </ListItem>
    </List>
  );

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🛒 Lazy Loaded Product List
          </Typography>
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

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        {drawerContent}
      </Drawer>

      <Suspense fallback={<p style={{ padding: '20px' }}>Loading Page...</p>}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
