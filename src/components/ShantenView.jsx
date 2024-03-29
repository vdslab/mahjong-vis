import { memo } from "react";
import { useRecoilValue } from "recoil";
import { Box, Card, List, ListItem, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import {
  diffShantenState,
  selectedTileState,
  shantenState,
  tehaiState,
} from "../atoms/atoms";

export const ShantenView = memo(() => {
  const tehai = useRecoilValue(tehaiState);
  const shanten = useRecoilValue(shantenState);
  const diffShanten = useRecoilValue(diffShantenState);
  const selectedTile = useRecoilValue(selectedTileState);
  const displayName = {
    other: "通常手",
    chitoitu: "七対子",
    kokushi: "国士無双",
  };
  const displayRuby = {
    other: "つうじょうて",
    chitoitu: "ちーといつ",
    kokushi: "こくしむそう",
  };
  return (
    <Box
      sx={{
        display: "table",
        height: "50%",
        width: "100%",
      }}
    >
      <Card
        sx={{
          display: "table-cell",
          verticalAlign: "middle",
          px: 1,
          pt: 1,
        }}
      >
        <Typography variant="h6" component="div">
          <ruby>
            向聴数
            <rt style={{ fontSize: "10px" }}>しゃんてんすう </rt>
          </ruby>
        </Typography>
        <List>
          {Object.keys(displayName).map((name) => {
            const tile = selectedTile || tehai.at(-1);
            const diff = diffShanten[tile]?.[name];
            return (
              <ListItem
                key={name}
                sx={{
                  py: 0,
                  px: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontSize: "100%" }}
                >
                  <ruby>
                    {displayName[name]}
                    <rt style={{ fontSize: "10px" }}>{displayRuby[name]}</rt>
                  </ruby>
                  {`：${shanten[name] > 0 ? shanten[name] : "聴牌"}`}
                </Typography>
                {diff === -1 ? (
                  <TrendingUpIcon color="error" />
                ) : diff === 0 ? (
                  <TrendingFlatIcon color="success" />
                ) : (
                  <TrendingDownIcon color="info" />
                )}
              </ListItem>
            );
          })}
        </List>
      </Card>
    </Box>
  );
});
