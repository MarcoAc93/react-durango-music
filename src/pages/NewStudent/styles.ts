import { Paper, styled } from "@mui/material";

export const ContainerPage = styled('div')({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  marginBottom: 16
});

export const HeaderWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export const ChipContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  marginTop: 8,
  marginBottom: 8,
  gap: 8
});

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: 8,
  background: theme.palette.error.light,
  color: 'white'
}));
