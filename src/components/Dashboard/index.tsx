import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, Outlet } from 'react-router-dom';
import { CircularProgress, useMediaQuery, useTheme} from '@mui/material';
import { DashboardContainer, Header, MainContent, MenuButton, Title} from './styles';

import { AUTHORIZATION } from "../../queries";
import CustomDrawer from "./Drawer";


const Dashboard = () => {
  const token = localStorage.getItem('token');
  const navigation = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggleDrawer = () => {
    setDrawerOpen(prevState => !prevState);
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
      <CustomDrawer open={drawerOpen || isDesktop} />
      <MainContent open={drawerOpen || isDesktop}>
        <Outlet />
      </MainContent>
    </DashboardContainer>
  );
}

export default Dashboard;
