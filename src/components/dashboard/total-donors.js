import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";

export const TotalDonors = (props) => (
  <Card sx={{ height: "85%" }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            TOTAL DONORS
          </Typography>
          <Typography color="textPrimary" variant="h4">
            1,600
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <PeopleIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          pt: 2,
        }}
      ></Box>
    </CardContent>
  </Card>
);
