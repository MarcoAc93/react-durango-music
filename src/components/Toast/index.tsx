import { Alert, Snackbar, AlertColor } from '@mui/material'
import React from 'react'

type Props = {
  open?: boolean;
  onClose?: () => void;
  message?: string;
  type?: AlertColor
}

const Toast = ({ message, onClose, open, type }: Props) => {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert onClose={onClose} severity={type} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Toast