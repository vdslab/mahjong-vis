import { calcShanten } from "./calcShanten";

export const getMachiHai = (tehai) => {
  const agariHaiList = {};
  const HAITYPE_LENGTH = { m: 9, p: 9, s: 9, w: 4, z: 3 };

  for (const [hai, newTehai] of Object.entries(deleteElement(tehai))) {
    const res = new Set();
    for (const type of ["m", "p", "s", "w", "z"]) {
      for (const i = 1; i <= HAITYPE_LENGTH[type]; i++) {
        newTehai[tehai.length - 1] = `${type}${i}`;
        if (checkTenpai(newTehai)) res.add(`${type}${i}`);
      }
    }
    agariHaiList[hai] = Array.from(res);
  }
  return agariHaiList;
};

const checkTenpai = (tehai) => {
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

  const { shanten } = calcShanten(counter, rleList);
  const { other, chitoitu } = shanten;

  return other === -1 || chitoitu === -1;
};

const makeObject = (array, init = 0) => {
  return array.reduce((obj, x) => Object.assign(obj, { [x]: init }), {});
};

const deleteElement = (array) => {
  const res = {};
  for (let i = 0; i < array.length; ++i) {
    res[array[i]] = array.slice(0, i).concat(array.slice(i + 1));
  }
  return res;
};
