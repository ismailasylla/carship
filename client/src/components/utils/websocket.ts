import { io } from 'socket.io-client';

const socket = io('http://localhost:5001'); // Adjust based on your server's address

export default socket;
