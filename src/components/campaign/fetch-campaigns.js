import { useState } from "react";
import { useRouter } from "next/router";
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
} from "@mui/material";
import { Search  as SearchIcon } from '../../icons/search';

const columns = [
  { id: "title", label: "Campaign\u00a0Title", minWidth: 170 },
  { id: "startDate", label: "Start\u00a0Date", minWidth: 100 },
  { id: "endDate", label: "End\u00a0Date", minWidth: 100 },
  { id: "location", label: "Location", minWidth: 130 },
  { id: "selectedBloodTypes", label: "Selected\u00a0Blood\u00a0Types", minWidth: 100, align: "centre" },
  { id: "targetDonors", label: "Target\u00a0Donors", minWidth: 100 },
  { id: "organizerName", label: "Organizer\u00a0Name", minWidth: 130 },
  { id: "OrganizerEmail", label: "Organizer\u00a0Email", minWidth: 100 },
  { id: "OrganizerPhone", label: "Organizer\u00a0Phone", minWidth: 100 },
  { id: "additionalNotes", label: "Additional\u00a0Notes", minWidth: 170 },
];

export default function Donors({ donor }) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAdd = (add) => {
    add.preventDefault();
    router.push("/campaigns");
  };

  const handleRowClick = (donorID) => {
    router.push(`/donors/${donorID}`);
  };

  return (
    <div>
      <Grid container justifyContent="space-between">
        <Typography variant="h3" id="tableTitle" component="div">
          Campaigns
        </Typography>
        <form onSubmit={handleAdd}>
          <Button sx={{ backgroundColor: "red" }} variant="contained" type="submit">
            Add New Campaign
          </Button>
        </form>
      </Grid>
      <Box sx={{ mt: 3, paddingBottom: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
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
                placeholder="Search for campaign"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
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
            {/* <TableBody>
              {donor.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}
                  onClick={() => handleRowClick(row.donorID)}>
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
            </TableBody> */}
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={donor.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </div>
  );
}
