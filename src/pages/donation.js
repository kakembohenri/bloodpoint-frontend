import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DonationDetails } from "../components/donation/donation-details";
import { DashboardLayout } from "../components/dashboard-layout";
import ugData from "../__mocks__/ugData.json";

const Page = () => (
  <>
    <Head>
      <title>Donation Form</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid
          //   container
          spacing={3}
        >
          <Grid item lg={8} md={6} xs={12}>
            <DonationDetails ugData={ugData} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
