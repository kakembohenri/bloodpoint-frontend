import { Bar } from "react-chartjs-2";
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export const TopHospitalsPerformingTransfusions = (props) => {
  const theme = useTheme();
  const data = {
    datasets: [
      {
        data: [18, 20, 30, 20, 29], // dummy data
        backgroundColor: "#FC7915",
        label: "Transfusions",
      },
    ],
    labels: [
      "Mulango National Referral Hospital",
      "Uganda Blood Tranfusion Service",
      "Mbale Regional Hospital",
      "Gulu Regional Hospital",
      "Jinja Regional Refferal Hospital",
    ],
  };
  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: { fontColor: theme.palette.text.secondary },
          gridLines: { display: false, drawBorder: false },
        },
      ],
      yAxes: [
        {
          ticks: { fontColor: theme.palette.text.secondary, beginAtZero: true, min: 0 },
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
    },
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
    <Card {...props}>
      <CardHeader title="Top Hospitals Performing Transfusions" />
      <Divider />
      <CardContent>
        <Box sx={{ height: 400, position: "relative" }}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};
