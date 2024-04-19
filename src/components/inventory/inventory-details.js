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
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TableSortLabel from "@mui/material/TableSortLabel";
import GetAppIcon from "@mui/icons-material/GetApp";
import RefreshIcon from "@mui/icons-material/Refresh";
import InventoryIcon from "@mui/icons-material/Inventory";
import DeleteIcon from "@mui/icons-material/Delete";
// Local module imports
import { Search as SearchIcon } from "../../icons/search";

// Table columns
const columns = [
  { id: "bloodUnitID", label: "Blood\u00a0Unit\u00a0ID", minWidth: 100, align: "center" },
  { id: "donorID", label: "Donor\u00a0ID", minWidth: 100 },
  { id: "fullName", label: "Name\u00a0of\u00a0Donor", minWidth: 170 },
  { id: "bloodType", label: "Blood\u00a0Type", minWidth: 100, align: "center" },
  { id: "donation_date", label: "Date\u00a0of\u00a0Donation", minWidth: 100 },
  // { id: "time", label: "Time\u00a0of\u00a0Donation", minWidth: 100 },
  { id: "email", label: "Donor\u00a0email", minWidth: 120 },
  { id: "phone", label: "Phone Number", minWidth: 100 },
];

export default function Inventory({ inventory }) {
  const router = useRouter();

  // State and hooks
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState(inventory);
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
  // Function for handling view action
  const hanldeView = (bloodUnitID) => {
    router.push(`/donors/${bloodUnitID}`);
  };

  // !Search Function
  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const validBloodTypes = ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"];
    setFilteredRows(
      inventory.filter((row) =>
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
      setFilteredRows(inventory);
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
    link.setAttribute("download", "Inventory.csv");
    link.click();
  };

  return (
    <div sx={{ paddingTop: 20 }}>
      <Grid container justifyContent="space-between">
        <Typography variant="h3" id="tableTitle" component="div">
          Blood Inventory
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
                  placeholder="Search for blood"
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
