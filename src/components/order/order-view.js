// External imports
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/router";
// MUI imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import { ArrowBack } from "@mui/icons-material";

// TODO: Fix the dimensions of the pdf to cater for very long documents

const OrderView = ({ order }) => {
  const table_data = JSON.parse(order.table_data);

  // !PDF Generation
  const handleDownload = () => {
    // get a reference to the card element
    const cardElement = document.getElementById("card");

    // generate a canvas element from the card element with custom dimensions and scale factor
    html2canvas(cardElement, {
      width: cardElement.scrollWidth,
      height: cardElement.scrollHeight,
      scale: 1.2,
    }).then((canvas) => {
      // create a new jsPDF instance with landscape orientation
      const pdf = new jsPDF("landscape");

      // add the canvas image to the PDF with custom position and size
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        10,
        10,
        280,
        (280 * canvas.height) / canvas.width
      );

      // download the PDF with a custom file name
      const fileName = `${order.bank}-${order.request_date}.pdf`;
      pdf.save(fileName);
    });
  };

  // !Status Color Change
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "rgb(255 202 39)";
      case "Processing":
        return "rgb(8 225 193)";
      case "Cancelled":
        return "rgb(255, 0, 0)";
      case "Completed":
        return "rgb(0, 128, 0)";
      default:
        return "black";
    }
  };

  // !Date Formatting
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Box>
      <Link
        href="/fetchOrders"
        sx={{ display: "flex", alignItems: "center", mt: 2, mb: 1, textDecoration: "none" }}
      >
        <ArrowBack />
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Orders
        </Typography>
      </Link>

      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h5">
          <strong>Order ID:</strong> {order.id}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <Button
            onClick={handleDownload}
            startIcon={<GetAppIcon />}
            sx={{
              backgroundColor: "rgb(2 123 255)",
              border: "1px solid rgb(2 123 255)",
              borderRadius: "25px",
              color: "white",
              "&:hover": { backgroundColor: "rgb(2 100 255)", color: "white" },
            }}
          >
            Download
          </Button>
        </Box>
      </Grid>

      <Divider sx={{ mb: 5, mt: 2 }} />

      <Card id="card" sx={{ boxShadow: "0px 4px 4px rgba(0,0,0,.25)" }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Box>
              <img src="/static/images/bpLogo.png" alt="logo" width={50} height={50} />
              <Typography variant="body2">
                <strong>www.bloodpoint.com</strong>
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: getStatusColor(order.status) }}
              >
                {order.status}
              </Typography>
              <Typography variant="body2">Order ID: {order.id}</Typography>
            </Box>
          </Grid>

          <Typography variant="body2" sx={{ fontWeight: "bold", mt: 3 }}>
            Location Information:
          </Typography>
          <Grid container justifyContent="space-between">
            <Grid item xs={4}>
              <Typography variant="body2">Order required at: {order.district}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">Blood Bank: {order.bank}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2">Ordering Hospital: {order.hospital}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="body2" sx={{ fontWeight: "bold", mt: 3 }}>
            Dates:
          </Typography>
          <Grid container justifyContent="space-between">
            <Grid item xs={4}>
              <Typography variant="body2">Order Date: {order.request_date}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">Latest Status Update:</Typography>
                <Typography variant="body2">{formatDate(order.updated_at)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2">Order Number:{order.id}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="body2" sx={{ fontWeight: "bold", mt: 3 }}>
            Client Details:
          </Typography>
          <Grid container justifyContent="space-between">
            <Box>
              <Typography variant="body2">Ordered By:{order.ordered_by}</Typography>
              <Typography variant="body2">Order Type:{order.order_type}</Typography>
            </Box>
          </Grid>

          <Table sx={{ mt: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>Blood Product</TableCell>
                <TableCell align="center">Blood Type</TableCell>
                <TableCell align="right">Quantity/Units</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {table_data.map((row) =>
                // Only display rows with non-zero values
                Object.entries(row).map(([key, value]) => {
                  if (key !== "product" && value !== 0) {
                    return (
                      <TableRow key={key}>
                        <TableCell>{row.product}</TableCell>
                        <TableCell align="center">{key}</TableCell>
                        <TableCell align="right">{value}</TableCell>
                      </TableRow>
                    );
                  }
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderView;
