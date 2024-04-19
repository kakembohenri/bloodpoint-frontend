import { useState, useEffect } from "react";
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
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormControl,
  FormLabel,
} from "@mui/material";

// TODO: Add error handling to location fields & Checkbox
// TODO: Male donors form is not submitting (unprocessable content error) -> Check the API (Fields 19 & 20 Logic)

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

const steps = [
  "A - Personal Information",
  "B - Pre Donation Counseling",
  "C - Medical Examination",
  "D - Final Decision",
];

export const DonationDetails = ({ props, ugData }) => {
  const router = useRouter();
  const [values, setValues] = useState({
    // A - Personal
    donorID: "",
    fullName: "",
    dob: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    donor_type: "",
    donation_type: "",
    donation_date: "",
    bloodType: "",
    venue: "",
    district: "",
    subcounty: "",

    // B - Pre Donation
    feeling_well_1: "",
    donation_reasons: [],
    read_material_3: "",
    denied_donation_4: "",
    transfused_5: "",
    wound_6: "",
    extract_tooth_7: "",
    chronic_illness_8: "",
    taking_medication_9: "",
    medical_procedure_10: "",
    vaccinations_11: "",
    sti_12: "",
    liver_disease_13: "",
    hiv_test_14: "",
    hiv_positive_15: "",
    multiple_partners_16: "",
    sex_worker_17: "",
    hiv_sexual_involvement_18: "",
    menstruating_19: "",
    pregnant_20: "",

    // C - Medical
    pressure: "",
    level: "",
    weight: "",
    pulse: "",
    temperature: "",
    note: "",

    // D - Final
    acceptance: "",
    rejection_reason: "",
    bag_type: "",
    bag_status: "",
    bad_bag_reason: "",
    arm: "",
    reaction: "",
    reaction_description: "",
    bleeding_start: "",
    bleeding_end: "",
  });
  const [donors, setDonors] = useState([]);
  const [selectedDonorId, setSelectedDonorId] = useState(null);
  const [isDonorIdDisabled, setIsDonorIdDisabled] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubcounty, setSelectedSubcounty] = useState("");
  const [errors, setErrors] = useState({});
  const [donations, setDonations] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  // Function that handles the district Change
  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setSelectedSubcounty("");
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // Function that handles the subcounty Change
  const handleSubcountyChange = (event) => {
    setSelectedSubcounty(event.target.value);
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
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

  // Function that calculates the age of the donor based on the date of birth
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Object that contains the required fields for the form error messages
  const requiredFields = {
    // A - Personal
    donorID: "Donor ID",
    fullName: "Full Name",
    dob: "Date of Birth",
    age: "Age",
    gender: "Gender",
    email: "Email Address",
    phone: "Phone Number",
    address: "Address",
    donor_type: "Donor Type",
    donation_type: "Type of Donation",
    donation_date: "Date and Type of Donation",
    bloodType: "Blood Type",
    venue: "Venue",
    district: "District",
    subcounty: "Subcounty",

    // B - Pre Donation
    feeling_well_1: "Feeling Well",
    donation_reasons: "Select at least one reason",
    read_material_3: "Read Material",
    denied_donation_4: "Denied Donation",
    transfused_5: "Transfused",
    wound_6: "Wound",
    extract_tooth_7: "Extract Tooth",
    chronic_illness_8: "Chronic Illness",
    taking_medication_9: "Taking Medication",
    medical_procedure_10: "Medical Procedure",
    vaccinations_11: "Vaccinations",
    sti_12: "STI",
    liver_disease_13: "Liver Disease",
    hiv_test_14: "HIV Test",
    hiv_positive_15: "HIV Positive",
    multiple_partners_16: "Multiple Partners",
    sex_worker_17: "Sex Worker",
    hiv_sexual_involvement_18: "HIV Sexual Involvement",
    menstruating_19: "Menstruating",
    pregnant_20: "Pregnant",

    // C - Medical
    pressure: "Blood Pressure",
    level: "Hemoglobin Level",
    weight: "Weight",
    pulse: "Pulse",
    temperature: "Temperature",
    note: "Note",

    // D - Final
    acceptance: "Acceptance",
    rejection_reason: "Rejection Reason",
    bag_type: "Type of Bleeding Bag",
    bag_status: "Status of Bleeding Bag",
    bad_bag_reason: "Reason for Bad Bag",
    arm: "Arm",
    reaction: "Reaction",
    reaction_description: "Reaction Description",
    bleeding_start: "Bleeding Start Time",
    bleeding_end: "Bleeding End Time",
  };

  // Function that validates the required fields
  const validateFields = () => {
    const newErrors = {};
    Object.entries(requiredFields).forEach(([field, fieldName]) => {
      // Only check for rejection_reason if acceptance is "no"
      if (field === "rejection_reason" && values.acceptance === "yes") {
        return;
      }
      // Only check for bad_bag_reason if bag_status is "not okay"
      if (field === "bad_bag_reason" && values.bag_status !== "not okay") {
        return;
      }
      // Only check for reaction_description if reaction is "yes"
      if (field === "reaction_description" && values.reaction !== "yes") {
        return;
      }
      // Custom validation check for donation reasons
      if (values.donation_reasons.length === 0) {
        newErrors.donation_reasons = true;
      }
      // Only check for menstruating_19 if gender is "female"
      if (field === "menstruating_19" && values.gender !== "female") {
        return;
      }
      // Only check for pregnant_20 if gender is "female"
      if (field === "pregnant_20" && values.gender !== "female") {
        return;
      }
      if (!values[field]) {
        newErrors[field] = `${fieldName} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function that obtains the donors and donations from the database
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donor`);
        setDonors(response.data);
      } catch (error) {
        // handle error
      }
    };
    const fetchDonations = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donation`);
        setDonations(response.data);
      } catch (error) {
        // handle error
      }
    };
    fetchDonors();
    fetchDonations();
  }, []);

  // Function that fills the form with the selected donor's details
  const handleSelectChange = (event) => {
    setSelectedDonorId(event.target.value);
    const selectedDonor = donors.find((donor) => donor.donorID === event.target.value);
    if (selectedDonor) {
      setValues({
        ...values,
        donorID: selectedDonor.donorID,
        fullName: selectedDonor.fullName,
        dob: selectedDonor.dob,
        age: calculateAge(selectedDonor.dob),
        gender: selectedDonor.gender,
        email: selectedDonor.email,
        phone: selectedDonor.phone,
        address: selectedDonor.address,
        bloodType: selectedDonor.bloodType,
      });
      setIsDonorIdDisabled(true);
    }
  };

  // Function that handles the change of the form fields
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // Handle change for the "Why have you come to donate?" question (checkboxes)
  const handleChange2 = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      if (checked) {
        // Add the value to the donation_reasons array
        setValues((prevValues) => ({
          ...prevValues,
          donation_reasons: [...prevValues.donation_reasons, value],
        }));
      } else {
        // Remove the value from the donation_reasons array
        setValues((prevValues) => ({
          ...prevValues,
          donation_reasons: prevValues.donation_reasons.filter((reason) => reason !== value),
        }));
      }
    } else {
      setValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  // Function that handles the submission of the form
  const handleSubmit = (event) => {
    event.preventDefault();

    // if (!validateFields()) {
    //   return;
    // }
    // Set rejection_reason to null if acceptance is "yes"
    if (values.acceptance === "yes") {
      values.rejection_reason = null;
    }
    // Set bad_bag_reason to null if bag_status is "okay"
    if (values.bag_status === "okay") {
      values.bad_bag_reason = null;
    }
    // Set reaction_description to null if reaction is "no"
    if (values.reaction === "no") {
      values.reaction_description = null;
    }
    // Set menstruating_19 to null if gender is "male"
    if (values.gender === "male") {
      values.menstruating_19 = null;
    }
    // Set pregnant_20 to null if gender  is "male"
    if (values.gender === "male") {
      values.pregnant_20 = null;
    }
    console.log(values);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donation`, {
        // A-Personal
        donorID: values.donorID,
        fullName: values.fullName,
        dob: values.dob,
        age: values.age,
        gender: values.gender,
        email: values.email,
        phone: values.phone,
        address: values.address,
        donor_type: values.donor_type,
        donation_type: values.donation_type,
        donation_date: values.donation_date,
        bloodType: values.bloodType,
        venue: values.venue,
        district: values.district,
        subcounty: values.subcounty,
        // B-Pre Donation
        feeling_well_1: values.feeling_well_1,
        donation_reasons: JSON.stringify(values.donation_reasons),
        read_material_3: values.read_material_3,
        denied_donation_4: values.denied_donation_4,
        transfused_5: values.transfused_5,
        wound_6: values.wound_6,
        extract_tooth_7: values.extract_tooth_7,
        chronic_illness_8: values.chronic_illness_8,
        taking_medication_9: values.taking_medication_9,
        medical_procedure_10: values.medical_procedure_10,
        vaccinations_11: values.vaccinations_11,
        sti_12: values.sti_12,
        liver_disease_13: values.liver_disease_13,
        hiv_test_14: values.hiv_test_14,
        hiv_positive_15: values.hiv_positive_15,
        multiple_partners_16: values.multiple_partners_16,
        sex_worker_17: values.sex_worker_17,
        hiv_sexual_involvement_18: values.hiv_sexual_involvement_18,
        menstruating_19: values.menstruating_19,
        pregnant_20: values.pregnant_20,
        // C-Medical
        pressure: values.pressure,
        level: values.level,
        weight: values.weight,
        pulse: values.pulse,
        temperature: values.temperature,
        note: values.note,
        // D-Final
        acceptance: values.acceptance,
        rejection_reason: values.rejection_reason,
        bag_type: values.bag_type,
        bag_status: values.bag_status,
        bad_bag_reason: values.bad_bag_reason,
        arm: values.arm,
        reaction: values.reaction,
        reaction_description: values.reaction_description,
        bleeding_start: values.bleeding_start,
        bleeding_end: values.bleeding_end,
      })
      .then((response) => {
        axios
          .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bloodunit`, {
            donorID: values.donorID,
            fullName: values.fullName,
            bloodType: values.bloodType,
            district: values.district,
            subcounty: values.subcounty,
            note: values.note,
            phone: values.phone,
            email: values.email,
            donation_date: values.donation_date,
            time: values.time,
            venue: values.venue,
            donation_type: values.donation_type,
          })
          //handle success
          .then((response) => {
            console.log(response.data);
            router.push("/fetchDonations");
          })
          .catch((error) => {
            // router.push("404");
          });
      })
      // handle error
      .catch((error) => {
        console.log(error);
        // router.push('404');
      });
  };

  // Returns the number of donations the selected donor has made
  const donationCount = donations.filter((donation) => donation.donorID === values.donorID).length;

  // Returns the last donation the selected donor has made
  const lastDonation = donations
    .filter((donation) => donation.donorID === values.donorID)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  const lastDonationDateTime = lastDonation?.donation_date;

  // Returns whether the selected donor can donate or not
  const canDonate =
    !lastDonationDateTime ||
    (values.donation_type === "whole" &&
      new Date(lastDonationDateTime) < new Date(Date.now() - 56 * 24 * 60 * 60 * 1000)) ||
    (values.donation_type === "red" &&
      new Date(lastDonationDateTime) < new Date(Date.now() - 112 * 24 * 60 * 60 * 1000));

  // Functions for handling multi-step form
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <form autoComplete="off" noValidate {...props} onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title={`${steps[activeStep]} (Donation Form)`}
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
              {activeStep === 0 && (
                <>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      name="donorID"
                      onChange={handleSelectChange}
                      required
                      select
                      SelectProps={{ native: true }}
                      value={selectedDonorId}
                      variant="outlined"
                      error={Boolean(errors.donorID)}
                      helperText={
                        errors.dob ? "Donor ID Required" : "Please enter Donor ID to fill the form"
                      }
                    >
                      <option value="">Select Donor ID</option>
                      {donors.map((donor) => (
                        <option key={donor.donorID} value={donor.donorID}>
                          {donor.donorID}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      disabled={isDonorIdDisabled}
                      name="fullName"
                      onChange={handleChange}
                      required
                      value={values.fullName}
                      variant="outlined"
                      error={Boolean(errors.fullName)}
                      helperText={errors.dob ? "Full Name Required" : "Donor's Full Name"}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      disabled={isDonorIdDisabled}
                      name="dob"
                      onChange={handleChange}
                      required
                      value={values.dob}
                      variant="outlined"
                      type="date"
                      error={Boolean(errors.dob)}
                      helperText={errors.dob ? "Date of Birth Required" : "Donor's Date of Birth"}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      // label="Age"
                      disabled={isDonorIdDisabled}
                      fullWidth
                      name="age"
                      onChange={handleChange}
                      required
                      value={values.age}
                      variant="outlined"
                      type="number"
                      error={Boolean(errors.age)}
                      helperText={errors.dob ? "Age Required" : "Donor's Age"}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Gender"
                      disabled={isDonorIdDisabled}
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
                      disabled={isDonorIdDisabled}
                      name="email"
                      onChange={handleChange}
                      required
                      value={values.email}
                      variant="outlined"
                      error={Boolean(errors.email)}
                      helperText={errors.dob ? "Email Required" : "Contact Email"}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      disabled={isDonorIdDisabled}
                      name="phone"
                      onChange={handleChange}
                      type="number"
                      value={values.phone}
                      variant="outlined"
                      error={Boolean(errors.phone)}
                      helperText={errors.dob ? "Phone Number Required" : "Contact Phone Number"}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      disabled={isDonorIdDisabled}
                      name="address"
                      onChange={handleChange}
                      required
                      value={values.address}
                      variant="outlined"
                      error={Boolean(errors.address)}
                      helperText={errors.dob ? "Address Required" : "Contact Address"}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      Type of donor
                    </Typography>
                    <RadioGroup
                      name="donor_type"
                      value={values.donor_type}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.donor_type}
                    >
                      <FormControlLabel control={<Radio />} label="New" value="new" />
                      <FormControlLabel control={<Radio />} label="Repeat" value="repeat" />
                      <FormControlLabel control={<Radio />} label="Regular" value="regular" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      Type of donation
                    </Typography>
                    <RadioGroup
                      name="donation_type"
                      value={values.donation_type}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.donation_type}
                    >
                      <FormControlLabel control={<Radio />} label="Whole Blood" value="whole" />
                      <FormControlLabel control={<Radio />} label="Red Blood" value="red" />
                    </RadioGroup>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      name="donation_date"
                      onChange={handleChange}
                      type="datetime-local"
                      value={values.date_time}
                      variant="outlined"
                      error={Boolean(errors.date_time)}
                      helperText={
                        errors.dateTime
                          ? "Date and Time Required"
                          : "Enter Date and Time of Donation"
                      }
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      disabled={isDonorIdDisabled}
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
                      label="Donation Venue"
                      fullWidth
                      name="venue"
                      onChange={handleChange}
                      required
                      value={values.venue}
                      variant="outlined"
                      error={Boolean(errors.venue)}
                      helperText={errors.venue}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      helperText="Please specify your district"
                      name="district"
                      onChange={handleDistrictChange}
                      required
                      select
                      SelectProps={{ native: true }}
                      value={values.district}
                      variant="outlined"
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
                      helperText="Please specify your subcounty"
                      name="subcounty"
                      onChange={handleSubcountyChange}
                      required
                      select
                      SelectProps={{ native: true }}
                      value={values.selectedDonorSubcounty}
                      variant="outlined"
                    >
                      <option value="">Select a SubCounty</option>
                      {getSubcountyOptions()}
                    </TextField>
                  </Grid>

                  <Grid item md={6} xs={12}></Grid>

                  <Grid item md={6} xs={12}>
                    <Typography>Number of times donor has donated: {donationCount}</Typography>
                    <Typography>
                      Last donation date and time: {lastDonationDateTime || "N/A"}
                    </Typography>
                    {values.donation_type && (
                      <Typography style={{ color: canDonate ? "green" : "red" }}>
                        This donor {canDonate ? "can" : "cannot"} donate.
                      </Typography>
                    )}
                  </Grid>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      1. Are you Feeling Well Today?
                    </Typography>
                    <RadioGroup
                      name="feeling_well_1"
                      value={values.feeling_well_1}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.feeling_well_1 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography variant="subtitle1" style={{ marginLeft: "36px" }}>
                      2. Why have you come to donate?
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.donation_reasons.includes("save_life")}
                          onChange={handleChange2}
                          name="donation_reasons"
                          value="save_life"
                          inputProps={{ "aria-label": "controlled" }}
                          style={{ marginLeft: "36px" }}
                        />
                      }
                      label="To give blood to save life"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.donation_reasons.includes("test_hiv")}
                          onChange={handleChange2}
                          name="donation_reasons"
                          value="test_hiv"
                          inputProps={{ "aria-label": "controlled" }}
                          style={{ marginLeft: "36px" }}
                        />
                      }
                      label="To test for HIV"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.donation_reasons.includes("good_to_donate")}
                          onChange={handleChange2}
                          name="donation_reasons"
                          value="good_to_donate"
                          inputProps={{ "aria-label": "controlled" }}
                          style={{ marginLeft: "36px" }}
                        />
                      }
                      label="Heard that donating blood is good"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.donation_reasons.includes("other_reason")}
                          onChange={handleChange2}
                          name="donation_reasons"
                          value="other_reason"
                          inputProps={{ "aria-label": "controlled" }}
                          style={{ marginLeft: "36px" }}
                        />
                      }
                      label="Other"
                    />
                    {errors.donation_reasons && (
                      <Typography variant="subtitle2" color="error" style={{ marginLeft: "36px" }}>
                        Select at least one reason
                      </Typography>
                    )}
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      3. Have you read the education material today?
                    </Typography>
                    <RadioGroup
                      name="read_material_3"
                      value={values.read_material_3}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.read_material_3 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      4. Have you ever been denied chance to donate blood, if so why?
                    </Typography>
                    <RadioGroup
                      name="denied_donation_4"
                      value={values.denied_donation_4}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.denied_donation_4 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      5. Have you ever been transfused?
                    </Typography>
                    <RadioGroup
                      name="transfused_5"
                      value={values.transfused_5}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.transfused_5 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      6. Do you have a wound anywhere on your body?
                    </Typography>
                    <RadioGroup
                      name="wound_6"
                      value={values.wound_6}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.wound_6 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      7. Did you extract a tooth or teeth in the last one week?
                    </Typography>
                    <RadioGroup
                      name="extract_tooth_7"
                      value={values.extract_tooth_7}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.extract_tooth_7 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      8. Do you have a history of chronic illness like asthma, sickle cells, high
                      blood pressure, ulcers, diabetes or epilepsy?
                    </Typography>
                    <RadioGroup
                      name="chronic_illness_8"
                      value={values.chronic_illness_8}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.chronic_illness_8 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      9. Are you currently taking medication for any disease/infection and/or
                      aspirin in the last 72 hours?
                    </Typography>
                    <RadioGroup
                      name="taking_medication_9"
                      value={values.taking_medication_9}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.taking_medication_9 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      10. Have you had any medical diagnostic procedure in the past e.g. injection,
                      circumcision, body piercing not done in the hospital?
                    </Typography>
                    <RadioGroup
                      name="medical_procedure_10"
                      value={values.medical_procedure_10}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.medical_procedure_10 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      11. Have you recently had any vaccinations?
                    </Typography>
                    <RadioGroup
                      name="vaccinations_11"
                      value={values.vaccinations_11}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.vaccinations_11 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      12. Have you ever suffered from a sexually transmitted infection?
                    </Typography>
                    <RadioGroup
                      name="sti_12"
                      value={values.sti_12}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.sti_12 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      13. Have you ever had liver disease such as hepatitis and jaundice(yellowing
                      of eyes and skin)?
                    </Typography>
                    <RadioGroup
                      name="liver_disease_13"
                      value={values.liver_disease_13}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.liver_disease_13 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      14. Have you ever had an HIV test?
                    </Typography>
                    <RadioGroup
                      name="hiv_test_14"
                      value={values.hiv_test_14}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.hiv_test_14 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      15. Have you ever had a positive test for the HIV/AIDS virus?
                    </Typography>
                    <RadioGroup
                      name="hiv_positive_15"
                      value={values.hiv_positive_15}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.hiv_positive_15 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      16. Have you had more than one sexual partner in the last 3 months?
                    </Typography>
                    <RadioGroup
                      name="multiple_partners_16"
                      value={values.multiple_partners_16}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.multiple_partners_16 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      17. Have you had sex with a male, female sex worker or recently received
                      payment for sex?
                    </Typography>
                    <RadioGroup
                      name="sex_worker_17"
                      value={values.sex_worker_17}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.sex_worker_17 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      18. Have you had sexual involvement with anyone who has HIV/AIDS or has had a
                      positive test for HIV/AIDS?
                    </Typography>
                    <RadioGroup
                      name="hiv_sexual_involvement_18"
                      value={values.hiv_sexual_involvement_18}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.hiv_sexual_involvement_18 ? "Response Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  {values.gender === "female" && (
                    <Grid xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        style={{ marginLeft: "36px", marginTop: "18px" }}
                      >
                        19. Are you actively menstruating today or had heavy menstrual bleeding
                        during the last three days? (Question for females only)
                      </Typography>
                      <RadioGroup
                        name="menstruating_19"
                        value={values.menstruating_19}
                        onChange={handleChange}
                        style={{ marginLeft: "36px" }}
                        row
                        helperText={errors.menstruating_19 ? "Response Required" : ""}
                      >
                        <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                        <FormControlLabel control={<Radio />} label="No" value="no" />
                      </RadioGroup>
                    </Grid>
                  )}

                  {values.gender === "female" && (
                    <Grid xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        style={{ marginLeft: "36px", marginTop: "18px" }}
                      >
                        20. Are you pregnant or breast-feeding? (Question for females only)
                      </Typography>
                      <RadioGroup
                        name="pregnant_20"
                        value={values.pregnant_20}
                        onChange={handleChange}
                        style={{ marginLeft: "36px" }}
                        row
                        helperText={errors.pregnant_20 ? "Response Required" : ""}
                      >
                        <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                        <FormControlLabel control={<Radio />} label="No" value="no" />
                      </RadioGroup>
                    </Grid>
                  )}

                  <Grid xs={12} md={12} style={{ marginTop: "30px" }}>
                    <Typography variant="subtitle1" style={{ marginLeft: "36px" }}>
                      N.B. Donor shall explain the answer YES of any of the above questions.
                    </Typography>
                    <Typography variant="subtitle1" style={{ marginLeft: "36px" }}>
                      The donoor should understand that any incorrect answer to the questions above
                      may harm their health or that of the person who will receive their blood.
                    </Typography>
                    <Typography variant="subtitle1" style={{ marginLeft: "36px" }}>
                      They should have answered honestly/truthfully and consent to their blood being
                      drawn, tested, and used for transfusion, research and other purposes. I
                      understand that I will be notified if any important abnormality is found.
                    </Typography>
                  </Grid>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Blood Pressure"
                      name="pressure"
                      onChange={handleChange}
                      required
                      value={values.pressure}
                      variant="outlined"
                      error={Boolean(errors.pressure)}
                      helperText={
                        errors.dob
                          ? "Blood Pressure Required (Normal BP: 90/60mmHg and 120/80mmHg)"
                          : "Blood Pressure in mmHg (Normal BP: 90/60mmHg and 120/80mmHg)"
                      }
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Hemoglobin Level"
                      fullWidth
                      name="level"
                      onChange={handleChange}
                      required
                      value={values.level}
                      variant="outlined"
                      error={Boolean(errors.level)}
                      helperText={
                        errors.level
                          ? "Hemoglobin Level Required (Normal Level: 13.5-17.5g/dL) [Men: 13.2 to 16.6], [Women: 11.6 to 15]."
                          : "Hemoglobin Level in g/dL (Normal Level: 13.5-17.5g/dL) [Men: 13.2 to 16.6], [Women: 11.6 to 15]."
                      }
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Weight"
                      fullWidth
                      name="weight"
                      onChange={handleChange}
                      required
                      value={values.weight}
                      variant="outlined"
                      type="number"
                      error={Boolean(errors.weight)}
                      helperText={errors.weight ? "Weight Required" : "Enter Weight in Kg"}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Pulse"
                      fullWidth
                      name="pulse"
                      onChange={handleChange}
                      required
                      value={values.pulse}
                      variant="outlined"
                      type="number"
                      error={Boolean(errors.pulse)}
                      helperText={errors.pulse ? "Pulse Required" : "Enter Pulse in B/min"}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Temperature"
                      fullWidth
                      name="temperature"
                      onChange={handleChange}
                      required
                      value={values.temperature}
                      variant="outlined"
                      type="number"
                      error={Boolean(errors.temperature)}
                      helperText={
                        errors.temperature ? "Temperature Required" : "Enter Temperature in °C"
                      }
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Donation Notes"
                      name="note"
                      onChange={handleChange}
                      value={values.note}
                      variant="outlined"
                      error={Boolean(errors.note)}
                      helperText={
                        errors.note
                          ? "General Appearance Notes Required"
                          : "This includes information about general appearance and conduct of donor"
                      }
                      multiline
                      rows={2}
                    />
                  </Grid>
                </>
              )}
              {activeStep === 3 && (
                <>
                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      Donor Acceptance
                    </Typography>
                    <RadioGroup
                      name="acceptance"
                      value={values.acceptance}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.acceptance ? "Donor Acceptance Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  {values.acceptance === "no" && (
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Reason for Rejection"
                        name="rejection_reason"
                        onChange={handleChange}
                        value={values.rejection_reason}
                        variant="outlined"
                        error={Boolean(errors.rejection_reason)}
                        helperText={
                          errors.note
                            ? "Reason for Rejection Required"
                            : "Give a reason for rejecting the donor"
                        }
                        multiline
                        rows={2}
                      />
                    </Grid>
                  )}

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      Type of Bleeding Bag
                    </Typography>
                    <RadioGroup
                      name="bag_type"
                      value={values.bag_type}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={
                        errors.bag_type ? "Type of Bleeding Bag Required" : "Type of Bleeding Bag"
                      }
                    >
                      <FormControlLabel control={<Radio />} label="Single" value="single" />
                      <FormControlLabel control={<Radio />} label="Double" value="double" />
                      <FormControlLabel control={<Radio />} label="Tripple" value="tripple" />
                      <FormControlLabel control={<Radio />} label="Quadruple" value="quadruple" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      Status of Bleeding Bag
                    </Typography>
                    <RadioGroup
                      name="bag_status"
                      value={values.bag_status}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.bag_status ? "Blood Bag Status Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Okay" value="okay" />
                      <FormControlLabel control={<Radio />} label="Not Okay" value="not okay" />
                    </RadioGroup>
                  </Grid>

                  {values.bag_status === "not okay" && (
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Reason for Bad Status of Bleeding Bag"
                        name="bad_bag_reason"
                        onChange={handleChange}
                        value={values.bad_bag_reason}
                        variant="outlined"
                        error={Boolean(errors.bad_bag_reason)}
                        helperText={
                          errors.bad_bag_reason
                            ? "Reason for Rejection Required"
                            : "Give a reason for rejecting the Bleeding Bag"
                        }
                        multiline
                        rows={2}
                      />
                    </Grid>
                  )}

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      Arm Bled
                    </Typography>
                    <RadioGroup
                      name="arm"
                      value={values.arm}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.arm ? "Arm Bled Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Left" value="left" />
                      <FormControlLabel control={<Radio />} label="Right" value="right" />
                    </RadioGroup>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ marginLeft: "36px", marginTop: "18px" }}
                    >
                      Any Adverse Reaction?
                    </Typography>
                    <RadioGroup
                      name="reaction"
                      value={values.reaction}
                      onChange={handleChange}
                      style={{ marginLeft: "36px" }}
                      row
                      helperText={errors.reaction ? "Adverse Reaction Required" : ""}
                    >
                      <FormControlLabel control={<Radio />} label="Yes" value="yes" />
                      <FormControlLabel control={<Radio />} label="No" value="no" />
                    </RadioGroup>
                  </Grid>

                  {values.reaction === "yes" && (
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Description of Adverse Reaction"
                        name="reaction_description"
                        onChange={handleChange}
                        value={values.reaction_description}
                        variant="outlined"
                        error={Boolean(errors.reaction_description)}
                        helperText={
                          errors.bad_bag_reason
                            ? "Reason for Rejection Required"
                            : "Give a reason for rejecting the donor"
                        }
                        multiline
                        rows={2}
                      />
                    </Grid>
                  )}

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      name="bleeding_start"
                      onChange={handleChange}
                      type="time"
                      value={values.bleeding_start}
                      variant="outlined"
                      error={Boolean(errors.bleeding_start)}
                      helperText={
                        errors.bleeding_start
                          ? "Bleeding Start Time Required"
                          : "Enter Start Time of Bleeding"
                      }
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      name="bleeding_end"
                      onChange={handleChange}
                      type="time"
                      value={values.bleeding_end}
                      variant="outlined"
                      error={Boolean(errors.bleeding_end)}
                      helperText={
                        errors.bleeding_end
                          ? "Bleeding End Time Required"
                          : "Enter End Time of Bleeding"
                      }
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button
            sx={{ mr: 2, bgcolor: "grey", color: "black", outline: "0.5px solid grey" }}
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              sx={{
                mr: 2,
                bgcolor: "red",
                color: "white",
              }}
              variant="contained"
              type="submit"
              // disabled={!canDonate}
            >
              Submit
            </Button>
          ) : (
            <Button
              sx={{ mr: 2, bgcolor: "red", color: "white" }}
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}

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
