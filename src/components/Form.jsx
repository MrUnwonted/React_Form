import { useState, useEffect } from 'react';
import submitForm, { BASE_URL } from '../api/formSubmit'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FormStyles.css'
import Loading from './Loading';
import RegistrationModal from './RegistrationModal';

// const BASE_URL = 'http://192.168.1.41:8000';

// Define the initial state outside of the component
const initialState = {
    prefix: '',
    firstname: '',
    lastname: '',
    dateofbirth: '',
    age: '',
    gender: '',
    phone_number: '',
    marrital_status: '',
    address: '',
    pincode: '',
    locality: '',
    country: '',
    state: '',
    district: '',
    email: '',
    isED: true,
    registrationType: '1',
    ageunitvalue: '',
    emergency_person: '',
    emergency_number: '',
    houseno: '',
    // Add other form fields here...
};

function Form() {
    const [isLoading, setIsLoading] = useState(true);
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);

    const [save_webRegistration, setsave_webRegistration] = useState({ ...initialState });

    const [prefixOptions, setPrefixOptions] = useState([]); // State to hold prefix options
    const [maritialOptions, setMaritialOptions] = useState([]); // State to hold district options
    const [districtOptions, setDistrictOptions] = useState([]); // State to hold district options
    const [stateOptions, setStateOptions] = useState([]); // State to hold state options
    const [countryOptions, setCountryOptions] = useState([]); // State to hold country options
    const [genderOptions, setgenderOptions] = useState([]);

    const [selectedPrefix, setSelectedPrefix] = useState(''); // State to hold the selected prefix
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedMaritial, setSelectedMaritial] = useState(''); // State to hold the selected district
    const [selectedDistrict, setSelectedDistrict] = useState(''); // State to hold the selected district
    const [selectedState, setSelectedState] = useState(''); // State to hold the selected state
    const [selectedCountry, setSelectedCountry] = useState(''); // State to hold the selected country
    const [ageUnit, setAgeUnit] = useState(1);
    const [errors, setErrors] = useState({});
    const [age, setAge] = useState(save_webRegistration.age);

    useEffect(() => {
        // Simulate loading for demonstration purposes (replace with your data fetching logic)
        const timeout = setTimeout(() => {
            setIsLoading(false); // Set isLoading to false after some time (simulating data fetching)
        }, 1000); // Simulate loading for 2 seconds

        return () => clearTimeout(timeout);
    }, []); // Run this effect only once on component mount

    // For Clearing the form
    const resetForm = () => {
        setsave_webRegistration({ ...initialState });
    };


    useEffect(() => {
        // Fetch all prefix data from the backend upon component mount
        const fetchData = async () => {
            try {

                const endpoint = '/life/registration/ApiRegistrationdefaultvalues/?';

                const apiUrl = `${BASE_URL}${endpoint}`;

                const response = await axios.get(apiUrl);

                if (response.data) {
                    // Assuming the response contains values in separate arrays
                    setPrefixOptions(response.data.prefix_values || []);
                    setMaritialOptions(response.data.marital_values || []);
                    setCountryOptions(response.data.country_values || []);
                    setStateOptions(response.data.state_values || []);
                    setDistrictOptions(response.data.district_values || []);
                    setgenderOptions(response.data.gender_values || []);
                } else {
                    console.error('Invalid data received:', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // // Function to check valid date format (yyyy-mm-dd)
    const isValidDateFormat = (dateString) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    const getAge = (dateString) => {
        var date = new Date(dateString);
        var today = new Date();
        var age = today.getFullYear() - date.getFullYear();
        var month = today.getMonth() - date.getMonth();
        var day = today.getDate() - date.getDate();
        if (month < 0) {
            age--;
            month += 12;
        }
        if (day < 0) {
            month--;
            day += 31;
        }
        //return age + " years " + month + " months " + day + " days";
        return { year: age, month: month, day: day };
    }

    const changeAgeUnit = (ageData) => {
        let ageValue = 0;
        if (ageData.year != 0) {
            setAgeUnit(1);
            ageValue = ageData.year;
        } else if (ageData.year === 0 && ageData.month != 0) {
            setAgeUnit(2);
            ageValue = ageData.month;
        } else if (ageData.year === 0 && ageData.month === 0 && ageData.day != 0) {
            setAgeUnit(3);
            ageValue = ageData.day;
        }

        return ageValue
    }

    const formatDate = (dob) => {

        var formatedDob = (dob.getDate() < 10 ? '0' +
            dob.getDate() : dob.getDate()) + "-" + (parseInt(dob.getMonth()) + 1)
            + "-" + dob.getFullYear();



        return formatedDob;
    }

    const handleAge = (e) => {
        const { value } = e.target.value;

        // const ageValue = changeAgeUnit(ageData);

        setsave_webRegistration({ ...save_webRegistration, ageunitvalue: ageUnit, age: value })
        setAge(value)
    }

    const handleAgeUnit = (e) => {
        const value = parseInt(e.target.value);
        setsave_webRegistration({ ...save_webRegistration, ageunitvalue: value })
    }

    const handleDateOfBirthChange = (e) => {
        const value = e.target.value;

        // Validate date format before further processing
        const isValidDate = isValidDateFormat(value); // Define isValidDateFormat function

        if (!isValidDate || value > (new Date())) {
            // Handle invalid date format or date greater than the current date
            toast.warning('Invalid date or year')
            return;
        }

        const dob = new Date(value);
        const ageData = getAge(value);

        // console.log(save_webRegistration.age);
        let formatedDob = formatDate(dob);
        const ageValue = changeAgeUnit(ageData)
        setsave_webRegistration({
            ...save_webRegistration, dateofbirth: formatedDob, ageunitvalue: ageUnit, age: ageValue // Store the Date of Birth
        });
        setAge(ageValue);

    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        let errorMessage = ''; // Initialize error message

        // Validate  number length
        if ((id === 'firstname' || id === 'lastname') && value.trim().length === 0) {
            errorMessage = id === 'firstname' ? 'First Name cannot be empty' : 'Last Name cannot be empty';
            toast.warn(id === 'firstname' ? 'First Name cannot be empty' : 'Last Name cannot be empty');
        } else if (id === 'phone_number' && (value.length !== 10 || !/^\d{10}$/.test(value))) {
            errorMessage = 'Phone number must be 10 digits'; // Set error message for phone number
        } else if (id === 'pincode' && (value.length !== 6 || !/^\d{6}$/.test(value))) {
            errorMessage = 'Pincode must be 6 digits'; // Set error message for phone number
        } else if (id === 'houseno' && (value.trim().length === 0)) {
            errorMessage = 'House No cannot be empty';
        }
        // Restrict input to only numeric characters
        if (id === 'phone_number' && !/^\d*$/.test(value)) {
            console.log('Invalid input: must contain only numeric characters');
            return false;
        } else if (id === 'pincode' && !/^\d*$/.test(value)) {
            console.log('Invalid input: must contain only numeric characters');
            return false;
        }

        // Update the state for errors
        setErrors({ ...errors, [id]: errorMessage });

        if (id === 'prefix') {
            setSelectedPrefix(value);
            setsave_webRegistration({ ...save_webRegistration, prefix: value });
        } else if (id === 'marrital_status') {
            setSelectedMaritial(value);
            setsave_webRegistration({ ...save_webRegistration, marrital_status: value });
        } else if (id === 'country') {
            setSelectedCountry(value);
            setsave_webRegistration({ ...save_webRegistration, country: value });
        } else if (id === 'district') {
            setSelectedDistrict(value);
            setsave_webRegistration({ ...save_webRegistration, district: value });
        } else if (id === 'state') {
            setSelectedState(value);
            setsave_webRegistration({ ...save_webRegistration, state: value });
        } else if (id === 'gender') {
            setSelectedGender(value);
            console.log(selectedGender);
            setsave_webRegistration({ ...save_webRegistration, gender: value });
        } //else if (id === 'dateofbirth') {

        //     handleDateOfBirthChange()
        // }

        // Separate logic for handling the phone number field
        if (id === 'phone_number') {
            // If the length is greater than 2 (considering '91'), remove the '91'
            const phoneNumber = value.length > 2 && value.startsWith('91') ? value.slice(2) : value;
            setsave_webRegistration({ ...save_webRegistration, [id]: phoneNumber });
        } else {
            // For other fields, update the state normally
            setsave_webRegistration({ ...save_webRegistration, [id]: value });
        }

        // setsave_webRegistration({ ...save_webRegistration, age: age }); 
        return true; // Return true if validation passes
    };

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const isFormFilled = () => {
        return (!!age);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setsave_webRegistration({ ...save_webRegistration, age: age });
        const { firstname, lastname, address, locality, email } = save_webRegistration;

        if (!firstname.trim()) {
            setErrors({ ...errors, firstname: 'First Name cannot be empty' });
            toast.warn('First Name cannot be empty');
            setIsLoading(false);
            return;
        }
        if (!lastname.trim()) {
            setErrors({ ...errors, lastname: 'Last Name cannot be empty' });
            toast.warn('Last Name cannot be empty');
            setIsLoading(false);
            return;
        }
        if (!address.trim()) {
            setErrors({ ...errors, address: 'Address cannot be empty' });
            toast.warn('Address cannot be empty');
            setIsLoading(false);
            return;
        }
        if (!locality.trim()) {
            setErrors({ ...errors, locality: 'Street cannot be empty' });
            toast.warn('Street cannot be empty');
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setErrors({ ...errors, email: 'Please enter a valid email address' });
            toast.warn('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        if (isFormFilled()) {

            try {


                setsave_webRegistration({ ...save_webRegistration, age: age });

                // Transform your existing 'save_webRegistration' object
                const modifiedData = {
                    save_webRegistration: [save_webRegistration],
                };

                // Call the function responsible for submitting data to the backend
                const response = await submitForm(modifiedData);
                if (response) {
                    // Handle successful form submission
                    console.log('Form submitted successfully!', response);
                    const queueNo = response.regno;
                    // Set the registration number to state
                    setRegistrationNumber(queueNo);
                    // Show the RegistrationModal on successful form submission
                    setShowRegistrationModal(true);
                    // Show a success toast message
                    toast.success('Form submitted successfully!');
                    resetForm();
                } else {
                    console.log('Form not submitted!!!!');
                }


            } catch (error) {
                console.error('Error submitting form:', error.message);
                // Show an error toast message
                toast.error('Error submitting form. Please try again.');
            }
        } else {
            // Display error or prevent form submission
            toast.error('Missing Date of Birth or Age');
        }

        setIsLoading(false);
    };

    // Close modal function for RegistrationModal
    const closeRegistrationModal = () => {
        window.location.reload();
    };
    // function _(id){
    //     return document.getElementById(id);
    // }
    return (
        <>
            {isLoading ? (
                <Loading /> // Show loading component while isLoading is true
            ) : (
                <div className=" col-sm-4 col-lg-12">
                    <div className=" p-4" style={{ maxWidth: '600px', margin: 'auto', background: '#fff' }}>
                        <header className="mb-4 text-center">
                            {/* <h2 style={{ color: '#333' }}>Medical Trust Booking</h2> */}
                            <img src="/arjun.jpg" alt="Medical Trust Booking" style={{ maxWidth: '100%', height: 'auto' }} />

                            <span style={{ fontSize: '12px', color: '#888' }}>
                                <span>NB: </span>
                                The given information will be kept for
                                medical purposes. Kindly provide accurate information.
                            </span>

                            <p > <span className="text-danger">*</span> Mandatory Fields </p>

                        </header>


                        <section>
                            <form onSubmit={handleSubmit}>

                                {/* Prefix */}
                                <div className="row mb-3">
                                    <label htmlFor="prefix" className="col-sm-2 form-label label-style">
                                        <span className="text-danger">*</span> <b> Prefix</b>
                                    </label>
                                    <div className="mb-3">
                                        <select
                                            className="form-select"
                                            aria-label="Default select example"
                                            id="prefix"
                                            value={selectedPrefix}
                                            onChange={handleChange} // Modify this line
                                            required
                                        >
                                            <option value="">Select Prefix</option>
                                            {prefixOptions.map((prefix) => (
                                                <option key={prefix.id} value={prefix.id}>
                                                    {prefix.prefix}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                </div>
                                {/* End of Prefix */}

                                {/* Validayions */}

                                <div className=" mb-3">
                                    <label htmlFor="firstname" className="col-sm-3 form-label label-style">
                                        <span className="text-danger">*</span> <b> First Name</b>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstname"
                                        placeholder="Enter your first name here"
                                        value={save_webRegistration.firstname}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.firstname && <div className="text-danger">{errors.firstname}</div>}
                                </div>

                                <div className=" mb-3">
                                    <label htmlFor="lastname" className="col-sm-3 form-label label-style">
                                        <span className="text-danger">*</span> <b>Last Name</b>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastname"
                                        placeholder="Enter your last name here"
                                        value={save_webRegistration.lastname}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.lastname && <div className="text-danger">{errors.lastname}</div>}
                                </div>


                                {/* Age */}
                                <div className="mb-3" style={{ display: 'flex' }}>
                                    {/* ... existing code for Date of Birth and Age inputs */}
                                    <div style={{ width: 'calc(100% - 200px)' }}>
                                        <label htmlFor="dateofbirth" className="form-label label-style">
                                            <span className="text-danger">*</span> <b>Date of Birth</b>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.dateofbirth ? 'is-invalid' : ''}`}
                                            id="dateofbirth"
                                            value={save_webRegistration.formatedDob}
                                            onChange={handleDateOfBirthChange}
                                            // max={new Date()}
                                            max={new Date().toISOString().split('T')[0]}
                                        />
                                        {errors.dateofbirth && <div className="text-danger">{errors.dateofbirth}</div>}
                                    </div>
                                    <div style={{ width: '200px', padding: '0 0 0 5px' }}>
                                        <label htmlFor="age" className="form-label"><b>Age </b></label>
                                        <div style={{ width: '200px', display: 'flex' }}>
                                            <input style={{ width: '80px' }}
                                                type="number"
                                                className={"form-control"}
                                                id="age"
                                                value={age}
                                                // onChange={(e) => setAge(e.target.value)}
                                                onChange={handleAge}
                                                min={1}
                                                max={150}
                                                required
                                            />
                                            <select style={{ width: '180px', margin: '0 0 0 5px' }}
                                                value={ageUnit} className='form-select'
                                                // onChange={(e) => setAgeUnit(parseInt(e.target.value))}
                                                onChange={handleAgeUnit}
                                            >
                                                <option value={1} label='Years' />
                                                <option value={2} label='Months' />
                                                <option value={3} label='Days' />

                                            </select>
                                        </div>
                                        {errors.age && <div className="text-danger">{errors.age}</div>}
                                    </div>
                                </div>

                                <fieldset className="row mb-3" required>
                                    <label htmlFor="gender" className="form-label label-style">
                                        <span className="text-danger">*</span> <b>Gender</b>
                                    </label>
                                    <div className="col-sm-2" style={{ display: 'flex' }}>
                                        {genderOptions.map((gender) => (
                                            <div className="form-check" key={gender.id} style={{ margin: '0 0 0 10px' }}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="gender"
                                                    id={gender.id}
                                                    value={gender.id} // Assigning gender.value to the input value
                                                    checked={save_webRegistration.gender === gender.id} // Adding checked attribute based on selectedGender
                                                    onClick={() => setsave_webRegistration({ ...save_webRegistration, gender: gender.id })}
                                                    required
                                                />
                                                <label className="form-check-label" htmlFor={gender.id} onClick={() => setsave_webRegistration({ ...save_webRegistration, gender: gender.id })}>
                                                    {gender.value}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.gender && <div className="col-sm-10 offset-sm-2 text-danger">{errors.gender}</div>}
                                </fieldset>


                                <div className="mb-3">
                                    <label htmlFor="phone_number" className="form-label label-style" >
                                        <span className="text-danger">*</span>
                                        <b> Phone Number</b></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone_number"
                                        placeholder="Enter your phone number here"
                                        value={save_webRegistration.phone_number}
                                        onChange={handleChange}
                                        maxLength={10}
                                        minLength={10}
                                        required
                                    />
                                    {errors.phone_number && <div className="text-danger">{errors.phone_number}</div>}
                                </div>

                                {/* End of Validayions */}


                                <div className=" mb-3">
                                    <label htmlFor="email" className="col-sm-2 form-label label-style">
                                        <span className="text-danger">*</span>
                                        <b>E-mail</b></label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email here"
                                        value={save_webRegistration.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>



                                {/* Maritial Status */}
                                <div className="row mb-3">
                                    <label htmlFor="marrital_status" className="col-sm-3 col-lg-3 form-label">
                                        <b> Marital Status</b>
                                    </label>
                                    <div>
                                        <select
                                            className="form-select"
                                            aria-label="Default select example"
                                            id="marrital_status"
                                            value={selectedMaritial}
                                            onChange={handleChange} // Modify this line
                                        >
                                            <option value="">Marital Status</option>
                                            {maritialOptions.map((maritial) => (
                                                <option key={maritial.id} value={maritial.id}>
                                                    {maritial.value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {/* End of Maritial Status */}

                                {/* Address and other */}

                                <div className=" mb-3">
                                    <label htmlFor="address" className="col-sm-3 form-label label-style">
                                        <span className="text-danger">*</span>
                                        <b> House No</b></label>
                                    <input
                                        type='text'
                                        className="form-control"
                                        id="address"
                                        placeholder="Enter your house number here"
                                        value={save_webRegistration.address}
                                        // onChange={handleChange}
                                        onChange={(e) => setsave_webRegistration({ ...save_webRegistration, address: e.target.value })}
                                        required
                                    />
                                    {errors.address && <div className="text-danger">{errors.address}</div>}
                                </div>

                                <div className=" mb-3">
                                    <label htmlFor="locality" className="col-sm-2 form-label label-style">
                                        <span className="text-danger">*</span>
                                        <b>Street</b></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="locality"
                                        placeholder="Enter your street here"
                                        value={save_webRegistration.locality}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.locality && <div className="text-danger">{errors.locality}</div>}
                                </div>

                                {/* District Dropdown */}
                                <div className="row mb-3">
                                    <label htmlFor="district" className="col-sm-2 form-label label-style">
                                        <span className="text-danger">*</span> <b>District</b>
                                    </label>
                                    <div className=" mb-3">
                                        <select
                                            className="form-select"
                                            aria-label="Default select example"
                                            id="district"
                                            value={selectedDistrict}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select District</option>
                                            {districtOptions.map((district) => (
                                                <option key={district.district_id} value={district.district_id}>
                                                    {district.District_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>


                                {/* State Dropdown */}
                                <div className="row mb-3">
                                    <label htmlFor="state" className="col-sm-2 form-label label-style">
                                        <span className="text-danger">*</span> <b>State</b>
                                    </label>
                                    <div className=" mb-3">
                                        <select
                                            className="form-select"
                                            aria-label="Default select example"
                                            id="state"
                                            value={selectedState}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {stateOptions.map((state) => (
                                                <option key={state.state_id} value={state.state_id}>
                                                    {state.state_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* End of Address and other */}

                                {/* Country,State,District */}
                                <div className="row mb-3">
                                    <label htmlFor="country" className="col-sm-2 form-label label-style">
                                        <span className="text-danger">*</span> <b>Country</b>
                                    </label>
                                    <div className=" mb-3">
                                        <select
                                            className="form-select"
                                            aria-label="Default select example"
                                            id="country"
                                            value={selectedCountry}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Country</option>
                                            {countryOptions.map((country) => (
                                                <option key={country.id} value={country.id}>
                                                    {country.nationality}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>


                                <div className=" mb-3">
                                    <label htmlFor="pincode" className="col-sm-2 form-label label-style">
                                        <b>Pincode</b></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="pincode"
                                        placeholder="Enter pincode"
                                        value={save_webRegistration.pincode}
                                        onChange={handleChange}
                                        maxLength={6}
                                        minLength={6}
                                        required
                                    />
                                    {errors.pincode && <div className="text-danger">{errors.pincode}</div>}
                                </div>

                                {/* End of Country,State,District */}

                                {/* <button type="submit" className="btn btn-primary mt-3">Submit</button> */}
                                <button type="submit" className="btn btn-primary mt-3"
                                // disabled={!isFormFilled()}
                                // onChange={saveChanges()}
                                >
                                    Submit
                                </button>

                            </form>
                            {/* Registration modal */}
                            <RegistrationModal
                                openModal={showRegistrationModal}
                                regNo={registrationNumber}
                                closeModal={closeRegistrationModal} />
                            <ToastContainer position="top-right" autoClose={6000} hideProgressBar />
                        </section>


                        <footer>
                            <div>
                                <br />
                                <p>All rights reserved @2023, Camerinfolks Pvt Ltd</p>
                            </div>
                        </footer>

                    </div>
                </div>
            )}
        </>
    );
}

export default Form