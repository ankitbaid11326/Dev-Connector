import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Login - Ger User Token
export const loginUser = userData => dispatch => {
    axios
        .post('/api/users/login', userData)
        .then(res => {
            // Save to local storage
            const {token} = res.data;
            // Set token to localStorage
            localStorage.setItem('jwtToken', token);
            // Set token to auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set Current User
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Set loggedin user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// Log out User
export const logoutUser = () => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove Auth header for future requests
    setAuthToken(false);
    // Set Current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};
