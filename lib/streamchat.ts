import { StreamChat } from "stream-chat";

const CHAT_API_KEY = process.env.CHAT_API_KEY ?? "";
const CHAT_API_SECRET = process.env.CHAT_API_SECRET ?? "";

const serverClient = StreamChat.getInstance(CHAT_API_KEY, CHAT_API_SECRET);

export { serverClient, CHAT_API_KEY };
