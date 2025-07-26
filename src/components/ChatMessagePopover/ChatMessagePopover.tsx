// src/components/ChatMessagePopover.tsx
import React, { useState } from 'react';
import {
  IconButton,
  Popover,
  Box,
  Typography,
  Badge,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const mockMessages = [
  { id: 1, sender: 'Coach', content: 'Great job last match!' },
  { id: 2, sender: 'Teammate', content: 'Let’s meet at 6pm for training.' },
  { id: 3, sender: 'System', content: 'New analysis available now.' },
];

export default function ChatMessagePopover() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'chat-popover' : undefined;

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={3} color="primary">
          <ChatBubbleOutlineIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="subtitle1" gutterBottom>
            📨 Messages
          </Typography>
          <List dense>
            {mockMessages.map((msg) => (
              <ListItem key={msg.id} alignItems="flex-start">
                <ListItemText
                  primary={msg.sender}
                  secondary={msg.content}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
}