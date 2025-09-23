"use client";
import { keysType } from "@/app/(root)/borrow/page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { UndoIcon } from "lucide-react";
import { useState } from "react";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";


type type_metadata = {
      proxyAddress: string | null;
      privateKey: string | null;
      jwt_auth: string | null;
      proxy_exp_time: string | null;
    }
export function RentDialog({ data }: { data: keysType }) {
  const [isSignIn, setIsSignIn] = useState(false);
  //   const [signature, setSignature] = useState<string | undefined>(undefined);
  const [state, setState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  const handleRentApiKey = async (
    signature: `0x${string}`,
    metadata:type_metadata 
  ) => {
    // Implement the logic to handle renting the API key
    try {
      const response = await axios.post(
        "/api/v1/action/create-new-session",

        { ...data, signature: signature, borrowerAddress: account?.address,...metadata}
      );
      console.log("Response from renting API key:", response);
    } catch (error) {
      console.error("Error renting API key:", error);
    }
  };

  const signAndRent = async () => {
    try {
      setIsSignIn(true);
      setError(null);
      const session = JSON.parse(
        localStorage.getItem("your_app_name_session_key")!
      );
      const jwt_auth = localStorage.getItem("your_app_name_jwt_token");
      const proxy_exp_time = localStorage.getItem("SESSION_EXPIRE_KEY");
      if (
        !session &&
        !jwt_auth &&
        !proxy_exp_time &&
        proxy_exp_time > Math.floor(Date.now() / 1000)
      ) {
        return;
      }
      const proxyAddress = session.address;
      const privateKey = session.privateKey;
      // console.log("metadata: ", {
      //   proxyAddress,
      //   privateKey,
      //   jwt_auth,
      //   proxy_exp_time,
      // });
      const metadata = {
        proxyAddress,
        privateKey,
        jwt_auth,
        proxy_exp_time,
      };
      // console.log(metadata);

      const signature = await account?.signMessage({
        message: `I aggery to buy this key: ${data.id}`,
      });

      handleRentApiKey(signature!, metadata);

      setIsSignIn(false);
      setState(false);
    } catch (error) {
      if (error.message === "User rejected the request.") {
        setError("User rejected the request.");
        setIsSignIn(false);
      }
      console.log(error);
    }
  };
  return (
    <AlertDialog open={state}>
      <AlertDialogTrigger asChild>
        {account?.address ? (
          <Button
            onClick={() => setState(true)}
            variant="outline"
            className="flex-1"
          >
            Rent
          </Button>
        ) : (
          <Button disabled={true} className="text-sm!">
            not connected
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Sign the Transaction to rent the {data.provider} API Key.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setState(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={signAndRent} disabled={isSignIn}>
            {isSignIn ? <Loading /> : "Sign"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const Loading = () => {
  return (
    <div className="text-primary-foreground flex-1 px-4">
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="4" cy="12" r="3" opacity="1">
          <animate
            id="spinner_qYjJ"
            begin="0;spinner_t4KZ.end-0.25s"
            attributeName="opacity"
            dur="0.75s"
            values="1;.2"
            fill="freeze"
          ></animate>
        </circle>
        <circle cx="12" cy="12" r="3" opacity=".4">
          <animate
            begin="spinner_qYjJ.begin+0.15s"
            attributeName="opacity"
            dur="0.75s"
            values="1;.2"
            fill="freeze"
          ></animate>
        </circle>
        <circle cx="20" cy="12" r="3" opacity=".3">
          <animate
            id="spinner_t4KZ"
            begin="spinner_qYjJ.begin+0.3s"
            attributeName="opacity"
            dur="0.75s"
            values="1;.2"
            fill="freeze"
          ></animate>
        </circle>
      </svg>
    </div>
  );
};
export default Loading;
