import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
// import { AccountProfile } from '../components/account/account-profile';
import { CommunicationDetails } from "../components/communication/communication-details";
import { DashboardLayout } from "../components/dashboard-layout";
import ugData from "../__mocks__/ugData.json";

const Page = () => (
  <>
    <Head>
      <title>Communication Form</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid spacing={3}>
          <Grid item lg={8} md={6} xs={12}>
            <CommunicationDetails ugData={ugData}/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
