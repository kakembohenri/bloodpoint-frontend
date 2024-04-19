// External imports
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
// MUI imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import PerfectScrollbar from "react-perfect-scrollbar";

// TODO: Add error handling to Text Box

const blood = [
  {
    value: "A+",
    label: "A+",
  },
  {
    value: "A-",
    label: "A-",
  },
  {
    value: "B+",
    label: "B+",
  },
  {
    value: "B-",
    label: "B-",
  },
  {
    value: "AB+",
    label: "AB+",
  },
  {
    value: "AB-",
    label: "AB-",
  },
  {
    value: "O+",
    label: "O+",
  },
  {
    value: "O-",
    label: "O-",
  },
];

const purpose = [
  {
    value: "null",
    label: "Select Purpose/Reason for Request",
  },
  {
    value: "surgery",
    label: "Surgery",
  },
  {
    value: "accident",
    label: "Accident",
  },
  {
    value: "child Birth",
    label: "Child Birth",
  },
  {
    value: "update Blood Stock",
    label: "Update Blood Stock",
  },
  {
    value: "other",
    label: "Other",
  },
];

const bloodBank = [
  {
    value: "MBARARA",
    label: "MBARARA",
  },
  {
    value: "MBALE",
    label: "MBALE",
  },
  {
    value: "AURA",
    label: "AURA",
  },
  {
    value: "FORT PORTAL",
    label: "FORT PORTAL",
  },
  {
    value: "LIRA",
    label: "LIRA",
  },
  {
    value: "GULU",
    label: "GULU",
  },
];

const columns = [
  { id: "type", label: "Type of Product", minWidth: 90 },
  { id: "o+Available", label: "O+ Available Units", minWidth: 90 },
  { id: "o+Order", label: "O+ Order", minWidth: 90 },
  { id: "o-Available", label: "O- Available Units", minWidth: 90 },
  { id: "o-Order", label: "O- Order", minWidth: 90 },
  { id: "a+Available", label: "A+ Available Units", minWidth: 90 },
  { id: "a+Order", label: "A+ Order", minWidth: 90 },
  { id: "a-Available", label: "A- Available Units", minWidth: 90 },
  { id: "a-Order", label: "A- Order", minWidth: 90 },
  { id: "b+Available", label: "B+ Available Units", minWidth: 90 },
  { id: "b+Order", label: "B+ Order", minWidth: 90 },
  { id: "b-Available", label: "B- Available Units", minWidth: 90 },
  { id: "b-Order", label: "B- Order", minWidth: 90 },
  { id: "ab+Available", label: "AB+ Available Units", minWidth: 90 },
  { id: "ab+Order", label: "AB+ Order", minWidth: 90 },
  { id: "ab-Available", label: "AB- Available Units", minWidth: 90 },
  { id: "ab-Order", label: "AB- Order", minWidth: 90 },
];

export const RequestDetails = ({ props, data }) => {
  const router = useRouter();

  // State and hooks
  const [values, setValues] = useState({
    bank: "MBARARA",
    order_type: "",
    table_data: data["MBARARA"].reduce((acc, row) => {
      acc[row["Type of Product"]] = {
        ...row,
        "O+ Order": 0,
        "O- Order": 0,
        "A+ Order": 0,
        "A- Order": 0,
        "B+ Order": 0,
        "B- Order": 0,
        "AB+ Order": 0,
        "AB- Order": 0,
      };
      return acc;
    }, {}),
    hospital: "",
    district: "",
    ordered_by: "",
    request_date: "",
  });
  const [errors, setErrors] = useState({});

  // !Input change handler
  // Function to handle form input change
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // Function to handle table available units change based on blood bank selected
  const handleBankChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
      table_data: data[value].reduce((acc, row) => {
        acc[row["Type of Product"]] = {
          ...row,
          "O+ Order": prevValues.table_data[row["Type of Product"]]["O+ Order"],
          "O- Order": prevValues.table_data[row["Type of Product"]]["O- Order"],
          "A+ Order": prevValues.table_data[row["Type of Product"]]["A+ Order"],
          "A- Order": prevValues.table_data[row["Type of Product"]]["A- Order"],
          "B+ Order": prevValues.table_data[row["Type of Product"]]["B+ Order"],
          "B- Order": prevValues.table_data[row["Type of Product"]]["B- Order"],
          "AB+ Order": prevValues.table_data[row["Type of Product"]]["AB+ Order"],
          "AB- Order": prevValues.table_data[row["Type of Product"]]["AB- Order"],
        };
        return acc;
      }, {}),
    }));
  };

  // Function to handle the order input change
  const handleOrderChange = (e, productType) => {
    const { name, value } = e.target;
    const availableUnits = values.table_data[productType][name.replace("Order", "Available Units")];
    if (value > availableUnits) {
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        table_data: {
          ...prevValues.table_data,
          [productType]: {
            ...prevValues.table_data[productType],
            [name]: value,
          },
        },
      }));
    }
  };

  const requiredFields = {
    bank: "Blood Bank",
    ordered_type: "Type of Order",
    hospital: "Hospital",
    district: "District",
    ordered_by: "Ordered By",
    request_date: "Request Date",
  };

  const validateFields = () => {
    const newErrors = {};
    Object.entries(requiredFields).forEach(([field, fieldName]) => {
      if (!values[field]) {
        newErrors[field] = `${fieldName} is required`;
      }
      // Custom validation check for order type
      if (values.order_type.length === 0) {
        newErrors.order_type = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // if (!validateFields()) {
    //   return;
    // }
    const requestData = {
      bank: values.bank,
      order_type: values.order_type,
      table_data: Object.values(values.table_data).map((row) => ({
        product: row["Type of Product"],
        "O+ Order": row["O+ Order"],
        "O- Order": row["O- Order"],
        "A+ Order": row["A+ Order"],
        "A- Order": row["A- Order"],
        "B+ Order": row["B+ Order"],
        "B- Order": row["B- Order"],
        "AB+ Order": row["AB+ Order"],
        "AB- Order": row["AB- Order"],
      })),
      hospital: values.hospital,
      district: values.district,
      ordered_by: values.ordered_by,
      request_date: values.request_date,
      status: "Pending",
    };
    console.log(requestData);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brequest`, requestData)
      .then((response) => {
        // handle success
        console.log(response.data);
        router.push("/fetchRequests");
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  return (
    <form autoComplete="off" noValidate {...props} onSubmit={handleSubmit}>
      <Card sx={{ maxWidth: "100%" }}>
        <CardHeader
          title="Blood Request Form"
          sx={{
            backgroundColor: "red",
            color: "white",
            "& .MuiDivider-root": {
              backgroundColor: "white",
            },
          }}
        />
        <Divider />
        <CardContent>
          <Grid>
            <Grid
              container
              spacing={3}
              sx={{
                padding: "25px",
                paddingLeft: "50px",
              }}
            >
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Select Blood Bank"
                    name="bank"
                    onChange={handleBankChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.bank}
                    variant="outlined"
                    error={Boolean(errors.bank)}
                    helperText={errors.bank}
                  >
                    <option>Select Blood Bank</option>
                    {bloodBank.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid xs={12} md={6}>
                  <Typography variant="subtitle1" style={{ marginLeft: "36px", marginTop: "18px" }}>
                    Order Type
                  </Typography>
                  <RadioGroup
                    name="order_type"
                    value={values.order_type}
                    onChange={handleChange}
                    style={{ marginLeft: "36px" }}
                    row
                    helperText={errors.feeling_well_1 ? "Response Required" : ""}
                  >
                    <FormControlLabel control={<Radio />} label="Emergency" value="emergency" />
                    <FormControlLabel control={<Radio />} label="Routine" value="routine" />
                  </RadioGroup>
                </Grid>

                <Grid xs={12} md={12}>
                  <TableContainer
                    sx={{
                      maxWidth: "100%",
                      marginTop: 4,
                      "&::-webkit-scrollbar": {
                        height: "0.6em",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "1em",
                      },
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.values(values.table_data).map((row) => (
                          <TableRow key={row["Type of Product"]}>
                            <TableCell
                              sx={{
                                position: "sticky",
                                left: 0,
                                zIndex: 1,
                                backgroundColor: "white",
                              }}
                            >
                              {row["Type of Product"]}
                            </TableCell>
                            <TableCell>{row["O+ Available Units"]}</TableCell>
                            <TableCell>
                              <TextField
                                name="O+ Order"
                                value={row["O+ Order"]}
                                onChange={(e) => handleOrderChange(e, row["Type of Product"])}
                              />
                            </TableCell>
                            <TableCell>{row["O- Available Units"]}</TableCell>
                            <TableCell>
                              <TextField
                                name="O- Order"
                                value={row["O- Order"]}
                                onChange={(e) => handleOrderChange(e, row["Type of Product"])}
                              />
                            </TableCell>
                            <TableCell>{row["A+ Available Units"]}</TableCell>
                            <TableCell>
                              <TextField
                                name="A+ Order"
                                value={row["A+ Order"]}
                                onChange={(e) => handleOrderChange(e, row["Type of Product"])}
                              />
                            </TableCell>
                            <TableCell>{row["A- Available Units"]}</TableCell>
                            <TableCell>
                              <TextField
                                name="A- Order"
                                value={row["A- Order"]}
                                onChange={(e) => handleOrderChange(e, row["Type of Product"])}
                              />
                            </TableCell>
                            <TableCell>{row["B+ Available Units"]}</TableCell>
                            <TableCell>
                              <TextField
                                name="B+ Order"
                                value={row["B+ Order"]}
                                onChange={(e) => handleOrderChange(e, row["Type of Product"])}
                              />
                            </TableCell>
                            <TableCell>{row["B- Available Units"]}</TableCell>
                            <TableCell>
                              <TextField
                                name="B- Order"
                                value={row["B- Order"]}
                                onChange={(e) => handleOrderChange(e, row["Type of Product"])}
                              />
                            </TableCell>
                            <TableCell>{row["AB+ Available Units"]}</TableCell>
                            <TableCell>
                              <TextField
                                name="AB+ Order"
                                value={row["AB+ Order"]}
                                onChange={(e) => handleOrderChange(e, row["Type of Product"])}
                              />
                            </TableCell>
                            <TableCell>{row["AB- Available Units"]}</TableCell>
                            <TableCell>
                              <TextField
                                name="AB- Order"
                                value={row["AB- Order"]}
                                onChange={(e) => handleOrderChange(e, row["Type of Product"])}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    sx={{ marginTop: "18px" }}
                    fullWidth
                    label="Hospital name"
                    name="hospital"
                    onChange={handleChange}
                    required
                    value={values.hospital}
                    variant="outlined"
                    error={Boolean(errors.hospital)}
                    helperText={
                      errors.hospital
                        ? "Hospital is not filled"
                        : "Enter Hospital/Health Facility Name"
                    }
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    sx={{ marginTop: "18px" }}
                    fullWidth
                    label="District"
                    name="district"
                    onChange={handleChange}
                    required
                    value={values.district}
                    variant="outlined"
                    error={Boolean(errors.district)}
                    helperText={errors.district ? "District is not filled" : null}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Ordered By"
                    name="ordered_by"
                    onChange={handleChange}
                    required
                    value={values.ordered_by}
                    variant="outlined"
                    error={Boolean(errors.ordered_by)}
                    helperText={errors.ordered_by ? "Ordered By is not filled" : null}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    name="request_date"
                    onChange={handleChange}
                    required
                    value={values.request_date}
                    variant="outlined"
                    type="date"
                    error={Boolean(errors.request_date)}
                    helperText={errors.request_date ? "Request Date Required" : "Enter Date of Request"}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        {/* <Divider /> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button
            sx={{
              mr: 2,
              bgcolor: "red",
              color: "white",
            }}
            variant="contained"
            type="submit"
          >
            Create Order
          </Button>
          <Button
            sx={{
              mr: 2,
              bgcolor: "white",
              color: "red",
              outline: "1px solid black",
            }}
            variant="contained"
          >
            Cancel
          </Button>
        </Box>
      </Card>
    </form>
  );
};
