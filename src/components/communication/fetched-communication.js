// External imports
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Papa from "papaparse";
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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TableSortLabel from "@mui/material/TableSortLabel";
import GetAppIcon from "@mui/icons-material/GetApp";
import RefreshIcon from "@mui/icons-material/Refresh";
import MessageIcon from "@mui/icons-material/Message";
import DeleteIcon from "@mui/icons-material/Delete";
// Local module imports
import { Search as SearchIcon } from "../../icons/search";

// Table columns
const columns = [
  { id: "title", label: "Message\u00a0Title", minWidth: 120 },
  { id: "recipient_group", label: "Recipient\u00a0Filter", minWidth: 120 },
  { id: "blood_group", label: "Blood\u00a0Group", minWidth: 120 },
  { id: "district", label: "Location", minWidth: 120 },
  { id: "recipient_count", label: "Recipient\u00a0Count", minWidth: 120 },
  { id: "blood_bank", label: "Blood\u00a0Bank", minWidth: 170 },
  { id: "address", label: "Address", minWidth: 170 },
];

export default function Communications({ communication }) {
  const router = useRouter();

  // State and hooks
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState(communication);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // !Pagination Functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // !Donor Actions Functions
  // Function for adding new message
  const handleAdd = (add) => {
    add.preventDefault();
    router.push("/communication");
  };

  // Function for handling view action
  const hanldeView = (id) => {
    router.push(`/message/${id}`);
  };

  // !Search Function
  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const validBloodTypes = ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"];
    setFilteredRows(
      communication.filter((row) =>
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
      setFilteredRows(communication);
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
    link.setAttribute("download", "Messages.csv");
    link.click();
  };

  return (
    <div sx={{ paddingTop: 20 }}>
      <Grid container justifyContent="space-between">
        <Typography variant="h3" id="tableTitle" component="div">
          Messages
        </Typography>
        <form onSubmit={handleAdd}>
          <Button
            sx={{
              backgroundColor: "red",
              padding: "11px 16px",
            }}
            startIcon={<MessageIcon />}
            variant="contained"
            type="submit"
          >
            Add New Message
          </Button>
        </form>
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
                  placeholder="Search for message"
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
                        let value = row[column.id];
                        if (column.id === "blood_group" || column.id === "district") {
                          value = JSON.parse(value);
                          if (value.length === 0) {
                            value =
                              column.id === "blood_group"
                                ? "No Blood Group Attached"
                                : "No Location Attached";
                          } else {
                            value = value.join(", ");
                          }
                        } else if (column.id === "recipient_group") {
                          value = JSON.parse(value);
                          value = value
                            .map((group) => (group === "by location" ? "Location" : "Blood Group"))
                            .join(", ");
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell style={{ minWidth: 150 }} align="center">
                        <IconButton
                          onClick={() => hanldeView(row.donorID)}
                          size="small"
                          sx={{ "&:hover": { color: "rgb(0, 128, 0)" } }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(row.donorID)}
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
    </div>
  );
}
