import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";

// TODO: Add error handling to location fields

const district = [
  {
    value: "koboko",
    label: "Koboko",
  },
  {
    value: "gomba",
    label: "Gomba",
  },
  {
    value: "kisoro",
    label: "Kisoro",
  },
];

const subcounty = [
  {
    value: "koboko",
    label: "Koboko",
  },
  {
    value: "gomba",
    label: "Gomba",
  },
  {
    value: "kisoro",
    label: "Kisoro",
  },
];

const gender = [
  {
    value: "null",
    label: "Select Gender",
  },
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
  },
];

const blood = [
  {
    value: "null",
    label: "Select Blood Type",
  },
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
  {
    value: "Unknown",
    label: "Unknown",
  },
];

export const DonorRegistrationDetails = ({ props, ugData }) => {
  const router = useRouter();
  const [values, setValues] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubcounty, setSelectedSubcounty] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [errors, setErrors] = useState({});

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setSelectedSubcounty("");
    setSelectedVillage("");
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubcountyChange = (event) => {
    setSelectedSubcounty(event.target.value);
    setSelectedVillage("");
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleVillageChange = (event) => {
    setSelectedVillage(event.target.value);
  };

  const getSubcountyOptions = () => {
    if (!selectedDistrict) {
      return [];
    }
    const divisions = Object.keys(ugData[selectedDistrict]);
    return divisions.map((division) => (
      <option key={division} value={division}>
        {division}
      </option>
    ));
  };

  const getVillageOptions = () => {
    if (!selectedDistrict || !selectedSubcounty) {
      return [];
    }
    const villages = Object.values(ugData[selectedDistrict][selectedSubcounty]);
    return villages.map((village) => (
      <option key={village} value={village}>
        {village}
      </option>
    ));
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const requiredFields = {
    fullName: "Full Name",
    donorID: "Donor ID",
    dob: "Date of Birth",
    lastDonation: "Last Donation Date",
    gender: "Gender",
    bloodType: "Blood Type",
    district: "District",
    email: "Email Address",
    subcounty: "Subcounty",
    phone: "Phone Number",
    address: "Address",
  };

  const validateFields = () => {
    const newErrors = {};
    Object.entries(requiredFields).forEach(([field, fieldName]) => {
      if (!values[field]) {
        newErrors[field] = `${fieldName} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateFields()) {
      return;
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donor`, {
        fullName: values.fullName,
        donorID: values.donorID,
        dob: values.dob,
        lastDonation: values.lastDonation,
        gender: values.gender,
        bloodType: values.bloodType,
        district: values.district,
        email: values.email,
        subcounty: values.subcounty,
        phone: values.phone,
        address: values.address,
      })
      .then((response) => {
        // handle success
        console.log(response.data);
        router.push("/fetchDonors");
      })
      .catch((error) => {
        // handle error
        console.log(error);
        //   router.push("/error");
      });
  };

  return (
    <form noValidate {...props} onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title="Donor Registration Form"
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
            {/* !Personal Information */}
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
                    // helperText="Please enter the full name"
                    label="Full Name"
                    name="fullName"
                    onChange={handleChange}
                    // required
                    value={values.fullName}
                    variant="outlined"
                    type="text"
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Gender"
                    name="gender"
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.gender}
                    variant="outlined"
                    error={Boolean(errors.gender)}
                    helperText={errors.gender}
                  >
                    {gender.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    name="dob"
                    onChange={handleChange}
                    required
                    value={values.dob}
                    variant="outlined"
                    type="date"
                    error={Boolean(errors.dob)}
                    helperText={errors.dob ? "Date of Birth Required" : "Enter Date of Birth"}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* !Blood Information */}
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
                    label="Donor ID"
                    name="donorID"
                    onChange={handleChange}
                    required
                    value={values.donorID}
                    variant="outlined"
                    error={Boolean(errors.donorID)}
                    helperText={errors.donorID}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Blood Type"
                    name="bloodType"
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.bloodType}
                    variant="outlined"
                    error={Boolean(errors.bloodType)}
                    helperText={errors.bloodType}
                  >
                    {blood.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    // helperText="Enter Last Blood Donation Date"
                    name="lastDonation"
                    onChange={handleChange}
                    // required
                    value={values.lastDonation}
                    // variant="outlined"
                    type="date"
                    error={Boolean(errors.lastDonation)}
                    helperText={errors.dob ? "Enter Blood Donation Date" : "Enter Blood Donation Date"}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* !Contact Information */}
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
                    label="Phone Number"
                    name="phone"
                    onChange={handleChange}
                    type="tel"
                    value={values.phone}
                    // variant="outlined"
                    error={Boolean(errors.phone)}
                    helperText={errors.phone}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    onChange={handleChange}
                    required
                    value={values.email}
                    variant="outlined"
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* !Address Information */}
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
                    // helperText="Please specify your district"
                    name="district"
                    onChange={handleDistrictChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.selectedDistrict}
                    variant="outlined"
                    helperText={
                      <>
                        Please specify your district
                        <br />
                        {errors.selectedDistrict}
                      </>
                    }
                  >
                    <option value="">Select a district</option>
                    {Object.keys(ugData).map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    // helperText="Please specify your subcounty"
                    name="subcounty"
                    onChange={handleSubcountyChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.selectedSubcounty}
                    variant="outlined"
                    helperText={
                      <>
                        Please specify your subcounty
                        <br />
                        {errors.selectedDistrict}
                      </>
                    }
                  >
                    <option value="">Select a SubCounty</option>
                    {getSubcountyOptions()}
                  </TextField>
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    onChange={handleChange}
                    required
                    value={values.address}
                    variant="outlined"
                    error={Boolean(errors.address)}
                    helperText={errors.email}
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
            Save details
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
