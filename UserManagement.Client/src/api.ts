import axios from 'axios';


const API_URL = 'http://localhost:5020/api/users'; // Updated to actual running port

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    userStatus: string;
    accountType: string;
    account: string;
    domain: string;
    upn: string;
    email: string;
    password: string;
    jobTitle: string;
    company: string;
    description?: string;
    managerName?: string;
    department: string;
}

export const getUsers = async () => {
    const response = await axios.get<User[]>(API_URL);
    return response.data;
};

export const getUser = async (id: number) => {
    const response = await axios.get<User>(`${API_URL}/${id}`);
    return response.data;
};

export const createUser = async (user: User) => {
    const response = await axios.post<User>(API_URL, user);
    return response.data;
};

export const updateUser = async (id: number, user: User) => {
    const response = await axios.put(`${API_URL}/${id}`, user);
    return response.data;
};

export const deleteUser = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
};
