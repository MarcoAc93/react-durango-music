import { Typography, styled } from "@mui/material";

export default styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(30),
  fontWeight: 700,
  margin: 0
}));
