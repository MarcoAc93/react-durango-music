import { styled } from '@mui/system';
import { Link, useLocation } from 'react-router-dom';
import { ListItem, ListItemButton, ListItemIcon, List } from '@mui/material';
import StudentsIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const drawerWidth = 150;

const MenuArray = [
  {
    text: 'Alumnos',
    Component: <StudentsIcon fontSize='large' color='primary' />,
    url: '/dashboard'
  },
  {
    text: 'Asistencias',
    Component: <GroupsIcon fontSize='large' color='primary' />,
    url: '/dashboard/asistencias'
  },
  {
    text: 'Pagos',
    Component: <AttachMoneyIcon fontSize='large' color='primary' />,
    url: '/dashboard/pagos'
  }
]

const DrawerContainer = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ open, theme }) => ({
  position: 'fixed',
  top: 0,
  left: open ? 0 : `-${drawerWidth}px`,
  width: drawerWidth,
  height: '100%',
  backgroundColor: '#fff',
  boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
  transition: 'left 0.3s ease',
  zIndex: 1000,
  [theme.breakpoints.up('md')]: {
    left: open ? 0 : `-${drawerWidth * 2}px`,
    width: drawerWidth * 2,
  }
}));

const DrawerContent = styled('div')({
  marginTop: 60
});

const StyledLink = styled(Link)((({ theme }) => ({
  textDecoration: 'none',
  marginLeft: -15,
  fontSize: 18,
  [theme.breakpoints.up('md')]: {
    fontSize: 24,
  }
})));

const CustomDrawer = ({ open }: { open?: boolean }) => {
  const location = useLocation();

  return (
    <DrawerContainer open={open}>
      <DrawerContent>
        <nav>
          <List>
            {MenuArray.map(element => (
              <ListItem disablePadding key={element.text}>
                <ListItemButton selected={element.url === location.pathname}>
                  <ListItemIcon>
                    {element.Component}
                  </ListItemIcon>
                  <StyledLink to={element.url}>{element.text}</StyledLink>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </nav>
      </DrawerContent>
    </DrawerContainer>
  );
};

export default CustomDrawer;