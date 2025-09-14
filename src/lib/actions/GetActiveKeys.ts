import axios from "axios"

export const fetchActiveKeys = async ()=>{
    const data = await axios.get("/api/v1/fetch/allkeys");
    console.log("Fetched Keys:",data.data);
    return data.data;
}