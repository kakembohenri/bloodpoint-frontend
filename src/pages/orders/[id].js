// External imports
import Head from "next/head";
import axios from "axios";
// MUI imports
import { Box, Container, Grid, Typography } from "@mui/material";
// Local imports
import { DashboardLayout } from "../../components/dashboard-layout";
import OrderView from "../../components/order/order-view";

const Page = ({ orders }) => {
  return (
    <>
      <Head>
        <title>Order Details</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          {/* <Typography sx={{ mb: 3 }} variant="h4">
            Order Details
          </Typography> */}
          <OrderView order={orders} />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

export async function getServerSideProps(context) {
  // console.log(context);
  const id = context.params.id;
  // console.log(id);
  // Fetch the data for the specific order based on the id
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brequest/${id}`);
  const orders = response.data;
  // console.log(orders);

  return {
    props: {
      orders,
    },
  };
}
