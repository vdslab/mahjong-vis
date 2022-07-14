import { useRecoilValue } from "recoil";
import { haiState, suteHaiListState } from "./atoms";
import { Grid, Card } from "@material-ui/core";
export default function AbandonedHaiView() {
  const suteHaiList = useRecoilValue(suteHaiListState);
  return (
    <Grid item xs={4}>
      <Card style={{ height: "300px" }}>
        <p>捨て牌</p>
        <Grid container>
          {suteHaiList.map((item, idx) => {
            return (
              <Grid item key={idx} xs={2}>
                {item}
              </Grid>
            );
          })}
        </Grid>
      </Card>
    </Grid>
  );
}
