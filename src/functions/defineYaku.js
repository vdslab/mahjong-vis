import { YAKU_DESCRIPTION } from "../const/yakuDescription";

export const defineYaku = (featureList, haiLen) => {
  const yakuList = makeObject(Object.keys(YAKU_DESCRIPTION));

  const tmpKotuCnt =
    featureList["zi_kotu"] +
    featureList["ichikyu_kotu"] +
    featureList["chunchan_kotu"];
  const tmpToituCnt =
    featureList["zi_toitu"] +
    featureList["ichikyu_toitu"] +
    featureList["chunchan_toitu"];
  const tmpShuntuCnt =
    featureList["ichikyu_shuntu"] + featureList["chunchan_shuntu"];
  const tmpRyanmenCnt =
    featureList["3-7_ryanmen"] + featureList["23_78_ryanmen"];
  const tmpChitoituCnt =
    featureList["chitoitu_chunchan_cnt"] +
    featureList["chitoitu_ichikyu_cnt"] +
    featureList["chitoitu_zi_cnt"];

  // 自風場風
  // TODO:浮き
  yakuList["zikaze_bakaze"] =
    featureList["zikaze_bakaze_kotu"] || featureList["zikaze_bakaze_kantu"]
      ? 100
      : featureList["zikaze_bakaze_toitu"]
      ? 70
      : 0;

  // 三元
  // TODO:浮き
  yakuList["sangenhai"] =
    featureList["sangen_kotu"] || featureList["sangen_kantu"]
      ? 100
      : featureList["sangen_toitu"]
      ? 70
      : 0;

  // タンヤオ
  // 枚数付与点(30点)
  yakuList["tanyao"] =
    (Math.max(
      featureList["chunchan_cnt"] -
        featureList["ichikyu_cnt"] -
        featureList["zi_cnt"],
      0
    ) /
      haiLen) *
    30;
  // 構造付与点(70点)
  yakuList["tanyao"] += Math.max(
    (featureList["chunchan_shuntu"] + featureList["chunchan_kotu"]) * 15 +
      featureList["chunchan_toitu"] * 10 +
      (featureList["3-7_ryanmen"] + featureList["2-8_kanchan"]) * 8 +
      featureList["23_78_ryanmen"] * 6 +
      featureList["13_79_kanchan"] * 3 +
      featureList["penchan"],
    featureList["chitoitu_chunchan_cnt"] * 10
  );

  // 平和
  yakuList["pinfu"] =
    tmpShuntuCnt * 21 +
    tmpRyanmenCnt * 5 +
    (featureList["ichikyu_toitu"] + featureList["chunchan_toitu"]) * 6 +
    featureList["is_pinfu"] -
    tmpKotuCnt * 21;
  // yakuList["pinfu"] =
  //   pinfu(
  //     Math.round(
  //       featureList["chitoitu_cnt"] - featureList["toitoi_sananko_cnt"]
  //     ),
  //     Math.round(
  //       featureList["ichikyu_shuntu"] + featureList["chunchan_shuntu"]
  //     ),
  //     Math.round(featureList["3-7_ryanmen"] + featureList["23_78_ryanmen"]),
  //     Math.round(featureList["13_79_kanchan"] + featureList["2-8_kanchan"]),
  //     Math.round(featureList["penchan"]),
  //     Math.round(featureList["sangen_cnt"] + featureList["zikaze_bakaze_cnt"]),
  //     0
  //   ) -
  //   ((featureList["sangen_kotu"] + featureList["zikaze_bakaze_kotu"]) * 25 +
  //     (featureList["sangen_toitu"] + featureList["zikaze_bakaze_toitu"]) * 15 +
  //     (featureList["chunchan_kotu"] + featureList["ichikyu_kotu"]) +
  //     featureList["kaze_kotu"] * 20);

  // 七対子
  yakuList["chitoitu"] = featureValue(tmpChitoituCnt, {
    7: 100,
    6: 95,
    5: 80,
    4: 50,
    3: 20,
    2: 10,
  });

  // 一盃口
  // 枚数点付与(30点)
  yakuList["ipeko"] = featureList["ipeko_score"] * 5;
  // 構造点付与(70点)
  yakuList["ipeko"] += featureList["ipeko_structure"];
  // 二盃口
  // 枚数点付与(30点)
  yakuList["ryanpeko"] = featureList["ryanpeko_score"] * 5;
  // 構造点付与(70点)
  yakuList["ryanpeko"] += featureList["ryanpeko_structure"];

  // 三色同順
  // 枚数点付与(40点)
  yakuList["sanshoku_dojun"] = (featureList["sanshoku_dojun_score"] * 40) / 9;
  // 構造点付与(60点)
  yakuList["sanshoku_dojun"] += featureList["sanshoku_dojun_structure"];
  // 三色同刻
  // 枚数点付与(40点)
  yakuList["sanshoku_doko"] = featureValue(featureList["sanshoku_doko_score"], {
    9: 100,
    8: 90,
    7: 80,
    6: 60,
    5: 40,
    4: 20,
    3: 10,
    2: 5,
    1: 2,
  });

  // 三暗刻
  // 枚数点付与(40点)
  yakuList["sananko"] =
    (Math.min(featureList["toitoi_sananko_cnt"], 3) * 40 +
      Math.min(3 - featureList["toitoi_sananko_cnt"], tmpChitoituCnt) * 15) /
    3;
  // 構造点付与(60点)
  yakuList["sananko"] +=
    tmpKotuCnt * 20 + Math.min(3 - tmpKotuCnt, tmpToituCnt) * 15;

  // 一通
  // 枚数点付与(40点)
  yakuList["ittu"] = (featureList["ittu_score"] / 9) * 40;
  // 構造点付与(60点)
  yakuList["ittu"] += featureList["ittu_structure"];

  // 小三元
  yakuList["shosangen"] =
    featureList["sangen_kotu"] * 40 + featureList["sangen_toitu"] * 20;

  // 混老頭
  // 枚数付与点(30点)
  yakuList["honroto"] =
    (Math.max(
      featureList["ichikyu_cnt"] +
        featureList["zi_cnt"] -
        featureList["chunchan_cnt"],
      0
    ) /
      haiLen) *
    30;
  // 構造付与点(70点)
  yakuList["honroto"] += Math.max(
    (featureList["zi_kotu"] + featureList["ichikyu_kotu"]) * 15 +
      (featureList["zi_toitu"] + featureList["ichikyu_toitu"]) * 10,
    (featureList["chitoitu_ichikyu_cnt"] + featureList["chitoitu_zi_cnt"]) * 10
  );

  // チャンタ
  yakuList["chanta"] =
    (featureList["ichikyu_kotu"] +
      featureList["ichikyu_shuntu"] +
      featureList["zi_kotu"]) *
      22 +
    (featureList["ichikyu_toitu"] + featureList["zi_toitu"]) * 12 +
    (featureList["penchan"] + featureList["13_79_kanchan"]) * 8 +
    featureList["2-8_kanchan"] * 4 +
    featureList["23_78_ryanmen"] * 2;

  // 純チャン
  yakuList["junchan"] =
    (featureList["ichikyu_kotu"] + featureList["ichikyu_shuntu"]) * 22 +
    featureList["ichikyu_toitu"] * 12 +
    (featureList["penchan"] + featureList["13_79_kanchan"]) * 8 +
    featureList["2-8_kanchan"] * 4 +
    featureList["23_78_ryanmen"] * 2;

  // 混一色
  // 枚数付与点(30点)
  yakuList["honitu"] =
    ((featureList["same_color_cnt"] + featureList["zi_cnt"]) / haiLen) * 30;
  // 構造付与点(70点)
  yakuList["honitu"] += featureList["honitu_score"];
  // 清一色
  // 枚数付与点(30点)
  yakuList["chinitu"] = (featureList["same_color_cnt"] / haiLen) * 30;
  // 構造付与点(70点)
  yakuList["chinitu"] += featureList["chinitu_score"];

  // 範囲外を丸める関数(error検知用)
  for (const key of Object.keys(yakuList)) {
    if (yakuList[key] < 0 && key !== "pinfu") {
      console.log(key, yakuList[key]);
      yakuList[key] = 0;
    }
    if (yakuList[key] > 100) {
      console.log(key, yakuList[key]);
      yakuList[key] = 100;
    }
  }
  return yakuList;
};

// 配列の中身をkeyとしたobjectを返す
const makeObject = (array, init = 0) => {
  return array.reduce((obj, x) => Object.assign(obj, { [x]: init }), {});
};

const featureValue = (cnt, d) => {
  return d[cnt] || 0;
};
