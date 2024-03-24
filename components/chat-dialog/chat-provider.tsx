"use client";

import "./layout.css";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ChannelFilters } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  InfiniteScroll,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { useDebouncedCallback } from "use-debounce";
//@ts-expect-error
import useSound from "use-sound";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClient } from "@/lib/use-client";
import { IconMessage } from "@tabler/icons-react";

import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

const filters: ChannelFilters = {
  type: "messaging",
};

const ChatProvider = ({ apiKey, token }: { apiKey: string; token: string }) => {
  const { toast } = useToast();
  const { data } = useSession();
  const chatClient = useClient({
    apiKey: apiKey,
    user: {
      id: data?.user?.name!,
      name: data?.user?.name!,
    },
    tokenOrProvider: token,
  });
  const [open, setOpen] = useState(false);
  const [play] = useSound("/sounds/ding.mp3", {
    interrupt: true,
    volume: 0.2,
  });

  const debounced = useDebouncedCallback((channelId: string) => {
    toast({
      title: `New message`,
      description: `There is a new message in ${channelId}!`,
    });
    play();
  }, 1000);

  if (!chatClient) {
    return (
      <Button variant="outline" className="inline-flex items-center" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Chat
      </Button>
    );
  }

  chatClient.on((event) => {
    if (
      event.type === "message.new" &&
      event.message?.user?.id !== data?.user?.name &&
      !open
    ) {
      debounced(event.channel_id!);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center">
          <span className="relative inline-flex">
            <Button
              variant="outline"
              className="inline-flex items-center"
              onClick={() => setOpen(!open)}
            >
              <IconMessage className="mr-2 h-4 w-4" /> Chat
            </Button>
            <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-700 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-600"></span>
            </span>
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[60vw]">
        <DialogHeader>
          <DialogTitle>Chat</DialogTitle>
          <DialogDescription>
            Communicate with in-game and external admins
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-[60vh]">
          <div className="absolute w-full h-full">
            <div className="flex h-full">
              <Chat client={chatClient} theme="str-chat__theme-dark">
                <ChannelList filters={filters} Paginator={InfiniteScroll} />
                <Channel>
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                  </Window>
                  <Thread />
                </Channel>
              </Chat>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ChatProvider };
