import axios from 'axios';

export const BASE_URL = 'http://localhost:8080';

export const signIn = async (value) => {
    const { data } = await axios.post(`${BASE_URL}/api/users/sign-in`, value);
  
    return data;
}

export const signUp = async (value) => {
    const { data } = await axios.post(`${BASE_URL}/api/users/sign-up`, value);
    return data;
}