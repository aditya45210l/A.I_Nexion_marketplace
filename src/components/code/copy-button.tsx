import { formatAddress } from "../dashboard/SubscriptionTable";
import { Button } from "../ui/button";
import { CopyButton } from "./copy-text";

export default function CopyTextComp({text}:{text:string}) {
  return (
    <div className="flex items-center gap-0.5">
      <span  className=" text-sm">{formatAddress(String(text))}</span>
      <CopyButton  content={`${text}`} variant="ghost" size="sm" />
    </div>
  );
}