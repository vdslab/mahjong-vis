import { useRecoilValue } from "recoil";
import { haiState, suteHaiListState } from "./atoms";
import { Grid, Card } from "@mui/material";
import { chengeHaiName2Path } from "./TehaiView";
import Image from "next/image";
export default function AbandonedHaiView() {
  const suteHaiList = useRecoilValue(suteHaiListState);
  return (
    <Grid item xs={2}>
      <Card style={{ height: "300px" }}>
        <p>捨て牌</p>
        <Grid container>
          {suteHaiList.map((item, idx) => {
            return (
              <Grid item key={idx} xs={2}>
                <Image
                  src={chengeHaiName2Path(item)}
                  width="100%"
                  height="100%"
                />
              </Grid>
            );
          })}
        </Grid>
      </Card>
    </Grid>
  );
}
