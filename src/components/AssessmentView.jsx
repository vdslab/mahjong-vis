import * as d3 from "d3";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  yakuValueState,
  selectedTileState,
  tehaiState,
  yakuRankState,
} from "../atoms/atoms";
import { defineFeature } from "../functions/defineFeature";
import { defineYaku } from "../functions/defineYaku";
import { DIMENSIONS } from "../const/upper";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import { Card, Tooltip } from "@mui/material";
import { memo, useCallback, useEffect } from "react";
import { changeHaiName2Path } from "../functions/util";

const dataHeight = 68;
const dataWidth = 51;
const contentX = 180;
const contentY = 80;
const contentWidth = 1050;
const contentHeight = 850;
const legendWidth = 150;

export const AssessmentView = () => {
  const yakuValue = useRecoilValue(yakuValueState);

  const strokeColor = "#888";
  const colorList = ["#e6ab02", "#666666", "#a6761d"];
  const colorScale = useCallback(
    d3
      .scaleLinear()
      .domain([100, 0, -100])
      .range(["orangered", "#dcdcdc", "dodgerblue"]),
    []
  );
  const xScale = d3
    .scaleLinear()
    .domain([0, Object.keys(yakuValue).length])
    .range([0, contentWidth - contentX - legendWidth])
    .nice();

  return (
    <Card sx={{ p: 1, height: "100%", width: "100%" }}>
      {Object.keys(yakuValue).length === 0 ? (
        <div>loading...</div>
      ) : (
        <svg
          viewBox={`0 0 ${contentWidth} ${contentHeight}`}
          width="330px"
          height="350px"
        >
          <VerticalAxis strokeColor={strokeColor} colorList={colorList} />
          <HorizontalAxis
            tiles={Object.keys(yakuValue)}
            scale={xScale}
            strokeColor={strokeColor}
          />
          <Contents data={yakuValue} xScale={xScale} colorScale={colorScale} />
          <RankLegends colorList={colorList} />
          <GradationLegends colorScale={colorScale} />
        </svg>
      )}
    </Card>
  );
};

const VerticalAxis = memo(({ strokeColor, colorList = [] }) => {
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
      <line
        x1={contentX - 10}
        y1={0}
        x2={contentX - 10}
        y2={contentHeight}
        stroke={strokeColor}
      />
      {DIMENSIONS.map((name, idx) => {
        rankIdx = -1;
        yakuRank.slice(0, 3).forEach((value, idx) => {
          if (value[0] == name) {
            rankIdx = idx;
          }
        });
        return (
          <g
            key={idx}
            transform={`translate(${contentX}, ${
              contentY + idx * (dataWidth + 3) + 30
            })`}
          >
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
                  style={{ userSelect: "none" }}
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
});

const HorizontalAxis = ({ tiles, scale, strokeColor }) => {
  const [selectedTile, setSelectedTile] = useRecoilState(selectedTileState);

  return (
    <g>
      <line
        x1={0}
        y1={contentY}
        x2={contentWidth - legendWidth}
        y2={contentY}
        stroke={strokeColor}
      />
      {tiles.map((tile, idx) => {
        return (
          <g key={idx} transform={`translate(${contentX + scale(idx)}, 4)`}>
            <image
              style={{ cursor: "pointer" }}
              href={changeHaiName2Path(tile)}
              width={dataWidth}
              height={dataHeight}
              onClick={() => setSelectedTile(tile)}
            />
            {selectedTile === tile && (
              <rect
                fill="none"
                stroke="red"
                strokeWidth="4px"
                width={dataWidth}
                height={dataHeight}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};

const Contents = ({ data, xScale, colorScale }) => {
  const viewData = transpose(Object.values(data).map((i) => Object.values(i)));

  return (
    <g transform={`translate(${contentX}, ${contentY + 5})`}>
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
                y={i * (dataWidth + 3)}
                width={dataWidth}
                height={dataWidth}
                fill={colorScale(item)}
              />
            </Tooltip>
          );
        });
      })}
    </g>
  );
};

const RankLegends = memo(({ colorList = [] }) => {
  return (
    <g
      transform={`translate(${contentWidth - legendWidth + 10}, ${
        contentHeight - 20
      })`}
    >
      {colorList.reverse().map((item, idx) => {
        return (
          <g key={idx} transform={`translate(${0}, ${-(idx * 40)})`}>
            <text fontSize="30" dominantBaseline="middle">
              {3 - idx}位
            </text>
            <circle cx={100} cy={-2} r="10" fill={item} />
          </g>
        );
      })}
      <text y={-120} fontSize="30">
        役の点数
      </text>
    </g>
  );
});

const GradationLegends = memo(({ colorScale }) => {
  return (
    <g transform={`translate(${contentWidth - legendWidth + 10}, ${0})`}>
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
      <g transform={`translate(60, 0)`}>
        <text y={30} fontSize="30" textAnchor="start">
          100
        </text>
        <text y={350} fontSize="30" textAnchor="start">
          0
        </text>
        <text y={650} fontSize="30" textAnchor="start">
          -100
        </text>
      </g>
      <g transform={`rotate(90) translate(10 , -50)`}>
        <rect width={650} height="50" fill="url('#gradient')" />
      </g>
    </g>
  );
});

// 転置
const transpose = (a) => {
  return a[0].map((_, c) => a.map((r) => r[c]));
};
