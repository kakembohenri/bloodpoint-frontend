import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Select from "react-select";
import { Grid, TextField, FormControl, InputLabel } from "@mui/material";

const selectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "56px",
  }),
};

export const CommunicationDetails = (props) => {
  const router = useRouter();
  const [values, setValues] = useState({
    title: "",
    message_body: "",
    recipient_group: [],
    sendTime: "",
  });
  const [errors, setErrors] = useState({});

  const group = [
    {
      value: "all",
      label: "Select All",
    },
    {
      value: "by blood group",
      label: "By Blood Group",
    },
    {
      value: "by location",
      label: "By Location",
    },
  ];

  const handleChange = (name) => (value) => {
    if (value.some((option) => option.value === "all")) {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: group.slice(1),
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  // Error messages for required fields
  const requiredFields = {
    title: "Message Title",
    message_body: "Message Body",
    recipient_group: "Recipient Group",
    sendTime: "Send Time",
  };

  const validateFields = () => {
    const newErrors = {};
    Object.entries(requiredFields).forEach(([field, fieldName]) => {
      if (!values[field] || (Array.isArray(values[field]) && values[field].length === 0)) {
        newErrors[field] = `${fieldName} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submission logic
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateFields()) {
      return;
    }
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/communication`, {
        title: values.title,
        message_body: values.message_body,
        recipient_group: values.recipient_group.map((option) => option.value).join(", "),
        sendTime: values.sendTime,
      })
      .then((response) => {
        // handle success
        console.log(response.data);
        router.push("/fetchCommunication");
      })
      .catch((error) => {
        // handle error
        console.log(error);
        // router.push('/404');
      });
  };

  return (
    <form autoComplete="off" noValidate {...props} onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            label="Message Title"
            name="title"
            onChange={(event) => handleChange(event.target.name)(event.target.value)}
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
            label="Message Body"
            name="message_body"
            onChange={(event) => handleChange(event.target.name)(event.target.value)}
            required
            value={values.message_body}
            variant="outlined"
            error={Boolean(errors.message_body)}
            helperText={errors.message_body}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="recipient-group-select"></InputLabel>
            <Select
              id="recipient-group-select"
              isMulti
              isSearchable
              name="recipient_group"
              options={group}
              onChange={handleChange("recipient_group")}
              value={values.recipient_group}
              placeholder="Select Group"
              styles={selectStyles}
            />
          </FormControl>
          {errors.recipient_group && (
            <div style={{ color: "red", marginTop: "8px" }}>{errors.recipient_group}</div>
          )}
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            label="Send Time"
            name="sendTime"
            onChange={(event) => handleChange(event.target.name)(event.target.value)}
            type="datetime-local"
            required
            value={values.sendTime}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            error={Boolean(errors.sendTime)}
            helperText={errors.sendTime}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default CommunicationDetails;
