import { api } from "../config/apiConfig";
import { writable } from "svelte/store";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const currentUser = Cookies.get("userToken")
    ? jwtDecode(Cookies.get("userToken"))
    : null;

const user = writable(currentUser);

async function register(email, name, password) {
    const response = await api.post('/register', {
        email,
        name,
        password
    })
    if (response.problem) {
        return response.data.code
    } else {
        const { jwt } = response.data;
        api.setHeader("Authorization", `Bearer ${jwt}`);
        updateUser(jwtDecode(jwt));
        Cookies.set("userToken", jwt, {
            expires: new Date().getTime() + 8 * 3600 * 1000,
        });
    }
    return user
}

async function login(email, password) {
    const response = await api.post('/login', {
        email,
        password
    })
    if (response.problem) {
        return response.data.code
    } else {
        const { jwt } = response.data;
        api.setHeader("Authorization", `Bearer ${jwt}`);
        updateUser(jwtDecode(jwt));
        Cookies.set("userToken", jwt, {
            expires: new Date().getTime() + 8 * 3600 * 1000,
        });
    }
    return user
}

async function getMe() {
    await api.setHeader(
        "Authorization",
        `Bearer ${Cookies.get("userToken")}`
    );
    const response = await api.get("/api/me");
    if (response.problem) {
        return response.data;
    } else {
        return response.data[0];
    }
}


function updateUser(userData) {
    return user.set(userData);
}

async function updateStudent(userData) {
    await api.setHeader("Authorization", `Bearer ${Cookies.get("userToken")}`);
    const response = await api.post(`/api/update-student`, userData);
    if (response.problem) {
        return response.data.code
    } else {
        return true
    }
}

function logout() {
    Cookies.remove("userToken");
    updateUser(null);
}

const customUserStore = {
    subscribe: user.subscribe,
    register,
    login,
    getMe,
    updateUser,
    updateStudent,
    logout

};

export default customUserStore;
