import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import { Box, Card, CardContent, Typography } from "@mui/material";

export const YakuDescription = () => {
  const list = [
    "zikaze_bakaze",
    "sangenhai",
    "tanyao",
    "pinfu",
    "ipeko",
    "sanshoku_dojun",
    "sanshoku_douko",
    "sananko",
    "ittu",
    "chitoitu",
    "toitoiho",
    "chanta",
    "sankantu",
    "shosangen",
    "honroto",
    "ryanpeko",
    "junchan",
    "honitu",
    "chinitu",
  ];

  return (
    <Card>
      <CardContent>
        {list.map((item, i) => {
          return (
            <Box key={i} sx={{ p: 1, pb: 1 }}>
              <Typography variant="h4">
                ・{YAKU_DESCRIPTION[item]["name"]}
              </Typography>
              <Typography variant="h6">
                ・翻：{YAKU_DESCRIPTION[item]["han"]}　・喰い下がり：
                {YAKU_DESCRIPTION[item]["kuiHan"]}
              </Typography>
              <Typography variant="h6">
                {YAKU_DESCRIPTION[item]["description"]}
              </Typography>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};
