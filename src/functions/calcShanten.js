import { SHANTEN_TABLE } from "../const/ShantenTable";

// 13枚の手牌入力があると仮定
export const calcShanten = (counter, rleList) => {
  const shanten = {
    other: 8,
    kokushi: 13,
    chitoitu: 13,
  };
  const composition = {
    head: null,
    mentu: 0,
    mentuCandidate: 0,
    m: { mentu: 0, mentuCandidate: 0 },
    p: { mentu: 0, mentuCandidate: 0 },
    s: { mentu: 0, mentuCandidate: 0 },
  };

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

  // 国士/七対子向聴数計算
  let kokushi_toitu_flag = false;
  let variety_cnt = 0;
  let toitu_cnt = 0;
  for (const [key, value] of Object.entries(counter)) {
    if (kokushiSet.has(key)) {
      if (value >= 2) kokushi_toitu_flag = true;
      shanten["kokushi"] -= 1;
    }
    if (value >= 2) toitu_cnt += 1;
    variety_cnt += 1;
  }
  shanten["chitoitu"] = 6 - toitu_cnt + (7 - Math.min(7, variety_cnt));
  shanten["kokushi"] -= Number(kokushi_toitu_flag);

  // 向聴数計算
  let [md, pd, sd] = Object.values(rleList).map((x) => Object.values(x));
  // 各色のみの面子構成数
  let mc = calc(md);
  let pc = calc(pd);
  let sc = calc(sd);
  // 雀頭になり得る牌を列挙
  const headList = [];
  let zi_toitu_cnt = 0;
  let zi_kotu_cnt = 0;
  for (const [tile, cnt] of Object.entries(counter)) {
    if (cnt >= 2) headList.push(tile);
    if (tile[0] === "w" || tile[0] === "z") {
      if (cnt >= 3) zi_kotu_cnt += 1;
      else if (cnt === 2) zi_toitu_cnt += 1;
    }
  }

  // 構成数の和
  let ba = arraySum([mc, pc, sc]);
  for (const i of [0, 2]) {
    ba[i] += zi_kotu_cnt;
    ba[i + 1] += zi_toitu_cnt;
  }

  // 面子数+面子候補数が4に満たないと下2桁、そうでないときは上2桁を採用
  if (ba[0] + ba[1] < 4 && ba[2] + ba[3] <= 4) {
    for (const [type, c] of [
      ["m", mc],
      ["p", pc],
      ["s", sc],
    ]) {
      composition[type]["mentu"] = c[2];
      composition[type]["mentuCandidate"] = c[3];
    }
    shanten["other"] = 8 - 2 * ba[2] - ba[3];
    composition["mentu"] = ba[2];
    composition["mentuCandidate"] = ba[3];
  } else if (ba[0] + ba[1] === 4) {
    for (const [type, c] of [
      ["m", mc],
      ["p", pc],
      ["s", sc],
    ]) {
      composition[type]["mentu"] = c[0];
      composition[type]["mentuCandidate"] = c[1];
    }
    shanten["other"] = 8 - 2 * ba[0] - Math.max(Math.min(4 - ba[0], ba[1]), 0);
    composition["mentu"] = ba[0];
    composition["mentuCandidate"] = ba[1];
  } else {
    for (const [type, c] of [
      ["m", mc],
      ["p", pc],
      ["s", sc],
    ]) {
      composition[type]["mentu"] = c[0];
      composition[type]["mentuCandidate"] = c[1];
    }
    shanten["other"] = 8 - 2 * ba[0] - Math.max(Math.min(4 - ba[0], ba[1]), 0);
    composition["mentu"] = ba[0];
    composition["mentuCandidate"] = ba[1];
    for (const head of headList) {
      const type = head[0];
      const num = head[1] - 1;
      let tmpMc = mc;
      let tmpPc = pc;
      let tmpSc = sc;
      let tmp = [zi_kotu_cnt, zi_toitu_cnt, zi_kotu_cnt, zi_toitu_cnt];
      if (type === "m") {
        md[num] -= 2;
        tmpMc = calc(md);
        md[num] += 2;
      } else if (type === "p") {
        pd[num] -= 2;
        tmpPc = calc(pd);
        pd[num] += 2;
      } else if (type === "s") {
        sd[num] -= 2;
        tmpSc = calc(sd);
        sd[num] += 2;
      }
      tmp = arraySum([tmpMc, tmpPc, tmpSc, tmp]);
      if (type === "w" || type === "z") {
        if (counter[head] === 2) {
          tmp[1] -= 1;
          tmp[3] -= 1;
        } else {
          tmp[0] -= 1;
          tmp[2] -= 1;
        }
      }
      let tmp_res = 0;
      if (tmp[0] + tmp[1] < 4 && tmp[2] + tmp[3] <= 4) {
        tmp_res = 7 - 2 * tmp[2] - tmp[3];
        if (tmp_res < shanten["other"]) {
          for (const [type, c] of [
            ["m", tmpMc],
            ["p", tmpPc],
            ["s", tmpSc],
          ]) {
            composition[type]["mentu"] = c[2];
            composition[type]["mentuCandidate"] = c[3];
          }
          shanten["other"] = tmp_res;
          composition["mentu"] = tmp[2];
          composition["mentuCandidate"] = tmp[3];
          composition["head"] = head;
        }
      } else if (tmp[0] + tmp[1] === 4) {
        tmp_res = 7 - 2 * tmp[0] - tmp[1];
        if (tmp_res < shanten["other"]) {
          for (const [type, c] of [
            ["m", tmpMc],
            ["p", tmpPc],
            ["s", tmpSc],
          ]) {
            composition[type]["mentu"] = c[0];
            composition[type]["mentuCandidate"] = c[1];
          }
          shanten["other"] = tmp_res;
          composition["mentu"] = tmp[0];
          composition["mentuCandidate"] = tmp[1];
          composition["head"] = head;
        }
      } else {
        tmp_res = 7 - 2 * tmp[0] - Math.max(Math.min(4 - tmp[0], tmp[1]), 0);
        if (tmp_res < shanten["other"]) {
          for (const [type, c] of [
            ["m", tmpMc],
            ["p", tmpPc],
            ["s", tmpSc],
          ]) {
            composition[type]["mentu"] = c[0];
            composition[type]["mentuCandidate"] = c[1];
          }
          shanten["other"] = tmp_res;
          composition["mentu"] = tmp[0];
          composition["mentuCandidate"] = tmp[1];
          composition["head"] = head;
        }
      }
    }
  }

  // 向聴数と向聴数最小の構成の和を返す
  return { shanten, composition };
};
// 配列の中身をkeyとしたobjectを返す
const makeObject = (array, init = 0) => {
  return array.reduce((obj, x) => Object.assign(obj, { [x]: init }), {});
};

const calc = (d) => {
  let res = [0, 0, 0, 0];
  // 先頭と末尾の不要な0削除
  const tileArrangement = d
    .reduce((prev, cur) => prev + cur, "")
    .replaceAll("0", " ")
    .trim()
    .replaceAll(" ", "0");
  const buf = tileArrangement.split(/00+/);
  for (const i of buf) {
    // 分割された牌の合計枚数が2枚以上ならShantenTableに存在するので計算
    if ([...i].reduce((prev, cur) => prev + Number(cur), 0) >= 2) {
      [...SHANTEN_TABLE[i]].map((num, index) => (res[index] += Number(num)));
    }
  }
  return res;
};

const arraySum = (array) => {
  const res = [0, 0, 0, 0];
  for (const i of array) {
    for (let j = 0; j < 4; ++j) res[j] += i[j];
  }
  return res;
};
