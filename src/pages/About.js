// pages/About.js
import React from "react";
import { Typography, Box } from "@mui/material";

const About = () => {
  return (
    <Box p={2}>
      <Typography variant="h4">About Page</Typography>
      <Typography variant="body1" mt={2}>
        This is a demo app showcasing (Created by Prem S. Bharti):
        <ul>
          <li>Lazy loading components</li>
          <li>Material UI integration</li>
          <li>Axios for API calls</li>
          <li>React Router for navigation</li>
        </ul>
      </Typography>
    </Box>
  );
};

export default About;
