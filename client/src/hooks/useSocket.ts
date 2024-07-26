import { useEffect } from 'react';
import socket from '../socket/websocket';

const useSocket = (event: string, callback: (data: any) => void) => {
  useEffect(() => {
    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
};

export default useSocket;
