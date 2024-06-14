import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { PageContainerCentered } from '../Loader';

const Container = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: 16,
  backgroundColor: '#f8d7da',
  color: '#721c24',
  border: '1px solid #f5c6cb',
  borderRadius: 15,
  marginBottom: 2,
});

type Props = {
  title?: string;
  description?: string;
};

const Error = ({ description, title }: Props) => {
  return (
    <PageContainerCentered>
      <Container>
        <WarningIcon sx={{ fontSize: 40, marginRight: 2 }} />
        <Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2">
            {description}
          </Typography>
        </Box>
      </Container>
    </PageContainerCentered>
  );
};

export default Error;
