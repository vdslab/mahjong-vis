import * as React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export const Header = () => {
  return (
    <header style={{ marginBottom: "50px" }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              麻雀機
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};
