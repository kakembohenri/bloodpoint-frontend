import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
// import { AccountProfile } from '../components/account/account-profile';
import { DonorRegistrationDetails } from '../components/donor/donor-registration-details';
import { DashboardLayout } from '../components/dashboard-layout';
import ugData from "../__mocks__/ugData.json";

const Page = () => (
  <>
    <Head>
      <title>
        Donor Registration
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
            <DonorRegistrationDetails ugData={ugData} />
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
