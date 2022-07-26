import * as d3 from "d3";
import { Card, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { defineFeature } from "../functions/defineFeature";
import { tehaiState } from "./atoms";
import { DIMENSIONS } from "../const/clusterValue";
import { DoDisturbOffSharp } from "@mui/icons-material";

const calc_dist = (a, b, n) => {
  let sum = 0;
  for (let i = 0; i < n; ++i) {
    sum += (a[i] - b[i]) * (a[i] - b[i]);
  }
  return Math.sqrt(sum);
};

const radviz = (
  data,
  dimensions,
  r,
  dime = [
    "tanyao",
    "sangenhai",
    "pinfu",
    "zikaze_bakaze",
    "honitu",
    "ipeko",
    "sanshoku_dojun",
    "chitoitu",
  ]
) => {
  const n = Object.keys(dimensions).length;
  // const scales = Object.keys(dimensions).map((property) => {
  //   console.log(property);
  //   return d3
  //     .scaleLinear()
  //     .domain(d3.extent(data, (item) => item[property]))
  //     .range([0, 1]);
  // });
  return data.map((item, i) => {
    let a = 0;
    let b = 0;
    let c = 0;
    const dt = (2 * Math.PI) / n;
    for (let j = 0; j < n; ++j) {
      const v = calc_dist(item, dimensions[dime[j]], n);
      a += v * Math.cos(dt * j);
      b += v * Math.sin(dt * j);
      c += v;
    }
    a *= r / c;
    b *= r / c;
    const d = Math.sqrt(a * a + b * b);
    return d;
    // const t = Math.atan2(b, a);
    // return { x: d * Math.cos(t), y: d * Math.sin(t) };
  });
};

// 配列の順列を生成
const permutation = (array) => {
  let result = [];
  if (array.length === 1) {
    result.push(array);
    return result;
  }
  for (let i = 0; i < array.length; i++) {
    const firstElem = array.slice(i, i + 1);
    const restElem = [...array.slice(0, i), ...array.slice(i + 1)];
    let innerPermutations = permutation(restElem);
    for (let j = 0; j < innerPermutations.length; j++) {
      result.push([...firstElem, ...innerPermutations[j]]);
    }
  }
  return result;
};
const average = (arr) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
};
const variance = (arr) => {
  const avg = average(arr);
  let varia = 0;
  for (let i = 0; i < arr.length; i++) {
    varia = varia + Math.pow(arr[i] - avg, 2);
  }
  return varia / arr.length;
};
const aaa = () => {
  const dimensions = DIMENSIONS;
  const r = 300;
  const yakuData = [];
  (async () => {
    const dime = [
      "sangenhai",
      "pinfu",
      "zikaze_bakaze",
      "honitu",
      "ipeko",
      "sanshoku_dojun",
      "chitoitu",
    ];

    // アンカーの順列を生成
    const dime_all = permutation(dime);
    const res = await fetch("/data/tehai_yaku.json");
    yakuData = await res.json();
    let max_i = 0;
    let max_pattern = [];
    let max_varia = 0;
    for (let i = 0; i < dime_all.length; i++) {
      const dime = ["tanyao", ...dime_all[i]];
      const arr = [];
      // if (i < dime_all.length) {
      yakuData.forEach((item) => {
        const ff = defineFeature(item.tehai).featureList;
        const dd = Object.keys(ff).map(function (key) {
          return ff[key];
        });
        arr.push(parseInt(radviz([dd], dimensions, r, dime)));
      });
      // 分散を計算
      const varia = variance(arr);
      console.log(varia, dime);
      if (varia > max_varia) {
        max_varia = varia;
        max_i = i;
        max_pattern = dime;
      }
      // }
    }
    console.log("max_varia", max_varia);
    console.log("max_i", max_i);
    console.log("max_pattern", max_pattern);
  })();

  const tehai = [
    "m1",
    "m2",
    "m3",
    "m7",
    "m7",
    "p6",
    "p6",
    "p6",
    "s3",
    "s4",
    "s5",
    "w1",
    "w1",
    "w1",
  ];

  // console.log(dime_all);
  // const f_list = defineFeature(tehai).featureList;

  // const data = Object.keys(f_list).map(function (key) {
  //   return f_list[key];
  // });
  // console.log(data);

  // const data1 = [];
  // data1.push(data);
  // console.log("aa", radviz(data1, dimensions, r));
};

export const Radviz = () => {
  const tehai = useRecoilValue(tehaiState);
  const feature = defineFeature(tehai);
  console.log("featureis ", feature);
  const dimensions = DIMENSIONS;
  aaa();
  const data = [
    [
      0, 0, 100, 0, 0, 56.66666667, 0, 48.33333333, 48.88888889, 0, 46, 0, 15,
      0, 0, 0, 0, 42.85714286, 42.85714286,
    ],
  ];
  const r = 300;
  const contentWidth = 2 * r;
  const contentHeight = 2 * r;
  const margin = 50;
  const width = contentWidth + margin * 2;
  const height = contentHeight + margin * 2;
  const lineColor = "#444";

  const points = radviz(data, dimensions, r);
  // console.log(points);

  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Radvis
      </Typography>
      <svg viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${margin + r},${margin + r})`}>
          <circle r={r} fill="none" stroke={lineColor} />
          {Object.keys(dimensions).map((property, i) => {
            return (
              <g
                key={i}
                transform={`rotate(${
                  (360 / Object.keys(dimensions).length) * i + 90
                })`}
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={-r}
                  stroke={lineColor}
                  opacity={0.3}
                />
                <text
                  y={-r}
                  textAnchor="middle"
                  dominantBaseline="text-after-edge"
                >
                  {property}
                </text>
              </g>
            );
          })}
          {data.map((item, i) => {
            const { x, y } = points[i];
            return (
              <g key={i} transform={`translate(${x},${y})`}>
                <circle r="3" opacity="0.8" />
              </g>
            );
          })}
        </g>
      </svg>
    </Card>
  );
};
