import { MouseEvent, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {
  Close,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import CycloneIcon from '@mui/icons-material/Cyclone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Outlet, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../components/authentication/account';
import { AppDispatch } from '../store/store';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import {
  Avatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  CSSObject,
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
import {
  setUser,
} from '../store/slices/userSlice';
import {
  useGetUserMutation,
} from '../store/api/UserApi';
import { logoutAll } from '../store/actions';
import { signOut } from 'aws-amplify/auth';
import { NotificationItem } from '../types/Notification.type';

const drawerWidth = 275;

const MobileMain = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  paddingTop: '56px',
  paddingBottom: '56px', // Pour laisser la place à la barre
  backgroundColor: Colors.background,
  position: 'relative',
  zIndex: 1, // 👈 Assure-toi qu'il est bien derrière la bottom bar
}));

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const ComputerDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function Root() {
  const user = useSelector(userSelector)
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {

      
      id: 1,
      title: "Mise à jour",
      description: "Nouvelle mise à jour disponible. Cliquez pour voir les détails.",
      route: "/update",
      read: false
    },
    {
      id: 3,
      title: "Message Admin",
      description: "Vous avez reçu un nouveau message de l'administrateur.",
      route: "/messages",
      read: false
    }
    // ... ajouter d'autres notifications si besoin
  ]);

  const handleProfileMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
  };

  // Action lors du clic sur une notification (navigation vers une page)
  const handleNotificationClick = (notification: NotificationItem) => {
    navigate(notification.route);
    handleNotificationsClose();
  };

  // Suppression d'une notification sans déclencher l'action de navigation
  const handleDeleteNotification = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Marquer toutes les notifications comme lues
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const handleLogout = async () => {
    userHasAuthenticated(false);
    dispatch(logoutAll());
    await signOut();
  };
  /*
  const subscription = user.subscription?.find(
    (item) => item.subscription_type === 'subscription'
  );
  */

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userHasAuthenticated, setIsLoading, setIsError, isError, isLoading } =
    useAppContext();

  const [getUser] = useGetUserMutation();

  const navigationItems = [
    {
      id: 'appointment',
      label: isMobile ? t('page.root.shortAppointmentLabel') as string : t('page.root.appointmentLabel') as string,
      icon: <CalendarMonthIcon sx={{ color: 'black' }} />,
      function: () => {
        navigate('/root/medicalAppointment');
      },
      disable: false
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userResponse = await getUser().unwrap();
        dispatch(setUser(userResponse));
      } catch (error: any) {
        console.error('🔴 getUser failed:', error);

        // 如果是未授權，跳轉回首頁或登入頁
        if (error?.status === 401 || error?.data?.message === 'Unauthorized') {
          userHasAuthenticated(false);
          navigate('/');
        } else {
          setIsError(true); // 其他錯誤顯示錯誤畫面
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, getUser, navigate, setIsError, setIsLoading, userHasAuthenticated]);

  const drawer = (
    
    <div>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton disabled={item.disable} onClick={item.function}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
  
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          {
            !isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                  {
                    marginRight: 5,
                  },
                  open && { display: 'none' },
                ]}
              >            
                <MenuIcon />
              </IconButton>
            )
          }

          {/* Logo et Titre */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/root/dashboard')}>
            <img src={'/assets/logo/logo.png'} height={40} width={40} alt="logo" />
            <Typography variant="h5" sx={{ pl: 1 }} noWrap component="div">
            Badminton
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Bouton Notifications */}
          <IconButton color="inherit" onClick={handleNotificationsOpen}>
            <Badge badgeContent={notifications.filter(item => !item.read).length} color="error"> {/* Affiche 4 notifications non lues */}
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationsClose}
            sx={{ mt: 1 }}
          >
            <Box sx={{ maxWidth: 350, maxHeight: 300, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150, p: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                  Pas de notifications
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
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteNotification(e, notification.id)}
                        sx={{ ml: 1 }}
                      >
                        <Close fontSize="small" sx={{height: 15, width: 15}} />
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
                Marquer tout comme lu
                </MenuItem>
              </Box>
            )}
          </Menu>

          {/* Avatar + Menu Profil */}
          <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 2 }}>
            <Avatar alt={user?.userProfile?.firstName} src="/assets/avatar.jpg" />
          </IconButton>
          <Menu sx={{p: 5}} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                navigate('/root/profile');
                handleMenuClose();
              }}
            >
              <PersonIcon sx={{ mr: 1 }} />
  Profil
            </MenuItem>

            <MenuItem disabled>
              <CycloneIcon sx={{ mr: 1 }} /> Abonnement
            </MenuItem>
            <MenuItem onClick={() => { navigate('/root/settings'); handleMenuClose(); }}>
              <SettingsIcon sx={{ mr: 1 }} /> Paramètres
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {
        isMobile ? (
          null
        ) : (
          <ComputerDrawer
            variant={"permanent"}
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                { isMobile ? theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon /> : theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {drawer}
            </List>
          </ComputerDrawer>
        )
      }
      

      
      {
        isMobile ?  (
          <>
            <MobileMain sx={{ flexGrow: 1, paddingBottom: '56px', width: '100%', minHeight: '100vh' }}>
              <HandleLoadingError isError={isError} isLoading={isLoading}>
                <Outlet />
              </HandleLoadingError>
            </MobileMain>
            {navigationItems.filter(item => item.disable === false).length > 0 && <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
                // Appelle la fonction correspondante
                navigationItems[newValue]?.function();
              }}
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: theme.zIndex.drawer + 100, // encore plus sûr
                borderTop: '1px solid #ccc',
                backgroundColor: Colors.white,
              }}
            >
              {navigationItems.filter(item => item.disable === false).map((item, index) => (
                <BottomNavigationAction
                  sx={{
                    '& .MuiBottomNavigationAction-label': {
                      fontSize: item.id === 'appointment' ? '13px' : '14px', // tu peux adapter la taille ici
                    }
                  }}
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  disabled={item.disable}
                  value={index}
                />
              ))}
            </BottomNavigation>}
          </>
        ) : (
          <Box component="main" sx={{ backgroundColor: Colors.background, minHeight: '100vh', width: '100%'}}>
            <DrawerHeader />
            <HandleLoadingError isError={isError} isLoading={isLoading}>
              <Outlet />
            </HandleLoadingError>
          </Box>
        )
      }
    </Box>
  );
}
