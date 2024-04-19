// External imports
import Head from "next/head";
import axios from "axios";
// MUI imports
import { Box, Container, Grid } from "@mui/material";
// Local imports
import Transfusions from "../components/transfusion/fetched-transfusions";
import { DashboardLayout } from "../components/dashboard-layout";

const Page = ({ transfusions }) => {
  return (
    <>
      <Head>
        <title>Transfusion Table</title>
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
            spacing={3}
          >
            <Grid item lg={8} md={6} xs={12}>
              <Transfusions transfusion={transfusions} />
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
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transfusion`);
  const transfusions = response.data;

  return {
    props: {
      transfusions,
    },
  };
}
