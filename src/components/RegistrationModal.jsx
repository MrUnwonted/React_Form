
import PropTypes from 'prop-types';
import './Loading.css'; // Import the CSS file for loading styles
const RegistrationModal = ({openModal,regNo,closeModal}) => {
    return (
        <div className='modal-panel' style={{display: (openModal ? 'flex' : 'none')}}>
            <div className='modal-panel-content'>
                <h2>Preregistration Successful!</h2>
                <p>Your queue number is <b> {regNo}</b></p>
                <button onClick={closeModal}>OK</button>
            </div>
        </div>
    );
};

// PropTypes validation
RegistrationModal.propTypes = {
    openModal: PropTypes.bool.isRequired,
    regNo: PropTypes.string.isRequired, // Change the type to string
    closeModal: PropTypes.func.isRequired, // Change the type to function
    // Other props
};

export default RegistrationModal;
