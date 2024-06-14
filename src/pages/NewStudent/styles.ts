import { styled } from "@mui/material";

export const ContainerPage = styled('div')({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  marginBottom: 16
});

export const InputWrapperColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  }
}));

export const InputWrapperRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16
});

export const ButtonGroupContainer = styled('div')({
  marginTop: 16
});

export const ButtonContainer = styled('div')({
  display: 'flex',
  gap: 16
});

