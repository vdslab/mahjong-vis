import AbondonedHaiView from "./AbandonedHaiView";
import AssessmentView from "./AssessmentView";
import TehaiView from "./TehaiView";
import { Grid } from "@mui/material";
export const Main = () => {
  return (
    <div>
      <Grid container>
        <AbondonedHaiView />
        <AssessmentView />
      </Grid>

      <TehaiView />
    </div>
  );
};
