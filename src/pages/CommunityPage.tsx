import React, { useState } from 'react';
import {
  Box, Typography, Avatar, Card, CardContent, CardMedia,
  IconButton, TextField, Button
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const RADIUS = '20px';

const mockPosts = [
  {
    id: 1,
    user: { name: 'Jordan23', avatar: 'https://i.pravatar.cc/150?img=1' },
    image: '/JIMMY.jpg',
    caption: 'Great game last night with the crew! 🏀🔥',
    likes: 128,
    comments: [
      { id: 1, name: 'baller_ben', text: 'So clean!' },
      { id: 2, name: 'courtqueen', text: 'Where is this court?' },
    ],
  },
  {
    id: 2,
    user: { name: 'HoopsLover', avatar: 'https://i.pravatar.cc/150?img=3' },
    image: '/635730022975359757-DSC-6352.webp',
    caption: 'Sunset games hit different.',
    likes: 95,
    comments: [],
  },
];

export default function BasketballCommunityPage() {
  // 將貼文放進狀態（才能即時更新）
  const [posts, setPosts] = useState(mockPosts);
  // 每張貼文的輸入草稿（用 id 當 key）
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  const handleChange = (postId: number, v: string) =>
    setDrafts((d) => ({ ...d, [postId]: v }));

  const submitComment = (postId: number) => {
    const text = (drafts[postId] || '').trim();
    if (!text) return;

    const newComment = {
      id: Date.now(),      // 簡易唯一 id
      name: 'You',         // 這裡可以換成你實際登入使用者名稱
      text,
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    setDrafts((d) => ({ ...d, [postId]: '' })); // 清空輸入框
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#0B0F19' }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          mb: 4,
          background: 'linear-gradient(90deg, #FFCA28, #ffca28, #ff8f00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 0.5,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          textShadow: '0 0 12px rgba(255,165,0,0.35)',
        }}
      >
        👥 Basketball Community
      </Typography>

      {posts.map((post) => (
        <Card
          key={post.id}
          sx={{
            mb: 4,
            borderRadius: RADIUS,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #0B0F19 0%, #0F1623 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,.45)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            transition:
              'transform .25s ease, box-shadow .25s ease, border-color .25s ease, filter .25s ease',
            willChange: 'transform, box-shadow, filter',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 1,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))',
              opacity: 0.6,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: -2,
              borderRadius: 14,
              pointerEvents: 'none',
              background:
                'radial-gradient(1000px 260px at 0% -20%, rgba(0,220,255,0.12), transparent 60%), radial-gradient(1000px 260px at 100% 120%, rgba(160,100,255,0.10), transparent 60%)',
              filter: 'blur(10px)',
              opacity: 0,
              transition: 'opacity .25s ease',
            },
            '&:hover': {
              transform: 'translateY(-2px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.06),
                0 24px 72px rgba(0,0,0,.6),
                0 0 24px rgba(0, 220, 255, .16),
                0 0 48px rgba(160, 100, 255, .12)
              `,
              filter: 'saturate(1.05)',
              '&::after': { opacity: 1 },
            },
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" p={2}>
            <Avatar src={post.user.avatar} alt={post.user.name} sx={{ mr: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#E6EDF3' }}>
              {post.user.name}
            </Typography>
            <Box flexGrow={1} />
            <IconButton sx={{ color: '#9AA4B2' }}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Media */}
          <CardMedia
            component="img"
            height="420"
            image={post.image}
            alt="Basketball post"
            sx={{
              objectFit: 'cover',
              objectPosition: post.id === 2 ? 'center 30%' : 'center',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          />

          <CardContent sx={{ pt: 2.5 }}>
            {/* Actions */}
            <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
              <IconButton disableRipple sx={{ p: 1, color: '#E6EDF3', '&:hover': { color: '#ffca28' } }}>
                <FavoriteBorderIcon sx={{ fontSize: 24 }} />
              </IconButton>
              <IconButton disableRipple sx={{ p: 1, color: '#E6EDF3', '&:hover': { color: '#00dcff' } }}>
                <ChatBubbleOutlineIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>

            {/* Caption */}
            <Typography variant="body1" sx={{ mb: 1.5, color: '#D1D9E0' }}>
              <strong style={{ color: '#E6EDF3' }}>{post.user.name}</strong> {post.caption}
            </Typography>

            {/* Comments */}
            {post.comments.map((c) => (
              <Typography variant="body2" key={c.id} sx={{ mb: 0.75, color: '#9AA4B2' }}>
                <strong style={{ color: '#C7D0D9' }}>{c.name}</strong> {c.text}
              </Typography>
            ))}

            {/* Divider glow */}
            <Box
              sx={{
                mt: 1.75,
                mb: 1.75,
                height: 1,
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
              }}
            />

            {/* Comment input */}
            <Box display="flex" gap={1}>
              <TextField
                size="small"
                fullWidth
                placeholder="Add a comment..."
                value={drafts[post.id] ?? ''}
                onChange={(e) => handleChange(post.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitComment(post.id);
                  }
                }}
                sx={{
                  input: { color: '#E6EDF3' },
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.24)' },
                    '&.Mui-focused fieldset': { borderColor: '#00dcff' },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={() => submitComment(post.id)}
                disabled={!((drafts[post.id] ?? '').trim())}
                sx={{
                  px: 2.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(0, 220, 255, 0.18)',
                  background: 'linear-gradient(90deg, #00dcff, #a064ff)',
                  '&:hover': { boxShadow: '0 10px 32px rgba(0, 220, 255, 0.28)' },
                }}
              >
                Post
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
