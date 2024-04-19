import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { AvailableUnits } from "../components/dashboard/available-units";
import { RecentRequests } from "../components/dashboard/recent-requests";
import { BloodAvailabilityBB } from "../components/dashboard/blood-availability";
import { TotalDonors } from "../components/dashboard/total-donors";
import { PendingRequests } from "../components/dashboard/pending-requests";
import { DashboardLayout } from "../components/dashboard-layout";
import { TotalHospitals } from "../components/dashboard/total-hospitals";
import { BloodStock } from "../components/dashboard/blood-stock";
import { HospitalOrderTrends } from "../components/dashboard/hospital-orders";
import { TopHospitalsPerformingTransfusions } from "../components/dashboard/hospital-tranfusion";

const Page = () => (
  <>
    <Head>
      <title>BloodPoint | Dashboard</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          {/* Row 1 */}
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AvailableUnits />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalDonors />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalHospitals />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <PendingRequests />
          </Grid>

          {/* Row 2 */}
          <Grid item lg={7} md={12} xs={12}>
            <BloodAvailabilityBB />
          </Grid>
          <Grid item lg={5} md={12} xs={12}>
            <BloodStock />
          </Grid>

          {/* Row 3 */}
          <Grid item lg={7} md={12} xs={12}>
            <HospitalOrderTrends />
          </Grid>
          <Grid item lg={5} md={12} xs={12}>
            <TopHospitalsPerformingTransfusions />
          </Grid>

          {/* Row 4 */}
          <Grid item lg={12} md={9} xs={12}>
            <RecentRequests />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
