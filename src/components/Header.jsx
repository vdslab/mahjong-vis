import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            mahjong-vis
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <List>
          {["a", "b", "help"].map((text, idx) => {
            return <ListItem key={idx}>{text}</ListItem>;
          })}
        </List>
      </Drawer>
    </Box>
  );
};
