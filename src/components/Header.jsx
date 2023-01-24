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
import { WordDescriptionDialog } from "./WordDescriptionDialog";
import { WebInfoDialog } from "./WebInfoDialog";
import { OperationDialog } from "./OperationDialog";
import { ChangeMode } from "./ChamgeMode";
import { useCallback } from "react";

export const Header = () => {
  const [yakuDialogOpen, setYakuDialogOpen] = useState(false);
  const [webInfoDialogOpen, setWebInfoDialogOpen] = useState(false);
  const [wordDialogOpen, setWordDialogOpen] = useState(false);
  const [operationDialogOpen, setOperationDialogOpen] = useState(false);
  const pages = ["このサイトについて", "操作説明", "役説明", "用語集"];

  const handleClick = (btnId) => {
    if (btnId === "役説明") setYakuDialogOpen(true);
    else if (btnId === "このサイトについて") setWebInfoDialogOpen(true);
    else if (btnId === "操作説明") setOperationDialogOpen(true);
    else if (btnId === "用語集") setWordDialogOpen(true);
  };
  const handleYakuDialogClose = useCallback(() => setYakuDialogOpen(false), []);
  const handleWebInfoDialogClose = useCallback(
    () => setWebInfoDialogOpen(false),
    []
  );
  const handleWordDialogClose = useCallback(() => setWordDialogOpen(false), []);
  const handleOperationDialogClose = useCallback(
    () => setOperationDialogOpen(false),
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
      <OperationDialog
        open={operationDialogOpen}
        onClose={handleOperationDialogClose}
      />
      <YakuDescriptionDialog
        open={yakuDialogOpen}
        onClose={handleYakuDialogClose}
      />
      <WordDescriptionDialog
        open={wordDialogOpen}
        onClose={handleWordDialogClose}
      />
    </Box>
  );
};
