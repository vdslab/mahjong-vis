import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import { useRecoilValue } from "recoil";
import { allTileState } from "../atoms/atoms";

export const WinDialog = memo((props) => {
  const { onClose, open } = props;
  const { yaku } = useRecoilValue(allTileState);

  const noDupYaku = {
    chanta: ["junchan", "honroto"],
    honitu: ["chinitu"],
    ipeko: ["ryanpeko", "chitoitu"],
    chitoitu: ["ryanpeko"],
  };

  return (
    <Dialog onClose={onClose} open={open} sx={{ p: 1 }}>
      <Stack direction="row" sx={{ p: 1 }}>
        <Typography sx={{ pl: 1, fontSize: 30, flexGrow: 1 }}>結果</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent>
        <Stack sx={{ p: 1, minWidth: 200 }}>
          {Object.keys(yaku).length !== 0 &&
            Object.keys(yaku)
              .filter((key) => yaku[key] === 100)
              .map((key, idx) => {
                if (Object.keys(noDupYaku).includes(key)) {
                  for (const dupYaku of noDupYaku[key]) {
                    if (yaku[dupYaku] === 100) {
                      return;
                    }
                  }
                }
                return (
                  <DialogContentText
                    key={idx}
                    sx={{ p: 1, textAlign: "center" }}
                  >
                    {YAKU_DESCRIPTION[key]["name"]}
                  </DialogContentText>
                );
              })}
        </Stack>
      </DialogContent>
    </Dialog>
  );
});
