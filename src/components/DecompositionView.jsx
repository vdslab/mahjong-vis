import { Card } from "@mui/material";
import { useRecoilValue } from "recoil";
import { decompositionsState, selectedTileState } from "../atoms/atoms";
import { changeHaiName2Path } from "./TehaiView";

export const DecompositionView = () => {
  const decompositions = useRecoilValue(decompositionsState);
  const selectedTile = useRecoilValue(selectedTileState);

  const contentWidth = 300;
  const contentHeight = 233;
  const imageWidth = 48;
  const imageHeight = 64;
  const tileTypes = "mps";

  console.log(decompositions);

  return (
    <Card sx={{ p: 1 }}>
      <svg viewBox={`0 0 ${contentWidth} ${contentHeight}`}>
        {!decompositions[selectedTile] ? (
          <g transform={`translate(${contentWidth / 2} ${contentHeight / 2})`}>
            <text
              textAnchor="middle"
              fontSize="20px"
              style={{ userSelect: "none" }}
            >
              分解結果はありません
            </text>
          </g>
        ) : (
          <g>
            {decompositions[selectedTile].map((type, idx) => {
              return arrayChunk(type, 2).map((aaa, i) => {
                return (
                  <g key={i}>
                    {aaa.map((tiles, j) => {
                      console.log("====");
                      return tiles.map((tile, k) => {
                        console.log(tile, j, k);
                        return (
                          <image
                            style={{ cursor: "pointer" }}
                            href={changeHaiName2Path(
                              `${tileTypes[idx]}${tile}`
                            )}
                            width={imageWidth}
                            height={imageHeight}
                            x={k * imageWidth}
                            y={i * j * imageHeight}
                          />
                        );
                      });
                    })}
                  </g>
                );
              });
            })}
          </g>
        )}
      </svg>
    </Card>
  );
};

const arrayChunk = ([...array], size = 1) => {
  return array.reduce(
    (acc, _, index) =>
      index % size ? acc : [...acc, array.slice(index, index + size)],
    []
  );
};
