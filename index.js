const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST']
    }
});

let sharedData = {};

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('updateData', sharedData);

    socket.on('updateData', (newData) => {
        sharedData = newData;
        io.sockets.emit('updateData', sharedData);
    });

    socket.emit('addData', sharedData);
    socket.on('addData', (newData) => {
        sharedData = {
            newData,
            ...sharedData,
        };
        io.sockets.emit('addData', sharedData);
    });

    socket.emit('getAllData', sharedData);
    socket.on('getAllData', () => {
        socket.emit('getAllData', sharedData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(4000, () => console.log('Listening on port 4000'));