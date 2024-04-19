// External library imports
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Papa from "papaparse";
import axios from "axios";
// MUI imports
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TableSortLabel from "@mui/material/TableSortLabel";
import GetAppIcon from "@mui/icons-material/GetApp";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
// Local module imports
import { Search as SearchIcon } from "../../icons/search";

export default function Orders({ order }) {
  const router = useRouter();

  // State and hooks
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState(order);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // !Pagination Functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // !Order Actions Functions
  // Function for handling view action
  const hanldeView = (id) => {
    router.push(`/orders/${id}`);
  };

  // Function for handling edit action
  const handleEdit = (id) => {
    router.push(`/orders/edit/${id}`);
  };

  // Function for handling delete action
  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brequest/${id}`)
      .then((response) => {
        console.log(response);
        router.push("/order");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // !Search Function
  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const validBloodTypes = ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"];
    setFilteredRows(
      order.filter((row) =>
        columns.some((column) => {
          const cellValue = row[column.id].toString().toLowerCase();
          if (column.id === "gender" && (searchValue === "male" || searchValue === "female")) {
            return cellValue === searchValue;
          } else if (column.id === "bloodType" && validBloodTypes.includes(searchValue)) {
            return cellValue === searchValue;
          } else {
            return cellValue.includes(searchValue);
          }
        })
      )
    );
    setPage(0);
  };

  // !Sorting Functions
  // The useEffect is run whenever the sortColumn or sortDirection changes to ensure filtered rows are updated after state change
  useEffect(() => {
    if (sortColumn === null || sortDirection === null) {
      setFilteredRows(order);
    } else {
      const direction = sortDirection === "asc" ? 1 : -1;
      setFilteredRows(
        filteredRows.slice().sort((a, b) => {
          if (a[sortColumn] < b[sortColumn]) return -1 * direction;
          if (a[sortColumn] > b[sortColumn]) return 1 * direction;
          return 0;
        })
      );
    }
  }, [sortColumn, sortDirection]);

  // Function for sorting columns
  const handleSortClick = (column) => {
    if (column === sortColumn) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    setPage(0);
  };

  // !Export Function
  const exportTable = () => {
    const csvData = [
      columns.map((column) => column.label.replace(/\u00A0/g, " ")),
      ...filteredRows.map((row) => columns.map((column) => row[column.id])),
    ];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Orders.csv");
    link.click();
  };

  // !Status Change Functions
  const handleStatusChange = (event, row) => {
    // Set selected order and open dialog
    setSelectedOrder(row);
    setDialogOpen(true);
    setLoading(false); // Set loading state to true
  };

  const handleDialogClose = () => {
    // Close dialog and reset selected order
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleConfirmStatusChange = (event) => {
    // Get selected order data
    const order = selectedOrder;

    // Set loading state
    setLoading(true);

    // Send API request to update order status in database
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brequest/update/${order.id}`, {
        status: order.status,
      })
      .then((response) => {
        // Handle success
        console.log(response.data);

        // Refetch all data
        axios
          .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brequest`)
          .then((response) => {
            // Update table data with new data from server
            setFilteredRows(response.data);
            // Reset loading state
            setLoading(false);
          })
          .catch((error) => {
            // Handle error
            console.log(error);
            // Reset loading state
            setLoading(false);
          });
      })
      .catch((error) => {
        // Handle error
        console.log(error);
        // Reset loading state
        setLoading(false);
      });

    // Close dialog and reset selected order
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusSelectChange = (event, row) => {
    // Update selected order status
    const updatedOrder = {
      ...row,
      status: event.target.value,
    };
    setSelectedOrder(updatedOrder);

    // Open dialog
    setDialogOpen(true);
  };

  // Table columns
  const columns = [
    { id: "id", label: "Order\u00a0ID", minWidth: 100 },
    { id: "hospital", label: "Hospital\u00a0Name", minWidth: 100 },
    { id: "request_date", label: "Order\u00a0Date", minWidth: 100 },
    {
      id: "status",
      label: "Status",
      minWidth: 80,
      format: (value, row) => (
        <Select
          value={value}
          onChange={(event) => handleStatusSelectChange(event, row)}
          sx={{ fontSize: 14, height: 40 }}
        >
          <MenuItem value="Pending">
            <Box sx={{ display: "flex", alignItems: "center", width: 100 }}>
              <AccessTimeIcon sx={{ color: "rgb(255 202 39)", fontSize: 14, mr: 1 }} />
              Pending
            </Box>
          </MenuItem>
          <MenuItem value="Processing">
            <Box sx={{ display: "flex", alignItems: "center", width: 100 }}>
              <HourglassEmptyIcon sx={{ color: "rgb(8 225 193)", fontSize: 14, mr: 1 }} />
              Processing
            </Box>
          </MenuItem>
          <MenuItem value="Cancelled">
            <Box sx={{ display: "flex", alignItems: "center", width: 100 }}>
              <CancelIcon sx={{ color: "rgb(255, 0, 0)", fontSize: 14, mr: 1 }} />
              Cancelled
            </Box>
          </MenuItem>
          <MenuItem value="Completed">
            <Box sx={{ display: "flex", alignItems: "center", width: 100 }}>
              <CheckCircleIcon sx={{ color: "rgb(0, 128, 0)", fontSize: 14, mr: 1 }} />
              Completed
            </Box>
          </MenuItem>
        </Select>
      ),
    },
  ];

  return (
    <div sx={{ paddingTop: 20 }}>
      <Grid container justifyContent="space-between">
        <Typography variant="h3" id="tableTitle" component="div">
          Hospital Orders
        </Typography>
      </Grid>

      <Box sx={{ mt: 3, paddingBottom: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleSearchChange}
                  placeholder="Search for order"
                  variant="outlined"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            onClick={exportTable}
            startIcon={<GetAppIcon />}
            sx={{
              backgroundColor: "white",
              border: "1px solid grey",
              color: "black",
              "&:hover": { backgroundColor: "rgb(0, 128, 0)", color: "white" },
            }}
          >
            Export
          </Button>
          <Button
            onClick={() => window.location.reload()}
            startIcon={<RefreshIcon />}
            sx={{
              backgroundColor: "white",
              border: "1px solid grey",
              color: "black",
              "&:hover": { backgroundColor: "rgb(2 123 255)", color: "white" },
            }}
          >
            Reload
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <TableSortLabel
                      active={sortColumn === column.id}
                      direction={sortColumn === column.id ? sortDirection : "asc"}
                      onClick={() => handleSortClick(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                      sx={{ height: 40 }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value, row) : value}
                          </TableCell>
                        );
                      })}
                      <TableCell style={{ minWidth: 150 }} align="center">
                        <IconButton
                          onClick={() => handleEdit(row.id)}
                          size="small"
                          sx={{ "&:hover": { color: "rgb(0, 0, 255)" } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => hanldeView(row.id)}
                          size="small"
                          sx={{ "&:hover": { color: "rgb(0, 128, 0)" } }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(row.id)}
                          size="small"
                          sx={{ "&:hover": { color: "rgb(255, 0, 0)" } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Change Order Status</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to change the order status?</DialogContentText>
        </DialogContent>
        <DialogActions>
          {loading ? (
            <HourglassBottomIcon size={24} /> // Display loading animation
          ) : (
            <>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleConfirmStatusChange}>Yes</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
