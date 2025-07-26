import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Badge,
  Box,
  Typography,
  Avatar,
  ListItemAvatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  unread: boolean;
  avatarUrl?: string; // ✅ 可選頭像連結
}

export default function ChatPreviewDrawer({
  open,
  onClose,
  messages,
}: {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
}) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">📬 Chat Preview</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {messages.map((msg) => (
            <ListItem key={msg.id} button alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={msg.avatarUrl}>
                  {!msg.avatarUrl && msg.sender[0]}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    {msg.sender}
                    {msg.unread && (
                      <Badge
                        color="error"
                        variant="dot"
                        overlap="circular"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                }
                secondary={msg.content}
                primaryTypographyProps={{ fontWeight: msg.unread ? 'bold' : 'normal' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
