import { io } from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_API_URL?.replace(
    "/api/v1",
    "",
  ) || "http://localhost:4001",
  {
    transports: ["websocket"],
    autoConnect: true,
  },
);

export default socket;