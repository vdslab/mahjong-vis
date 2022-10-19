import * as d3 from "d3";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  yakuValueState,
  selectedTileState,
  tehaiState,
  yakuRankState,
} from "./atoms";
import { defineFeature } from "../functions/defineFeature";
import { defineYaku } from "../functions/defineYaku";
import { DIMENSIONS } from "../const/upper";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import { Card, Tooltip } from "@mui/material";
import { memo, useCallback, useEffect } from "react";
import { changeHaiName2Path } from "../functions/util";

export const AssessmentView = () => {
  const yakuValue = useRecoilValue(yakuValueState);
  const [selectedTile, setSelectedTile] = useRecoilState(selectedTileState);
  const margin = {
    top: 10,
    bottom: 50,
    left: 100,
    right: 90,
  };
  const contentWidth = 800;
  const contentHeight = 1200;
  const strokeColor = "#888";
  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight + 0;
  const colorList = ["#e6ab02", "#666666", "#a6761d"];
  const colorScale = useCallback(
    d3
      .scaleLinear()
      .domain([100, 0, -100])
      .range(["orangered", "whitesmoke", "dodgerblue"]),
    []
  );
  const xScale = d3
    .scaleLinear()
    .domain([0, Object.keys(yakuValue).length])
    .range([0, contentWidth])
    .nice();
  const yScale = useCallback(
    d3
      .scaleLinear()
      .domain([0, DIMENSIONS.length])
      .range([0, contentHeight - 200])
      .nice(),
    []
  );

  return (
    <Card sx={{ p: 1, height: "100%" }}>
      {Object.keys(yakuValue).length === 0 ? (
        <div>loading...</div>
      ) : (
        <svg
          viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
        >
          <VerticalAxis
            names={DIMENSIONS}
            scale={yScale}
            strokeColor={strokeColor}
            height={svgHeight}
            colorList={colorList}
          />
          <HorizontalAxis
            tiles={Object.keys(yakuValue)}
            scale={xScale}
            strokeColor={strokeColor}
            width={svgWidth}
            selectedTile={selectedTile}
            setSelectedTile={setSelectedTile}
          />
          <Contents
            data={yakuValue}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
          />
          <Legends
            x={80}
            y={svgHeight - 130}
            width={svgWidth - 200}
            colorScale={colorScale}
            colorList={colorList}
          />
        </svg>
      )}
    </Card>
  );
};

const VerticalAxis = memo(
  ({ names, scale, strokeColor, height, colorList = [] }) => {
    const x = 70;
    const [y1, y2] = [-20, height - 180];
    const tehai = useRecoilValue(tehaiState);
    const [yakuRank, setYakuRank] = useRecoilState(yakuRankState);
    let rankIdx = -1;

    useEffect(() => {
      if (tehai.length !== 0) {
        const featureList = defineFeature(tehai);
        const data = defineYaku(featureList.featureList, 14, 0);
        const DescList = Object.entries(data);

        DescList.sort(function (p1, p2) {
          return p2[1] - p1[1];
        });
        setYakuRank(DescList);
      }
    }, [tehai]);
    return (
      <g>
        <line x1={x} y1={y1} x2={x} y2={y2} stroke={strokeColor} />
        {names.map((name, idx) => {
          rankIdx = -1;
          yakuRank.slice(0, 3).forEach((value, idx) => {
            if (value[0] == name) {
              rankIdx = idx;
            }
          });
          return (
            <g key={idx} transform={`translate(${x}, ${120 + scale(idx)})`}>
              <Tooltip
                title={YAKU_DESCRIPTION[name]["description"]}
                placement="top-start"
                arrow
                disableInteractive
              >
                <g>
                  {rankIdx > -1 ? (
                    <circle cx="-160" cy="0" r="10" fill={colorList[rankIdx]} />
                  ) : (
                    ""
                  )}
                  <text
                    x="-20"
                    textAnchor="end"
                    dominantBaseline="central"
                    fontSize="30"
                    style={{
                      userSelect: "none",
                    }}
                  >
                    {YAKU_DESCRIPTION[name]["name"]}
                  </text>
                </g>
              </Tooltip>
            </g>
          );
        })}
      </g>
    );
  }
);

const HorizontalAxis = ({
  tiles,
  scale,
  strokeColor,
  width,
  selectedTile,
  setSelectedTile,
}) => {
  const y = 80;
  const [x1, x2] = [-60, width];
  const [tileWidth, tileHeight] = [51, 68];

  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={strokeColor} />
      {tiles.map((tile, idx) => {
        return (
          <g key={idx} transform={`translate(${80 + scale(idx)}, 0)`}>
            <image
              style={{ cursor: "pointer" }}
              href={changeHaiName2Path(tile)}
              width={tileWidth}
              height={tileHeight}
              onClick={() => setSelectedTile(tile)}
            />
            {selectedTile === tile && (
              <rect
                fill="none"
                stroke="red"
                strokeWidth="4px"
                width={tileWidth}
                height={tileHeight}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};

const Contents = ({ data, xScale, yScale, colorScale }) => {
  const viewData = transpose(Object.values(data).map((i) => Object.values(i)));

  return (
    <g transform={`translate(80, 90)`}>
      {viewData.map((rows, i) => {
        return rows.map((item, j) => {
          return (
            <Tooltip
              key={i * viewData.length + j}
              title={Math.ceil(item)}
              arrow
              disableInteractive
            >
              <rect
                x={xScale(j)}
                y={yScale(i)}
                width={52}
                height={58}
                fill={colorScale(item)}
              />
            </Tooltip>
          );
        });
      })}
    </g>
  );
};

const Legends = memo(({ x, y, width, colorScale, colorList = [] }) => {
  return (
    <g>
      <g transform={`translate(${x - 140}, ${y})`}>
        <text fontSize="30">役の点数</text>
      </g>

      {colorList.map((item, idx) => {
        return (
          <g
            key={idx}
            transform={`translate(${x - 40}, ${y + (idx + 1) * 30})`}
          >
            <text x="-100" y="0" fontSize="30" dominantBaseline="middle">
              {idx + 1}位
            </text>
            <circle cx="0" cy="0" r="10" fill={item} />
          </g>
        );
      })}
      <g transform={`translate(${x}, ${y})`}>
        <linearGradient id="gradient">
          {[...Array(41)].map((_, idx) => {
            return (
              <stop
                key={idx}
                offset={`${(idx * 5) / 2}%`}
                stopColor={colorScale(100 - idx * 5)}
              />
            );
          })}
        </linearGradient>
        <rect width={width} height="50" fill="url('#gradient')" />
        <text
          dominantBaseline="text-after-edge"
          fontSize={30}
          y="100"
          style={{ userSelect: "none" }}
        >
          {`<---- その役になる`}
        </text>
        <text
          textAnchor="end"
          dominantBaseline="text-after-edge"
          fontSize={30}
          x={width}
          y="100"
          style={{ userSelect: "none" }}
        >
          {`その役にならない ---->`}
        </text>
      </g>
    </g>
  );
});

// 転置
const transpose = (a) => {
  return a[0].map((_, c) => a.map((r) => r[c]));
};
