import { useRecoilState, useRecoilValue } from "recoil";
import { haiState, tehaiState, suteHaiListState } from "./atoms";
import { useEffect } from "react";
export default function TehaiView() {
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
      <div
        style={{
          width: "500px",
          height: "200px",
          border: "1px solid black",
          float: "left",
        }}
      >
        <p>手牌</p>
        <ul style={{ overflow: "hidden" }}>
          {tehai.map((item) => {
            return (
              <li
                style={{ float: "left", listStyle: "none", padding: "10px" }}
                data-id={item.id}
                data-hai={item.hai}
                onClick={clickHandler}
              >
                {item.hai}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
function generateNewHai() {
  const HAITYPE = "mpskz";
  let hai = "";
  hai += HAITYPE[getRandomInt(0, HAITYPE.length - 1)];
  if (["m", "p", "s"].includes(hai)) {
    hai += getRandomInt(1, 9);
  } else if (hai === "k") {
    hai += getRandomInt(1, 4);
  } else {
    hai + getRandomInt(1, 3);
  }
  return hai;
}

function generaTeHai() {
  const haiList = [];
  // 手牌生成
  for (let i = 0; i < 15; i++) {
    const hai = generateNewHai();
    haiList.push({ hai: hai, id: i });
  }
  return haiList;
}
