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
import { useActiveAccount } from "thirdweb/react";

export function RentDialog({ data }: { data: keysType }) {
  const [isSignIn, setIsSignIn] = useState(false);
//   const [signature, setSignature] = useState<string | undefined>(undefined);
  const [state, setState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const account = useActiveAccount();

  const handleRentApiKey = async (signature:`0x${string}`) => {
    // Implement the logic to handle renting the API key
    try {
      const response = await axios.post(
        "/api/v1/action/create-new-session",
        
             {...data,signature:signature,borrowerAddress:account?.address}
        
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
      const signature = await account?.signMessage({
        message: `I aggery to buy this key: ${data.id}`,
      });
    //   setSignature(signature);
      console.log(signature);
      handleRentApiKey(signature);

      setIsSignIn(false)
      setState(false);
    } catch (error) {
        if(error.message === 'User rejected the request.'){
            setError('User rejected the request.');
            setIsSignIn(false);
        }
      console.log(error);
    }
  };
  return (
    <AlertDialog open={state}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => setState(true)}
          variant="outline"
          className="flex-1"
        >
          Rent
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Sign the Transaction to rent the {data.provider} API Key.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setState(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={signAndRent} disabled={isSignIn}>
            {isSignIn ? (
<Loading/>
            ) : (
              "Sign"
            )}
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
  )
}
export default Loading
