import { Dialog, DialogTitle, Stack, Typography } from "@mui/material";

export const DisplayInfo = (props) => {
  const { onClose, open } = props;
  const data = [1, 2, 3];

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>結果</DialogTitle>
      <Stack sx={{ p: 1 }}>
        {data.map((i, idx) => {
          return <Typography key={idx}>{i}</Typography>;
        })}
      </Stack>
    </Dialog>
  );
};
