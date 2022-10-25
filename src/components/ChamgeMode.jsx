import { memo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { haiModeState, suteHaiListState } from "../atoms/atoms";
import { FormControl, NativeSelect, Typography } from "@mui/material";

export const ChangeMode = memo(() => {
  const [haiMode, setHaiMode] = useRecoilState(haiModeState);
  const suteHaiList = useRecoilValue(suteHaiListState);

  return (
    <>
      <Typography variant="h6" component="div">
        現在のモード：
      </Typography>
      <FormControl variant="outlined">
        <NativeSelect
          value={haiMode}
          disabled={suteHaiList.length > 0}
          onChange={(e) => setHaiMode(e.target.value)}
        >
          <option value={0}>すべての牌</option>
          <option value={1}>混一色</option>
          <option value={2}>清一色</option>
          <option value={3}>国士</option>
        </NativeSelect>
      </FormControl>
    </>
  );
});
