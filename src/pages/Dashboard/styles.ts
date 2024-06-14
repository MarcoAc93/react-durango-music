import { styled } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Link } from 'react-router-dom';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  drawerWidth?: number;
}

export const Main = styled('main', { shouldForwardProp: (prop) => (prop !== 'open' && prop !== 'drawerWidth') })<{
  open?: boolean;
  drawerWidth?: number;
}>(({ theme, open, drawerWidth }) => ({
  flex: 1,
  height: '100%',
  width: '100%',
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export const LinkItem = styled(Link)({
  textDecoration: 'none',
  color: 'black',
});

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth',
})<AppBarProps>(({ theme, open, drawerWidth }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
