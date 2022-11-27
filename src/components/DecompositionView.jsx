import { memo } from "react";
import { useRecoilValue } from "recoil";
import { decompositionsState } from "../atoms/atoms";
import { changeHaiName2Path } from "../functions/util";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Image from "next/image";

export const DecompositionView = memo(() => {
  const decompositions = useRecoilValue(decompositionsState);
  const contentWidth = 900;
  const decoArr = [];
  const sortedDecompositions = JSON.parse(JSON.stringify(decompositions));
  if (Object.keys(decompositions).length > 0) {
    for (let i_m in decompositions.m) {
      for (let i_p in decompositions.p) {
        for (let i_s in decompositions.s) {
          decoArr.push({ m: i_m, p: i_p, s: i_s });
        }
      }
    }
    Object.keys(decompositions).map((type) => {
      decompositions[type].map((pItem, id) => {
        if (pItem.length > 0) {
          for (let idx in pItem) {
            sortedDecompositions[type][id][idx].sort((a, b) => a - b);
          }
          sortedDecompositions[type][id].sort((a, b) => {
            if (a[0] - b[0] == 0 && a[1] - b[1] < 0) {
              return -1;
            } else {
              return a[0] - b[0];
            }
          });
        }
      });
      if (decompositions[type].length > 0) {
        sortedDecompositions[type].sort((a, b) => {
          if (a[0][0] - b[0][0] == 0 && a[0][1] - b[0][1] < 0) {
            return -1;
          } else {
            return a[0][0] - b[0][0];
          }
        });
      }
    });
  }

  return (
    <Card sx={{ p: 2, width: contentWidth }}>
      {Object.keys(sortedDecompositions).length && (
        <Stack justifyContent="center" alignItems="center">
          {decoArr.map((pt, id) => {
            return (
              <Stack key={id} direction="row" sx={{ p: 1 }}>
                {Object.keys(sortedDecompositions).map((type, idx) => {
                  return (
                    <Stack key={idx} direction="row">
                      {sortedDecompositions[type][pt[type]].length > 0 &&
                        sortedDecompositions[type][pt[type]].map(
                          (itemGroup) => {
                            return itemGroup.map((itemHai, id) => (
                              <Stack
                                sx={{
                                  width: 8 * 5,
                                  ml: id == 0 ? 1 : 0,
                                }}
                                key={id}
                              >
                                <Image
                                  src={changeHaiName2Path(`${type}${itemHai}`)}
                                  width={8 * 5}
                                  height={11 * 5}
                                />
                              </Stack>
                            ));
                          }
                        )}
                    </Stack>
                  );
                })}
              </Stack>
            );
          })}
        </Stack>
      )}
    </Card>
  );
});
