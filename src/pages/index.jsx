import { SuteHaiView } from "../components/SuteHaiView";
import { AssessmentView } from "../components/AssessmentView";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Radviz } from "../components/Radviz";
import { TehaiView } from "../components/TehaiView";
import { DecompositionView } from "../components/DecompositionView";
import { ShantenView } from "../components/ShantenView";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useInterval } from "../functions/useInterval";

const Home = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [count, setCount] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [dist, setDist] = useState(0);
  useInterval(() => setCount((prev) => prev + 1), isRunning ? 10000 : null);

  const handleIsRunningChange = (event) => {
    setIsRunning(event.target.checked);
  };

  const handleMouseMove = (event) => {
    const dx = (x - Number(event.clientX)) / 8;
    const dy = (y - Number(event.clientY)) / 8;
    setDist((prev) => prev + Math.sqrt(dx * dx + dy * dy));
    setX(Number(event.clientX));
    setY(Number(event.clientY));
  };

  useEffect(() => {
    console.log(`距離:${dist}`);
    console.log(`計測時間:${count * 10}秒`);
  }, [count]);

  const viewHeight = 380 - 12;
  return (
    <Box
      sx={{ bgcolor: "#f5f5f5", minWidth: "1200px" }}
      onMouseMove={handleMouseMove}
    >
      <Header />
      <input
        type="checkbox"
        checked={isRunning}
        onChange={handleIsRunningChange}
      />
      Running
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
      <Footer />
    </Box>
  );
};

export default Home;
