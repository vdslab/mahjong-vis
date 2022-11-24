import { useRecoilValue } from "recoil";
import { decompositionsState, selectedTileState } from "../atoms/atoms";
import { changeHaiName2Path } from "../functions/util";
import { Box, Button, Card, Dialog, Stack, Typography } from "@mui/material";
import Image from "next/image";
export const DecompositionView = () => {
  const decompositions = useRecoilValue(decompositionsState);
  const selectedTile = useRecoilValue(selectedTileState);

  const contentWidth = 900;
  const contentHeight = 300;
  const imageWidth = 48;
  const imageHeight = 64;
  const tileTypes = ["m", "p", "s"];
  const typeName = ["萬子", "筒子", "索子"];
  console.log("decompositions", decompositions);
  // tileTypes.map((type, idx) => {
  //   decompositions[type].map((arr) => {
  //     arr.map((ar) => {
  //       ar.map((a) => {
  //         console.log(type);
  //       });
  //     });
  //   });
  // });
  return (
    <Card sx={{ p: 2, width: contentWidth }}>
      {/* <svg viewBox={`0 0 ${contentWidth} ${contentHeight}`}> */}
      {Object.keys(decompositions).length ? (
        <g>
          {tileTypes.map((type, idx) => {
            return decompositions[type].length == 0 ? (
              <div>loading...</div>
            ) : (
              <Stack direction="row" style={{ justifyContent: "center" }}>
                {decompositions[type][0].length != 0 ? (
                  <p>{typeName[idx]}</p>
                ) : (
                  <></>
                )}
                {decompositions[type].map((arr) => {
                  return arr.length != 0 ? (
                    <>
                      <Stack
                        direction="row"
                        sx={{ p: 1, border: "1px solid black", mx: 1, mb: 1 }}
                      >
                        {arr.map((ar, id) => {
                          return ar.map((a, idx) => {
                            return (
                              <Stack
                                sx={{
                                  pl: id > 0 && idx == 0 ? 1 : 0,
                                }}
                              >
                                <Image
                                  src={changeHaiName2Path(`${type}${a}`)}
                                  width="30"
                                  height="50"
                                />
                              </Stack>
                            );
                          });
                        })}
                      </Stack>
                    </>
                  ) : (
                    ""
                  );
                })}
              </Stack>
            );
          })}
        </g>
      ) : (
        <g>
          <Stack></Stack>
        </g>
      )}
      {/* {!decompositions[selectedTile] ? (
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
        )} */}
      {/* </svg> */}
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
