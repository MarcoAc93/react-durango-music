import { Typography, styled } from "@mui/material";
const drawerWidth = 150;

export const DashboardContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
});

export const Header = styled('header', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
  drawerWidth?: number;
}>(({ open, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  paddingLeft: open ? drawerWidth + 10 : 16,
  transition: 'padding-left 0.3s ease',
  height: '64px',
  boxSizing: 'border-box',
}));

export const MenuButton = styled('button')({
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '24px',
  cursor: 'pointer',
});

export const MainContent = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ open }) => ({
  flexGrow: 1,
  padding: '0px 16px',
  marginTop: 16,
  marginLeft: open ? `${drawerWidth}px` : '0',
  transition: 'margin-left 0.3s ease',
  boxSizing: 'border-box',
}));

export const Title = styled(Typography)({
  fontSize: 24,
  fontWeight: 500
});
