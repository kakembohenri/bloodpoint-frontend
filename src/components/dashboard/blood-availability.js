import { Bar } from "react-chartjs-2";
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export const BloodAvailabilityBB = (props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        backgroundColor: "#FF0000", // Red for O+
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [18, 5, 19, 27, 29, 19, 20],
        label: "O+",
        maxBarThickness: 10,
      },
      {
        backgroundColor: "#8B0000", // Dark Red for O-
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [11, 20, 12, 29, 30, 25, 13],
        label: "O-",
        maxBarThickness: 10,
      },
      {
        backgroundColor: "#FF4500", // Orange Red for A+
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [23, 29, 30, 13, 11, 20, 12],
        label: "A+",
        maxBarThickness: 10,
      },
      {
        backgroundColor: "#B22222", // Firebrick for A-
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [30, 13, 11, 20, 12, 23, 29],
        label: "A-",
        maxBarThickness: 10,
      },
      {
        backgroundColor: "#DC143C", // Crimson for B+
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [18, 5, 19, 27, 29, 19, 20],
        label: "B+",
        maxBarThickness: 10,
      },
      {
        backgroundColor: "#CD5C5C", // Indian Red for B-
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [31, 13, 11, 20, 12, 23, 29],
        label: "B-",
        maxBarThickness: 10,
      },
      {
        backgroundColor: "#FA8072", // Salmon for AB+
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [15, 20, 12, 29, 30, 25, 13],
        label: "AB+",
        maxBarThickness: 10,
      },
      {
        backgroundColor: "#E9967A", // Dark Salmon for AB-
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [25, 13, 11, 20, 12, 23, 29],
        label: "AB-",
        maxBarThickness: 10,
      },
    ],
    labels: [
      "Fort Portal Blood Bank",
      "AB Portal Blood Bank",
      "Nakasero Blood Bank",
      "Gulu Regional Blood Bank",
      "Konza Blood Bank",
      "Malimbi Blood Bank",
      "Mahi Mahiu Blood Bank",
    ],
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: true },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0,
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider,
        },
      },
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  return (
    <Card sx={{ height: "100%" }} {...props}>
      <CardHeader title="Blood Availability by Blood Bank" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: "relative",
          }}
        >
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};
