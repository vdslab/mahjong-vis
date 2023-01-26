import { memo } from "react";
import { useRecoilValue } from "recoil";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import {
  decompositionsState,
  selectedTileState,
  tehaiState,
} from "../atoms/atoms";
import { changeHaiName2Path } from "../functions/util";
import Image from "next/image";

export const DecompositionView = memo(() => {
  const decompositions = useRecoilValue(decompositionsState);
  const selectedTile = useRecoilValue(selectedTileState);
  const tehai = useRecoilValue(tehaiState);
  const imageWidth = 3;
  const imageHeight = 4;
  const contentWidth = 900;
  // 牌が選択されていないときデフォルトで現在の手牌の分解を表示
  const targetTile =
    selectedTile || (tehai.length && tehai[tehai.length - 1]) || "";

  return (
    <Card sx={{ p: 2, width: contentWidth }}>
      {decompositions[targetTile] ? (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          divider={<Divider orientation="vertical" flexItem />}
        >
          {["m", "p", "s"].map((type) => (
            <Stack key={type} spacing={1}>
              {decompositions[targetTile][type].map((group, i) => (
                <Stack
                  direction="row"
                  spacing={1}
                  key={`${type}${JSON.stringify(group)}-${i}`}
                >
                  {group.length ? (
                    group.map((mentu, j) => (
                      <Stack
                        direction="row"
                        key={`${type}${JSON.stringify(mentu)}-${j}`}
                      >
                        {mentu.map((num, idx) => (
                          <Image
                            key={idx}
                            src={changeHaiName2Path(`${type}${num}`)}
                            width={imageWidth * 15}
                            height={imageHeight * 15}
                          />
                        ))}
                      </Stack>
                    ))
                  ) : (
                    <div>ﾅｲﾖｰ</div>
                  )}
                </Stack>
              ))}
            </Stack>
          ))}
          <Stack direction="row" spacing={1}>
            {decompositions[targetTile]["z"].length ? (
              decompositions[targetTile]["z"].map((mentu, i) => (
                <Stack
                  direction="row"
                  spacing={1}
                  key={`z${JSON.stringify(mentu)}-${i}`}
                >
                  {mentu.map((n, idx) => {
                    const type = n <= 4 ? "w" : "z";
                    const num = n <= 4 ? n : n - 4;
                    return (
                      <Image
                        key={idx}
                        src={changeHaiName2Path(`${type}${num}`)}
                        width={imageWidth * 15}
                        height={imageHeight * 15}
                      />
                    );
                  })}
                </Stack>
              ))
            ) : (
              <div>ﾅｲﾖｰ</div>
            )}
          </Stack>
        </Stack>
      ) : (
        <div>loading...</div>
      )}
    </Card>
  );
});
