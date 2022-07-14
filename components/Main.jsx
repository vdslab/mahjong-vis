import AbondonedHaiView from "./AbandonedHaiView";
import AssessmentView from "./AssessmentView";
// import { RadvizChart } from "./RadvizChart";
import TehaiView from "./TehaiView";
import { Grid } from "@mui/material";
export const Main = () => {
  return (
    <div>
      <Grid container>
        <AbondonedHaiView />
        {/* <RadvizChart /> */}
        <AssessmentView />
      </Grid>

      <TehaiView />
    </div>
  );
};
