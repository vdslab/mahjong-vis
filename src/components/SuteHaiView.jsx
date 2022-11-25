import { useRecoilValue } from "recoil";
import Card from "@mui/material/Card";
import { suteHaiListState } from "../atoms/atoms";
import { changeHaiName2Path } from "../functions/util";

export const SuteHaiView = () => {
  const suteHaiList = useRecoilValue(suteHaiListState);

  const contentWidth = 300;
  const contentHeight = 192;
  const imageWidth = 48;
  const imageHeight = 64;

  return (
    <Card sx={{ p: 2, marginBottom: "10px" }}>
      <svg
        viewBox={`0 0 ${contentWidth} ${contentHeight}`}
        width={232}
        height={148}
      >
        <g>
          {suteHaiList.map((tile, idx) => {
            return (
              <image
                key={idx}
                x={(idx % 6) * imageWidth + 6}
                y={Math.floor(idx / 6) * imageHeight}
                style={{ cursor: "pointer" }}
                href={changeHaiName2Path(tile)}
                width={imageWidth}
                height={imageHeight}
              />
            );
          })}
        </g>
      </svg>
    </Card>
  );
};
