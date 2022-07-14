import AbondonedHaiView from "./AbandonedHaiView";
import AssessmentView from "./AssessmentView";
import { Radviz } from "./Radviz";
import TehaiView from "./TehaiView";
import { Grid } from "@mui/material";
export const Main = () => {
  return (
    <div>
      <Grid container>
        <AbondonedHaiView />
        <Radviz />
        <AssessmentView />
      </Grid>

      <TehaiView />
    </div>
  );
};
