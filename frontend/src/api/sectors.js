import axios from "./axios";

export const getSectors = () => axios.get("/admin/sectors");
export const createSector = (data) => axios.post("/admin/sectors", data);
