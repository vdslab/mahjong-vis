import { Box, Grid } from "@mui/material";

import { SuteHaiView } from "../components/SuteHaiView";
import { AssessmentView } from "../components/AssessmentView";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Radviz } from "../components/Radviz";
import { TehaiView } from "../components/TehaiView";
import { DecompositionView } from "../components/DecompositionView";
import { ShantenView } from "../components/ShantenView";
import { Container } from "@mui/system";

const Home = () => {
  return (
    <Box sx={{ bgcolor: "#f5f5f5", minWidth: "1000px" }}>
      <Header />
      <Container>
        <Grid container sx={{ p: 3 }} columnSpacing={2} rowSpacing={2}>
          <Grid item xs={3}>
            <Grid container rowSpacing={2}>
              <Grid item xs={12}>
                <SuteHaiView />
              </Grid>
              <Grid item xs={12}>
                <ShantenView />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Radviz />
          </Grid>
          <Grid item xs={5}>
            <AssessmentView />
          </Grid>
          <Grid item xs={12}>
            <TehaiView />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default Home;
