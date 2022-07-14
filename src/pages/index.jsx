import { Box, Grid } from "@mui/material";

import { AbandonedHaiView } from "../../components/AbandonedHaiView";
import { AssessmentView } from "../../components/AssessmentView";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Radviz } from "../../components/Radviz";
import { TehaiView } from "../../components/TehaiView";

const Home = () => {
  return (
    <Box sx={{ bgcolor: "#f5f5f5" }}>
      <Header />
      <Grid container sx={{ p: 3 }} columnSpacing={2} rowSpacing={2}>
        <Grid item xs={3}>
          <AbandonedHaiView />
        </Grid>
        <Grid item xs={6}>
          <Radviz />
        </Grid>
        <Grid item xs={3}>
          <AssessmentView />
        </Grid>
        <Grid item xs={12}>
          <TehaiView />
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default Home;
