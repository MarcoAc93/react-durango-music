import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, Outlet } from 'react-router-dom';
import { CircularProgress, styled, useMediaQuery, useTheme, Typography } from '@mui/material';

import { AUTHORIZATION } from "../../queries";
import CustomDrawer from "./Drawer";

const drawerWidth = 150;

const DashboardContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
});

const Header = styled('header', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
  drawerWidth?: number;
}>(({ open }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#1976d2',
  color: 'white',
  paddingLeft: open ? drawerWidth + 10 : 16,
  transition: 'padding-left 0.3s ease',
  height: '64px',
  boxSizing: 'border-box',
}));

const MenuButton = styled('button')({
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '24px',
  cursor: 'pointer',
});

const MainContent = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ open }) => ({
  flexGrow: 1,
  padding: 16,
  marginTop: 16,
  marginLeft: open ? `${drawerWidth}px` : '0',
  transition: 'margin-left 0.3s ease',
  boxSizing: 'border-box',
}));

const Title = styled(Typography)({
  fontSize: 24,
  fontWeight: 500
})

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const navigation = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggleDrawer = () => {
    setDrawerOpen(prevState => !prevState);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

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
    <DashboardContainer>
      <Header open={drawerOpen || isDesktop}>
        <MenuButton onClick={handleToggleDrawer}>☰</MenuButton>
        <Title noWrap variant="h1">Durango Music</Title>
      </Header>
      <CustomDrawer open={drawerOpen || isDesktop} onClose={handleDrawerClose} />
      <MainContent open={drawerOpen || isDesktop}>
        <Outlet />
      </MainContent>
    </DashboardContainer>
  );
}

export default Dashboard;
