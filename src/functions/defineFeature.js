import { FEATURE_LIST } from "../const/featureList";
import { IPEKO_STRUCTURE, SANSHOKU_STRUCTURE } from "../const/score";
import { calcShanten } from "./calcShanten";
const ziSet = new Set(["w", "z"]);

export const defineFeature = (tehai) => {
  // const tehai = [
  //   "m1",
  //   "m1",
  //   "m4",
  //   "m5",
  //   "m8",
  //   "m8",
  //   "p3",
  //   "p4",
  //   "s3",
  //   "s5",
  //   "s7",
  //   "s8",
  //   "s9",
  //   "s4",
  // ];
  // 特徴量の初期化されたobject
  const featureList = makeObject(FEATURE_LIST);
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
  cntFeature(counter, featureList, rleList);
  // 七対子は面子分解に寄らない
  // 七対子のときの対子量計算
  for (const [tile, cnt] of Object.entries(counter)) {
    const type = tile[0];
    const num = tile[1];
    if (cnt >= 2) {
      if (ziSet.has(type)) featureList["chitoitu_zi_cnt"] += 1;
      else {
        if (num === "1" || num === "9")
          featureList["chitoitu_ichikyu_cnt"] += 1;
        else featureList["chitoitu_chunchan_cnt"] += 1;
        featureList[`chitoitu_${type}_cnt`] += 1;
      }
    }
  }
  // 暗刻になりえる枚数持っているかどうかのカウント
  featureList["toitoi_sananko_cnt"] = arrayFilterLength(
    Object.values(counter),
    3
  );
  // 最小向聴数の面子構成数
  const { shanten, composition } = calcShanten(counter, rleList);
  // 頭が確定していれば引く
  if (composition["head"] && !ziSet.has(composition["head"][0])) {
    const type = composition["head"][0];
    const num = composition["head"][1];
    counter[composition["head"]] -= 2;
    rleList[type][num] -= 2;
  }
  // 面子候補列挙
  const mentuList = mentuFeature(counter);

  const res = { m: [], p: [], s: [] };
  for (const [type, list] of Object.entries(rleList)) {
    const mentu = mentuList[type][0];
    const mentuCandidate = mentuList[type][1];
    const three = composition[type]["mentu"];
    const two = composition[type]["mentuCandidate"];
    const threeCombs = deleteDuplicate([...combs(mentu, three)]);
    const twoCombs = deleteDuplicate([...combs(mentuCandidate, two)]);
    for (const i of threeCombs) {
      const tmpI = JSON.parse(JSON.stringify(list));
      let flagI = false;
      for (const j of i.flat()) {
        tmpI[j] -= 1;
        if (tmpI[j] < 0) {
          flagI = true;
          break;
        }
      }
      if (flagI) continue;

      for (const j of twoCombs) {
        const tmpJ = JSON.parse(JSON.stringify(tmpI));
        let flagJ = false;
        for (const k of j.flat()) {
          tmpJ[k] -= 1;
          if (tmpJ[k] < 0) {
            flagJ = true;
            break;
          }
        }
        if (flagJ) continue;

        // すべて満たした
        const tmp_res = [];
        for (const a of i) tmp_res.push(a);
        for (const a of j) tmp_res.push(a);
        if (composition["head"]?.[0] === type) {
          const num = Number(composition["head"][1]);
          tmp_res.push([num, num]);
        }
        res[type].push(tmp_res);

        // 構造系の特徴量
        // 一通
        featureList["ittu_structure"] = Math.max(
          featureList["ittu_structure"],
          ittuStructure(i, j)
        );
        // 一盃口
        featureList["ipeko_structure"] = Math.max(
          featureList["ipeko_structure"],
          ipekoStructure(tmp_res)
        );
      }
    }
  }
  featureList["sanshoku_dojun_structure"] = sanshokuStructure(res);
  for (const type of ["m", "p", "s"]) {
    const tmpFeature = {
      ichikyu_kotu: 0,
      chunchan_kotu: 0,
      ichikyu_shuntu: 0,
      chunchan_shuntu: 0,
      ichikyu_toitu: 0,
      chunchan_toitu: 0,
      penchan: 0,
      "23_78_ryanmen": 0,
      "3-7_ryanmen": 0,
      "13_79_kanchan": 0,
      "2-8_kanchan": 0,
    };
    for (const i of res[type]) {
      for (const j of i) {
        if (j.length === 3) {
          // 面子
          if (new Set(j).size === 1) {
            // 刻子
            if (j[0] === 1 || j[0] === 9) tmpFeature["ichikyu_kotu"] += 1;
            else tmpFeature["chunchan_kotu"] += 1;
          } else {
            // 順子
            if (j[0] === 1 || j[2] === 9) tmpFeature["ichikyu_shuntu"] += 1;
            else tmpFeature["chunchan_shuntu"] += 1;
          }
        } else {
          // 面子候補
          if (new Set(j).size === 1) {
            // 対子
            if (j[0] === 1 || j[0] === 9) tmpFeature["ichikyu_toitu"] += 1;
            else tmpFeature["chunchan_toitu"] += 1;
          } else {
            // 塔子
            if (j[0] + 1 === j[1]) {
              // 辺張,両面
              if (j[0] === 1 || j[1] === 9) tmpFeature["penchan"] += 1;
              else if (j[0] === 2 || j[1] === 8)
                tmpFeature["23_78_ryanmen"] += 1;
              else tmpFeature["3-7_ryanmen"] += 1;
            } else {
              if (j[0] === 1 || j[1] === 9) tmpFeature["13_79_kanchan"] += 1;
              else tmpFeature["2-8_kanchan"] += 1;
            }
          }
        }
      }
    }
    for (const i of Object.keys(tmpFeature)) {
      if (res[type].length !== 0)
        featureList[i] += tmpFeature[i] / res[type].length;
    }
  }

  isshokuStructure(composition, counter, featureList);
  featureList["ryanpeko_structure"] = Math.max(
    featureList["ryanpeko_structure"],
    ryanpekoStructure(res)
  );

  // 平和フラグ
  // 聴牌状態のとき分解を検索して両面待ちが存在するとき、和了牌を記録する
  const ryanmenRes = new Set();
  if (tehai.length !== 14 && shanten["other"] === 0) {
    for (const type of ["m", "p", "s"]) {
      for (const i of res[type]) {
        for (const j of i) {
          if (j.length === 2 && j[0] !== 1 && j[1] !== 9 && j[0] + 1 === j[1]) {
            ryanmenRes.add(`${type}${j[0] - 1}`);
            ryanmenRes.add(`${type}${j[1] + 1}`);
          }
        }
      }
    }
  }

  return { shanten, res: sortDecomposition(res), featureList, ryanmenRes };
};

// 面子構成を列挙
const mentuFeature = (counter) => {
  // 面子と面子候補のリスト
  const mentuList = { m: [[], []], p: [[], []], s: [[], []] };

  for (const [key, value] of Object.entries(counter)) {
    const type = key[0];
    const num = Number(key[1]);
    const cnt = value;

    // 順子
    if (!ziSet.has(type)) {
      // 面子
      if (
        counter.hasOwnProperty(`${type}${num + 1}`) &&
        counter.hasOwnProperty(`${type}${num + 2}`)
      ) {
        for (
          let i = 0;
          i <
          Math.min(
            cnt,
            counter[`${type}${num + 1}`],
            counter[`${type}${num + 2}`]
          );
          ++i
        ) {
          mentuList[type][0].push([num, num + 1, num + 2]);
        }
      }
      // 辺張,両面
      if (counter.hasOwnProperty(`${type}${num + 1}`)) {
        for (let i = 0; i < Math.min(cnt, counter[`${type}${num + 1}`]); ++i) {
          mentuList[type][1].push([num, num + 1]);
        }
      }
      // 嵌張
      if (counter.hasOwnProperty(`${type}${num + 2}`)) {
        for (let i = 0; i < Math.min(cnt, counter[`${type}${num + 2}`]); ++i) {
          mentuList[type][1].push([num, num + 2]);
        }
      }
      if (cnt >= 3) mentuList[type][0].push([num, num, num]);
      if (cnt >= 2) mentuList[type][1].push([num, num]);
    }
  }
  return mentuList;
};

// 数系特徴量
const cntFeature = (counter, featureList, rleList) => {
  for (const [key, value] of Object.entries(counter)) {
    const type = key[0];
    const num = Number(key[1]);
    const cnt = value;

    if (!ziSet.has(type)) {
      // 数牌の数カウント
      if (num === 1 || num === 9) featureList["ichikyu_cnt"] += cnt;
      else featureList["chunchan_cnt"] += cnt;
    } else {
      // 字牌対子,刻子の数カウント
      if (cnt >= 2) {
        const name = cnt === 2 ? "toitu" : cnt === 3 ? "kotu" : "kantu";
        if (type === "z") {
          featureList[`sangen_${name}`] += 1;
          featureList["sangen_cnt"] += cnt;
        } else {
          if (num === 1) {
            featureList[`zikaze_bakaze_${name}`] += 1;
            featureList["zikaze_bakaze_cnt"] += cnt;
          } else {
            featureList[`kaze_${name}`] += 1;
            featureList["kaze_cnt"] += cnt;
          }
        }
        featureList[`zi_${name}`] += 1;
      }
      featureList["zi_cnt"] += cnt;
    }
  }

  // 手牌の中で1枚以上ある数牌の数
  featureList["ittu_score"] = Math.max(
    ...Object.values(rleList).map(
      (data, _) => Object.values(data).filter((num) => num >= 1).length
    )
  );
  // 三色同順
  for (let i = 1; i < 10; ++i) {
    let tmp = 0;
    for (const type of ["m", "p", "s"]) {
      tmp += rleList[type][i] >= 1 ? 1 : 0;
      tmp += rleList[type][i + 1] >= 1 ? 1 : 0;
      tmp += rleList[type][i + 2] >= 1 ? 1 : 0;
    }
    featureList["sanshoku_dojun_score"] = Math.max(
      tmp,
      featureList["sanshoku_dojun_score"]
    );
  }
  // 三色同刻
  for (let i = 1; i < 10; ++i) {
    let tmp = 0;
    for (const type of ["m", "p", "s"])
      tmp += rleList[type][i] === 4 ? 3 : rleList[type][i];
    featureList["sanshoku_doko_score"] = Math.max(
      tmp,
      featureList["sanshoku_doko_score"]
    );
  }
  // 一盃口
  let maxType = "m";
  let maxNum = 1;
  for (const type of ["m", "p", "s"]) {
    for (let i = 1; i < 10; ++i) {
      let tmp = 0;
      if (rleList[type][i] >= 1) tmp += rleList[type][i] >= 2 ? 2 : 1;
      if (rleList[type][i + 1] >= 1) tmp += rleList[type][i + 1] >= 2 ? 2 : 1;
      if (rleList[type][i + 2] >= 1) tmp += rleList[type][i + 2] >= 2 ? 2 : 1;
      if (featureList["ipeko_score"] < tmp) {
        featureList["ipeko_score"] = tmp;
        maxType = type;
        maxNum = i;
      }
    }
  }
  // 二盃口
  const tmpRleList = JSON.parse(JSON.stringify(rleList));
  tmpRleList[maxType][maxNum] = Math.max(0, tmpRleList[maxType][maxNum] - 2);
  tmpRleList[maxType][maxNum + 1] = Math.max(
    0,
    tmpRleList[maxType][maxNum + 1] - 2
  );
  tmpRleList[maxType][maxNum + 2] = Math.max(
    0,
    tmpRleList[maxType][maxNum + 2] - 2
  );
  for (const type of ["m", "p", "s"]) {
    for (let i = 1; i < 10; ++i) {
      let tmp = 0;
      if (tmpRleList[type][i] >= 1) tmp += tmpRleList[type][i] >= 2 ? 2 : 1;
      if (tmpRleList[type][i + 1] >= 1)
        tmp += tmpRleList[type][i + 1] >= 2 ? 2 : 1;
      if (tmpRleList[type][i + 2] >= 1)
        tmp += tmpRleList[type][i + 2] >= 2 ? 2 : 1;
      if (featureList["ryanpeko_score"] < tmp)
        featureList["ryanpeko_score"] = tmp;
    }
  }
  featureList["ryanpeko_score"] =
    (featureList["ipeko_score"] + featureList["ryanpeko_score"]) / 2;
};

// 一通の構造を持つかどうか(MAX:60)
const ittuStructure = (i, j) => {
  const res = [];
  const maxScore = 20;
  const midScore = 10;
  const minScore = 7;

  // 一通が確定するような面子/面子候補には最大の評価値を付与
  // 面子に対して点数付与
  for (let n = 1; n < 8; ++n) {
    if (searchArray(i, [n, n + 1, n + 2]))
      res.push((n - 1) % 3 === 0 ? maxScore : minScore);
  }
  // 面子候補に対して点数付与
  if (searchArray(j, [1, 2]) || searchArray(j, [1, 3])) res.push(midScore);
  else if (searchArray(j, [2, 3])) res.push(minScore);
  // 中
  if (searchArray(j, [4, 6])) res.push(midScore);
  else if (searchArray(j, [4, 5]) || searchArray(j, [5, 6])) res.push(minScore);
  // 右
  if (searchArray(j, [7, 9]) || searchArray(j, [8, 9])) res.push(midScore);
  else if (searchArray(j, [7, 8])) res.push(minScore);
  res.sort((a, b) => a - b);
  return (res[0] || 0) + (res[1] || 0) + (res[2] || 0);
};

// 一盃口の構造を持つかどうか(MAX:70)
// TODO:修正必要
const ipekoStructure = (data) => {
  let res = 0;
  for (const comb of deleteDuplicate([...combs(data, 2)])) {
    const tmp = makeObject([...Array(9)].map((_, i) => i + 1));
    for (const i of comb.flat()) tmp[i] += 1;
    const buf = Object.values(tmp).join("");
    for (const [key, value] of Object.entries(IPEKO_STRUCTURE)) {
      if (buf.indexOf(key) !== -1 && res < value) res = value;
    }
  }
  return res;
};

// 二盃口の構造を持つかどうか(MAX:70)
const ryanpekoStructure = (data) => {
  const res = [];

  for (const value of Object.values(data)) {
    // 面子+候補が3以下の場合はipekoと処理は同じ
    if (value[0].length <= 3) {
      let tmp_res = 0;
      for (const a of value) {
        const tmp = ipekoStructure(a);
        if (tmp_res < tmp) tmp_res = tmp;
      }
      if (tmp_res !== 0) res.push(tmp_res);
    } else {
      const tmp = [];
      if (value[0].length === 5) {
        for (const a of value) {
          for (const b of deleteElement(a)) {
            tmp.push(calcRyanpeko(b));
          }
        }
      } else {
        for (const a of value) tmp.push(calcRyanpeko(a));
      }
      tmp.sort((a, b) => b - a);
      return tmp[0] / 2;
    }
  }
  res.sort((a, b) => b - a);
  return ((res[0] || 0) + (res[1] || 0)) / 2;
};

const calcRyanpeko = (array) => {
  const rows = [
    [array[0], array[1], array[2], array[3]],
    [array[0], array[2], array[1], array[3]],
    [array[0], array[3], array[1], array[2]],
  ];
  let res = 0;
  for (const row of rows) {
    res = Math.max(
      res,
      ipekoStructure(row.slice(0, 2)) + ipekoStructure(row.slice(2))
    );
  }
  return res;
};

// 三色同順の構造を持つかどうか(MAX:60)
const sanshokuStructure = (data) => {
  let res = 0;

  for (let i = 1; i < 9; ++i) {
    let tmp = [0, 0, 0];
    for (const type of ["m", "p", "s"]) {
      for (const j of data[type]) {
        if (searchArray(j, [i, i + 1, i + 2])) tmp[0] += 1;
        else {
          if (i === 1 || i === 7) {
            if (searchArray(j, [1, 2]) || searchArray(j, [1, 3])) tmp[1] += 1;
            else if (searchArray(j, [2, 3])) tmp[2] += 1;
          } else if (i === 7) {
            if (searchArray(j, [8, 9]) || searchArray(j, [7, 9])) tmp[1] += 1;
            else if (searchArray(j, [7, 8])) tmp[2] += 1;
          } else {
            if (searchArray(j, [i, i + 2])) tmp[1] += 1;
            else if (
              searchArray(j, [i, i + 1]) ||
              searchArray(j, [i + 1, i + 2])
            )
              tmp[2] += 1;
          }
        }
      }
    }
    res = Math.max(res, SANSHOKU_STRUCTURE[tmp.join("")] || 0);
  }
  return res;
};

// 一色手の特徴量計算
const isshokuStructure = (data, counter, featureList) => {
  let chinitu_score = 0;
  let maxType = "m";
  for (const type of ["m", "p", "s"]) {
    let tmp =
      data[type]["mentu"] * 15 +
      data[type]["mentuCandidate"] * 7 +
      (data["head"]?.[0] === type ? 10 : 0);
    if (chinitu_score < tmp) {
      chinitu_score = tmp;
      maxType = type;
    }
  }
  let honitu_score = chinitu_score + (ziSet.has(data["head"]?.[0]) ? 10 : 0);
  let same_color_cnt = data["head"]?.[0] === maxType ? 2 : 0;
  for (const [tile, cnt] of Object.entries(counter)) {
    const type = tile[0];
    if (ziSet.has(type)) {
      if (cnt === 2) honitu_score += 7;
      else if (cnt >= 3) honitu_score += 15;
    } else if (type === maxType) same_color_cnt += cnt;
  }

  featureList["chinitu_score"] = Math.max(
    chinitu_score,
    featureList[`chitoitu_${maxType}_cnt`] * 10
  );
  featureList["honitu_score"] = Math.max(
    honitu_score,
    (featureList[`chitoitu_${maxType}_cnt`] + featureList[`chitoitu_zi_cnt`]) *
      10
  );
  featureList["same_color_cnt"] = same_color_cnt;
};

// 分解のソート
const sortDecomposition = (decompositions) => {
  if (Object.keys(decompositions).length === 0) return {};

  const sortedDecompositions = JSON.parse(JSON.stringify(decompositions));
  for (const type of ["m", "p", "s"]) {
    decompositions[type].map((pItem, id) => {
      for (let idx = 0; idx < pItem.length; ++pItem)
        sortedDecompositions[type][id][idx].sort((a, b) => a - b);
      sortedDecompositions[type][id].sort((a, b) => {
        if (a[0] - b[0] == 0 && a[1] - b[1] < 0) return -1;
        else return a[0] - b[0];
      });
    });
    sortedDecompositions[type].sort((a, b) => {
      if (a[0][0] - b[0][0] == 0 && a[0][1] - b[0][1] < 0) return -1;
      else return a[0][0] - b[0][0];
    });
  }
  return sortedDecompositions;
};

// 配列の中身をkeyとしたobjectを返す
const makeObject = (array, init = 0) => {
  return array.reduce((obj, x) => Object.assign(obj, { [x]: init }), {});
};

// 組み合わせ列挙
const combs = function* (arr, rs, repetition = false) {
  rs = [rs].flat();
  for (const r of rs)
    yield* (function* c(current, i, j) {
      if (i == r) {
        yield [...current];
        return;
      } else if (j >= arr.length) return;

      current[i] = arr[j];

      yield* c(current, i + 1, j + !repetition);
      yield* c(current, i, j + 1);
    })(new Array(r), 0, 0);
};

// 二次元配列の重複削除
const deleteDuplicate = (array) => {
  return [...new Set(array.map(JSON.stringify))].map(JSON.parse);
};

// 二次元配列内の検索
const searchArray = (array, tar) => {
  return (
    array.findIndex((item) => JSON.stringify(item) === JSON.stringify(tar)) !==
    -1
  );
};

// 条件にあった配列の長さを返す
const arrayFilterLength = (array, req) => {
  return array.filter((val) => val >= req).length;
};

// 配列から取り除いた要素とそれ以外の要素のオブジェクトを返す
const deleteElement = (array) => {
  const res = [];
  for (let i = 0; i < array.length; ++i) {
    res.push(array.slice(0, i).concat(array.slice(i + 1)));
  }
  return res;
};
