import { useRecoilValue } from "recoil";
import { suteHaiListState } from "./atoms";
import { Card, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { changeHaiName2Path } from "./TehaiView";

export const AbandonedHaiView = () => {
  const suteHaiList = useRecoilValue(suteHaiListState);

  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        河
      </Typography>
      <Grid container>
        {suteHaiList.map((item, idx) => {
          return (
            <Grid item key={idx} xs={2}>
              <Image
                src={changeHaiName2Path(item)}
                width="100%"
                height="100%"
              />
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
};
