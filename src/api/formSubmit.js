import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast notifications from your library

// export const BASE_URL = 'http://192.168.1.15:8000';
export const BASE_URL = 'http://192.168.1.41:8080';

// export const BASE_URL = 'http://117.232.109.229:8080';


const submitForm = async (save_webRegistration) => {
  try {
    const endpoint = '/life/registration/ApiWebRegistration/?';
    const apiUrl = `${BASE_URL}${endpoint}`;
    const response = await axios.post(apiUrl, save_webRegistration, {
      timeout:100000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("save_webRegistration",response);
    console.log(response.data,"data");
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle server error with status code
      toast.error('Server Error. Please try again later.');
    } else if (error.request) {
      // Handle no response from the server
      toast.error('No response from server. Please check your network connection.');
    } else {
      // Handle other errors or exceptions
      toast.error('Internal server error occurred. Please try again.');
    }
  }
};

export default submitForm;
