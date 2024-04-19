import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServicesOutlined";

export const PendingRequests = (props) => (
  <Card sx={{ height: "85%" }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            PENDING REQUESTS
          </Typography>
          <Typography color="textPrimary" variant="h4">
            5
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "primary.main",
              height: 56,
              width: 56,
            }}
          >
            <MedicalServicesIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
