import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, Outlet } from 'react-router-dom';
import { CircularProgress, styled, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Toolbar, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StudentsIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import CoursesIcon from '@mui/icons-material/GridView';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { AppBar, LinkItem, Main } from './styles';

import { AUTHORIZATION } from "../../queries";

const drawerWidth = 150;
const MenuArray = [
  {
    text: 'Alumnos',
    Component: <StudentsIcon />,
    url: ''
  },
  {
    text: 'Grupos',
    Component: <GroupsIcon />,
    url: '/dashboard/grupos'
  },
  {
    text: 'Cursos',
    Component: <CoursesIcon />,
    url: '/dashboard/cursos'
  },
  {
    text: 'Pagos',
    Component: <AttachMoneyIcon />,
    url: '/dashboard/pagos'
  }
]

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigation = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const newDrawerWidth = isDesktop ? drawerWidth * 2 : drawerWidth;

  const handleDrawerOpen = () => setOpen(true);

  const handleDrawerClose = () => setOpen(false);

  const { loading } = useQuery(AUTHORIZATION, {
    variables: { token },
    onCompleted(data) {
      if (!data.authorization?.id) navigation('/login')
    },
    onError() {
      navigation('/login')
    },
  });

  if (loading) return <CircularProgress  />

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open || isDesktop} drawerWidth={newDrawerWidth}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...((open || isDesktop) && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" noWrap component="div">
            Durango Music
          </Typography>
        </Toolbar>
      </AppBar>
        <Drawer
          sx={{
            width: newDrawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: newDrawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open || isDesktop}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <List>
            {MenuArray.map((element) => (
              <ListItem key={element.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: 45 }}>
                    {element.Component}
                  </ListItemIcon>
                  <LinkItem to={element.url}>
                    <ListItemText primary={element.text} />
                  </LinkItem>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Main open={open || isDesktop} drawerWidth={newDrawerWidth}>
          <Outlet />
        </Main>
    </Box>
  );
}

export default Dashboard;
