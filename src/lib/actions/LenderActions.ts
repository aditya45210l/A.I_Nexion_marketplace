import axios from "axios";

export const LendTheKey = async (values: {
  provider: string;
  model: string;
  key: string;
  pricePerCall: string;
  termAndConduction?: unknown;
  lenderAddress:string;
}) => {
  const res = await axios.post("/api/v1/forms/lend", values);
    return res.data;
};
