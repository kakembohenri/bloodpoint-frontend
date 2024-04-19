import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import Campaigns from "../components/campaign/fetch-campaigns";
import { DashboardLayout } from "../components/dashboard-layout";
import axios from "axios";

const Page = ({ campaigns }) => {
    return (
        <>
            <Head>
                <title>Communication Table</title>
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
                            <Campaigns campaign = { campaigns }/>
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
            communications
        }
    };
}
