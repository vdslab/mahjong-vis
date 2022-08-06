import { Box, Grid } from "@mui/material";

import { AbandonedHaiView } from "../components/AbandonedHaiView";
import { AssessmentView } from "../components/AssessmentView";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Radviz } from "../components/Radviz";
import { TehaiView } from "../components/TehaiView";
import { DecompositionView } from "../components/DecompositionView";

const Home = () => {
  return (
    <Box sx={{ bgcolor: "#f5f5f5" }}>
      <Header />
      <Grid container sx={{ p: 3 }} columnSpacing={2} rowSpacing={2}>
        <Grid item xs={3}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <AbandonedHaiView />
            </Grid>
            {/* <Grid item xs={12}>
              <DecompositionView />
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Radviz />
        </Grid>
        <Grid item xs={4}>
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
