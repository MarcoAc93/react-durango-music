import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const DialogTitleStyled = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

type Props = {
  open?: boolean;
  handleClose?: () => void;
  title?: string;
  description?: string
  error?: {
    title: string;
    description: string;
  }
}

const Modal = ({ open = false, handleClose, title, description, error }: Props) => (
  <BootstrapDialog
    onClose={handleClose}
    aria-labelledby="customized-dialog-title"
    open={open}
  >
    <DialogTitleStyled sx={{ m: 0, p: 2 }} id="customized-dialog-title">
      {error ? <ErrorIcon /> : <CheckCircleIcon />}{title}
    </DialogTitleStyled>
    <IconButton
      aria-label="close"
      onClick={handleClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 12,
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <CloseIcon />
    </IconButton>
    <DialogContent dividers>
      <Typography gutterBottom>
        {description}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={handleClose} variant='outlined' color='primary'>
        Ok
      </Button>
    </DialogActions>
  </BootstrapDialog>
);

export default Modal;
