// External imports
import Head from "next/head";
import axios from "axios";
// MUI imports
import { Box, Container, Grid } from "@mui/material";
// Local imports
import Communications from "../components/communication/fetched-communication";
import { DashboardLayout } from "../components/dashboard-layout";

const Page = ({ communications }) => {
  return (
    <>
      <Head>
        <title>Communication Table</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth="xl">
          <Grid spacing={3}>
            <Grid item lg={8} md={6} xs={12}>
              <Communications communication={communications} />
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
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/communication`);
  const communications = response.data;

  return {
    props: {
      communications,
    },
  };
}
