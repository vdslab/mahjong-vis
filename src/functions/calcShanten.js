import { SHANTEN_TABLE } from "../const/shantenTable";

// 13枚の手牌入力があると仮定
export const calcShanten = (tehai) => {
  const res = {
    other: 8,
    chitoitu: 6,
    kokushi: 13,
  };
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

  // 向聴数計算
  let [md, pd, sd] = Object.values(rleList).map((x) => Object.values(x));
  // 各色のみの面子構成数
  let mc = calc(md);
  let pc = calc(pd);
  let sc = calc(sd);
  // 構成数の和
  let ba = [0, 0, 0, 0];
  for (const c of [mc, pc, sc]) {
    for (let i = 0; i < 4; ++i) ba[i] += c[i];
  }

  // 雀頭になり得る牌を列挙
  const headList = [];
  for (const [tile, cnt] of Object.entries(counter)) {
    if (cnt >= 2) headList.push(tile);
    if (tile[0] === "w" || tile[0] === "z") {
      if (cnt === 3) {
        ba[0] += 1;
        ba[2] += 1;
      } else if (cnt === 2) {
        ba[1] += 1;
        ba[3] += 1;
      }
    }
  }

  // 面子数+面子候補数が4に満たないとA、そうでないときはB
  // 面子過多なとき雀頭が作れれば向聴数-1する
  // 字牌雀頭を作れるときは雀頭検索を行わないほうがいい？
  if (ba[0] + ba[1] < 4) res["other"] = 8 - 2 * ba[2] - ba[3];
  else if (ba[0] + ba[1] === 4) res["other"] = 8 - 2 * ba[0] - ba[1];
  else {
    res["other"] = 8 - 2 * ba[0] - Math.max(Math.min(4 - ba[0], ba[1]), 0);
    for (const head of headList) {
      let tmp = [0, 0, 0, 0];
      const type = head[0];
      const num = head[1] - 1;
      if (type === "m") {
        md[num] -= 2;
        tmp = arraySum([calc(md), pc, sc]);
        md[num] += 2;
      } else if (type === "p") {
        pd[num] -= 2;
        tmp = arraySum([calc(pd), mc, sc]);
        pd[num] += 2;
      } else {
        sd[num] -= 2;
        tmp = arraySum([calc(sd), mc, pc]);
        sd[num] += 2;
      }
      let tmp_res = 0;
      if (tmp[0] + tmp[1] < 4) tmp_res = 7 - 2 * tmp[2] - tmp[3];
      else if (tmp[0] + tmp[1] === 4) tmp_res = 7 - 2 * tmp[0] - tmp[1];
      else tmp_res = 7 - 2 * tmp[0] - Math.max(Math.min(4 - tmp[0], tmp[1]), 0);
      res["other"] = Math.min(res["other"], tmp_res);
    }
  }
  return res;
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
