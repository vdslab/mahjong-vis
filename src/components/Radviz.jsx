import { Card, Tooltip } from "@mui/material";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  shantenState,
  tehaiState,
  yakuValueState,
  diffShantenState,
  selectedTileState,
} from "./atoms";
import { defineFeature } from "../functions/defineFeature";
import { defineYaku } from "../functions/defineYaku";
import { DIMENSIONS } from "../const/upper";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import { useEffect, useState } from "react";

const radviz = (data, r) => {
  const n = DIMENSIONS.length;
  let a = 0;
  let b = 0;
  let c = 0;
  const dt = (2 * Math.PI) / n;
  for (let j = 0; j < n; ++j) {
    const v = data[DIMENSIONS[j]];
    a += v * Math.cos(dt * j);
    b += v * Math.sin(dt * j);
    c += v;
  }
  a *= r / c;
  b *= r / c;
  const d = (Math.sqrt(a * a + b * b) * 4) / 3;
  const t = Math.atan2(b, a);
  return { x: d * Math.cos(t), y: d * Math.sin(t) };
};

export const Radviz = () => {
  const tehai = useRecoilValue(tehaiState);
  const selectedTile = useRecoilValue(selectedTileState);
  const setShanten = useSetRecoilState(shantenState);
  const setYakuValue = useSetRecoilState(yakuValueState);
  const setDiffShanten = useSetRecoilState(diffShantenState);
  const [points, setPoints] = useState([]);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  // 図の大きさ
  const r = 300;
  const contentWidth = 2 * r;
  const contentHeight = 2 * r;
  const margin = 50;
  const width = contentWidth + margin * 2;
  const height = contentHeight + margin * 2;
  const lineColor = "#444";

  // 点の大きさ
  const pointSize = 10;

  useEffect(() => {
    if (tehai.length !== 0) {
      // 14枚の手牌の特徴量と向聴数を計算
      const { featureList, shanten } = defineFeature(tehai);

      // radviz上の点の座標
      // 配列の末尾が現在の点の座標
      const points = [];

      // 現在持っている13枚の手牌の特徴量とツモ牌を含めて任意の牌を切ったときの手牌の特徴量と向聴数の差
      const diffAssessment = {};
      const diffShanten = {};
      // 14枚のうち13枚を抜き出したときの役推定と向聴数計算
      const tehaiFeature = {};
      const tehaiShanten = {};
      for (const [key, value] of Object.entries(deleteElement(tehai))) {
        const { featureList, shanten } = defineFeature(value);
        const yaku = defineYaku(featureList, value.length, 0);
        tehaiFeature[key] = yaku;
        tehaiShanten[key] = shanten;
        points.push([key, radviz(yaku, r)]);
      }

      for (const [hai, yaku] of Object.entries(tehaiFeature)) {
        diffAssessment[hai] = DIMENSIONS.reduce(
          (obj, x) =>
            Object.assign(obj, {
              [x]: yaku[x] - tehaiFeature[tehai[tehai.length - 1]][x],
            }),
          {}
        );
        diffShanten[hai] = Object.keys(shanten).reduce(
          (obj, x) =>
            Object.assign(obj, {
              [x]:
                tehaiShanten[hai][x] - tehaiShanten[tehai[tehai.length - 1]][x],
            }),
          {}
        );
      }

      setX(x);
      setY(y);
      setPoints(points);
      setShanten(tehaiShanten[tehai[tehai.length - 1]]);
      setYakuValue(diffAssessment);
      setDiffShanten(diffShanten);
    }
  }, [tehai]);

  return (
    <Card sx={{ p: 1, height: "100%" }}>
      {tehai.length === 0 ? (
        <div>loading...</div>
      ) : (
        <svg viewBox={`0 0 ${width} ${height}`}>
          <g transform={`translate(${margin + r},${margin + r})`}>
            <circle r={r} fill="none" stroke={lineColor} />
            {DIMENSIONS.map((property, i) => {
              return (
                <g
                  key={i}
                  transform={`rotate(${(360 / DIMENSIONS.length) * i + 90})`}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={-r}
                    stroke={lineColor}
                    opacity={0.3}
                  />
                  <Tooltip
                    title={YAKU_DESCRIPTION[property]["description"]}
                    arrow
                    disableInteractive
                  >
                    <text
                      y={-r}
                      textAnchor="middle"
                      dominantBaseline="text-after-edge"
                      fontSize={20}
                      style={{ userSelect: "none" }}
                    >
                      {YAKU_DESCRIPTION[property]["name"]}
                    </text>
                  </Tooltip>
                </g>
              );
            })}
            {points.map(([tile, { x, y }], i) => {
              return (
                <g key={i} transform={`translate(${x},${y})`}>
                  <circle
                    r={pointSize}
                    fill={i !== points.length - 1 ? "green" : "red"}
                    fillOpacity={
                      selectedTile === "" || selectedTile === tile ? 1 : 0.1
                    }
                  />
                </g>
              );
            })}
          </g>
        </svg>
      )}
    </Card>
  );
};

// 配列から取り除いた要素とそれ以外の要素のオブジェクトを返す
const deleteElement = (array) => {
  const res = {};
  for (let i = 0; i < array.length; ++i) {
    res[array[i]] = array.slice(0, i).concat(array.slice(i + 1));
  }
  return res;
};
