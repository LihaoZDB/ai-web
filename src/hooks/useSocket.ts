import { io, type Socket } from "socket.io-client";
import { socketUrl } from "@/apis";
import { useUserStore } from "@/stores/user";
let socket: Socket | null = null;

export const useSocket = () => {
  const userStore = useUserStore();
  // 连接socket
  const connect = () => {
    const userId = userStore.user?.id;
    if (!userId) return; // 没有用户ID无法连接
    if (socket) return; // 已经连接过无法连接
    socket = io(socketUrl, {
      transports: ["websocket"], // 传输方式
      autoConnect: true, // 自动连接
      reconnection: true, // 自动重连
      reconnectionDelay: 1000, // 重连延迟
      reconnectionDelayMax: 5000, // 重连最大延迟
      reconnectionAttempts: 5, // 重连次数
      timeout: 20000, // 超时时间
      query: {
        userId,
      },
    });
    // 为了threeShaking
    if (import.meta.hot) {
      import.meta.hot.data.socket = socket;
    }
  };

  // 断开连接
  const disconnect = () => {
    if (socket) {
      socket.disconnect(); // 断开连接
      socket.removeAllListeners(); // 移除所有监听器
      socket = null; // 重置socket
      // 为了threeShaking
      if (import.meta.hot) {
        import.meta.hot.data.socket = null;
      }
    }
  };

  // 获取socket
  const getSocket = (): Socket | null => {
    if (socket) {
      return socket;
    }
    if (import.meta.hot) {
      socket = import.meta.hot.data.socket;
    }
    return socket;
  };

  return {
    connect,
    disconnect,
    getSocket,
  };
};
