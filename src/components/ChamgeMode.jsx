import { memo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Typography from "@mui/material/Typography";
import { haiModeState, suteHaiListState, dimensionState } from "../atoms/atoms";
import { DIMENSIONS } from "../const/dimensions";

export const ChangeMode = memo(() => {
  const [haiMode, setHaiMode] = useRecoilState(haiModeState);
  const suteHaiList = useRecoilValue(suteHaiListState);
  const setDimension = useSetRecoilState(dimensionState);

  const handleChange = (num) => {
    setHaiMode(num);
    setDimension(DIMENSIONS[num]);
  };

  return (
    <>
      <Typography variant="h6" component="div">
        現在のモード：
      </Typography>
      <FormControl variant="outlined">
        <NativeSelect
          value={haiMode}
          disabled={suteHaiList.length > 0}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value={0}>すべての牌</option>
          <option value={1}>混一色</option>
          <option value={2}>清一色</option>
          <option value={3}>タンヤオ</option>
          <option value={4}>国士</option>
          <option value={5}>すべての牌(アンカー配置最適)</option>
        </NativeSelect>
      </FormControl>
    </>
  );
});
