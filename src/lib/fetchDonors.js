import axios from 'axios';

// Function for fetching Donor data from the database
export default async function fetchDonors() {
    const response = await axios.get('http://127.0.0.1:8000/api/donor', {withCredentials: true});
    const donors = response.data;
    return donors;
}
