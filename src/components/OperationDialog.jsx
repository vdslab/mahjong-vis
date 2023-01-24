import { Fragment, memo } from "react";
import Image from "next/image";
import Images from "../../public/images/operationImage/operation1.png";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const OperationDialog = memo((props) => {
  const { open, onClose } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Box sx={{ display: "flex" }}>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            操作説明
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent id="alert-dialog-description">
        <Contents />
      </DialogContent>
    </Dialog>
  );
});

const Contents = () => {
  const text = [
    [
      "1.手牌ビュー",
      "切りたい牌をクリックすると、手牌を切ることができます。",
      "また、牌にマウスをホバーすると、Radvizビュー上の対応した点がハイライトされます。",
      "リセットボタン：手牌をリセットできます。",
      "ツモボタン：役が完成した場合はこのボタンを押すことで和了ることができます。",
    ],
    [
      "2.Radvizビュー",
      "各点にマウスをホバーすると画像のようにその点に対応した手牌の牌が表示されます。",
      "また、円周上にある役名にマウスをホバーすると役の説明を読むことができます。",
    ],
    [
      "3.ヒートマップビュー",
      "ヒートマップのタイルにマウスをホバーすると対応した役に近づく度合いが数値で表示されます。",
      "また、役名ににマウスをホバーすると役の説明を読むことができます。",
      "上部に表示された手牌をクリックすることで、Radvizビュー上の対応した点がハイライトされます。",
    ],
    [
      "手牌分解ビュー",
      "手牌ビューで牌にマウスをホバーすると、その牌を切った場合の最小向聴数における分解の組み合わせを表示しています",
    ],
  ];

  return (
    <Box>
      <Image src={Images} alt="Image" />
      {text.map((tmp) => {
        const title = tmp[0];
        const buf = tmp.slice(1);
        return (
          <Box key={title} sx={{ pb: 1 }}>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
            {buf.map((description, i) => (
              <Typography
                key={`${buf}${i}`}
                gutterBottom
                variant="body1"
                color="text.secondary"
              >
                {description}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};
