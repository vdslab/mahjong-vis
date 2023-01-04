import { CHITOITU_GRAD, SANSHOKU_DOKO_GRAD } from "../const/score";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";

export const defineYaku = (featureList, haiLen) => {
  if (haiLen === 14) console.log(featureList);
  const yakuList = makeObject(Object.keys(YAKU_DESCRIPTION));

  const ziToituCnt =
    featureList["zikaze_bakaze_toitu"] +
    featureList["kaze_toitu"] +
    featureList["sangen_toitu"];
  const ziKotuCnt =
    featureList["zikaze_bakaze_kotu"] +
    featureList["kaze_kotu"] +
    featureList["sangen_kotu"];
  const ziCnt =
    featureList["zikaze_bakaze_cnt"] +
    featureList["kaze_cnt"] +
    featureList["sangen_cnt"];
  const yaochuCnt = ziCnt + featureList["ichikyu_cnt"];
  const tmpKotuCnt =
    ziKotuCnt + featureList["ichikyu_kotu"] + featureList["chunchan_kotu"];
  const tmpShuntuCnt =
    featureList["ichikyu_shuntu"] + featureList["chunchan_shuntu"];
  const tmpRyanmenCnt =
    featureList["3-7_ryanmen"] + featureList["23_78_ryanmen"];
  const tmpChitoituCnt =
    featureList["chitoitu_chunchan_cnt"] + featureList["chitoitu_yaochu_cnt"];

  // 自風場風
  yakuList["zikaze_bakaze"] = featureList["zikaze_bakaze_kotu"]
    ? 100
    : featureList["zikaze_bakaze_toitu"]
    ? 70
    : featureList["zikaze_bakaze_cnt"]
    ? 10
    : 0;

  // 三元牌
  yakuList["sangenhai"] = featureList["sangen_kotu"]
    ? 100
    : featureList["sangen_toitu"]
    ? 70
    : featureList["sangen_cnt"]
    ? 10
    : 0;

  // タンヤオ
  // TODO:max(,0)の処理いるかどうか
  // 枚数付与点(30点)
  yakuList["tanyao"] =
    (Math.max(featureList["chunchan_cnt"] - yaochuCnt, 0) / haiLen) * 30;
  // 構造付与点(70点)
  // 七対子と複合するため別途計算している
  yakuList["tanyao"] += Math.max(
    (featureList["chunchan_shuntu"] + featureList["chunchan_kotu"]) * 15 +
      featureList["chunchan_toitu"] * 10 +
      (featureList["3-7_ryanmen"] + featureList["2-8_kanchan"]) * 8 +
      featureList["23_78_ryanmen"] * 6 +
      featureList["13_79_kanchan"] * 3 +
      featureList["penchan"],
    (featureValue(featureList["chitoitu_chunchan_cnt"], CHITOITU_GRAD) * 7) / 10
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
  yakuList["chitoitu"] = featureValue(tmpChitoituCnt, CHITOITU_GRAD);

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
  yakuList["sanshoku_doko"] = featureValue(
    featureList["sanshoku_doko_score"],
    SANSHOKU_DOKO_GRAD
  );

  // 三暗刻
  // 枚数点付与(40点)
  yakuList["sananko"] =
    (Math.min(featureList["toitoi_sananko_cnt"], 3) * 40 +
      Math.min(3 - featureList["toitoi_sananko_cnt"], tmpChitoituCnt) * 15) /
    3;
  // 構造点付与(60点)
  yakuList["sananko"] += featureList["sananko_structure"];

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
    (Math.max(yaochuCnt - featureList["chunchan_cnt"], 0) / haiLen) * 30;
  // 構造付与点(70点)
  // 七対子と複合するため別途計算している
  yakuList["honroto"] += Math.max(
    (ziKotuCnt + featureList["ichikyu_kotu"]) * 15 +
      (ziToituCnt + featureList["ichikyu_toitu"]) * 10,
    featureList["chitoitu_yaochu_cnt"] * 10
  );

  // チャンタ
  yakuList["chanta"] =
    (featureList["ichikyu_kotu"] + featureList["ichikyu_shuntu"] + ziKotuCnt) *
      22 +
    (featureList["ichikyu_toitu"] + ziToituCnt) * 12 +
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
  yakuList["honitu"] = ((featureList["same_color_cnt"] + ziCnt) / haiLen) * 30;
  // 構造付与点(70点)
  yakuList["honitu"] += featureList["honitu_structure"];
  // 清一色
  // 枚数付与点(30点)
  yakuList["chinitu"] = (featureList["same_color_cnt"] / haiLen) * 30;
  // 構造付与点(70点)
  yakuList["chinitu"] += featureList["chinitu_structure"];

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
  if (haiLen === 14) console.log(yakuList);
  return yakuList;
};

// 配列の中身をkeyとしたobjectを返す
const makeObject = (array, init = 0) => {
  return array.reduce((obj, x) => Object.assign(obj, { [x]: init }), {});
};

const featureValue = (cnt, d) => {
  for (const [key, value] of d) {
    if (key <= cnt) return value;
  }
  return 0;
};
