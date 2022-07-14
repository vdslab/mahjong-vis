import { Fragment, useEffect } from "react";
import { useRecoilState } from "recoil";
import { haiState, tehaiState, suteHaiListState } from "./atoms";
import haiOrder from "./haiOrder";
import Image from "next/image";
import { Box, Card, Stack, Typography } from "@mui/material";

export const TehaiView = () => {
  const [abandonedHai, setAbandonedHai] = useRecoilState(haiState);
  const [tehai, setTehai] = useRecoilState(tehaiState);
  const [suteHaiList, setSuteHaiList] = useRecoilState(suteHaiListState);
  const MAX_PLAY_TIMES = 17;

  useEffect(() => {
    const haiList = initHai();
    const addedHai = generateNewHai();
    setTehai([...haiList, addedHai]);
  }, []);

  const clickHandler = (clickedHai, idx) => {
    const copiedTehai = JSON.parse(JSON.stringify(tehai));
    setAbandonedHai(clickedHai);
    setSuteHaiList([...suteHaiList, clickedHai]);
    const addedHai = generateNewHai();
    const newTehai = copiedTehai.filter((item, id) => idx != id);
    newTehai.sort((x, y) => haiOrder.indexOf(x) - haiOrder.indexOf(y));
    newTehai.push(addedHai);
    setTehai(newTehai);
    if (suteHaiList.length > MAX_PLAY_TIMES) {
      alert("手牌をリセットします");
      setSuteHaiList([]);
      const haiList = initHai();
      setTehai(haiList);
    }
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

const initHai = () => {
  const haiList = [];
  // 手牌生成
  for (let i = 0; i < 13; i++) {
    const hai = generateNewHai();
    haiList.push(hai);
  }
  return haiList.sort((x, y) => haiOrder.indexOf(x) - haiOrder.indexOf(y));
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
