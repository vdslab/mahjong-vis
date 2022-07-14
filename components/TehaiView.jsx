import { useRecoilState } from "recoil";
import { haiState, tehaiState, suteHaiListState } from "./atoms";
import { useEffect } from "react";
import haiOrder from "./haiOrder";
import Image from "next/image";
import { Card, Stack, Typography } from "@mui/material";

export const TehaiView = () => {
  const [abandonedHai, setAbandonedHai] = useRecoilState(haiState);
  const [tehai, setTehai] = useRecoilState(tehaiState);
  const [suteHaiList, setSuteHaiList] = useRecoilState(suteHaiListState);
  const MAX_PLAY_TIMES = 18;
  useEffect(() => {
    const haiList = generaTeHai();
    setTehai(haiList);
  }, []);
  function clickHandler(e) {
    if (suteHaiList.length < MAX_PLAY_TIMES) {
      const clickedHai = e.currentTarget.getAttribute("data-hai");
      const id = e.currentTarget.getAttribute("data-id");
      const copiedTehai = JSON.parse(JSON.stringify(tehai));
      setAbandonedHai(clickedHai);
      setSuteHaiList([...suteHaiList, clickedHai]);
      const addedHai = generateNewHai();
      const newTehai = copiedTehai.filter((item) => item.id != id);
      newTehai.sort(
        (x, y) => haiOrder.indexOf(x.hai) - haiOrder.indexOf(y.hai)
      );
      newTehai.push({ hai: addedHai, id: 14 + suteHaiList.length });
      setTehai(newTehai);
    } else {
      alert("手牌をリセットします");
      setSuteHaiList([]);
      const haiList = generaTeHai();
      setTehai(haiList);
    }
  }
  if (tehai.length < 1) {
    return <div></div>;
  } else {
    return (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          手牌
        </Typography>
        <Stack direction="row">
          {tehai.map((item, idx) => {
            return (
              <Image
                key={idx}
                onClick={clickHandler}
                src={chengeHaiName2Path(item.hai)}
                width="80%"
                height="100%"
              />
            );
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

function generaTeHai() {
  const haiList = [];
  // 手牌生成
  for (let i = 0; i < 14; i++) {
    const hai = generateNewHai();
    haiList.push({ hai: hai, id: i });
  }
  return haiList;
}
export function chengeHaiName2Path(haiName) {
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
}
