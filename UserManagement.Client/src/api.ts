import axios from 'axios';


const API_BASE_URL = 'http://localhost:5020/api';
const USERS_API_URL = `${API_BASE_URL}/Users`;
const GROUPS_API_URL = `${API_BASE_URL}/Groups`;

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
    role?: string;
    groupIds?: number[];
    groups?: { id: number; groupName: string }[];
}

export interface Group {
    id?: number;
    groupName: string;
    type: string;
    department: string;
    memberCount?: number;
    memberIds?: number[];
    members?: { id: number; firstName: string; lastName: string; email: string }[];
}

export interface Department {
    id?: number;
    name: string;
    description?: string;
}

export interface AuditLog {
    id: number;
    timestamp: string;
    performedBy: string;
    action: string;
    targetEntity: string;
    targetId?: string;
    changeSummary: string;
}

const DEPARTMENTS_API_URL = `${API_BASE_URL}/Departments`;
const AUDIT_LOGS_API_URL = `${API_BASE_URL}/AuditLogs`;
const AUTH_API_URL = `${API_BASE_URL}/Auth`;
const ASSETS_API_URL = `${API_BASE_URL}/Assets`;

export interface Asset {
    id?: number;
    category: string;
    product: string;
    location: string;
    company: string;
    serialNumber: string;
    assignedToUserId?: number;
    assignedToUser?: { id: number; firstName: string; lastName: string };
    status: string;
    departmentId?: number;
    department?: { id: number; name: string };
    deploymentDate?: string;
    vendor?: string;
    manufacturer?: string;
    purchaseDate?: string;
    orderNo?: string;
    price?: string;
    orderStatus?: string;
    warrantyEndDate?: string;
    cpu?: string;
    ram?: string;
    hdd?: string;
}

// Set performed by header
export const setPerformedByHeader = (account: string | null) => {
    if (account) {
        axios.defaults.headers.common['X-Performed-By'] = account;
    } else {
        delete axios.defaults.headers.common['X-Performed-By'];
    }
};

// Users API
export const getUsers = async () => {
    const response = await axios.get<User[]>(USERS_API_URL);
    return response.data;
};

export const getUser = async (id: number) => {
    const response = await axios.get<User>(`${USERS_API_URL}/${id}`);
    return response.data;
};

export const createUser = async (user: User) => {
    const response = await axios.post<User>(USERS_API_URL, user);
    return response.data;
};

export const updateUser = async (id: number, user: User) => {
    const response = await axios.put(`${USERS_API_URL}/${id}`, user);
    return response.data;
};

export const deleteUser = async (id: number) => {
    const response = await axios.delete(`${USERS_API_URL}/${id}`);
    return response.data;
};

// Groups API
export const getGroups = async () => {
    const response = await axios.get<Group[]>(GROUPS_API_URL);
    return response.data;
};

export const getGroup = async (id: number) => {
    const response = await axios.get<Group>(`${GROUPS_API_URL}/${id}`);
    return response.data;
};

export const createGroup = async (group: Group) => {
    const response = await axios.post<Group>(GROUPS_API_URL, group);
    return response.data;
};

export const updateGroup = async (id: number, group: Group) => {
    const response = await axios.put(`${GROUPS_API_URL}/${id}`, group);
    return response.data;
};

export const deleteGroup = async (id: number) => {
    const response = await axios.delete(`${GROUPS_API_URL}/${id}`);
    return response.data;
};

// Departments API
export const getDepartments = async () => {
    const response = await axios.get<Department[]>(DEPARTMENTS_API_URL);
    return response.data;
};

export const createDepartment = async (dept: Department) => {
    const response = await axios.post<Department>(DEPARTMENTS_API_URL, dept);
    return response.data;
};

export const updateDepartment = async (id: number, dept: Department) => {
    const response = await axios.put(`${DEPARTMENTS_API_URL}/${id}`, dept);
    return response.data;
};

export const deleteDepartment = async (id: number) => {
    const response = await axios.delete(`${DEPARTMENTS_API_URL}/${id}`);
    return response.data;
};

// Audit Logs API
export const getAuditLogs = async () => {
    const response = await axios.get<AuditLog[]>(AUDIT_LOGS_API_URL);
    return response.data;
};

// Auth API
export const login = async (credentials: any) => {
    const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
    return response.data;
};

// Assets API
export const getAssets = async () => {
    const response = await axios.get<Asset[]>(ASSETS_API_URL);
    return response.data;
};

export const getAsset = async (id: number) => {
    const response = await axios.get<Asset>(`${ASSETS_API_URL}/${id}`);
    return response.data;
};

export const createAsset = async (asset: Asset) => {
    const response = await axios.post<Asset>(ASSETS_API_URL, asset);
    return response.data;
};

export const updateAsset = async (id: number, asset: Asset) => {
    const response = await axios.put(`${ASSETS_API_URL}/${id}`, asset);
    return response.data;
};

export const deleteAsset = async (id: number) => {
    const response = await axios.delete(`${ASSETS_API_URL}/${id}`);
    return response.data;
};
