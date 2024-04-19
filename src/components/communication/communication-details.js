import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  FormControl,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";
import Select from "react-select";

// TODO: Add error handling to Text Box

// Styles for select component
const selectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "56px",
  }),
};

// Form fields for recipient group
const group = [
  { value: "by blood group", label: "By Blood Group" },
  { value: "by location", label: "By Location" },
];

// Form fields for blood group
const blood = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

export const CommunicationDetails = ({ props, ugData }) => {
  const router = useRouter();
  // State variables
  const [values, setValues] = useState({
    title: "",
    recipient_group: [],
    blood_group: [],
    district: [],
    donors: [],
    blood_bank: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [showBloodGroup, setShowBloodGroup] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  // State variable to store queried donor information
  const [donors, setDonors] = useState([]);

  // Function to query donor information from backend API
  const fetchDonors = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donor`);

      // Filter donors based on selected blood group and location
      const filteredDonors = response.data.filter((donor) => {
        const bloodGroupMatch =
          values.blood_group.length === 0 ||
          values.blood_group.some((group) => group.value === donor.bloodType);
        const districtMatch =
          values.district.length === 0 ||
          values.district.some((district) => district.value === donor.district);
        return bloodGroupMatch && districtMatch;
      });

      setDonors(filteredDonors);
    } catch (error) {
      console.error(error);
    }
  };

  // Call fetchDonors function when selected filters change
  useEffect(() => {
    const bloodGroup = values.blood_group.map((group) => group.value);
    const district = values.district.map((district) => district.value);
    fetchDonors(bloodGroup, district);
  }, [values.blood_group, values.district]);

  // Handle Change for the select fields
  const handleChange = (name) => (value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Check if "By ... Group" is selected
    if (name === "recipient_group") {
      setShowBloodGroup(value.some((option) => option.value === "by blood group"));
      setShowDistrict(value.some((option) => option.value === "by location"));
    }
  };

  // Handle Change for the text fields
  const handleChange2 = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // Error messages for required fields
  const requiredFields = {
    title: "Message Title",
    recipient_group: "Recipient Group",
    blood_group: "Blood Group",
    district: "Location",
    blood_bank: "Blood Bank",
    address: "Address",
  };

  const validateFields = () => {
    const newErrors = {};

    Object.entries(requiredFields).forEach(([field, fieldName]) => {
      if (!values[field] || (Array.isArray(values[field]) && values[field].length === 0)) {
        newErrors[field] = `${fieldName} is required`;
      } else if (field === "blood_group") {
        // Check if all selected blood groups are valid
        const invalidBloodGroups = values.blood_group.filter(
          (group) => !blood.some((option) => option.value === group.value)
        );

        if (invalidBloodGroups.length > 0) {
          newErrors[field] = `Invalid Blood Group: ${invalidBloodGroups.join(", ")}`;
        }
      } else if (field === "district") {
        // Check if all selected districts are valid
        const invalidDistricts = values.district.filter(
          (district) => !Object.keys(ugData).includes(district.value)
        );

        if (invalidDistricts.length > 0) {
          newErrors[field] = `Invalid District: ${invalidDistricts.join(", ")}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submission logic
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      ...values,
      recipient_group: JSON.stringify(values.recipient_group.map((item) => item.value)),
      blood_group: JSON.stringify(values.blood_group.map((item) => item.value)),
      district: JSON.stringify(values.district.map((item) => item.value)),
      donors: JSON.stringify(donors.map((donor) => donor["donorID"])),
      recipient_count: donors.length,
      blood_bank: values.blood_bank,
      address: values.address,
    };
    console.log(data);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/communication`, data)

      .then((response) => {
        // handle success
        console.log(response.data);
        router.push("/fetchCommunication");
      })
      .catch((error) => {
        // handle error
        console.log(error);
        // router.push("/404");
      });
  };

  return (
    <form autoComplete="off" noValidate {...props} onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title="Communication Form"
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
            <Grid container spacing={3} sx={{ padding: "25px", paddingLeft: "50px" }}>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Message Title"
                    name="title"
                    onChange={handleChange2}
                    required
                    value={values.title}
                    variant="outlined"
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="recipient-group-select"></InputLabel>
                    <Select
                      id="recipient-group-select"
                      isMulti
                      name="recipient_group"
                      options={group}
                      onChange={handleChange("recipient_group")}
                      value={values.recipient_group}
                      placeholder="Select Group"
                      styles={selectStyles}
                    />
                  </FormControl>
                  <Typography variant="caption" display="block" gutterBottom>
                    Select Groups To Filter By
                  </Typography>
                  {/* {errors.recipient_group && (
                    <div style={{ color: "red", marginTop: "8px" }}>{errors.recipient_group}</div>
                  )} */}
                </Grid>
                {showBloodGroup && (
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="blood-group-select"></InputLabel>
                      <Select
                        id="blood-group-select"
                        isMulti
                        name="blood_group"
                        options={blood}
                        onChange={handleChange("blood_group")}
                        value={values.blood_group}
                        placeholder="Select Blood Group"
                        styles={selectStyles}
                      />
                    </FormControl>
                    <Typography variant="caption" display="block" gutterBottom>
                      Select Blood Groups To Filter
                    </Typography>
                  </Grid>
                )}
                {showDistrict && (
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="district-select"></InputLabel>
                      <Select
                        id="district-select"
                        isMulti // Allow for multiple selections
                        name="district"
                        options={Object.keys(ugData).map((district) => ({
                          value: district,
                          label: district,
                        }))}
                        onChange={handleChange("district")}
                        value={values.district}
                        placeholder="Select District"
                        styles={selectStyles}
                      />
                    </FormControl>
                    <Typography variant="caption" display="block" gutterBottom>
                      Select Location To Filter
                    </Typography>
                  </Grid>
                )}
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Blood Bank Name"
                    name="blood_bank"
                    onChange={handleChange2}
                    required
                    value={values.blood_bank}
                    variant="outlined"
                    error={Boolean(errors.blood_bank)}
                    helperText={errors.blood_bank}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Donation Address"
                    name="address"
                    onChange={handleChange2}
                    required
                    value={values.address}
                    variant="outlined"
                    error={Boolean(errors.address)}
                    helperText={errors.address}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Display queried donor information */}
          {(values.blood_group.length > 0 || values.district.length > 0) && (
            <>
              <Typography variant="h6">Number of donors: {donors.length}</Typography>
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Donor ID</TableCell>
                      <TableCell>Full Name</TableCell>
                      <TableCell>DOB</TableCell>
                      <TableCell>Blood Type</TableCell>
                      <TableCell>District</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {donors.map((donor) => (
                      <TableRow key={donor.donorID}>
                        <TableCell>{donor.donorID}</TableCell>
                        <TableCell>{donor.fullName}</TableCell>
                        <TableCell>{donor.dob}</TableCell>
                        <TableCell>{donor.bloodType}</TableCell>
                        <TableCell>{donor.district}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </CardContent>

        {/* <Divider /> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button sx={{ mr: 2, bgcolor: "red", color: "white" }} variant="contained" type="submit">
            Send Message
          </Button>

          <Button
            sx={{ mr: 2, bgcolor: "white", color: "red", outline: "1px solid black" }}
            variant="contained"
          >
            Cancel
          </Button>
        </Box>
      </Card>
    </form>
  );
};
