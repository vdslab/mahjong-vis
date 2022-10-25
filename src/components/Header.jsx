import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  DialogTitle,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { YakuDescription } from "./YakuDescription";
import { WebInfo } from "./WebInfo";
import { ChangeMode } from "./ChamgeMode";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState([0, false]);
  const menuList = ["このサイトについて", "役説明"];
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
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ pl: 2, flexGrow: 1 }}>
            mahjong-vis
          </Typography>
          <ChangeMode />
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
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
              <DialogTitle sx={{ fontSize: "40px" }}>{menuList[0]}</DialogTitle>
            </DialogContent>
          ) : (
            <DialogContent>
              <DialogTitle sx={{ fontSize: "40px" }}>{menuList[1]}</DialogTitle>
            </DialogContent>
          )}
          {dialogOpen[0] === 0 ? (
            <DialogActions>
              <Stack spacing={2}>
                <WebInfo />
                <Button
                  sx={{ p: 1 }}
                  variant="contained"
                  size="large"
                  onClick={() => handleClose(dialogOpen[0])}
                >
                  閉じる
                </Button>
              </Stack>
            </DialogActions>
          ) : (
            <DialogActions>
              <Stack spacing={2}>
                <YakuDescription />
                <Button
                  sx={{ p: 1 }}
                  variant="contained"
                  size="large"
                  onClick={() => handleClose(dialogOpen[0])}
                >
                  閉じる
                </Button>
              </Stack>
            </DialogActions>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};
