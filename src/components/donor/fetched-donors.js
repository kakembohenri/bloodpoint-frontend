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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TableSortLabel from "@mui/material/TableSortLabel";
import GetAppIcon from "@mui/icons-material/GetApp";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
// Local module imports
import { Search as SearchIcon } from "../../icons/search";

// Table columns
const columns = [
  { id: "donorID", label: "Donor\u00a0ID", minWidth: 70 },
  { id: "fullName", label: "Full\u00a0Name", minWidth: 170 },
  { id: "dob", label: "Date\u00a0of\u00a0Birth", minWidth: 100 },
  // { id: "lastDonation", label: "Last\u00a0Donation", minWidth: 100 },
  { id: "gender", label: "Gender", minWidth: 100 },
  { id: "bloodType", label: "Blood\u00a0Type", minWidth: 100 },
  { id: "district", label: "District", minWidth: 100 },
  // { id: "subcounty", label: "Sub\u00a0County", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "phone", label: "Phone", minWidth: 100 },
  // { id: "address", label: "Address", minWidth: 120 },
];

export default function Donors({ donor }) {
  const router = useRouter();

  // State and hooks
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState(donor);
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
  // Function for adding new donor
  const handleAdd = (add) => {
    add.preventDefault();
    router.push("/donors");
  };

  // Function for handling view action
  const hanldeView = (donorID) => {
    router.push(`/donors/${donorID}`);
  };

  // Function for handling edit action
  const handleEdit = (donorID) => {
    router.push(`/donors/${donorID}/edit`);
  };

  // Function for handling delete action
  const handleDelete = (donorID) => {
    console.log(donorID);
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donor/${donorID}`)
      .then((response) => {
        console.log(response);
        router.push("/donors");
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
      donor.filter((row) =>
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
      setFilteredRows(donor);
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
    link.setAttribute("download", "Donors.csv");
    link.click();
  };

  return (
    <div sx={{ paddingTop: 20 }}>
      <Grid container justifyContent="space-between">
        <Typography variant="h3" id="tableTitle" component="div">
          Donors
        </Typography>
        <form onSubmit={handleAdd}>
          <Button
            sx={{
              backgroundColor: "red",
              padding: "11px 16px",
            }}
            startIcon={<PersonAddIcon />}
            variant="contained"
            type="submit"
          >
            Add New Donor
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
                  placeholder="Search for donor"
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
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell style={{ minWidth: 150 }} align="center">
                        <IconButton
                          onClick={() => handleEdit(row.donorID)}
                          size="small"
                          sx={{ "&:hover": { color: "rgb(0, 0, 255)" } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
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
