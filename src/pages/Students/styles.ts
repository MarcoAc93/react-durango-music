import { FormControlLabel, styled } from "@mui/material";

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 24
});

export const Title = styled('h2')(({ theme }) => ({
  fontSize: theme.typography.pxToRem(30),
  fontWeight: 700,
  margin: 0
}));

export const ControlContainer = styled('div')({
  display: 'flex',
  gap: 8
});

export const Label = styled(FormControlLabel)(({
  marginLeft: 0,
  '.MuiButtonBase-root': {
    paddingLeft: 0,
    paddingRight: 20
  }
}));
