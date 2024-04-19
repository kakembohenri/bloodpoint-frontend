import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';
// import { AccountProfile } from '../components/account/account-profile';
import { RequestDetails } from '../components/request/request-details';
import { DashboardLayout } from '../components/dashboard-layout';
import data from "../__mocks__/orderData.json";

const Page = () => (
  <>
    <Head>
      <title>
        Blood Request Form
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid
        //   container
          spacing={3}
        >
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <RequestDetails data={ data }/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
