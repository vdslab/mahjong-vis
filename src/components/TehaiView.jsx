import { Fragment, useEffect, useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getMachiHai } from "../functions/getmachiHai";
import {
  allTileState,
  diffShantenState,
  haiModeState,
  suteHaiListState,
  shantenState,
  selectedTileState,
  tehaiState,
} from "../atoms/atoms";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import { WinDialog } from "./WinDialog";
import { changeHaiName2Path } from "../functions/util";
import { HAI_ORDER } from "../const/HaiOrder";
import { GENERATE_HAI_SET } from "../const/generateHaiSet";
import { Mp } from "@mui/icons-material";

export const TehaiView = () => {
  const MAX_PLAY_TIMES = 18;
  const [tehai, setTehai] = useRecoilState(tehaiState);
  const [tehaiStack, setTehaiStack] = useState([]);
  const [suteHaiList, setSuteHaiList] = useRecoilState(suteHaiListState);
  const [selectedTile, setSelectedTile] = useRecoilState(selectedTileState);
  const [open, setOpen] = useState([false, 0]);
  const [winDialogOpen, setWinDialogOpen] = useState(false);
  const haiMode = useRecoilValue(haiModeState);
  const [mouseOveredTile, setMouseOveredTile] = useState(null);
  const shanten = useRecoilValue(shantenState);
  const diffShanten = useRecoilValue(diffShantenState);
  const allTile = useRecoilValue(allTileState);
  useEffect(() => {
    initHai();
  }, [haiMode]);

  const handleTileClicked = async (tile, idx) => {
    const tmpTehai = JSON.parse(JSON.stringify(tehai));
    const hai = generateNewHai(tehaiStack, haiMode);
    const newTehai = tmpTehai
      .filter((_, id) => id !== idx)
      .sort((x, y) => HAI_ORDER.indexOf(x) - HAI_ORDER.indexOf(y));
    setSuteHaiList([...suteHaiList, tile]);
    setSelectedTile("");
    if (suteHaiList.length + 1 < MAX_PLAY_TIMES && open[0] === false)
      newTehai.push(hai);
    setTehai(newTehai);
    if (suteHaiList.length + 1 >= MAX_PLAY_TIMES && open[0] === false)
      setOpen([true, 1]);
    setTehaiStack([...tehaiStack]);
  };

  const handleMouseOver = (tile, idx) => {
    setSelectedTile(tile);
    setMouseOveredTile(idx);
  };

  const handleMouseOut = () => {
    if (selectedTile !== "") {
      setSelectedTile("");
      setMouseOveredTile(null);
    }
  };

  const handleTumoClose = useCallback(() => {
    setWinDialogOpen(false);
    initHai();
  }, [haiMode]);

  const handleClickOpen = () => {
    setOpen([true, 0]);
  };
  const handleClose = (mode) => {
    setOpen([false, mode === 0 ? 0 : 1]);
    initHai();
  };

  const initHai = () => {
    const haiList = [];
    const haiStack = shuffle(
      [...Array(34)].map((_, idx) => Array(4).fill(idx)).flatMap((i) => i)
    );
    while (haiStack.length > 0 && haiList.length < 14) {
      haiList.push(generateNewHai(haiStack, haiMode));
    }
    setTehaiStack([...haiStack]);
    setSuteHaiList([]);
    setSelectedTile("");
    setTehai([
      ...haiList
        .slice(0, 13)
        .sort((x, y) => HAI_ORDER.indexOf(x) - HAI_ORDER.indexOf(y)),
      haiList[13],
    ]);
  };
  const machiList = getMachiHai(tehai);

  return (
    <Card sx={{ px: 3, pt: 3, pb: 1, width: "900px" }}>
      {tehai.length === 0 ||
      tehai.filter((tile) => diffShanten[tile]).length !== tehai.length ? (
        <div>loading...</div>
      ) : (
        <>
          <Stack direction="row" style={{ justifyContent: "center" }}>
            {tehai.map((item, idx) => {
              // 現在の最小向聴数の形を求める
              const names = (() => {
                const min = Math.min(...Object.values(shanten));
                return Object.keys(shanten).filter(
                  (key) => shanten[key] === min
                );
              })();
              const icon = (() => {
                for (const name of names) {
                  if (diffShanten[item][name] < 0)
                    return (
                      <TrendingUpIcon
                        color="error"
                        sx={{ m: "auto", fontSize: "40px" }}
                      />
                    );
                }
                for (const name of names) {
                  if (diffShanten[item][name] === 0)
                    return (
                      <TrendingFlatIcon
                        color="success"
                        sx={{ m: "auto", fontSize: "40px" }}
                      />
                    );
                }
                return (
                  <TrendingDownIcon
                    color="info"
                    sx={{ m: "auto", fontSize: "40px" }}
                  />
                );
              })();
              if (idx !== 13) {
                return (
                  <Stack key={idx}>
                    <Tooltip
                      title={
                        Object.keys(machiList).length && machiList[item].length
                          ? machiList[item].map((machi) => {
                              return (
                                <img
                                  src={changeHaiName2Path(machi[0])}
                                  width="30"
                                  height="40"
                                />
                              );
                            })
                          : ""
                      }
                      arrow
                      placement="top-start"
                    >
                      <div>
                        <Image
                          style={{
                            cursor: "pointer",
                            opacity:
                              item === selectedTile && idx === mouseOveredTile
                                ? 0.5
                                : 1,
                          }}
                          onClick={() => handleTileClicked(item, idx)}
                          onMouseOver={() => handleMouseOver(item, idx)}
                          onMouseOut={handleMouseOut}
                          src={changeHaiName2Path(item)}
                          width="80"
                          height="110"
                        />
                      </div>
                    </Tooltip>
                    {icon}
                  </Stack>
                );
              } else {
                return (
                  <Fragment key={idx}>
                    <Box sx={{ p: 1 }} />
                    <Stack key={idx}>
                      <Tooltip
                        title={
                          Object.keys(machiList).length &&
                          machiList[item].length
                            ? machiList[item].map((machi) => {
                                return (
                                  <img
                                    src={changeHaiName2Path(machi[0])}
                                    width="30"
                                    height="40"
                                  />
                                );
                              })
                            : ""
                        }
                        arrow
                        placement="top-start"
                      >
                        <div>
                          <Image
                            style={{
                              cursor: "pointer",
                              opacity:
                                item === selectedTile && idx === mouseOveredTile
                                  ? 0.5
                                  : 1,
                            }}
                            onClick={() => handleTileClicked(item, idx)}
                            onMouseOver={() => handleMouseOver(item, idx)}
                            onMouseOut={handleMouseOut}
                            src={changeHaiName2Path(item)}
                            width="80"
                            height="110"
                          />
                        </div>
                      </Tooltip>
                    </Stack>
                  </Fragment>
                );
              }
            })}
            <Box sx={{ p: 1 }} />
            <Button
              variant="contained"
              color="error"
              onClick={handleClickOpen}
              sx={{ height: "70px", whiteSpace: "nowrap" }}
            >
              リセット
            </Button>
            <Box sx={{ p: 1 }} />
            <Button
              variant="contained"
              sx={{ height: "70px" }}
              disabled={
                Object.values(allTile["shanten"]).filter((val) => val === -1)
                  .length === 0
              }
              onClick={() => setWinDialogOpen(true)}
            >
              ツモ
            </Button>
          </Stack>
          <Dialog open={open[0]} onClose={() => handleClose(0)}>
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
                style={{ padding: "25px 0" }}
              >
                {open[1] === 0
                  ? "手牌をリセットしますか？"
                  : "手牌をリセットします"}
              </Typography>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    initHai();
                    handleClose(open[1] === 0 ? 0 : 1);
                  }}
                >
                  {open[1] === 0 ? "リセットする" : "OK"}
                </Button>
                {open[1] === 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleClose(0);
                    }}
                  >
                    キャンセル
                  </Button>
                )}
              </Stack>
            </Card>
          </Dialog>
          <WinDialog onClose={handleTumoClose} open={winDialogOpen} />
        </>
      )}
    </Card>
  );
};

const generateNewHai = (stack, mode) => {
  let num = -1;
  while (stack.length > 0 && !GENERATE_HAI_SET[mode].has(num))
    num = stack.pop();

  let hai = "";
  if (num <= 8) hai += "m" + (num + 1);
  else if (num <= 17) hai += "p" + ((num % 9) + 1);
  else if (num <= 26) hai += "s" + ((num % 9) + 1);
  else if (num <= 30) hai += "w" + ((num % 9) + 1);
  else hai += "z" + ((num % 9) - 3);
  return hai;
};

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
