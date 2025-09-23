'use client'
import ChatBotDemo from "@/components/ai-comp/chat"
import { ChatApiInputDialoag } from "@/components/ai-comp/ChatApiInputDialoag"
import { Button } from "@/components/ui/button"
import { useChatStore } from "@/lib/stores/ChatStore"

const Page = () => {
  // const {apiKey} = useChatStore();

  return (
  <>  <ChatApiInputDialoag/>
  {/* <Button onClick={() =>console.log(apiKey)}>get value</Button> */}
    <ChatBotDemo/></>
  )
}
export default Page