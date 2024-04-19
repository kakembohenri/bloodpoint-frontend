// External library imports
import Head from "next/head";
import axios from "axios";
// MUI imports
import { Box, Container, Grid } from "@mui/material";
// Local module imports
import Donations from "../components/donation/fetched-donations";
import { DashboardLayout } from "../components/dashboard-layout";

const Page = ({ donations }) => {
  return (
    <>
      <Head>
        <title>Donations Table</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid
            //   container
            spacing={3}
          >
            <Grid item lg={8} md={6} xs={12}>
              <Donations donation={donations} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

export async function getServerSideProps() {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donation`);
  const donations = response.data;

  return {
    props: {
      donations,
    },
  };
}
