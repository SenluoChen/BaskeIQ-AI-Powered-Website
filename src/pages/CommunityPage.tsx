import { Box, Typography, Avatar, Card, CardContent, CardMedia, IconButton, TextField, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
const mockPosts = [
  {
    id: 1,
    user: {
      name: 'Jordan23',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    image: '/JIMMY.jpg',
    caption: 'Great game last night with the crew! 🏀🔥',
    likes: 128,
    comments: [
      { id: 1, name: 'baller_ben', text: 'So clean!' },
      { id: 2, name: 'courtqueen', text: 'Where is this court?' }
    ]
  },
  {
    id: 2,
    user: {
      name: 'HoopsLover',
      avatar: 'https://i.pravatar.cc/150?img=3'
      
    },
    image: '/635730022975359757-DSC-6352.webp',
    caption: 'Sunset games hit different.',
    
    likes: 95,
    comments: []
    
  }
];

export default function BasketballCommunityPage() {
  return (
    <Box sx={{ p: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        👥 Basketball Community
      </Typography>

      {mockPosts.map((post) => (
        <Card
          key={post.id}
          sx={{
            mb: 4,
            borderRadius: 3, // 12px 等於 Apple-style
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Box display="flex" alignItems="center" p={2}>
            <Avatar src={post.user.avatar} alt={post.user.name} sx={{ mr: 2 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              {post.user.name}
            </Typography>
            <Box flexGrow={1} />
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>

          <CardMedia
            component="img"
            height="400"
            image={post.image}
            alt="Basketball post"
            sx={{
              objectFit: 'cover',
              objectPosition: post.id === 2 ? 'center 30%' : 'center'  // 👈 只針對 id 為 2 的圖片調整
            }}
          />

          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <IconButton disableRipple sx={{ p: 1 }}>
                <FavoriteBorderIcon sx={{ fontSize: 24 }} />
              </IconButton>
              <IconButton disableRipple sx={{ p: 1 }}>
                <ChatBubbleOutlineIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>{post.user.name}</strong> {post.caption}
            </Typography>

            {post.comments.map((comment) => (
              <Typography variant="body2" key={comment.id} sx={{ mb: 0.5 }}>
                <strong>{comment.name}</strong> {comment.text}
              </Typography>
            ))}

            <Box mt={2} display="flex" gap={1}>
              <TextField size="small" fullWidth placeholder="Add a comment..." />
              <Button variant="contained">Post</Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
