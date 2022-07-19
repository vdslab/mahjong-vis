import { Box, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      sx={{
        background: "#bdbdbd",
        textAlign: "center",
        bottom: 0,
        p: 3,
      }}
    >
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        &copy; team2022-namako
      </Typography>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        ※ 画像は「<a href="https://mj-dragon.com/rule/">麻雀の雀龍.com</a>
        」の無料麻雀牌画を利用しています。
      </Typography>
    </Box>
  );
};
