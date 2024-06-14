import { CircularProgress, styled, CircularProgressProps } from "@mui/material";

export const PageContainerCentered = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

const PageLoader = (props?: CircularProgressProps) => (
  <PageContainerCentered>
    <CircularProgress {...props} />
  </PageContainerCentered>
);

export default PageLoader;
