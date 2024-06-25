import { Dialog, DialogTitle, IconButton, DialogContent } from '@mui/material';
import { Close, HowToReg } from '@mui/icons-material';

import EnrollmentForm from '../EnrollmentForm';

type Props = {
  isOpen?: boolean;
  studentId: string
  onClose: () => void;
}

const EnrollStudent = ({ onClose, isOpen = false, studentId }: Props) => (
  <Dialog open={isOpen} maxWidth='md' fullWidth>
    <DialogTitle>
      <HowToReg color='primary' /> Inscribir Alumno
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
      <EnrollmentForm
        studentId={studentId}
        onCancelBtn={onClose}
        onSuccessBtn={() => {}}
      />
    </DialogContent>
  </Dialog>
);

export default EnrollStudent;
