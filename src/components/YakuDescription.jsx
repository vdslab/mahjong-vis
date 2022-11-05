import Image from "next/image";
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
            <Box key={i}>
              <Box style={{ textAlign: 'right' }}>
                <Typography variant="h4" style={{ textAlign: 'left' }}>
                    ・{YAKU_DESCRIPTION[item]["name"]}
                    {YAKU_DESCRIPTION[item]["menzen"] === true ? (
                        <Typography variant="h6" sx={{ display:"inline", textAlign:'right' }}>
                        ・翻：{YAKU_DESCRIPTION[item]["han"]}（鳴き不可）
                        </Typography>
                    ) : (
                        <Typography variant="h6" display="inline">
                        ・翻：{YAKU_DESCRIPTION[item]["han"]}　・喰い下がり：
                        {YAKU_DESCRIPTION[item]["kuiHan"]}
                        </Typography>
                    )}
                </Typography>
              </Box>
                
                
              <Typography variant="h6">
                {YAKU_DESCRIPTION[item]["description"]}
              </Typography>
              <Image
                src={`/images/hai_ex/${item}.png`}
                width="550"
                height="50"
                alt="Image"
              />
              <Typography paragraph></Typography>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};