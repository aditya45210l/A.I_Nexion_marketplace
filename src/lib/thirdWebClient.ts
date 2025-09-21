import { createThirdwebClient } from "thirdweb";
import { THIRDWEB_CLIENT_ID } from "./env";

export const ThirdWebClient = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID || "5e55900bcfa9090da91b0bdd621088e8",
});

 
