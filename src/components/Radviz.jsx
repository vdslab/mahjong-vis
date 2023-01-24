import { memo, useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import {
  shantenState,
  tehaiState,
  yakuValueState,
  diffShantenState,
  selectedTileState,
  allTileState,
  ryanmenState,
  decompositionsState,
  dimensionState,
} from "../atoms/atoms";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import { defineFeature } from "../functions/defineFeature";
import { defineYaku } from "../functions/defineYaku";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import { changeHaiName2Path } from "../functions/util";

const radviz = (dim, data, r) => {
  const n = dim.length;
  let x = 0;
  let y = 0;
  let i = 0;
  const dt = (2 * Math.PI) / n;
  for (let j = 0; j < n; ++j) {
    const v = data[dim[j]];
    x += v * Math.cos(dt * j);
    y += v * Math.sin(dt * j);
    i += v;
  }
  x *= r / i;
  y *= r / i;
  return { x, y };
};

export const Radviz = () => {
  const tehai = useRecoilValue(tehaiState);
  const selectedTile = useRecoilValue(selectedTileState);
  const dimension = useRecoilValue(dimensionState);
  const setShanten = useSetRecoilState(shantenState);
  const setYakuValue = useSetRecoilState(yakuValueState);
  const setDiffShanten = useSetRecoilState(diffShantenState);
  const setAllTile = useSetRecoilState(allTileState);
  const setDecompositions = useSetRecoilState(decompositionsState);
  const [ryanmen, setRyanmen] = useRecoilState(ryanmenState);

  const [points, setPoints] = useState([]);
  const [radvizCircle, setRadvizCircle] = useState(null);

  // 図の大きさ
  const contentWidth = 800;
  const contentHeight = 800;
  const r = contentWidth / 2;
  const margin = 60;
  const lineColor = "#444";

  // 点の大きさ
  const pointSize = 10;

  useEffect(() => {
    if (tehai.length !== 0) {
      // 14枚の手牌の特徴量と向聴数を計算
      const { featureList, shanten } = defineFeature(tehai);
      featureList["is_pinfu"] = ryanmen.has(tehai[tehai.length - 1]) ? 1 : 0;
      const yaku = defineYaku(featureList, 14);
      setAllTile({ shanten, yaku });

      // radviz上の点の座標
      const points = [];

      // 現在持っている13枚の手牌の特徴量とツモ牌を含めて任意の牌を切ったときの手牌の特徴量と向聴数の差
      const diffAssessment = {};
      const diffShanten = {};
      // 14枚のうち13枚を抜き出したときの役推定と向聴数計算
      const tehaiFeature = {};
      const tehaiShanten = {};
      // 14枚のうち13枚を抜き出したときの手牌分解
      const dec = {};
      const tehaiJson = JSON.stringify(tehai.slice(0, -1));
      for (const [key, value] of Object.entries(deleteElement(tehai))) {
        const { featureList, shanten, ryanmenRes, res } = defineFeature(value);
        if (JSON.stringify(value) === tehaiJson) {
          setRyanmen(ryanmenRes);
        }
        const yaku = defineYaku(featureList, value.length);
        tehaiFeature[key] = yaku;
        tehaiShanten[key] = shanten;
        dec[key] = res;
        points.push([key, radviz(dimension, yaku, r)]);
      }

      for (const [hai, yaku] of Object.entries(tehaiFeature)) {
        diffAssessment[hai] = Object.keys(YAKU_DESCRIPTION).reduce(
          (obj, x) =>
            Object.assign(obj, {
              [x]: yaku[x] - tehaiFeature[tehai[tehai.length - 1]][x],
            }),
          {}
        );
        diffShanten[hai] = ["other", "chitoitu", "kokushi"].reduce(
          (obj, x) =>
            Object.assign(obj, {
              [x]:
                tehaiShanten[hai][x] - tehaiShanten[tehai[tehai.length - 1]][x],
            }),
          {}
        );
      }
      setDecompositions(dec);
      setPoints(points);
      setShanten(tehaiShanten[tehai[tehai.length - 1]]);
      setYakuValue(diffAssessment);
      setDiffShanten(diffShanten);
    }
  }, [tehai]);

  return (
    <Card
      sx={{
        p: 1,
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {tehai.length === 0 || !dimension ? (
        <div>loading...</div>
      ) : (
        <svg viewBox={`0 0 ${contentWidth} ${contentHeight}`}>
          <g transform={`translate(${contentWidth / 2},${contentHeight / 2})`}>
            <circle r={r - margin} fill="none" stroke={lineColor} />
            {dimension.map((property, i) => {
              return (
                <g
                  key={i}
                  transform={`rotate(${(360 / dimension.length) * i + 90})`}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={-r + margin}
                    stroke={lineColor}
                    opacity={0.3}
                  />
                  <Tooltip
                    title={
                      YAKU_DESCRIPTION[property]["name"] +
                      (YAKU_DESCRIPTION[property]["ruby"] != ""
                        ? "（" + YAKU_DESCRIPTION[property]["ruby"] + "）"
                        : "") +
                      ":" +
                      YAKU_DESCRIPTION[property]["description"]
                    }
                    arrow
                    disableInteractive
                  >
                    <text
                      y={-r + margin}
                      textAnchor="middle"
                      dominantBaseline="text-after-edge"
                      fontSize={30}
                      style={{ userSelect: "none" }}
                    >
                      {YAKU_DESCRIPTION[property]["name"]}
                    </text>
                  </Tooltip>
                </g>
              );
            })}
            {points.map(([tile, { x, y }], i) => (
              <g key={i} transform={`translate(${x},${y})`}>
                <Tooltip
                  title={
                    radvizCircle && (
                      <img
                        src={changeHaiName2Path(radvizCircle)}
                        width="30"
                        height="40"
                      />
                    )
                  }
                  arrow
                  placement="top-start"
                >
                  <circle
                    r={pointSize}
                    fill={tile !== tehai[tehai.length - 1] ? "green" : "red"}
                    fillOpacity={
                      !selectedTile || selectedTile === tile ? 1 : 0.1
                    }
                    onMouseOver={() => setRadvizCircle(tile)}
                  />
                </Tooltip>
              </g>
            ))}
          </g>
          <Legends x={contentWidth - 130} y={contentHeight - 50} />
        </svg>
      )}
    </Card>
  );
};

const Legends = memo(({ x, y }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="10" fill="red" />
      <text
        x="20"
        y="0"
        fontSize="20"
        dominantBaseline="middle"
        style={{ userSelect: "none" }}
      >
        現在の位置
      </text>
      <circle cx="0" cy="30" r="10" fill="green" />
      <text
        x="20"
        y="30"
        fontSize="20"
        dominantBaseline="middle"
        style={{ userSelect: "none" }}
      >
        予測位置
      </text>
    </g>
  );
});

// 配列から取り除いた要素とそれ以外の要素のオブジェクトを返す
const deleteElement = (array) => {
  const res = {};
  for (let i = 0; i < array.length; ++i) {
    res[array[i]] = array.slice(0, i).concat(array.slice(i + 1));
  }
  return res;
};
