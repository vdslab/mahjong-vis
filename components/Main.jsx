import AbondonedHaiView from "./AbandonedHaiView";
import AssessmentView from "./AssessmentView";
import RadvizChart from "./RadvizChart";
import TehaiView from "./TehaiView";
import { Grid } from "@material-ui/core";
export default function Main() {
  return (
    <div>
      <Grid container>
        <AbondonedHaiView />
        <RadvizChart />
        <AssessmentView />
      </Grid>

      <TehaiView />
    </div>
  );
}
