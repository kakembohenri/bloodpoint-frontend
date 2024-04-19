import axios from 'axios';

// Define a function for fetching data from Laravel using Axios
export async function fetchForms() {
    // Make a GET request to the Laravel endpoint for fetching data from forms table
    const response = await axios.get(`http://127.0.0.1:8000/api/form`);

    // Get the forms data from the response object
    const forms = response.data;

    // Return the forms data
    return forms;
  }

// Function for fetching Donor data from the database
export async function fetchDonors() {
    const response = await axios.get('http://127.0.0.1:8000/api/donor');
    const donors = response.data;
    return donors;
}
