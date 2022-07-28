import { Box, Grid } from "@mui/material";

import { AbandonedHaiView } from "../components/AbandonedHaiView";
import { AssessmentView } from "../components/AssessmentView";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Radvis } from "../components/Radvis";
import { TehaiView } from "../components/TehaiView";
import { Calc } from "../components/calc";

const Home = () => {
  return (
    <Box sx={{ bgcolor: "#f5f5f5" }}>
      {/* <Header />
      <Grid container sx={{ p: 3 }} columnSpacing={2} rowSpacing={2}>
        <Grid item xs={3}>
          <AbandonedHaiView />
        </Grid>
        <Grid item xs={6}> */}
      <Radvis />
      {/* <Calc /> */}
      {/* </Grid>
        <Grid item xs={3}>
          <AssessmentView />
        </Grid>
        <Grid item xs={12}>
          <TehaiView />
        </Grid>
      </Grid>
      <Footer /> */}
    </Box>
  );
};

export default Home;
