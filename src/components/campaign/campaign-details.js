import { useState } from "react";
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
  TextareaAutosize,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import axios from "axios";

// TODO: Add error handling to Text Box
// TODO: Refactor form layout

const group = [
  {
    value: "Hospital",
    label: "Hospital",
  },
  {
    value: "Blood Bank",
    label: "Blood Bank",
  },
];

export const CampaignDetails = (props) => {
  const router = useRouter();
  const [values, setValues] = useState([]);
  const [errors, setErrors] = useState({});
  const [bloodState, setBloodState] = useState({
    O: false,
    A: false,
    B: false,
    AB: false,
  });
  // const [selectedBloodTypes, setSelectedBloodTypes] = useState([]);

  // Blood Type Checkbox
  const handleBloodChange = (event) => {
    setBloodState({
      ...bloodState,
      [event.target.name]: event.target.checked,
    });
  };

  // const handleBloodChange = (event) => {
  //   const { name, checked } = event.target;
  //   const newSelectedBloodTypes = checked
  //     ? [...selectedBloodTypes, name]
  //     : selectedBloodTypes.filter((type) => type !== name);
  //   setSelectedBloodTypes(newSelectedBloodTypes);
  //   setState({ ...state, [name]: checked }); // update the state as before
  // };

  const { O, A, B, AB } = bloodState;
  const error = [O, A, B, AB].filter((v) => v).length === 0;

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const requiredFields = {
    title: "Campaign Title",
    startDate: "Start Date",
    endDate: "End Date",
    location: "Location",
    selectedBloodTypes: "Blood Types",
    targetDonors: "Target Donors",
    organizerName: "Organizer Name",
    organizerEmail: "Organizer Email",
    organizerPhone: "Organizer Phone",
    additionalNotes: "Additional Notes",
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
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaign`, {
        title: values.title,
        startDate: values.startDate,
        endDate: values.endDate,
        location: values.location,
        setSelectedBloodTypes: values.selectedBloodTypes,
        targetDonors: values.targetDonors,
        organizerName: values.organizerName,
        organizerEmail: values.organizerEmail,
        organizerPhone: values.organizerPhone,
        additionalNotes: values.additionalNotes,
      })
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

    console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
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
            {/* Message Information */}
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
                    label="Campaign Title"
                    name="title"
                    onChange={handleChange}
                    required
                    value={values.title}
                    variant="outlined"
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    name="startDate"
                    onChange={handleChange}
                    required
                    type="date"
                    value={values.startDate}
                    variant="outlined"
                    error={Boolean(errors.startDate)}
                    helperText={
                      errors.dob
                        ? "Campaign Start Date Required"
                        : "Please enter Campaign Start Date"
                    }
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    name="endDate"
                    onChange={handleChange}
                    required
                    type="date"
                    value={values.endDate}
                    variant="outlined"
                    error={Boolean(errors.endDate)}
                    helperText={
                      errors.dob ? "Campaign End Date Required" : "Please enter Campaign End Date"
                    }
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Location of Blood Campaign"
                    name="location"
                    onChange={handleChange}
                    required
                    value={values.location}
                    variant="outlined"
                    error={Boolean(errors.location)}
                    helperText={
                      errors.dob
                        ? "Location of Campaign Required"
                        : "Please enter Location of Campaign (i.e. City, Neighborhood, Address)"
                    }
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <Box sx={{ display: "flex" }}>
                    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                      <FormLabel component="legend">Select Blood Type(s) Required</FormLabel>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox checked={O} onChange={handleBloodChange} name="O" />
                              }
                              label="O"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox checked={A} onChange={handleBloodChange} name="A" />
                              }
                              label="A"
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={6}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox checked={B} onChange={handleBloodChange} name="B" />
                              }
                              label="B"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox checked={AB} onChange={handleBloodChange} name="AB" />
                              }
                              label="AB"
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                      <FormHelperText error={error}>Select at least one blood type</FormHelperText>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Target Number of Donors"
                    name="targetDonors"
                    onChange={handleChange}
                    required
                    type="number"
                    value={values.targetDonors}
                    variant="outlined"
                    error={Boolean(errors.targetDonors)}
                    helperText={errors.targetDonors}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Organizer Name"
                    name="organizerName"
                    onChange={handleChange}
                    required
                    type="number"
                    value={values.organizerName}
                    variant="outlined"
                    error={Boolean(errors.organizerName)}
                    helperText={errors.organizerName}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Organizer Email"
                    name="organizerEmail"
                    onChange={handleChange}
                    required
                    type="number"
                    value={values.organizerEmail}
                    variant="outlined"
                    error={Boolean(errors.organizerEmail)}
                    helperText={errors.organizerEmail}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Organizer Phone Number"
                    name="organizerPhone"
                    onChange={handleChange}
                    required
                    type="number"
                    value={values.organizerEmail}
                    variant="outlined"
                    error={Boolean(errors.organizerPhone)}
                    helperText={errors.organizerPhone}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Typography>Message Body</Typography>

                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={7}
                      placeholder="Enter your additional information here..."
                      name="additional_notes"
                      onChange={handleChange}
                      value={values.additionalNotes}
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
                      error={Boolean(errors.additionalNotes)}
                      helperText={errors.additionalNotes}
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
