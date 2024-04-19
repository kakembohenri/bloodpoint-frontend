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
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import DeleteIcon from "@mui/icons-material/Delete";
// Local module imports
import { Search as SearchIcon } from "../../icons/search";

const columns = [
  // Donor Information
  { id: "donorID", label: "Donor\u00a0ID", minWidth: 100 },
  { id: "fullName", label: "Full\u00a0Name", minWidth: 170 },
  { id: "age", label: "Age", minWidth: 100 },
  { id: "gender", label: "Gender", minWidth: 100 },
  // Donation Information
  { id: "donation_date", label: "Donation\u00a0Date", minWidth: 100 },
  { id: "bloodType", label: "Blood\u00a0Type", minWidth: 100 },
  { id: "donation_type", label: "Donation\u00a0Type", minWidth: 100 },
  // Donation Location
  { id: "district", label: "District", minWidth: 100 },
  { id: "subcounty", label: "Subcounty", minWidth: 100 },
  { id: "venue", label: "Venue", minWidth: 150 },
  { id: "address", label: "Address", minWidth: 170 },
  // Donor Contact Information
  { id: "email", label: "Email", minWidth: 170 },
  { id: "phone", label: "Phone\u00a0Number", minWidth: 170 },
  // Donation Counselling
  { id: "donation_counselling.sti_12", label: "Suffered\u00a0from STI?", minWidth: 100 },
  { id: "donation_counselling.hiv_positive_15", label: "HIV\u00a0Positive?", minWidth: 100 },
  {
    id: "donation_counselling.hiv_sexual_involvement_18",
    label: "HIV\u00a0Sexual Involvement",
    minWidth: 170,
  },
  // Bag Information
  { id: "final_decision.bag_type", label: "Bag Type", minWidth: 100 },
  { id: "final_decision.bag_status", label: "Bag Status", minWidth: 100 },
  // Final Decision
  { id: "final_decision.acceptance", label: "Acceptance", minWidth: 100 },
];

export default function Donations({ donation }) {
  const router = useRouter();

  // State and hooks
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState(donation);
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

  // !Object Nested Value Getter
  // Function for getting nested values from the data object
  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  // !Donation Actions Functions
  const handleAdd = (add) => {
    add.preventDefault();
    router.push("/donation");
  };

  // Function for handling view action
  const handleView = (id) => {
    router.push(`/donation/${id}`);
  };

  // Function for handling edit action
  const handleEdit = (id) => {
    router.push(`/donation/edit/${id}`);
  };

  // Function for handling delete action
  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donation/${id}`)
      .then((response) => {
        console.log(response);
        router.push("/donation");
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
      donation.filter((row) =>
        columns.some((column) => {
          const cellValue = getNestedValue(row, column.id);
          if (cellValue === undefined) {
            return false;
          }
          const cellValueStr = cellValue.toString().toLowerCase();
          if (column.id === "gender" && (searchValue === "male" || searchValue === "female")) {
            return cellValueStr === searchValue;
          } else if (column.id === "bloodType" && validBloodTypes.includes(searchValue)) {
            return cellValueStr === searchValue;
          } else {
            return cellValueStr.includes(searchValue);
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
      setFilteredRows(donation);
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
      ...filteredRows.map((row) => columns.map((column) => getNestedValue(row, column.id))),
    ];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Donations.csv");
    link.click();
  };

  return (
    <div sx={{ paddingTop: 20 }}>
      <Grid container justifyContent="space-between">
        <Typography variant="h3" id="tableTitle" component="div">
          Donations
        </Typography>
        <form onSubmit={handleAdd}>
          <Button
            sx={{ backgroundColor: "red", padding: "11px 16px" }}
            startIcon={<BloodtypeIcon />}
            variant="contained"
            type="submit"
          >
            Add New Donation
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
                  placeholder="Search for donation"
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
                <TableCell colSpan={4}>Donor Information</TableCell>
                <TableCell colSpan={3}>Donation Information</TableCell>
                <TableCell colSpan={4}>Donation Location</TableCell>
                <TableCell colSpan={2}>Donor Contact Details</TableCell>
                <TableCell colSpan={3}>Donation Counselling</TableCell>
                <TableCell colSpan={2}>Bag Information</TableCell>
                <TableCell>Final Decision</TableCell>
                <TableCell></TableCell>
              </TableRow>
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
                        const value = getNestedValue(row, column.id);
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
                          onClick={() => handleView(row.donorID)}
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

// Table columns
// const columns = [
//   // { id: "id", label: "Donation\u00a0ID", minWidth: 100 },
//   { id: "donorID", label: "Donor\u00a0ID", minWidth: 100 },
//   { id: "fullName", label: "Full\u00a0Name", minWidth: 170 },
//   // { id: "dob", label: "Date\u00a0of\u00a0Birth", minWidth: 100 },
//   { id: "age", label: "Age", minWidth: 100 },
//   { id: "gender", label: "Gender", minWidth: 100 },
//   { id: "donation_date", label: "Donation\u00a0Date", minWidth: 100 },
//   { id: "bloodType", label: "Blood\u00a0Type", minWidth: 100 },
//   // { id: "donor_type", label: "Donor\u00a0Type", minWidth: 100 },
//   { id: "donation_type", label: "Donation\u00a0Type", minWidth: 100 },
//   { id: "venue", label: "Venue", minWidth: 100 },
//   { id: "email", label: "Email", minWidth: 170 },
//   { id: "phone", label: "Phone\u00a0Number", minWidth: 170 },
//   { id: "district", label: "District", minWidth: 100 },
//   { id: "subcounty", label: "Subcounty", minWidth: 100 },
//   { id: "address", label: "Address", minWidth: 170 },

//   // Donation Counselling
//   // { id: "donation_counselling.feeling_well_1", label: "Feeling Well", minWidth: 100 },
//   // { id: "donation_counselling.donation_reasons", label: "Donation Reasons", minWidth: 170 },
//   // { id: "donation_counselling.read_material_3", label: "Read Material", minWidth: 100 },
//   // { id: "donation_counselling.denied_donation_4", label: "Denied\u00a0Donation", minWidth: 100 },
//   // { id: "donation_counselling.transfused_5", label: "Transfused", minWidth: 100 },
//   // { id: "donation_counselling.wound_6", label: "Wound", minWidth: 100 },
//   // { id: "donation_counselling.extract_tooth_7", label: "Extract Tooth", minWidth: 100 },
//   // { id: "donation_counselling.chronic_illness_8", label: "Chronic Illness", minWidth: 100 },
//   // { id: "donation_counselling.taking_medication_9", label: "Taking Medication", minWidth: 100 },
//   // { id: "donation_counselling.medical_procedure_10", label: "Medical Procedure", minWidth: 100 },
//   // { id: "donation_counselling.vaccinations_11", label: "Vaccinations", minWidth: 100 },
//   // { id: "donation_counselling.sti_12", label: "STI", minWidth: 100 },
//   // { id: "donation_counselling.liver_disease_13", label: "Liver Disease", minWidth: 100 },
//   // { id: "donation_counselling.hiv_test_14", label: "HIV\u00a0Test", minWidth: 100 },
//   { id: "donation_counselling.hiv_positive_15", label: "HIV\u00a0Positive", minWidth: 100 },
//   // { id: "donation_counselling.multiple_partners_16", label: "Multiple Partners", minWidth: 100 },
//   // { id: "donation_counselling.sex_worker_17", label: "Sex Worker", minWidth: 100 },
//   // {id: "donation_counselling.hiv_sexual_involvement_18", label: "HIV Sexual Involvement", minWidth: 170,},
//   // { id: "donation_counselling.menstruating_19", label: "Menstruating", minWidth: 170 },
//   // { id: "donation_counselling.pregnant_20", label: "Pregnant?", minWidth: 170 },

//   // Medical Examination
//   // { id: "medical_examination.pressure", label: "Pressure (mmHg)", minWidth: 170 },
//   // { id: "medical_examination.level", label: "Level (g/dL)", minWidth: 170 },
//   // { id: "medical_examination.weight", label: "Weight (kg)", minWidth: 170 },
//   // { id: "medical_examination.pulse", label: "Pulse (bpm)", minWidth: 170 },
//   // { id: "medical_examination.temperature", label: "Temperature (°C)", minWidth: 170 },
//   // { id: "medical_examination.note", label: "Note", minWidth: 170 },

//   // Final Decision
//   { id: "final_decision.acceptance", label: "Acceptance", minWidth: 100 },
//   // { id: "final_decision.rejection_reason", label: "Rejection Reason", minWidth: 100 },
//   { id: "final_decision.bag_type", label: "Bag Type", minWidth: 100 },
//   { id: "final_decision.bag_status", label: "Bag Status", minWidth: 100 },
//   // { id: "final_decision.bad_bag_reason", label: "Bad Bag Reason", minWidth: 100 },
//   // { id: "final_decision.arm", label: "Arm Used", minWidth: 100 },
//   // { id: "final_decision.reaction", label: "Reaction?", minWidth: 100 },
//   // { id: "final_decision.reaction_description", label: "Reaction Description", minWidth: 100 },
//   // { id: "final_decision.bleeding_start", label: "Bleeding Start Time", minWidth: 100 },
//   // { id: "final_decision.bleeding_end", label: "Bleeding End Time", minWidth: 100 },
// ];
