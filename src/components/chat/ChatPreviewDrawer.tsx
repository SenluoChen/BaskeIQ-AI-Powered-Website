import { useMemo, useState, useRef, useEffect } from 'react';
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
  TextField,
  Button,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface ChatMessage {
  id: number;
  sender: string;                // 對話預覽列表的發件者
  content: string;
  unread: boolean;
  avatarUrl?: string;
  fromMe?: boolean;              // 在聊天室中是否是我送出的
  timestamp?: string | number;
}

type Props = {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];       // 父層提供的訊息（例如最近訊息）
  onSendMessage?: (to: string, text: string) => void; // 可選：回傳給父層
};

export default function ChatPreviewDrawer({
  open,
  onClose,
  messages,
  onSendMessage,
}: Props) {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [localMsgs, setLocalMsgs] = useState<ChatMessage[]>([]); 
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 關閉抽屜時重置
  useEffect(() => {
    if (!open) {
      setActiveUser(null);
      setDraft('');
    }
  }, [open]);

  // 取得聊天室頭像
  const activeAvatar = useMemo(
    () => messages.find(m => m.sender === activeUser)?.avatarUrl,
    [messages, activeUser]
  );

  // 這裡把父層的 messages + 本地暫存的訊息合併後，再過濾出屬於 activeUser 的對話
  const combined = useMemo(() => [...messages, ...localMsgs], [messages, localMsgs]);

  const activeThread = useMemo(
    () =>
      combined.filter(
        m =>
          // 對方發給我的訊息
          m.sender === activeUser ||
          // 我發給 activeUser 的訊息（我們把 sender 也設成 activeUser，方便篩選）
          (m.fromMe && m.sender === activeUser)
      ),
    [combined, activeUser]
  );

  // 捲到最底
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeThread.length, open, activeUser]);

  const handleEnterChat = (user: string) => {
    setActiveUser(user);
    setDraft('');
  };

  const handleBackToList = () => {
    setActiveUser(null);
    setDraft('');
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !activeUser) return;

    // 1) 先本地新增一筆（立即可見）
    const now = new Date();
    const newMsg: ChatMessage = {
      id: now.getTime(),
      sender: activeUser,     // 為了過濾方便，自己送出的也標記對方為 sender
      content: text,
      unread: false,
      fromMe: true,
      timestamp: now.toLocaleTimeString(),
    };
    setLocalMsgs(prev => [...prev, newMsg]);

    // 2) 可選：回呼給父層（讓父層真正儲存）
    onSendMessage?.(activeUser, text);

    // 3) 清空輸入框
    setDraft('');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 360,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#0f1218',
          color: '#fff',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {activeUser ? (
              <>
                <IconButton size="small" onClick={handleBackToList} sx={{ color: '#fff' }}>
                  <ArrowBackIcon />
                </IconButton>
                <Avatar src={activeAvatar} sx={{ width: 28, height: 28 }}>
                  {!activeAvatar && activeUser[0]}
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {activeUser}
                </Typography>
              </>
            ) : (
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                📬 Chat Preview
              </Typography>
            )}
          </Box>

          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        {!activeUser ? (
          // ===== 列表模式 =====
          <Box sx={{ p: 1.5, overflowY: 'auto' }}>
            <List disablePadding>
              {messages.map(msg => (
                <ListItem
                  key={msg.id}
                  alignItems="flex-start"
                  disableGutters
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    px: 1,
                    transition: 'background .2s ease',
                    '&:hover': { background: 'rgba(255,255,255,0.06)' },
                    cursor: 'pointer',
                  }}
                  onClick={() => handleEnterChat(msg.sender)}
                >
                  <ListItemAvatar>
                    <Avatar src={msg.avatarUrl}>{!msg.avatarUrl && msg.sender[0]}</Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography sx={{ fontWeight: 700 }}>{msg.sender}</Typography>
                        {msg.unread && <Badge color="error" variant="dot" overlap="circular" />}
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }} noWrap>
                        {msg.content}
                      </Typography>
                    }
                    primaryTypographyProps={{
                      fontWeight: msg.unread ? ('bold' as const) : 'normal',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          // ===== 聊天模式 =====
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* 訊息串 */}
            <Box
              ref={scrollRef}
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
              }}
            >
              {activeThread.map(m => {
                const mine = !!m.fromMe;
                return (
                  <Box
                    key={m.id}
                    sx={{
                      alignSelf: mine ? 'flex-end' : 'flex-start',
                      maxWidth: '78%',
                      p: 1,
                      px: 1.25,
                      borderRadius: 2,
                      bgcolor: mine ? 'rgba(255, 202, 40, 0.16)' : 'rgba(255,255,255,0.08)',
                      border: mine
                        ? '1px solid rgba(255, 202, 40, 0.35)'
                        : '1px solid rgba(255,255,255,0.08)',
                      color: '#fff',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    }}
                  >
                    <Typography variant="body2">{m.content}</Typography>
                    {m.timestamp && (
                      <Typography
                        variant="caption"
                        sx={{ opacity: 0.6, display: 'block', mt: 0.25 }}
                      >
                        {m.timestamp}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ opacity: 0.1 }} />

            {/* 輸入區（已移除 TextField 內的箭頭/送出圖示） */}
            <Box sx={{ p: 1.5, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${activeUser}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                InputProps={{
                  sx: {
                    bgcolor: 'rgba(255,255,255,0.06)',
                    borderRadius: 2,
                    color: '#fff',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSend}
                sx={{
                  bgcolor: '#ffca28',
                  color: '#000',
                  '&:hover': { bgcolor: '#ffc93c' },
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Send
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
