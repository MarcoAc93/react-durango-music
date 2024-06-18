import { styled } from "@mui/material";

export const ContainerPage = styled('form')({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  marginBottom: 16
});

export const HeaderWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center'
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
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
});

export const ButtonGroupContainer = styled('div')({
  marginTop: 16
});

export const ButtonContainer = styled('div')({
  display: 'flex',
  gap: 16
});

export const InputWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 4
});

export const ChipContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  marginTop: 8,
  gap: 8
});
