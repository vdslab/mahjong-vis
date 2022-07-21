import { FEATURE_LIST, TYPE_LIST } from "../const/const";
import { SHANTEN_TABLE } from "../const/shantenTable";

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
  // 数系特徴量
  const [md, pd, sd] = cntFeature(counter, featureList, 1, 1);

  const res = [];
  [md, pd, sd].map((data, idx) => {
    const buf = String(
      Number(Object.values(data).reduce((prev, cur) => prev + cur, ""))
    ).split(/00+/);
    let tmp = [0, 0, 0, 0];
    for (const i of buf) {
      if ([...i].reduce((prev, cur) => prev + Number(cur), 0) >= 2) {
        [...SHANTEN_TABLE[i]].map((num, index) => (tmp[index] += Number(num)));
      }
    }
    const a = tmp[2] * 2 + tmp[3];
    const b = tmp[0] * 2 + tmp[1];
    const [three, two] = a > b ? [tmp[2], tmp[3]] : [tmp[0], tmp[1]];
    if (a === 0 && b === 0) {
      return;
    }
    const threeMentu = mentuList[idx][0];
    const twoMentu = mentuList[idx][1];

    // TODO:分解結果は複数ある
    // 22345688 => 22 345 68 8 or 22 345 6 88 etc....
    const tmp_res = [];
    for (const i of deleteDuplicate([...combs(threeMentu, three)])) {
      const tmp_i = JSON.parse(JSON.stringify(data));
      let flag_i = false;
      let cnt = 0;

      for (const j of i) {
        for (const k of j) {
          tmp_i[k] -= 1;
          if (tmp_i[k] < 0) {
            flag_i = true;
            break;
          }
        }
      }
      if (flag_i) continue;
      for (const j of deleteDuplicate([...combs(twoMentu, two)])) {
        const tmp_j = JSON.parse(JSON.stringify(tmp_i));
        let flag_j = false;
        for (const k of j) {
          for (const l of k) {
            tmp_j[l] -= 1;
            if (tmp_j[l] < 0) {
              flag_j = true;
              break;
            }
          }
        }
        if (flag_j) continue;

        // 一通の計算
        // TODO:修正必要
        let tmp_ittu_cnt = 0;
        // 左
        if (searchArray(i, [1, 2, 3])) tmp_ittu_cnt += 3;
        else if (searchArray(j, [1, 2]) || searchArray(j, [1, 3]))
          tmp_ittu_cnt += 2;
        else if (searchArray(j, [2, 3])) tmp_ittu_cnt += 1;
        // 中
        if (searchArray(i, [4, 5, 6])) tmp_ittu_cnt += 3;
        else if (searchArray(j, [4, 6])) tmp_ittu_cnt += 2;
        else if (searchArray(j, [4, 5]) || searchArray(j, [5, 6]))
          tmp_ittu_cnt += 1;
        // 右
        if (searchArray(i, [7, 8, 9])) tmp_ittu_cnt += 3;
        else if (searchArray(j, [7, 9]) || searchArray(j, [8, 9]))
          tmp_ittu_cnt += 2;
        else if (searchArray(j, [7, 8])) tmp_ittu_cnt += 1;
        featureList["ittu_cnt"] = Math.max(
          featureList["ittu_cnt"],
          tmp_ittu_cnt
        );
        cnt += 1;
        if (cnt === 1) {
          tmp_res.push(i);
          tmp_res.push(j);
        }
      }
    }
    res.push(tmp_res);
  });

  for (const i of res) {
    for (const j of i) {
      for (const k of j) {
        if (k.length === 3) {
          // 面子
          if (new Set(k).size === 1) {
            // 刻子
            if (k[0] === 1 || k[0] === 9) featureList["ichikyu_kotu"] += 1;
            else featureList["chunchan_kotu"] += 1;
          } else {
            // 順子
            if (k[0] === 1 || k[2] === 9) featureList["ichikyu_shuntu"] += 1;
            else featureList["chunchan_shuntu"] += 1;
          }
        } else {
          // 面子候補
          if (new Set(k).size === 1) {
            // 対子
            if (k[0] === 1 || k[0] === 9) featureList["ichikyu_toitu"] += 1;
            else featureList["chunchan_toitu"] += 1;
          } else {
            // 塔子
            if (k[0] + 1 === k[1]) {
              // 辺張,両面
              if (k[0] === 1 || k[1] === 9) featureList["penchan"] += 1;
              else if (k[0] === 2 || k[0] === 8)
                featureList["23_78_ryanmen"] += 1;
              else featureList["3-7_ryanmen"] += 1;
            } else {
              if (k[0] === 1 || k[1] === 9) featureList["13_79_kanchan"] += 1;
              else featureList["2-8_kanchan"] += 1;
            }
          }
        }
      }
    }
  }

  // 三色同順
  for (let i = 1; i < 8; ++i) {
    let tmp = 0;
    for (const j of res) {
      if (searchArray(j[0], [i, i + 1, i + 2])) tmp += 3;
      else {
        if (i === 1) {
          if (searchArray(j[1], [1, 2]) || searchArray(j[1], [1, 3])) tmp += 2;
          else if (searchArray(j[1], [2, 3])) tmp += 1;
        } else if (i === 7) {
          if (searchArray(j[1], [8, 9]) || searchArray(j[1], [7, 9])) tmp += 2;
          else if (searchArray(j[1], [7, 8])) tmp += 1;
        } else {
          if (searchArray(j[1], [i, i + 2])) tmp += 2;
          else if (
            searchArray(j[1], [i, i + 1]) ||
            searchArray(j[1], [i + 1, i + 2])
          )
            tmp += 1;
        }
      }
    }
    featureList["sanshoku_mentu"] = Math.max(
      featureList["sanshoku_mentu"],
      tmp
    );
  }

  return featureList;
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

// 数系特徴量
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
      typeCnt[type] += cnt;
    } else {
      // 字牌対子,刻子の数カウント
      if (cnt >= 2) {
        const name = cnt === 2 ? "toitu" : cnt === 3 ? "kotu" : "kantu";
        if (type === "z") {
          featureList[`sangen_${name}`] += 1;
          featureList["sangen_cnt"] += cnt;
        } else {
          if (playerWind == num || roundWind == num) {
            featureList[`zikaze_bakaze_${name}`] += 1;
            featureList["zikaze_bakaze_cnt"] += cnt;
          } else {
            featureList[`kaze_${name}`] += 1;
            featureList["kaze_cnt"] += cnt;
          }
        }
        featureList[`zi_${name}`] += 1;
        featureList["zi_cnt"] += cnt;
      }
    }
  }

  // 手牌の中で最も多い色の数
  featureList["same_color_cnt"] = Math.max(...Object.values(typeCnt));
  // 手牌の中で1枚以上ある数牌の数
  featureList["1-9_cnt"] = Math.max(
    ...Object.values(rleList).map(
      (data, _) => Object.values(data).filter((num) => num >= 1).length
    )
  );
  // 三色同順
  for (let i = 0; i < 7; ++i) {
    const tmp = Object.values(rleList).reduce((prev, data) => {
      return (
        prev +
        Object.values(data)
          .slice(i, i + 3)
          .filter((num) => num >= 1).length
      );
    }, 0);
    featureList["sanshoku_cnt"] = Math.max(tmp, featureList["sanshoku_cnt"]);
  }
  return Object.values(rleList);
};

// 配列の中身をkeyとしたobjectを返す
const makeObject = (array, init = 0) => {
  return array.reduce((obj, x) => Object.assign(obj, { [x]: init }), {});
};

// 条件にあった配列の長さを返す
const arrayFilterLength = (array, req) => {
  return array.filter((val) => val >= req).length;
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
