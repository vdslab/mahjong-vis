import { memo } from "react";
import { useRecoilValue } from "recoil";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import { allTileState } from "../atoms/atoms";

export const WinDialog = memo((props) => {
  const { onClose, open } = props;
  const { yaku } = useRecoilValue(allTileState);
  const displayYaku = Object.keys(yaku).filter((key) => yaku[key] === 100);

  const noDupYaku = {
    chanta: new Set(["junchan", "honroto"]),
    honitu: new Set(["chinitu"]),
    ipeko: new Set(["ryanpeko", "chitoitu", "sananko"]),
    chitoitu: new Set(["ryanpeko"]),
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
          {displayYaku.length ? (
            displayYaku.map((key, idx) => {
              if (Object.keys(noDupYaku).includes(key)) {
                for (const dupYaku of noDupYaku[key]) {
                  if (yaku[dupYaku] === 100) {
                    return;
                  }
                }
              }
              return (
                <DialogContentText key={idx} sx={{ p: 1, textAlign: "center" }}>
                  {YAKU_DESCRIPTION[key]["name"]}
                </DialogContentText>
              );
            })
          ) : (
            <DialogContentText sx={{ p: 1, textAlign: "center" }}>
              ツモ
            </DialogContentText>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
});
