"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/lib/stores/ChatStore";
import { Save } from "lucide-react";
import { useState } from "react";

import Loading from "../marketplace/RentDialog";

export function ChatApiInputDialoag() {
  const { apiKey, setApiKey } = useChatStore();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(true);
  const handleApiKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const _apiKey = formData.get("api-key");

    console.log('allready have this key: ',apiKey)
  
    setApiKey(_apiKey as string);
    console.log(formData.get("api-key"));
    setLoading(false);
    setState(false);
  };

  

  return (
    <Dialog open={state}>
      {/* <DialogTrigger asChild>
          <Button variant="outline">Chat</Button>
          </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => handleApiKeySubmit(e)}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Enter Api Key </DialogTitle>
            {/* <DialogDescription>
              Make sure you enter write key!
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              {/* <Label htmlFor="name-1">Api key</Label> */}
              <Input
                id="api-key"
                name="api-key"
                type="password"
                required={true}
              />
            </div>
            {/* <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div> */}
          </div>
          <DialogFooter>
            <DialogClose asChild onClick={() => setState(false)}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {loading ? (
              <Button type="submit">
                <Loading />
              </Button>
            ) : (
              <Button type="submit">
                <Save />
                Save
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
