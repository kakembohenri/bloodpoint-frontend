import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { AccountProfile } from "../../components/account/account-profile";
import { DashboardLayout } from "../../components/dashboard-layout";
import LabTabs from "../../components/profile/tabs";
import axios from "axios";

const Page = ({ requestData, donationData }) => {
  return (
    <>
      <Head>
        <title>Blood Request Status</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            Blood Request Status
          </Typography>
          <Grid container spacing={3}>
            <Grid item lg={4} md={6} xs={12}>
              <AccountProfile donor={donorData} />
            </Grid>
          </Grid>
          <LabTabs donor={donorData} donations={donationData} />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

export async function getServerSideProps(context) {
  // console.log(context);

  const requestID = context.params.id;
  // console.log(donroID)
  // Fetch the data for the specific donor based on their donorID
  const resRequest = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brequest/${requestID}`);
  const requestData = resRequest.data;
  // console.log(donorData)

  // Fetch the donations for the specific donor based on their donorID
  // const resDonations = await axios.get(`http://127.0.0.1:8000/api/donation/${donroID}`);
  // const donationData = resDonations.data;
  // console.log(donationData);

  return {
    props: {
      donorData,
      donationData,
    },
  };
}
