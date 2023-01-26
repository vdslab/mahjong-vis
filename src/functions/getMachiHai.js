import { calcShanten } from "./calcShanten";
const checkTenpai = (tehai, mode = 0) => {
  // 手牌を枚数*数字に圧縮するためのランレングス圧縮
  const rleList = {
    m: makeObject([...Array(9)].map((_, i) => i + 1)),
    p: makeObject([...Array(9)].map((_, i) => i + 1)),
    s: makeObject([...Array(9)].map((_, i) => i + 1)),
  };
  // 手牌に何があるかのカウント
  const counter = {};
  for (const tile of tehai) {
    counter[tile] = (counter[tile] || 0) + 1;
    if (tile[0] !== "w" && tile[0] !== "z") rleList[tile[0]][tile[1]] += 1;
  }

  const { shanten, composition } = calcShanten(counter, rleList);

  if (mode == 0) {
    if (shanten.other == 0 || shanten.chitoitu == 0) {
      return true;
    } else {
      return false;
    }
  }
  if (mode == 1) {
    if (shanten.other == -1 || shanten.chitoitu == -1) {
      return true;
    } else {
      false;
    }
  }
};

const makeObject = (array, init = 0) => {
  return array.reduce((obj, x) => Object.assign(obj, { [x]: init }), {});
};

export const getMachiHai = (tehai) => {
  const agariHaiList = {};
  const HAITYPE_LENGTH = { m: 9, p: 9, s: 9, w: 4, z: 3 };

  if (checkTenpai(tehai, 0)) {
    tehai.forEach((item, idx) => {
      agariHaiList[item] = [];
      ["m", "p", "s", "w", "z"].map((type) => {
        for (const i = 1; i <= HAITYPE_LENGTH[type]; i++) {
          const tmpTehai = tehai.slice(0, tehai.length);
          tmpTehai[idx] = type + i;
          if (
            checkTenpai(tmpTehai, 1) &&
            !agariHaiList[item].includes(type + i)
          ) {
            agariHaiList[item].push(type + i);
          }
        }
      });
    });
    return agariHaiList;
  } else {
    return {};
  }
};
