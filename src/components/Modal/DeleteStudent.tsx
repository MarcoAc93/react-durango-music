import { useRef } from 'react';
import { Dialog, DialogTitle, IconButton, DialogContent, Typography, DialogActions, Button, FormControl, TextField, TextFieldProps } from '@mui/material';
import { Warning, Close } from '@mui/icons-material';

type Props = {
  isOpen?: boolean;
  onClose: () => void;
  onOkBtn: (input: string) => void;
}

const DeleteStudent = ({ onClose, onOkBtn, isOpen = false }: Props) => {
  const inputRef = useRef<TextFieldProps>();

  const handleOkBtn = () => {
    onOkBtn(inputRef?.current?.value as string)
  }

  return (
    <Dialog open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color='warning' /> Desactivar Alumno
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 12,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>
          Al hacer click en "OK" desactivaras al alumno fulano
        </Typography>
        <FormControl fullWidth>
          <TextField
            inputRef={inputRef}
            placeholder='Razon por la que desactivas al alumno?'
            type='text'
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant='contained' color='info' onClick={onClose}>
          Cancelar
        </Button>
        <Button autoFocus variant='contained' color='secondary' onClick={handleOkBtn}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteStudent;
