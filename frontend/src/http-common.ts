import axios from "axios";

export const simpleJSON = axios.create({
    baseURL: "http://localhost:8080/",
    headers: {
        "Content-type": "application/json"
    }
});

export const specialURIList = axios.create({
    baseURL: "http://localhost:8080/",
    headers: {
        "Content-Type":"text/uri-list"
    }
});