import { Fragment, useEffect, useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  tehaiState,
  suteHaiListState,
  haiCheckListState,
  shantenState,
  diffShantenState,
  selectedTileState,
  winState,
} from "../atoms/atoms";
import { HAI_ORDER } from "../const/HaiOrder";
import Image from "next/image";
import {
  Box,
  Button,
  Card,
  Dialog,
  FormControl,
  Grid,
  NativeSelect,
  Stack,
  Typography,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { WinDialog } from "./WinDialog";
import { changeHaiName2Path } from "../functions/util";

export const TehaiView = () => {
  const HAITYPELIST = "mpswz";
  const MAX_PLAY_TIMES = 18;
  const [tehai, setTehai] = useRecoilState(tehaiState);
  const [suteHaiList, setSuteHaiList] = useRecoilState(suteHaiListState);
  const [haiCheckList, setHaiCheckList] = useRecoilState(haiCheckListState);
  const [selectedTile, setSelectedTile] = useRecoilState(selectedTileState);
  const [open, setOpen] = useState([false, 0]);
  const [winDialogOpen, setWinDialogOpen] = useState(false);
  const [haiMode, setHaiMode] = useState(0);
  const [mouseOveredTile, setMouseOveredTile] = useState(null);
  const suteHaiCount = suteHaiList.length;
  const shanten = useRecoilValue(shantenState);
  const diffShanten = useRecoilValue(diffShantenState);
  const win = useRecoilValue(winState);

  useEffect(() => {
    const haiList = initHai();
    setTehai(haiList);
  }, []);

  useEffect(() => {
    resetTehai();
  }, [haiMode]);

  const handleTileClicked = (tile, idx) => {
    const tmpTehai = JSON.parse(JSON.stringify(tehai));
    const addedHai = "";
    const tehaiCheckedList = haiCheckList.map((item) => item.slice());
    let isAddedHai = 1;
    while (isAddedHai) {
      const hai = generateNewHai(haiMode);
      const haiType = HAITYPELIST.indexOf(hai[0]);
      if (tehaiCheckedList[haiType][parseInt(hai[1]) - 1] < 4) {
        tehaiCheckedList[haiType][parseInt(hai[1]) - 1] += 1;
        addedHai += hai;
        isAddedHai = 0;
      }
    }
    setHaiCheckList(tehaiCheckedList);
    const newTehai = tmpTehai
      .filter((_, id) => id !== idx)
      .sort((x, y) => HAI_ORDER.indexOf(x) - HAI_ORDER.indexOf(y));
    newTehai.push(addedHai);
    setTehai(newTehai);
    setSuteHaiList([...suteHaiList, tile]);
    setSelectedTile("");
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
    resetTehai();
  }, []);
  const handleClickOpen = () => {
    setOpen([true, 0]);
  };
  const handleClose = (mode) => {
    setOpen([false, mode === 0 ? 0 : 1]);
  };
  const initHai = () => {
    const haiList = [];
    const tehaiCheckedList = [
      Array(9).fill(0),
      Array(9).fill(0),
      Array(9).fill(0),
      Array(4).fill(0),
      Array(3).fill(0),
    ];

    for (let i = 0; i < 14; i++) {
      const isAddedHai = true;
      while (isAddedHai) {
        const hai = generateNewHai(haiMode);
        const haiType = HAITYPELIST.indexOf(hai[0]);
        if (tehaiCheckedList[haiType][parseInt(hai[1]) - 1] < 4) {
          tehaiCheckedList[haiType][parseInt(hai[1]) - 1] += 1;
          haiList.push(hai);
          isAddedHai = false;
        }
      }
    }
    setHaiCheckList(tehaiCheckedList);
    return [
      ...haiList
        .slice(0, 13)
        .sort((x, y) => HAI_ORDER.indexOf(x) - HAI_ORDER.indexOf(y)),
      haiList[13],
    ];
  };
  const resetTehai = () => {
    setSuteHaiList([]);
    setSelectedTile("");
    const haiList = initHai();
    setTehai(haiList);
  };
  if (suteHaiCount >= MAX_PLAY_TIMES && open[0] === false) {
    setOpen([true, 1]);
  }

  return (
    <Card sx={{ p: 3 }}>
      {tehai.length < 1 ||
      tehai.filter((tile) => diffShanten[tile]).length !== tehai.length ? (
        <div>loading...</div>
      ) : (
        <>
          <Grid container sx={{ p: 1 }}>
            <Grid item xs={12} md={1}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                手牌
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth variant="standard">
                <NativeSelect
                  inputProps={{
                    name: "haiMode",
                    id: "",
                  }}
                  value={haiMode}
                  disabled={suteHaiList.length > 0 ? true : false}
                  onChange={(e) => setHaiMode(e.target.value)}
                >
                  <option value={0}>すべての牌</option>
                  <option value={1}>混一色</option>
                  <option value={2}>清一色</option>
                  <option value={3}>国士</option>
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid item xs={8} sm={4} md={1}>
              <Typography variant="h6" component="div" sx={{ pl: 3 }}>
                向聴数
              </Typography>
            </Grid>
            <Grid item xs={8} sm={4} md={2}>
              <Typography variant="h6" component="div" sx={{ pl: 5 }}>
                {`通常手：${shanten["other"] > 0 ? shanten["other"] : "聴牌"}`}
              </Typography>
            </Grid>
            <Grid item xs={8} sm={4} md={2}>
              <Typography variant="h6" component="div" sx={{ pl: 5 }}>
                {`七対子：${
                  shanten["chitoitu"] > 0 ? shanten["chitoitu"] : "聴牌"
                }`}
              </Typography>
            </Grid>
            <Grid item xs={8} sm={4} md={2}>
              <Typography variant="h6" component="div" sx={{ pl: 5 }}>
                {`国士無双：${
                  shanten["kokushi"] > 0 ? shanten["kokushi"] : "聴牌"
                }`}
              </Typography>
            </Grid>
          </Grid>

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
                    {icon}
                  </Stack>
                );
              } else {
                return (
                  <Fragment key={idx}>
                    <Box sx={{ p: 1 }} />
                    <Stack key={idx}>
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
                    </Stack>
                  </Fragment>
                );
              }
            })}
            <Box sx={{ p: 1 }} />
            <Button variant="contained" color="error" onClick={handleClickOpen}>
              リセット
            </Button>
            <Box sx={{ p: 1 }} />
            <Button
              variant="contained"
              disabled={
                Object.values(win["shanten"]).filter((val) => val === -1)
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
                    resetTehai();
                    handleClose(open[1] === 0 ? 0 : 1);
                  }}
                >
                  {open[1] === 0 ? "リセットする" : "OK"}
                </Button>{" "}
                {open[1] === 0 ? (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleClose(0);
                    }}
                  >
                    キャンセル
                  </Button>
                ) : (
                  ""
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

const getRandomInt = (min = 0, max = 34) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateNewHai = (mode) => {
  const haiList = [
    [...Array(34)].map((_, i) => i),
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 27, 28, 29, 30, 31, 32, 33],
    [...Array(9)].map((_, i) => i),
    [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33],
  ];
  const intHai = haiList[mode][getRandomInt(0, haiList[mode].length)];

  let hai = "";
  if (intHai <= 8) {
    hai += "m" + (intHai + 1);
  } else if (intHai <= 17) {
    hai += "p" + ((intHai % 9) + 1);
  } else if (intHai <= 26) {
    hai += "s" + ((intHai % 9) + 1);
  } else if (intHai <= 30) {
    hai += "w" + ((intHai % 9) + 1);
  } else {
    hai += "z" + ((intHai % 9) - 3);
  }
  return hai;
};
