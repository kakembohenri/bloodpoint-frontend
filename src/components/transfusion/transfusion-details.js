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
  Typography,
  TextareaAutosize,
} from "@mui/material";

// TODO: Add error handling to Text Box

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

const reason = [
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

export const TransfusionDetails = (props) => {
  const router = useRouter();
  const [values, setValues] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const requiredFields = {
    patient_id: "Patient ID",
    gender: "Gender",
    blood_comp_id: "Blood Component ID",
    recipient_name: "Recipient Name",
    recipient_name: "Recipient Name",
    transfuser: "Transfuser",
    date_of_transfusion: "Date of Transfusion",
    time_of_transfusion: "Time of Transfusion",
    purpose: "Purpose",
    remarks: "Remarks",
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
        .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transfusion`, {
          patient_id: values.patient_id,
          gender: values.gender,
          blood_comp_id: values.blood_comp_id,
          recipient_name: values.recipient_name,
          transfuser: values.transfuser,
          date_of_transfusion: values.date_of_transfusion,
          time_of_transfusion: values.time_of_transfusion,
          purpose: values.purpose,
          remarks: values.remarks,
        })
        .then((response) => {
          // handle success
          console.log(response.data);
          router.push("/fetchTransfusion");
        })
        .catch((error) => {
          // handle error
          console.log(error);
          // router.push('404');
        })

        // console.log(first)
  }

  return (
    <form autoComplete="off" noValidate {...props} onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title="Blood Transfusion Recording Form"
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
            {/* Patient Information */}
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
                    label="Patient ID"
                    name="patient_id"
                    onChange={handleChange}
                    required
                    value={values.patient_id}
                    variant="outlined"
                    error={Boolean(errors.patient_id)}
                    helperText={errors.patient_id}
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
              </Grid>
            </Grid>

            {/* Blood Information */}
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
                    label="Blood Component ID"
                    name="blood_comp_id"
                    onChange={handleChange}
                    required
                    value={values.blood_comp_id}
                    variant="outlined"
                    error={Boolean(errors.blood_comp_id)}
                    helperText={errors.blood_comp_id ? "Blood Component ID Required" : "Enter Blood Component ID"}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Recipient Name"
                    name="recipient_name"
                    onChange={handleChange}
                    required
                    value={values.recipient_name}
                    variant="outlined"
                    error={Boolean(errors.recipient_name)}
                    helperText={errors.recipient_name}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Transfused By"
                    name="transfuser"
                    onChange={handleChange}
                    required
                    value={values.transfuser}
                    variant="outlined"
                    error={Boolean(errors.transfuser)}
                    helperText={errors.transfuser}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    name="date_of_transfusion"
                    onChange={handleChange}
                    required
                    value={values.date_of_transfusion}
                    variant="outlined"
                    type="date"
                    error={Boolean(errors.blood_comp_id)}
                    helperText={errors.blood_comp_id ? "Date of Transfusion Required" : "Enter Date of Transfusion"}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    name="time_of_transfusion"
                    onChange={handleChange}
                    required
                    value={values.time_of_transfusion}
                    variant="outlined"
                    type="time"
                    error={Boolean(errors.time_of_transfusion)}
                    helperText={errors.time_of_transfusion ? "Time of Transfusion Required" : "Enter Time of Transfusion"}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Reason for Transfusion"
                    name="purpose"
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.purpose}
                    variant="outlined"
                    error={Boolean(errors.purpose)}
                    helperText={errors.purpose}
                  >
                    {reason.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Typography>Remarks</Typography>

                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={7}
                      placeholder="Enter your additional information here..."
                      name="remarks"
                      onChange={handleChange}
                      value={values.remarks}
                      style={{
                        flexGrow: 1,
                        resize: "none",
                        padding: "10px",
                        height: 100,
                        borderRadius: "5px",
                        border: "0.5px solid grey",
                        "&::placeholder": {
                          fontFamily:
                            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
                          fontSize: "1.2rem",
                        },
                      }}
                    />
                  </Box>
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
