import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  from: 'me' | 'other';
  text: string;
  timestamp: string;
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([
    { from: 'other', text: 'Salut ! Tu viens jouer ce soir ? 😄', timestamp: '18:23' },
    { from: 'me', text: 'Oui bien sûr ! À quelle heure ?', timestamp: '18:24' },
    { from: 'other', text: 'Vers 20h.', timestamp: '18:25' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      { from: 'me', text: newMessage.trim(), timestamp: formattedTime }
    ]);
    setNewMessage('');
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" p={1}>
      <Typography variant="h6" mb={1}>
        💬 Discussion avec {id || 'invité'}
      </Typography>

      <Paper sx={{ flex: 1, p: 2, overflowY: 'auto', mb: 1 }}>
        <List>
          {messages.map((msg, idx) => (
            <ListItem
              key={idx}
              sx={{
                justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              <Box
                sx={{
                  backgroundColor: msg.from === 'me' ? '#d1e7dd' : '#e2e3e5',
                  borderRadius: 2,
                  p: 1.2,
                  maxWidth: '70%',
                }}
              >
                <ListItemText
                  primary={msg.text}
                  secondary={msg.timestamp}
                  sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                />
              </Box>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Divider />

      <Box display="flex" mt={1}>
        <TextField
          fullWidth
          placeholder="Écrire un message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          size="small"
        />
        <IconButton onClick={handleSend} color="primary" sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
