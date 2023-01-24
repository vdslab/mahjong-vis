import { memo } from "react";
import { useRecoilValue } from "recoil";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Stack from "@mui/material/Stack";
import { decompositionsState, selectedTileState } from "../atoms/atoms";
import { changeHaiName2Path } from "../functions/util";
import Image from "next/image";

export const DecompositionView = memo(() => {
  const decompositions = useRecoilValue(decompositionsState);
  const imageWidth = 3;
  const imageHeight = 4;
  const contentWidth = 900;
  const selectedTile = useRecoilValue(selectedTileState);
  return (
    <Card sx={{ p: 2, width: contentWidth }}>
      {Object.keys(decompositions).length && (
        <List>
          {Object.entries(decompositions).map(([tile, arr]) => {
            const comb = [];
            for (let m = 0; m < arr["m"].length; ++m) {
              for (let p = 0; p < arr["p"].length; ++p) {
                for (let s = 0; s < arr["s"].length; ++s) {
                  comb.push({ m, p, s });
                }
              }
            }
            return (
              <>
                {tile == selectedTile ? (
                  <ListItem key={tile}>
                    <ListItemAvatar
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mr: 5,
                      }}
                    >
                      <Image
                        src={changeHaiName2Path(`${tile}`)}
                        width={imageWidth * 10}
                        height={imageHeight * 10}
                      />
                    </ListItemAvatar>
                    <Stack>
                      {comb.map((pt, id) => (
                        <Stack
                          key={id}
                          direction="row"
                          sx={{
                            p: "5px",
                            width: "100%",
                          }}
                        >
                          {["m", "p", "s"].map((type) => (
                            <Stack key={type} direction="row">
                              {arr[type][pt[type]].length > 0 &&
                                arr[type][pt[type]].map((itemGroup) =>
                                  itemGroup.map((itemHai, id) => (
                                    <Stack sx={{ ml: id === 0 }} key={id}>
                                      <Image
                                        src={changeHaiName2Path(
                                          `${type}${itemHai}`
                                        )}
                                        width={imageWidth * 15}
                                        height={imageHeight * 15}
                                      />
                                    </Stack>
                                  ))
                                )}
                            </Stack>
                          ))}
                        </Stack>
                      ))}
                    </Stack>
                  </ListItem>
                ) : (
                  ""
                )}
              </>
            );
          })}
        </List>
      )}
    </Card>
  );
});
