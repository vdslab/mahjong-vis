import { FEATURE_LIST, TYPE_LIST } from "../const/const";

export const defineFeature = (tehai) => {
  if (tehai.length === 0) {
    return [];
  }

  // 面子と面子候補と浮き牌のリスト
  // 萬子筒子索子風三元の5種類
  const mentuList = [...Array(5)].map((_) => [...Array(3)].map((_) => []));

  // 特徴量の初期化されたobject
  const featureList = makeObject(FEATURE_LIST);

  // 手牌に何があるかのカウント
  const counter = tehai.reduce(
    (prev, cur) => ({
      ...prev,
      [cur]: 1 + (prev[cur] || 0),
    }),
    {}
  );

  // 七対子,対々和,三暗刻は面子分解に寄らない
  featureList["chitoitu_cnt"] = arrayFilterLength(Object.values(counter), 2);
  featureList["toitoi_sananko_cnt"] = arrayFilterLength(
    Object.values(counter),
    3
  );

  // 面子構成を列挙
  mentuFeature(mentuList, counter);
  cntFeature(counter, featureList, 1, 1);
  console.log(mentuList);
  console.log(featureList);

  return tehai;
};

// 面子構成を列挙
const mentuFeature = (mentuList, counter) => {
  const ziSet = new Set(["w", "z"]);

  for (const [key, value] of Object.entries(counter)) {
    const type = key[0];
    const num = Number(key[1]);
    const cnt = value;

    // 順子
    if (!ziSet.has(type) && num !== 9) {
      // 面子
      if (
        counter.hasOwnProperty(`${type}${num + 1}`) &&
        counter.hasOwnProperty(`${type}${num + 2}`)
      ) {
        for (
          let i = 0;
          i <
          Math.max(
            cnt,
            counter[`${type}${num + 1}`],
            counter[`${type}${num + 2}`]
          );
          ++i
        ) {
          mentuList[TYPE_LIST[type]][0].push([num, num + 1, num + 2]);
        }
      }
      // 辺張,両面
      if (counter.hasOwnProperty(`${type}${num + 1}`)) {
        for (let i = 0; i < Math.max(cnt, counter[`${type}${num + 1}`]); ++i) {
          mentuList[TYPE_LIST[type]][1].push([num, num + 1]);
        }
      }
      // 嵌張
      if (counter.hasOwnProperty(`${type}${num + 2}`)) {
        for (let i = 0; i < Math.max(cnt, counter[`${type}${num + 2}`]); ++i) {
          mentuList[TYPE_LIST[type]][1].push([num, num + 2]);
        }
      }
    }
    if (cnt >= 3) mentuList[TYPE_LIST[type]][0].push([num, num, num]);
    if (cnt >= 2) mentuList[TYPE_LIST[type]][1].push([num, num]);
  }
};

const cntFeature = (counter, featureList, roundWind, playerWind) => {
  // 手牌を枚数*数字に圧縮するためのランレングス圧縮
  const rleList = {
    m: makeObject([...Array(9)].map((_, i) => i + 1)),
    p: makeObject([...Array(9)].map((_, i) => i + 1)),
    s: makeObject([...Array(9)].map((_, i) => i + 1)),
  };
  // 牌種の枚数
  const typeCnt = {
    m: 0,
    p: 0,
    s: 0,
  };

  const ziSet = new Set(["w", "z"]);

  for (const [key, value] of Object.entries(counter)) {
    const type = key[0];
    const num = Number(key[1]);
    const cnt = value;

    if (!ziSet.has(type)) {
      // 数牌の数カウント
      if (num === 1 || num === 9) featureList["ichikyu_cnt"] += cnt;
      else featureList["chunchan_cnt"] += cnt;
      rleList[type][num] += cnt;
      typeCnt[type] = cnt;
    } else {
      // 字牌対子,刻子の数カウント
      if (cnt >= 2) {
      }
    }
  }
};

// 配列の中身をkeyとしたobjectを返す
const makeObject = (array, init = 0) => {
  return array.reduce((obj, x) => Object.assign(obj, { [x]: init }), {});
};

// 条件にあった配列の長さを返す
const arrayFilterLength = (array, req) => {
  return array.filter((val) => val >= req).length;
};
