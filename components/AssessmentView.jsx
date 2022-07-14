import { Card, Typography } from "@mui/material";

export const AssessmentView = () => {
  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        評価値
      </Typography>
    </Card>
  );
};
