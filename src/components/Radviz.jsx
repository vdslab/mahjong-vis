import * as d3 from "d3";
import { Card, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { defineFeature } from "../functions/defineFeature";
import { tehaiState } from "./atoms";

const calc_dist = (a, b, n) => {
  let sum = 0;
  for (let i = 0; i < n; ++i) {
    sum += (a[i] - b[i]) * (a[i] - b[i]);
  }
  return Math.sqrt(sum);
};

const radviz = (data, dimensions, r) => {
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
      const v = calc_dist(item, dimensions[Object.keys(dimensions)[j]], n);
      a += v * Math.cos(dt * j);
      b += v * Math.sin(dt * j);
      c += v;
    }
    a *= r / c;
    b *= r / c;
    const d = Math.sqrt(a * a + b * b);
    const t = Math.atan2(b, a);
    return { x: d * Math.cos(t), y: d * Math.sin(t) };
  });
};

export const Radviz = () => {
  const tehai = useRecoilValue(tehaiState);
  const feature = defineFeature(tehai);
  const dimensions = {
    tanyao: [
      0, 0, 100, 19.62155388, 0, 64.16597048, 0, 48.13074353, 42.67195767,
      4.448621554, 42.6566416, 0, 15.18796992, 0, 0, 0, 0, 48.80057286,
      48.80057286,
    ],
    sangenhai: [
      2.397003745, 100, 65.65008026, 9.287141074, 0, 52.06963518, 0,
      65.13524761, 43.20155361, 2.571785268, 49.11860175, 44.21473159,
      23.27715356, 41.84769039, 29.71285893, 0, 19.27091136, 65.14178705,
      40.54752987,
    ],
    pinfu: [
      0, 0, 85.58282209, 99.52147239, 0, 65.34423995, 0, 15, 59.78868439,
      6.319018405, 19.85276074, 33.16564417, 0, 0, 4.214723926, 0, 32.20858896,
      50.31770377, 49.17835232,
    ],
    zikaze_bakaze: [
      100, 2.987551867, 65.44161233, 8.263485477, 0, 51.17335178, 0, 64.7164592,
      44.31074228, 2.634854772, 49.41908714, 44.36514523, 22.90456432,
      0.995850622, 29.85062241, 0, 20.08713693, 65.66390041, 41.73088322,
    ],
    honitu: [
      11.25, 24.375, 63.83928571, 6.25, 0, 33.33333333, 0, 64.27083333,
      58.54166667, 5.625, 68.4375, 44.125, 23.4375, 8.125, 30.375, 0, 22.0625,
      100, 76.5625,
    ],
    ipeko: [
      1.578947368, 6.315789474, 80.35714286, 90.31578947, 0, 51.24269006, 0,
      29.03508772, 45.43859649, 62.43421053, 58.21052632, 37.23684211,
      6.315789474, 2.105263158, 9.736842105, 0, 33.71052632, 57.70676692,
      53.7593985,
    ],
    sanshoku_dojun: [
      4.615384615, 6.923076923, 77.38095238, 39.15384615, 0, 100, 0,
      23.54700855, 52.45014245, 2.179487179, 20.84615385, 49.15384615,
      3.846153846, 2.307692308, 8.256410256, 0, 45.64102564, 50.36630037,
      46.24542125,
    ],
    chitoitu: [
      13.17073171, 28.7804878, 63.7630662, 25.83739837, 0, 30.59620596, 0,
      44.02439024, 27.01897019, 100, 60, 33.17073171, 0, 11.05691057,
      27.70731707, 0, 19.77235772, 61.78861789, 44.25087108,
    ],
  };
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
