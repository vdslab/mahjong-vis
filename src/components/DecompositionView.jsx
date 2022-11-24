import { useRecoilValue } from "recoil";
import { decompositionsState } from "../atoms/atoms";
import { changeHaiName2Path } from "../functions/util";
import { Card, Stack } from "@mui/material";
import Image from "next/image";
export const DecompositionView = () => {
  const decompositions = useRecoilValue(decompositionsState);
  const contentWidth = 900;

  const decoArr = [];
  if (Object.keys(decompositions).length > 0) {
    for (let i_m = 0; i_m < decompositions.m.length; i_m++) {
      for (let i_p = 0; i_p < decompositions.p.length; i_p++) {
        for (let i_s = 0; i_s < decompositions.s.length; i_s++) {
          decoArr.push({ m: i_m, p: i_p, s: i_s });
        }
      }
    }
  }

  // if (Object.keys(decompositions).length > 0) {
  //   console.log("m", decompositions.m.length);
  //   console.log("p", decompositions.p.length);
  //   console.log("s", decompositions.s.length);

  //   if (decompositions.m.length > 0) {
  //     for (let i_m = 0; i_m < decompositions.m.length; i_m++) {
  //       if (decompositions.p.length > 0) {
  //         for (let i_p = 0; i_p < decompositions.p.length; i_p++) {
  //           if (decompositions.s.length > 0) {
  //             for (let i_s = 0; i_s < decompositions.s.length; i_s++) {
  //               decoArr.push({ m: i_m, p: i_p, s: i_s });
  //             }
  //           }
  //         }
  //       } else {
  //         if (decompositions.s.length > 0) {
  //           for (let i_s = 0; i_s < decompositions.s.length; i_s++) {
  //             decoArr.push({ m: i_m, p: -1, s: i_s });
  //           }
  //         }
  //       }
  //     }
  //   } else {
  //     if (decompositions.p.length > 0) {
  //       for (let i_p = 0; i_p < decompositions.p.length; i_p++) {
  //         if (decompositions.s.length > 0) {
  //           for (let i_s = 0; i_s < decompositions.s.length; i_s++) {
  //             decoArr.push({ m: -1, p: i_p, s: i_s });
  //           }
  //         }
  //       }
  //     } else {
  //       if (decompositions.s.length > 0) {
  //         for (let i_s = 0; i_s < decompositions.s.length; i_s++) {
  //           decoArr.push({ m: -1, p: -1, s: i_s });
  //         }
  //       }
  //     }
  //   }
  // }

  return (
    <Card sx={{ p: 2, width: contentWidth }}>
      {Object.keys(decompositions).length ? (
        <Stack justifyContent="center" alignItems="center">
          {decoArr.map((pt, id) => {
            return (
              <Stack direction="row" sx={{ p: 1 }}>
                {Object.keys(decompositions).map((type, idx) => {
                  return (
                    <Stack direction="row" sx={{ ml: 1 }}>
                      {decompositions[type][pt[type]].length > 0
                        ? decompositions[type][pt[type]].map((item) => {
                            return item.map((itemm, id) => {
                              return (
                                <Stack sx={{ width: 8 * 5 }} key={id}>
                                  <Image
                                    src={changeHaiName2Path(`${type}${itemm}`)}
                                    width={8 * 5}
                                    height={11 * 5}
                                  />
                                </Stack>
                              );
                            });
                          })
                        : ""}
                    </Stack>
                  );
                })}
              </Stack>
            );
          })}
        </Stack>
      ) : (
        <Stack></Stack>
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
