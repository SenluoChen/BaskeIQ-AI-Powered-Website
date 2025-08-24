import { MouseEvent, useEffect, useState, useCallback  } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Close,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import CycloneIcon from '@mui/icons-material/Cyclone';
import { Outlet, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { useAppContext } from '../components/authentication/account';
import { AppDispatch } from '../store/store';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  Avatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import HandleLoadingError from '../components/handle-loading-error/HandleLoadingError';
import { Colors } from '../styles/Colors';
import { userSelector } from '../store/selectors/userSelector';
import { setUser } from '../store/slices/userSlice';
import { useGetUserMutation } from '../store/api/UserApi';
import { logoutAll } from '../store/actions';
import { signOut } from 'aws-amplify/auth';
import { NotificationItem } from '../types/Notification.type';
import ChatIcon from '@mui/icons-material/Chat';
import ChatPreviewDrawer from '../components/chat/ChatPreviewDrawer';
import UserSetupModal from '../components/modal/UserSetupModal';
import { setMatched } from '../store/slices/matchSlice';
import { useLazyGetMatchesQuery } from '../store/api/MatchApi';
import LeftSportsDrawer from '../components/LeftSportsDrawer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import Footer from '../components/footer'
import { Portal } from '@mui/material';




const drawerWidth = 320;



/* ---------------- Mobile main ---------------- */
const MobileMain = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  paddingTop: '56px',
  paddingBottom: '56px',
  backgroundColor: Colors.background,
  position: 'relative',
  zIndex: 1,
}));

/* ---------------- Drawer header spacer ---------------- */
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

/* ---------------- App bar ---------------- */
interface CustomAppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<CustomAppBarProps>(({ theme }) => ({
  background: 'linear-gradient(145deg, #0B0F19 0%, #111827 100%)',
  borderBottom: '1px solid rgba(255,255,255,0.08)', // 底部分隔線
  color: '#fff',
  boxShadow: '0 4px 20px rgba(0,0,0,0.6)', // 比較有科技感的陰影

  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

/* ---------------- Chat type ---------------- */
interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  unread: boolean;
  avatarUrl?: string;
}

export default function Root() {
  const user = useSelector(userSelector);
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showUserSetupModal, setShowUserSetupModal] = useState(false);
  const [chatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'The GOAT', content: 'Ball out tonight?', unread: true, avatarUrl: '/lebron.avif' },
    { id: 2, sender: 'Wemby', content: 'Let’s catch up tomorrow.', unread: false, avatarUrl: '/Victor-Wembanyama-Portrait.webp' },
    { id: 3, sender: 'Steph', content: 'Gonna hit 20 threes on you', unread: false, avatarUrl: '/i.png' },
  ]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, title: 'Update', description: 'New update available. Click to view details.', route: '/update', read: false },
    { id: 3, title: 'Admin Message', description: "You have received a new message from the administrator.", route: '/messages', read: false },
  ]);


  const handleProfileMenuOpen = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationsOpen = (event: MouseEvent<HTMLButtonElement>) => setNotificationAnchorEl(event.currentTarget);
  const handleNotificationsClose = () => setNotificationAnchorEl(null);

  const handleNotificationClick = (notification: NotificationItem) => {
    navigate(notification.route);
    handleNotificationsClose();
  };

  const handleDeleteNotification = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userHasAuthenticated, setIsLoading, setIsError, isError, isLoading } = useAppContext();
  const [getUser] = useGetUserMutation();
  const [getMatches] = useLazyGetMatchesQuery();
  const [leftOpen, setLeftOpen] = useState(false);
  const [isChatPreviewOpen, setIsChatPreviewOpen] = useState(false);
  const toggleChatPreview = useCallback(() => {
    setIsChatPreviewOpen(prev => !prev);
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userResponse, matchesResponse] = await Promise.all([getUser().unwrap(), getMatches().unwrap()]);
        if (userResponse === null) {
          setShowUserSetupModal(true);
        } else {
          dispatch(setUser(userResponse));
        }
        if (matchesResponse?.matches) {
          dispatch(setMatched(matchesResponse.matches));
        }
      } catch (error: any) {
        if (error?.status === 401 || error?.data?.message === 'Unauthorized') {
          userHasAuthenticated(false);
          navigate('/');
        } else {
          setIsError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, getMatches, getUser, navigate, setIsError, setIsLoading, userHasAuthenticated]);

  const navigationItems: any[] = [];

  const handleLogout = async () => {
    userHasAuthenticated(false);
    dispatch(logoutAll());
    await signOut();
  };

  const upcomingMatches = [
    { date: '6/15', day: 'Tuesday', place: 'Villejuif Court', interest: 8 },
    { date: '6/18', day: 'Friday', place: 'Ivry Gymnasium', interest: 5 },
    { date: '6/20', day: 'Sunday', place: 'Sports Palace', interest: 12 },
    { date: '6/22', day: 'Wednesday', place: 'Paris 13th District', interest: 7 },
  ];


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={!isMobile && leftOpen}>

        <Toolbar>
          {/* Logo + Title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: 0.5,
              ml: -2, 
              py: 0.8,
              borderRadius: 2,
              paddingBottom: '2px',
              transition: 'all 0.25s ease',
              overflow: 'hidden', // 關鍵：防止放大後溢出影響 AppBar
              height: 40, // 固定容器高度
              '&:hover img': {
                transform: 'scale(1.1)', // 放大圖片
              },
            }}
            onClick={() => navigate('/root/dashboard')}
          >
            <Box
              component="img"
              src="/BasketIQ logo.png"
              alt="BasketIQ Logo"
              sx={{
                height: '550%',
                objectFit: 'contain',
                display: 'block',
                transition: 'transform 0.3s ease',
                transformOrigin: 'center',
              }}
            />
          </Box> 


          <Box sx={{ flexGrow: 1 }} />

          {/* Chat */}
          <ChatPreviewDrawer
            open={isChatPreviewOpen}
            onClose={toggleChatPreview}
            messages={chatMessages}
          />

          <IconButton color="inherit" onClick={toggleChatPreview}>
            <Badge badgeContent={2} color="error">
              <ChatIcon />
            </Badge>
          </IconButton>

          {/* Notifications */}
          <IconButton color="inherit" onClick={handleNotificationsOpen}>
            <Badge badgeContent={notifications.filter((i) => !i.read).length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          
          <Menu anchorEl={notificationAnchorEl} open={Boolean(notificationAnchorEl)} onClose={handleNotificationsClose} sx={{ mt: 1 }}>
            <Box sx={{ maxWidth: 350, maxHeight: 300, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150, p: 3 }}>
                  <Typography variant="body1" color="textSecondary">
          No notifications
                  </Typography>
                </Box>
              ) : (
                <MenuList>
                  {notifications.map((notification) => (
                    <MenuItem key={notification.id} onClick={() => handleNotificationClick(notification)} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                          {notification.title}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                          {notification.description}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={(e) => handleDeleteNotification(e, notification.id)} sx={{ ml: 1 }}>
                        <Close fontSize="small" sx={{ height: 15, width: 15 }} />
                      </IconButton>
                    </MenuItem>
                  ))}
                </MenuList>
              )}
            </Box>
            {notifications.length > 0 && (
              <Box>
                <Divider />
                <MenuItem onClick={handleMarkAllAsRead} sx={{ justifyContent: 'center', fontWeight: 'bold' }}>
        Mark all as read
                </MenuItem>
              </Box>
            )}
          </Menu>

          {/* Profile */}
          <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 2 }}>
            <Avatar alt={user?.userProfile?.username} src={user.userProfile?.imageUrl} />
          </IconButton>
          <Menu sx={{ p: 5 }} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                navigate('/root/profile');
                handleMenuClose();
              }}
            >
              <PersonIcon sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem disabled>
              <CycloneIcon sx={{ mr: 1 }} /> Subscription
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate('/root/settings');
                handleMenuClose();
              }}
            >
              <SettingsIcon sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Log out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <LeftSportsDrawer
          open={leftOpen}
          onClose={() => setLeftOpen(false)}
          width={drawerWidth}        // ← 一致
          onJoin={(id) => {/* optional 導頁或 API */}}
        />
      )}

      {/* ---------- Main content ---------- */}
      {isMobile ? (
        <>
          <MobileMain
            sx={{
              flexGrow: 1,
              paddingBottom: '56px', // 預留 BottomNavigation 高度
              width: '100%',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: Colors.background, // 手機版背景也要深色
            }}
          >
            <HandleLoadingError isError={isError} isLoading={isLoading}>
              <Outlet />
            </HandleLoadingError>

            {/* Footer for mobile */}
            <Footer />
          </MobileMain>

          {navigationItems.filter((item) => item.disable === false).length > 0 && (
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
                navigationItems[newValue]?.function();
              }}
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: theme.zIndex.drawer + 100,
                borderTop: '1px solid #ccc',
                backgroundColor: Colors.white,
              }}
            >
              {navigationItems
                .filter((item) => item.disable === false)
                .map((item, index) => (
                  <BottomNavigationAction
                    sx={{
                      '& .MuiBottomNavigationAction-label': {
                        fontSize:
                    item.id === 'appointment' ? '13px' : '14px',
                      },
                    }}
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    disabled={item.disable}
                    value={index}
                  />
                ))}
            </BottomNavigation>
          )}
        </>
      ) : (
        
        <Box
          component="main"
          sx={{
            background: '#0B0F19',
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            
          }}
        >
          <DrawerHeader />
          <Box sx={{ flex: 1 }}>
            <HandleLoadingError isError={isError} isLoading={isLoading}>
              <Outlet />
            </HandleLoadingError>
          </Box>

          {/* Footer for desktop */}
          <Footer />
        </Box>
      )}

      {/* ⬇️ 把浮動籃球按鈕放到 body（永遠在最上層） */}
      <Portal>
        {!isMobile && (
          <IconButton
            aria-label="toggle sports drawer"
            onClick={() => setLeftOpen(v => !v)}
            sx={{
              position: 'fixed',
              left: 20,
              bottom: 20,
              zIndex: (t) => t.zIndex.tooltip + 1, // 1501，壓過 Drawer/Backdrop
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, rgba(217,217,217,0.06), rgba(0,0,0,0.22))',
              boxShadow: '0 10px 24px rgba(0,0,0,.38)',
              transition: 'transform .18s ease, box-shadow .18s ease, background .18s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 14px 32px rgba(0,0,0,.45)',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(0,0,0,0.28))',
              },
              '&:active': {
                transform: 'scale(0.96)',
                boxShadow: '0 6px 16px rgba(0,0,0,.42)',
              },
            }}
          >
            <SportsBasketballIcon sx={{ color: '#ffca28', fontSize: 42, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
          </IconButton>
        )}
      </Portal>
    </Box> 
  );
}
