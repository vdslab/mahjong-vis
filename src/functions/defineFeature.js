import { FEATURE_LIST, TYPE_LIST } from "../const/const";
import { SHANTEN_TABLE } from "../const/shantenTable";

export const defineFeature = (tehai) => {
  // const tehai = [
  //   "m2",
  //   "m2",
  //   "m2",
  //   "m4",
  //   "m5",
  //   "m5",
  //   "m5",
  //   "m5",
  //   "m6",
  //   "m8",
  //   "m8",
  //   "m8",
  //   "m9",
  //   "m9",
  // ];
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
  const kokushiSet = new Set([
    "m1",
    "m9",
    "p1",
    "p9",
    "s1",
    "s9",
    "w1",
    "w2",
    "w3",
    "w4",
    "z1",
    "z2",
    "z3",
  ]);
  let flag = false;
  for (const [key, value] of Object.entries(counter)) {
    if (kokushiSet.has(key)) {
      if (value >= 2) flag = true;
      featureList["kokushi_cnt"] += 1;
    }
  }
  featureList["kokushi_cnt"] += Number(flag);
  // 面子構成を列挙
  mentuFeature(mentuList, counter);
  // 数系特徴量
  const [md, pd, sd] = cntFeature(counter, featureList, 1, 1);
  const res = [];
  // 字牌の刻子と対子を先にカウントしておく
  let tmpThree = featureList["zi_kotu"] + featureList["zi_kantu"];
  let tmpTwo = featureList["zi_toitu"];
  [md, pd, sd].map((data, idx) => {
    // 先頭と末尾の不要な0削除
    const tileArrangement = Object.values(data)
      .reduce((prev, cur) => prev + cur, "")
      .replaceAll("0", " ")
      .trim()
      .replaceAll(" ", "0");
    const buf = tileArrangement.split(/00+/);
    let tmp = [0, 0, 0, 0];
    for (const i of buf) {
      // 分割された牌の合計枚数が2枚以上ならShantenTableに存在するので計算
      if ([...i].reduce((prev, cur) => prev + Number(cur), 0) >= 2) {
        [...SHANTEN_TABLE[i]].map((num, index) => (tmp[index] += Number(num)));
      }
    }

    // 頭がある場合の計算
    // 全ての頭に対して向聴計算をして、最適な分解（向聴数最小のもの）を見つける
    const a = tmp[2] * 2 + tmp[3];
    const b = tmp[0] * 2 + tmp[1];
    if (a === 0 && b === 0) return;
    const [three, two] = a > b ? [tmp[2], tmp[3]] : [tmp[0], tmp[1]];
    tmpThree += three;
    tmpTwo += two;

    const threeMentu = mentuList[idx][0];
    const twoMentu = mentuList[idx][1];

    // TODO:分解結果は複数ある
    // 22345688 => 22 345 68 8 or 22 345 6 88 etc....
    // 分解した結果から向聴数を求める？
    const tmp_res = [];

    for (const i of deleteDuplicate([...combs(threeMentu, three)])) {
      const tmp_i = JSON.parse(JSON.stringify(data));
      let flag_i = false;

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
        tmp_res.push(i);
        tmp_res.push(j);
      }
    }
    res.push(tmp_res);

    // 一盃口の構造を持っているかどうか計算
    // 実際にそのような分解に成っている必要はない
    // 分解が一盃口かどうかは確認したほうがいい気がする
    featureList["ipeko_score"] = Math.max(
      featureList["ipeko_score"],
      checkIpeko(tileArrangement)
    );
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
  // 分解が複数あるときの応急処置
  // TODO:絶対バグの元
  // for (const i of [
  //   "chunchan_kotu",
  //   "ichikyu_shuntu",
  //   "chunchan_shuntu",
  //   "ichikyu_toitu",
  //   "chunchan_toitu",
  //   "penchan",
  //   "23_78_ryanmen",
  //   "3-7_ryanmen",
  //   "13_79_kanchan",
  //   "2-8_kanchan",
  // ]) {
  //   featureList[i] = featureList[i] / (res.length ? res.length : 1) / 2;
  // }

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

  // 雀頭候補の数
  // TODO:分解結果が複数ある
  let f = featureList["zi_toitu"];
  for (const i of res) {
    i.map((j, idx) => {
      if (idx % 2) {
        for (const k of j) if (new Set(k).size === 1) f += 1;
      } else {
        if (deleteDuplicate(j).length !== j.length)
          featureList["ipeko_structure"] = 100;
      }
    });
  }

  // 面子過多をチェック
  const isOver = tmpThree + tmpTwo >= 5;
  const shanten = {
    other:
      8 -
      tmpThree * 2 -
      (isOver ? 4 - tmpThree : tmpTwo) -
      (isOver && f >= 1 ? 1 : 0),
    chitoitu:
      6 -
      featureList["chitoitu_cnt"] +
      Math.max(0, 7 - Object.keys(counter).length),
    kokushi: 13 - featureList["kokushi_cnt"],
  };

  return { featureList, shanten, res };
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
      }
      featureList["zi_cnt"] += cnt;
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

// 一盃口の特徴量計算
const checkIpeko = (buf) => {
  const newBuf = buf.replaceAll("3", "2").replaceAll("4", "2");
  const d = [
    ["222", 100],
    ["1221", 90],
    ["212", 85],
    ["221", 80],
    ["122", 80],
    ["11211", 70],
    ["1121", 65],
    ["1211", 65],
    ["211", 60],
    ["112", 60],
    ["202", 50],
    ["121", 40],
    ["111", 20],
    ["102", 20],
    ["201", 20],
    ["21", 20],
    ["12", 20],
  ];

  for (const [key, value] of d) {
    if (newBuf.indexOf(key) !== -1) return value;
  }
  return 0;
};
