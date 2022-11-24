import { Box, Container } from "@mui/material";
import { SuteHaiView } from "../components/SuteHaiView";
import { AssessmentView } from "../components/AssessmentView";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Radviz } from "../components/Radviz";
import { TehaiView } from "../components/TehaiView";
import { DecompositionView } from "../components/DecompositionView";
import { ShantenView } from "../components/ShantenView";

const Home = () => {
  const viewHeight = 380 - 12;
  return (
    <Box sx={{ bgcolor: "#f5f5f5", minWidth: "1000px" }}>
      <Header />
      <Container>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "264px",
              height: viewHeight,
              flexFlow: "column",
              marginRight: "20px",
            }}
          >
            <SuteHaiView />
            <ShantenView />
          </Box>
          <Box sx={{ width: "350px", height: viewHeight, marginRight: "20px" }}>
            <Radviz />
          </Box>
          <Box sx={{ width: "420px", height: viewHeight }}>
            <AssessmentView />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            height: "150px",
            width: "100%",
            marginTop: "20px",
            // marginBottom: "20px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TehaiView />
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            marginTop: "10px",
            marginBottom: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DecompositionView />
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Home;
