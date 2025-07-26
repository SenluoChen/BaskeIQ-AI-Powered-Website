// CalendarNewsPanel.tsx
import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const CalendarNewsPanel = () => {
  const [open, setOpen] = useState(false);

  const newsItems = [
    { title: "Breaking News: Match Postponed", date: "2025-06-24" },
    { title: "New Coaching AI Released", date: "2025-06-23" },
    { title: "Championship Schedule Updated", date: "2025-06-22" },
    // 你可以從 API 或 props 傳資料進來
  ];

  return (
    <>
      {/* 日曆按鈕（放在左側邊欄中） */}
      <IconButton onClick={() => setOpen(true)}>
        <CalendarTodayIcon />
      </IconButton>

      {/* 右側彈出的抽屜 */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div style={{ width: 300, padding: 16 }}>
          <Typography variant="h6" gutterBottom>
            📰 Latest News
          </Typography>
          <Divider />
          <List>
            {newsItems.map((item, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemText
                  primary={item.title}
                  secondary={item.date}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default CalendarNewsPanel;
