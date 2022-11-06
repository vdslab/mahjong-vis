import { Fragment, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import { YakuDescriptionDialog } from "./YakuDescriptionDialog";
import { WebInfoDialog } from "./WebInfoDialog";
import { ChangeMode } from "./ChamgeMode";
import { useCallback } from "react";

export const Header = () => {
  const [yakuDialogOpen, setYakuDialogOpen] = useState(false);
  const [webInfoDialogOpen, setWebInfoDialogOpen] = useState(false);
  const pages = ["このサイトについて", "役説明"];

  const handleClick = (btnId) => {
    if (btnId === "役説明") setYakuDialogOpen(true);
    else if (btnId === "このサイトについて") setWebInfoDialogOpen(true);
  };
  const handleYakuDialogClose = useCallback(() => setYakuDialogOpen(false), []);
  const handleWebInfoDialogClose = useCallback(
    () => setWebInfoDialogOpen(false),
    []
  );

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
                  onClick={() => handleClick(page)}
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
      <WebInfoDialog
        open={webInfoDialogOpen}
        onClose={handleWebInfoDialogClose}
      />
      <YakuDescriptionDialog
        open={yakuDialogOpen}
        onClose={handleYakuDialogClose}
      />
    </Box>
  );
};
