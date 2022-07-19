import { Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  haiState,
  tehaiState,
  suteHaiListState,
  haiCheckListState,
} from "./atoms";
import haiOrder from "./haiOrder";
import Image from "next/image";
import { Box, Card, Stack, Typography, Button, Dialog } from "@mui/material";
export const TehaiView = () => {
  const [abandonedHai, setAbandonedHai] = useRecoilState(haiState);
  const [tehai, setTehai] = useRecoilState(tehaiState);
  const [suteHaiList, setSuteHaiList] = useRecoilState(suteHaiListState);
  const MAX_PLAY_TIMES = 17;
  const [haiCheckList, setHaiCheckList] = useRecoilState(haiCheckListState);
  useEffect(() => {
    const haiList = initHai();
    setTehai(haiList);
  }, []);

  const clickHandler = (clickedHai, idx) => {
    const copiedTehai = JSON.parse(JSON.stringify(tehai));
    setAbandonedHai(clickedHai);
    setSuteHaiList([...suteHaiList, clickedHai]);
    const addedHai = "";

    const tehaiCheckedList = [];
    for (const item of haiCheckList) {
      tehaiCheckedList.push(item.slice());
    }
    const HAITYPELIST = "mpswz";
    const isAddedHai = 1;
    while (isAddedHai) {
      const hai = generateNewHai();
      const haiType = HAITYPELIST.indexOf(hai[0]);
      if (tehaiCheckedList[haiType][parseInt(hai[1])] < 4) {
        tehaiCheckedList[haiType][parseInt(hai[1])] += 1;
        addedHai += hai;
        isAddedHai = 0;
      }
    }

    setHaiCheckList(tehaiCheckedList);

    const newTehai = copiedTehai.filter((item, id) => idx != id);
    newTehai.sort((x, y) => haiOrder.indexOf(x) - haiOrder.indexOf(y));
    newTehai.push(addedHai);
    setTehai(newTehai);

    if (suteHaiList.length >= MAX_PLAY_TIMES) {
      resetTehai(true);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
    const HAITYPELIST = "mpswz";
    for (let i = 0; i < 14; i++) {
      const isAddedHai = true;
      while (isAddedHai) {
        const hai = generateNewHai();
        const haiType = HAITYPELIST.indexOf(hai[0]);
        if (tehaiCheckedList[haiType][parseInt(hai[1])] < 4) {
          tehaiCheckedList[haiType][parseInt(hai[1])] += 1;
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
  const [open, setOpen] = useState(false);
  const resetTehai = (alertFlg) => {
    if (alertFlg) {
      alert("手牌をリセットします");
    }
    setSuteHaiList([]);

    const haiList = initHai();
    setTehai(haiList);
  };

  if (tehai.length < 1) {
    return <></>;
  } else {
    return (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          手牌
        </Typography>
        <Stack direction="row">
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
          </Stack>
          <div style={{ flexGrow: "1" }}></div>
          <Button variant="contained" onClick={handleClickOpen}>
            リセット
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
                style={{ padding: "25px 0" }}
              >
                手牌をリセットしますか？
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
                    resetTehai(false);
                    handleClose();
                  }}
                >
                  リセットする
                </Button>{" "}
                <Button variant="outlined" onClick={handleClose}>
                  キャンセル
                </Button>
              </Stack>
            </Card>
          </Dialog>
        </Stack>
      </Card>
    );
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
function generateNewHai() {
  const HAITYPE = "mpswz";
  let hai = "";
  hai += HAITYPE[getRandomInt(0, HAITYPE.length - 1)];
  if (["m", "p", "s"].includes(hai)) {
    hai += getRandomInt(1, 9);
  } else if (hai === "w") {
    hai += getRandomInt(1, 4);
  } else {
    hai + getRandomInt(1, 3);
  }
  return hai;
}

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
