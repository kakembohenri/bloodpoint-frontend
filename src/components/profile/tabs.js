import React, { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import { AccountProfileDetails } from "../account/account-profile-details";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

const columns = [
  { id: "donorID", label: "Donor\u00a0ID", minWidth: 100 },
  { id: "donation_date", label: "Donation\u00a0Date", minWidth: 100 },
  { id: "time", label: "Time", minWidth: 100 },
  { id: "bloodType", label: "Blood\u00a0Type", minWidth: 100 },
  { id: "pressure", label: "Pressure", minWidth: 100 },
  { id: "level", label: "Level", minWidth: 100 },
  { id: "weight", label: "Weight", minWidth: 100 },
  { id: "venue", label: "Venue", minWidth: 150 },
  { id: "note", label: "Note", minWidth: 170 },
];

export default function LabTabs({ donor, donations }) {
  const [value, setValue] = useState("1");
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", paddingTop: "40px" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Details" value="1" />
            <Tab label="Donation History" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Card>
            <CardHeader title="Basic Details" />
            <Divider />
            <CardContent>
              <h4>Full Name</h4>
              {donor.fullName}
              <Divider sx={{ my: 1 }} />
              <h4>Donor ID</h4>
              {donor.donorID}
              <Divider sx={{ my: 1 }} />
              <h4>Blood Type</h4>
              {donor.bloodType}
              <Divider sx={{ my: 1 }} />
              <h4>Last Donation</h4>
              {donor.lastDonation}
              <Divider sx={{ my: 1 }} />
              <h4>Gender</h4>
              {donor.gender}
              <Divider sx={{ my: 1 }} />
              <h4>Email</h4>
              {donor.email}
              <Divider sx={{ my: 1 }} />
              <h4>Phone Number</h4>
              {donor.phone}
              <Divider sx={{ my: 1 }} />
              <h4>Address</h4>
              {donor.address}
              <Divider sx={{ my: 1 }} />
              <h4>District</h4>
              {donor.district}
              <Divider sx={{ my: 1 }} />
              <h4>Sub County</h4>
              {donor.subcounty}
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel value="2">
          <div>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {donations
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
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
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={donations.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
