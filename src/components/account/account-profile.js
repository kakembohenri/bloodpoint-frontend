import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

const user = {
  timezone: "GTM-7",
};

export const AccountProfile = ({ donor }) => (
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Avatar
          src={user.avatar}
          sx={{
            height: 64,
            mb: 2,
            width: 64,
          }}
        />
        <Typography color="textPrimary" gutterBottom variant="h5">
          {donor.fullName}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {`${donor.email}`}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {donor.donorID}
        </Typography>
      </Box>
    </CardContent>
    <Divider />
  </Card>
);
