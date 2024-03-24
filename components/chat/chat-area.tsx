"use client";

import moment from "moment";
import { useSession } from "next-auth/react";
import { Key, useEffect, useRef } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/utils";
import { IconAlertTriangle } from "@tabler/icons-react";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

const sendMessage = async (data: any) => {
  await fetch(`/api/admins/chat`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      source: "WEB",
      author: data.name,
      avatar: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}?size=1024`,
      id: data.id,
      message: data.value,
      timestamp: new Date(),
    }),
  });
};

const ChatBubble = ({ data, session }: { data: any; session: any }) => {
  const isSelf = data.sender_id === session.user.id;

  return (
    <div className={`flex ${isSelf ? "items-start" : "justify-end"} gap-2.5`}>
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={data.avatar_url ?? ""}
          alt={data?.sender_name ?? "N/A"}
        />
        <AvatarFallback>{"N/A"}</AvatarFallback>
      </Avatar>
      <div
        className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-neutral-900`}
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {data?.sender_name}
          </span>
          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
            ({data.chat_source})
          </span>
        </div>
        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
          {data.message}
        </p>
        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
          {moment(data.timestamp).utc().format("YYYY-MM-DD HH:mm:ss")}
        </span>
      </div>
    </div>
  );
};

const ChatBox = () => {
  const { data: session } = useSession();
  const {
    data: chats,
    isLoading,
    mutate,
    error,
  } = useSWR("/api/admins/chat", fetcher, {
    refreshInterval: 800,
  });

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  if (isLoading) {
    return <Skeleton className="full-w h-[350px]" />;
  }

  if (error) {
    return (
      <div className="h-[350px] flex justify-center items-center">
        <Alert className="border-red-600">
          <IconAlertTriangle className="h-4 w-4" color="rgb(220 38 38)" />
          <AlertTitle className="text-sm">Error!</AlertTitle>
          <AlertDescription>
            <p className="text-xs">Could not load chat.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="w-full rounded-md border">
        <ScrollArea className="h-[300px]">
          <div className="m-4 space-y-4 flex flex-col justify-between">
            {chats?.map((chatData: any, index: Key | null | undefined) => {
              return (
                <ChatBubble key={index} data={chatData} session={session} />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      <Input
        className="mt-2"
        placeholder="> Send message..."
        onKeyUp={async (key) => {
          const keyCode = key.code;
          if (!keyCode.includes("Enter")) {
            return;
          }

          //@ts-expect-error
          const value = key.target.value;
          const timestamp = new Date();

          const message = {
            chat_source: "WEB",
            sender_name: session?.user?.name,
            // @ts-expect-error
            avatar_url: `https://cdn.discordapp.com/avatars/${session?.user?.id}/${session?.user.avatar}?size=1024`,
            sender_id: session?.user?.id,
            message: value,
            timestamp: timestamp,
          };

          mutate([...chats, message], {
            optimisticData: [...chats, message],
            rollbackOnError: true,
            populateCache: true,
            revalidate: false,
          });

          //@ts-expect-error
          key.target.value = "";

          await sendMessage({
            name: session?.user?.name,
            id: session?.user?.id,
            // @ts-expect-error
            avatar: session?.user.avatar,
            value: value,
            timestamp: timestamp,
          });
        }}
      />
    </>
  );
};

export { ChatBox };
