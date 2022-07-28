import { Card, Typography } from "@mui/material";
import { defineFeature } from "../functions/defineFeature";
import { defineYaku } from "../functions/defineYaku";
import { DIMENSIONS } from "../const/test";
import { aaa } from "../../public/data/tehai_yaku";
import { useEffect, useState } from "react";

const permutation = ((
  r = (x, y = x.length - 1, z = []) =>
    y
      ? x.reduce(
          (a, b, c, d, _ = [...d]) =>
            a.concat(r((_.splice(c, 1), _), y - 1, z.concat(b))),
          []
        )
      : x.map((a) => [...z, a])
) => r)();

const variance = (data) => {
  const average = data.reduce((prev, cur) => prev + cur, 0) / data.length;
  return (
    data.reduce((prev, cur) => prev + Math.pow(cur - average, 2), 0) /
    data.length
  );
};

const radviz = (data, r, dim) => {
  const n = DIMENSIONS.length;
  return data.slice(0, 10).map((item) => {
    const yaku = defineYaku(defineFeature(item.tehai).featureList, 14, 0);
    let a = 0;
    let b = 0;
    let c = 0;
    const dt = (2 * Math.PI) / n;
    for (let j = 0; j < n; ++j) {
      const v = yaku[dim[j]];
      a += v * Math.cos(dt * j);
      b += v * Math.sin(dt * j);
      c += v;
    }
    a *= r / c;
    b *= r / c;
    return Math.sqrt(a * a + b * b);
  });

  // return data.slice(0, 100).map((item) => {
  //   const yaku = defineYaku(defineFeature(item.tehai).featureList, 14, 0);

  //   let a = 0;
  //   let b = 0;
  //   let c = 0;
  //   const dt = (2 * Math.PI) / n;
  //   for (let j = 0; j < n; ++j) {
  //     const v = yaku[DIMENSIONS[j]];
  //     a += v * Math.cos(dt * j);
  //     b += v * Math.sin(dt * j);
  //     c += v;
  //   }
  //   a *= r / c;
  //   b *= r / c;
  //   const d = (Math.sqrt(a * a + b * b) * 3) / 2;
  //   const t = Math.atan2(b, a);
  //   return { x: d * Math.cos(t), y: d * Math.sin(t) };
  // });
};

export const Calc = () => {
  const res = {};
  const per = permutation(DIMENSIONS);
  let max_variance = 0;
  let max_ali = [];
  let min_variance = 1000000000;
  let min_ali = [];
  for (const name of per) {
    const v = variance(radviz(aaa, 500, name));
    res[name] = v;
    if (max_variance < v) {
      max_ali = name;
      max_variance = v;
    } else if (min_variance > v) {
      min_ali = name;
      min_variance = v;
    }
  }
  console.log(max_ali, max_variance);
  console.log(min_ali, min_variance);
  // console.log(res);

  // useEffect(() => {
  //   radviz(aaa, 500).then(setRes);
  // }, [res]);

  return <Card sx={{ p: 3, height: "100%" }}></Card>;
};
