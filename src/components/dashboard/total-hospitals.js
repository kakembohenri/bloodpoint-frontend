import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import InsertChartIcon from "@mui/icons-material/InsertChartOutlined";

export const TotalHospitals = (props) => (
  <Card sx={{ height: "85%" }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            TOTAL HOSPITALS
          </Typography>
          <Typography color="textPrimary" variant="h4">
            20
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "warning.main",
              height: 56,
              width: 56,
            }}
          >
            <InsertChartIcon />
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
