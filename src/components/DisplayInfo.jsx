import { Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { tehaiState } from "./atoms";
import { defineFeature } from "../functions/defineFeature";
import { defineYaku } from "../functions/defineYaku";
import { useRecoilValue } from "recoil";

export const DisplayInfo = (props) => {
  const { onClose, open } = props;
  if (open === false) {
    return <></>;
  }
  const { featureList, shanten } = defineFeature(useRecoilValue(tehaiState));
  const data1 = defineYaku(featureList, 14, 0);
  const YakuNameDisplaied = {
    chanta: "混全帯么九",
    chinitu: "清一色",
    chitoitu: "七対子",
    honitu: "混一色",
    honroto: "混老頭",
    ipeko: "一盃口",
    ittu: "一気通貫",
    junchan: "純全帯么九",
    pinfu: "平和",
    ryanpeko: "二盃口",
    sananko: "三暗刻",
    sangenhai: "三元牌",
    sankantu: "三槓子",
    sanshoku_dojun: "三色同順",
    sanshoku_douko: "三色同刻",
    shosangen: "小三元",
    shousangen: "小三元",
    tanyao: "断么九",
    toitoiho: "対々和",
    zikaze_bakaze: "字牌,場風",
  };
  const noDupYaku = {
    chanta: ["junchan", "honroto"],
    honitu: ["chinitu"],
    ipeko: ["ryanpeko"],
  };
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>結果</DialogTitle>
      <Stack sx={{ p: 1 }}>
        {Object.keys(data1).map((key, idx) => {
          if (data1[key] === 100) {
            if (Object.keys(noDupYaku).includes(key)) {
              noDupYaku[key].map((yaku) => {
                if (data1[yaku] === 100) {
                  return <></>;
                }
                return (
                  <Typography key={idx}>{YakuNameDisplaied[key]}</Typography>
                );
              });
            } else {
              return (
                <Typography key={idx}>{YakuNameDisplaied[key]}</Typography>
              );
            }
          }
        })}
      </Stack>
    </Dialog>
  );
};
