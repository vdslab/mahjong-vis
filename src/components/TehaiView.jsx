import { Fragment, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  haiState,
  tehaiState,
  suteHaiListState,
  haiCheckListState,
  shantenState,
} from "./atoms";
import haiOrder from "./haiOrder";
import Image from "next/image";
import {
  Box,
  Card,
  Stack,
  Typography,
  Button,
  Dialog,
  Grid,
} from "@mui/material";

export const TehaiView = () => {
  const HAITYPELIST = "mpswz";
  const MAX_PLAY_TIMES = 18;
  const setAbandonedHai = useSetRecoilState(haiState);
  const [tehai, setTehai] = useRecoilState(tehaiState);
  const [suteHaiList, setSuteHaiList] = useRecoilState(suteHaiListState);
  const [open, setOpen] = useState([false, 0]);
  const [haiCheckList, setHaiCheckList] = useRecoilState(haiCheckListState);
  const shanten = useRecoilValue(shantenState);
  const suteHaiCount = suteHaiList.length;

  useEffect(() => {
    const haiList = initHai();
    setTehai(haiList);
  }, []);

  const clickHandler = (clickedHai, idx) => {
    const copiedTehai = JSON.parse(JSON.stringify(tehai));
    const addedHai = "";
    const tehaiCheckedList = [];
    for (const item of haiCheckList) {
      tehaiCheckedList.push(item.slice());
    }
    let isAddedHai = 1;
    while (isAddedHai) {
      const hai = generateNewHai();
      const haiType = HAITYPELIST.indexOf(hai[0]);
      if (tehaiCheckedList[haiType][parseInt(hai[1]) - 1] < 4) {
        tehaiCheckedList[haiType][parseInt(hai[1]) - 1] += 1;
        addedHai += hai;
        isAddedHai = 0;
      }
    }
    setHaiCheckList(tehaiCheckedList);
    const newTehai = copiedTehai.filter((item, id) => idx != id);
    newTehai.sort((x, y) => haiOrder.indexOf(x) - haiOrder.indexOf(y));
    newTehai.push(addedHai);
    setTehai(newTehai);
    setAbandonedHai(clickedHai);
    setSuteHaiList([...suteHaiList, clickedHai]);
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
        const hai = generateNewHai();
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
        .sort((x, y) => haiOrder.indexOf(x) - haiOrder.indexOf(y)),
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

  if (tehai.length < 1) {
    return <></>;
  } else {
    return (
      <Card sx={{ p: 3 }}>
        <Grid container>
          <Grid item xs={5}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              手牌
            </Typography>
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
            if (idx !== 13) {
              return (
                <Image
                  key={idx}
                  onClick={() => clickHandler(item, idx)}
                  src={changeHaiName2Path(item)}
                  width="80%"
                  height="100%"
                />
              );
            } else {
              return (
                <Fragment key={idx}>
                  <Box sx={{ p: 1 }} />
                  <Image
                    key={idx}
                    onClick={() => clickHandler(item, idx)}
                    src={changeHaiName2Path(item)}
                    width="80%"
                    height="100%"
                  />
                </Fragment>
              );
            }
          })}
          <Box sx={{ p: 1 }} />
          <Button variant="contained" onClick={handleClickOpen}>
            リセット
          </Button>
        </Stack>
        <Dialog open={open[0]} onClose={handleClose}>
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
      </Card>
    );
  }
};

const getRandomInt = (min = 0, max = 34) => {
  return Math.floor(Math.random() * (max - min) + min);
};
const generateNewHai = () => {
  // 全て
  const test = [...Array(34)].map((_, i) => i);
  // 混一色
  // const test = [0, 1, 2, 3, 4, 5, 6, 7, 8, 27, 28, 29, 30, 31, 32, 33];
  // 清一色
  // const test = [...Array(9)].map((_, i) => i);
  // 国士
  // const test = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];
  const intHai = test[getRandomInt()];

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
