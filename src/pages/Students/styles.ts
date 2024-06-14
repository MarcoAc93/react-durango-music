import { styled } from "@mui/material";

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 24
});

export const Title = styled('h2')(({ theme }) => ({
  fontSize: theme.typography.pxToRem(34),
  fontWeight: 700,
  margin: 0
}));
