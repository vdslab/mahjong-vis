import { memo } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";

export const YakuDescriptionDialog = memo((props) => {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            役説明
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ background: "whitesmoke" }}>
        <List>
          {Object.keys(YAKU_DESCRIPTION).map((name) => {
            return (
              <ListItem key={name}>
                <Contents item={name} />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
});

const Contents = ({ item }) => {
  const {
    name,
    description,
    han,
    kuiHan,
    menzen,
    ruby = "",
  } = YAKU_DESCRIPTION[item];

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            <ruby>
              {name}
              <rt style={{ fontSize: "10px" }}>{ruby}</rt>
            </ruby>{" "}
          </Typography>
          <Typography variant="h6" component="div" sx={{ pr: 2 }}>
            {`${han}翻`}
          </Typography>
          <Typography variant="h6" component="div">
            {menzen
              ? "面前のみ"
              : han === kuiHan
              ? "喰い下がりなし"
              : `喰い下がり${kuiHan}翻`}
          </Typography>
        </Box>
        <Typography gutterBottom variant="body1" color="text.secondary">
          {description}
        </Typography>
        <CardMedia
          component="img"
          image={`/images/hai_ex/${item}.png`}
          alt={`${name}の手牌例`}
        />
      </CardContent>
    </Card>
  );
};
