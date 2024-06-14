import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon } from '@mui/material';
import StudentsIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import CoursesIcon from '@mui/icons-material/GridView';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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

const DrawerContainer = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ open }) => ({
  position: 'fixed',
  top: 0,
  left: open ? 0 : `-${drawerWidth}px`,
  width: drawerWidth,
  height: '100%',
  backgroundColor: '#fff',
  boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
  transition: 'left 0.3s ease',
  zIndex: 1000,
}));

const DrawerContent = styled('div')({
  marginTop: 60
});

const ListStyled = styled('ul')({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '0 8px'
});


const CustomDrawer = ({ open, onClose }: { open?: boolean; onClose: () => void }) => {
  return (
    <DrawerContainer open={open}>
      <DrawerContent>
        <nav>
          <ListStyled>
            {MenuArray.map(element => (
              <ListItem disablePadding key={element.text}>
                <ListItemIcon>
                  {element.Component}
                </ListItemIcon>
                <Link to={element.url}>{element.text}</Link>
              </ListItem>
            ))}
          </ListStyled>
        </nav>
      </DrawerContent>
    </DrawerContainer>
  );
};

export default CustomDrawer;