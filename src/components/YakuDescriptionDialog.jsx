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
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Box sx={{ display: "flex" }}>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            役説明
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        id="alert-dialog-description"
        sx={{ background: "whitesmoke" }}
      >
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
  const { name, description, han, kuiHan, menzen } = YAKU_DESCRIPTION[item];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            {name}
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
