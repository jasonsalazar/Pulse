import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

import type {
  Message,
  MessagesRead,
  UserTypingEvent,
} from "../types/messaging";

const SIGNALR_URL = "http://192.168.1.12:5000/hubs/chat";

let connection: HubConnection | null = null;

export type SignalRConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

type ConnectionStatusHandler = (status: SignalRConnectionStatus) => void;

type MessagesReadHandler = (result: MessagesRead) => void;

type UserTypingHandler = (event: UserTypingEvent) => void;

const connectionStatusHandlers = new Set<ConnectionStatusHandler>();

function notifyConnectionStatus(status: SignalRConnectionStatus) {
  connectionStatusHandlers.forEach((handler) => {
    handler(status);
  });
}

function createConnection(): HubConnection {
  const hubConnection = new HubConnectionBuilder()
    .withUrl(SIGNALR_URL, {
      accessTokenFactory: () => localStorage.getItem("accessToken") ?? "",
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(LogLevel.Warning)
    .build();

  hubConnection.onreconnecting(() => {
    notifyConnectionStatus("reconnecting");
  });

  hubConnection.onreconnected(() => {
    notifyConnectionStatus("connected");
  });

  hubConnection.onclose(() => {
    notifyConnectionStatus("disconnected");
  });

  return hubConnection;
}

export function getSignalRConnection(): HubConnection {
  if (!connection) {
    connection = createConnection();
  }

  return connection;
}

export async function startSignalRConnection(): Promise<HubConnection> {
  const hubConnection = getSignalRConnection();

  if (hubConnection.state === HubConnectionState.Connected) {
    notifyConnectionStatus("connected");

    return hubConnection;
  }

  if (hubConnection.state === HubConnectionState.Connecting) {
    return hubConnection;
  }

  if (hubConnection.state === HubConnectionState.Reconnecting) {
    return hubConnection;
  }

  notifyConnectionStatus("connecting");

  try {
    await hubConnection.start();

    notifyConnectionStatus("connected");

    return hubConnection;
  } catch (error) {
    notifyConnectionStatus("disconnected");

    throw error;
  }
}

export async function stopSignalRConnection(): Promise<void> {
  if (!connection) {
    return;
  }

  if (connection.state !== HubConnectionState.Disconnected) {
    await connection.stop();
  }
}

export async function sendSignalRMessage(
  conversationId: string,
  content: string,
): Promise<Message> {
  const hubConnection = await startSignalRConnection();

  if (hubConnection.state !== HubConnectionState.Connected) {
    throw new Error("Messaging connection is not available.");
  }

  return await hubConnection.invoke<Message>(
    "SendMessage",
    conversationId,
    content,
  );
}

export function onMessageReceived(
  handler: (message: Message) => void,
): () => void {
  const hubConnection = getSignalRConnection();

  hubConnection.on("messageReceived", handler);

  return () => {
    hubConnection.off("messageReceived", handler);
  };
}

export function onConnectionStatusChanged(
  handler: ConnectionStatusHandler,
): () => void {
  connectionStatusHandlers.add(handler);

  return () => {
    connectionStatusHandlers.delete(handler);
  };
}

export function onMessagesRead(handler: MessagesReadHandler): () => void {
  const hubConnection = getSignalRConnection();
  const callback = (result: MessagesRead) => {
    handler(result);
  };

  hubConnection.on("messagesRead", callback);

  return () => {
    hubConnection.off("messagesRead", callback);
  };
}

export async function markConversationAsReadViaSignalR(
  conversationId: string,
): Promise<void> {
  const hubConnection = getSignalRConnection();
  if (hubConnection.state !== HubConnectionState.Connected) {
    throw new Error("SignalR is not connected.");
  }

  await hubConnection.invoke("MarkConversationAsRead", conversationId);
}

export function onUserTyping(handler: UserTypingHandler): () => void {
  const hubConnection = getSignalRConnection();
  const callback = (event: UserTypingEvent) => {
    handler(event);
  };

  hubConnection.on("userTyping", callback);

  return () => {
    hubConnection.off("userTyping", callback);
  };
}

export function onUserStoppedTyping(handler: UserTypingHandler): () => void {
  const hubConnection = getSignalRConnection();
  const callback = (event: UserTypingEvent) => {
    handler(event);
  };

  hubConnection.on("userStoppedTyping", callback);

  return () => {
    hubConnection.off("userStoppedTyping", callback);
  };
}

export async function startTyping(conversationId: string): Promise<void> {
  const hubConnection = getSignalRConnection();
  if (hubConnection.state !== HubConnectionState.Connected) {
    return;
  }

  await hubConnection.send("StartTyping", conversationId);
}

export async function stopTyping(conversationId: string): Promise<void> {
  const hubConnection = getSignalRConnection();
  if (hubConnection.state !== HubConnectionState.Connected) {
    return;
  }

  await hubConnection.send("StopTyping", conversationId);
}
