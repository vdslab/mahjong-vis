import { memo } from "react";
import { Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { defineFeature } from "../functions/defineFeature";
import { defineYaku } from "../functions/defineYaku";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import { useRecoilValue } from "recoil";
import { tehaiState } from "../atoms/atoms";

export const WinDialog = memo((props) => {
  const { onClose, open } = props;
  const { featureList, shanten } = defineFeature(useRecoilValue(tehaiState));
  const data1 = defineYaku(featureList, 14, 0);

  const noDupYaku = {
    chanta: ["junchan", "honroto"],
    honitu: ["chinitu"],
    ipeko: ["ryanpeko"],
  };

  return (
    open && (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>結果</DialogTitle>
        <Stack sx={{ p: 1 }}>
          {Object.keys(data1)
            .filter((key) => data1[key] === 100)
            .map((key, idx) => {
              if (Object.keys(noDupYaku).includes(key)) {
                for (const dupYaku of noDupYaku[key]) {
                  if (data1[dupYaku] === 100) {
                    return;
                  }
                }
              }
              return <Typography key={idx}>{YAKU_DESCRIPTION[key]}</Typography>;
            })}
        </Stack>
      </Dialog>
    )
  );
});
