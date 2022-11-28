import { memo } from "react";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { WORD_DESCRIPTION } from "../const/WordDescription";

export const WordDescriptionDialog = memo((props) => {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            用語集
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ background: "whitesmoke" }}>
        <List>
          {Object.entries(WORD_DESCRIPTION).map(([key, value]) => {
            return (
              <ListItem key={key}>
                <Card sx={{ width: "100%", p: 2 }}>
                  <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    {key}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {value}
                  </Typography>
                </Card>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
});
