import { Fragment, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  tehaiState,
  suteHaiListState,
  haiCheckListState,
  shantenState,
  diffShantenState,
  selectedTileState,
} from "./atoms";
import { HAI_ORDER } from "../const/HaiOrder";
import Image from "next/image";
import {
  Box,
  Card,
  Stack,
  Typography,
  Button,
  Dialog,
  Grid,
  NativeSelect,
  FormControl,
  InputLabel,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { DisplayInfo } from "./DisplayInfo";

export const TehaiView = () => {
  const HAITYPELIST = "mpswz";
  const MAX_PLAY_TIMES = 18;
  const [tehai, setTehai] = useRecoilState(tehaiState);
  const [suteHaiList, setSuteHaiList] = useRecoilState(suteHaiListState);
  const [haiCheckList, setHaiCheckList] = useRecoilState(haiCheckListState);
  const [selectedTile, setSelectedTile] = useRecoilState(selectedTileState);
  const [open, setOpen] = useState([false, 0]);
  const [tumoOpen, setTumoOpen] = useState(false);
  const [haiMode, setHaiMode] = useState(0);
  const suteHaiCount = suteHaiList.length;
  const shanten = useRecoilValue(shantenState);
  const diffShanten = useRecoilValue(diffShantenState);
  const [clickedHai, setClickedHai] = useState(null);

  useEffect(() => {
    const haiList = initHai();
    setTehai(haiList);
  }, []);

  const handleTileClicked = (tile, idx) => {
    if (idx === clickedHai) {
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
      setSuteHaiList([...suteHaiList, selectedTile]);
      setSelectedTile("");
      setClickedHai(null);
    } else {
      setSelectedTile(tile);
      setClickedHai(idx);
    }
  };

  const handleTumo = () => {
    setTumoOpen(true);
  };
  const handleTumoClose = () => {
    setTumoOpen(false);
    resetTehai();
  };
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

    const haiList = initHai();
    setTehai(haiList);
  };
  if (suteHaiCount >= MAX_PLAY_TIMES && open[0] === false) {
    setOpen([true, 1]);
  }
  const handleChange = (e) => {
    setHaiMode(e.target.value);
  };
  return (
    <Card sx={{ p: 3 }}>
      {tehai.length < 1 || Object.keys(diffShanten).length === 0 ? (
        <div>loading...</div>
      ) : (
        <>
          <Grid container sx={{ p: 1 }}>
            <Grid item xs={1}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                手牌
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="">自模モードを選択</InputLabel>
                <NativeSelect
                  defaultValue={0}
                  inputProps={{
                    name: "haiMode",
                    id: "",
                  }}
                  disabled={suteHaiList.length > 0 ? true : false}
                  onChange={handleChange}
                >
                  <option value={0}>すべての牌</option>
                  <option value={1}>混一色</option>
                  <option value={2}>清一色</option>
                  <option value={3}>国士</option>
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="h6" component="div" sx={{ pl: 3 }}>
                向聴数
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h6" component="div" sx={{ pl: 5 }}>
                {`通常手：${shanten["other"] > 0 ? shanten["other"] : "聴牌"}`}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h6" component="div" sx={{ pl: 5 }}>
                {`七対子：${
                  shanten["chitoitu"] > 0 ? shanten["chitoitu"] : "聴牌"
                }`}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h6" component="div" sx={{ pl: 5 }}>
                {`国士無双：${
                  shanten["kokushi"] > 0 ? shanten["kokushi"] : "聴牌"
                }`}
              </Typography>
            </Grid>
          </Grid>
          <Stack direction="row">
            {tehai.map((item, idx) => {
              // 現在の最小向聴数の形を求める
              const names = (function () {
                const min = Math.min(...Object.values(shanten));
                return Object.keys(shanten).filter(
                  (key) => shanten[key] === min
                );
              })();
              const icon = (() => {
                for (const name of names) {
                  if (diffShanten[item]?.name > 0)
                    return <TrendingUpIcon color="error" sx={{ m: "auto" }} />;
                }
                return <TrendingDownIcon color="info" sx={{ m: "auto" }} />;
              })();
              if (idx !== 13) {
                return (
                  <Stack key={idx}>
                    <Image
                      onClick={() => handleTileClicked(item, idx)}
                      src={changeHaiName2Path(item)}
                      width="60%"
                      height="80%"
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
                        onClick={() => handleTileClicked(item, idx)}
                        src={changeHaiName2Path(item)}
                        width="60%"
                        height="80%"
                      />
                      {icon}
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
                Object.values(shanten).filter((val) => val === -1).length === 0
              }
              onClick={handleTumo}
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
          <DisplayInfo onClose={handleTumoClose} open={tumoOpen} />
        </>
      )}
    </Card>
  );
};

const getRandomInt = (min = 0, max = 34) => {
  return Math.floor(Math.random() * (max - min) + min);
};
const generateNewHai = (mode = 0) => {
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

export const changeHaiName2Path = (haiName) => {
  let path = "/images/hai/";
  switch (haiName[0]) {
    case "m":
      path += "man" + haiName[1];
      break;
    case "p":
      path += "pin" + haiName[1];
      break;
    case "s":
      path += "sou" + haiName[1];
      break;
    case "w":
      path += "ji" + haiName[1];
      break;
    case "z":
      const num = parseInt(haiName[1]) + 4;
      path += "ji" + num;
      break;
  }
  path += ".gif";
  return path;
};
