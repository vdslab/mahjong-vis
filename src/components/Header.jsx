import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState([0, false]);
  const menuList = ["mahjong-visとは", "役説明"];
  const handleClick = (btnId) => {
    setDialogOpen([btnId, true]);
  };
  const handleClose = (btnId) => {
    setDialogOpen([btnId, false]);
  };
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
          {menuList.map((text, idx) => {
            return (
              <ListItem key={idx}>
                <ListItemButton onClick={() => handleClick(idx)}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Dialog open={dialogOpen[1]} onClose={() => handleClose(dialogOpen[0])}>
        <Box sx={{ p: 1 }}>
          {dialogOpen[0] === 0 ? (
            <DialogContent>
              <p>{menuList[0]}</p>
            </DialogContent>
          ) : (
            <DialogContent>
              <p>{menuList[1]}</p>
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={() => handleClose(dialogOpen[0])}>閉じる</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};
