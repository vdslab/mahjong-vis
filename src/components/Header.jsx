import { Fragment, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Toolbar,
  Typography,
  DialogTitle,
  Divider,
} from "@mui/material";
import { YakuDescription } from "./YakuDescription";
import { WebInfo } from "./WebInfo";
import { ChangeMode } from "./ChamgeMode";

export const Header = () => {
  const [dialogOpen, setDialogOpen] = useState([0, false]);
  const pages = ["このサイトについて", "役説明"];

  const handleClick = (btnId) => setDialogOpen([btnId, true]);
  const handleClose = (btnId) => setDialogOpen([btnId, false]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ pl: 1 }}>
            mahjong-vis
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ p: 1 }} />
          <Box sx={{ display: "flex" }}>
            {pages.map((page, idx) => (
              <Fragment key={page}>
                <Button
                  onClick={() => handleClick(idx)}
                  sx={{ color: "white", display: "block" }}
                >
                  {page}
                </Button>
                {idx !== pages.length - 1 && (
                  <Divider orientation="vertical" flexItem />
                )}
              </Fragment>
            ))}
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ ml: "auto" }}>
            <ChangeMode />
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog open={dialogOpen[1]} onClose={() => handleClose(dialogOpen[0])}>
        <Box sx={{ p: 1 }}>
          {dialogOpen[0] === 0 ? (
            <DialogContent>
              <DialogTitle sx={{ fontSize: "40px" }}>{pages[0]}</DialogTitle>
            </DialogContent>
          ) : (
            <DialogContent>
              <DialogTitle sx={{ fontSize: "40px" }}>{pages[1]}</DialogTitle>
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
