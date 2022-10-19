import { useRecoilValue } from "recoil";
import { suteHaiListState } from "../atoms/atoms";
import { Card } from "@mui/material";
import { changeHaiName2Path } from "./TehaiView";

export const AbandonedHaiView = () => {
  const suteHaiList = useRecoilValue(suteHaiListState);

  const contentWidth = 300;
  // const contentHeight = 250;
  const contentHeight = 533;
  const imageWidth = 48;
  const imageHeight = 64;

  return (
    <Card sx={{ p: 2 }}>
      <svg viewBox={`0 0 ${contentWidth} ${contentHeight}`}>
        <g transform={"translate(5, 30)"}>
          <text fontSize="30" style={{ userSelect: "none" }}>
            河
          </text>
          <g transform={"translate(0, 20)"}>
            {suteHaiList.map((tile, idx) => {
              return (
                <image
                  key={idx}
                  x={(idx % 6) * imageWidth}
                  y={Math.floor(idx / 6) * imageHeight}
                  style={{ cursor: "pointer" }}
                  href={changeHaiName2Path(tile)}
                  width={imageWidth}
                  height={imageHeight}
                />
              );
            })}
          </g>
        </g>
      </svg>
    </Card>
  );
};
