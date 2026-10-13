const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
    }
});

// Make io accessible inside Express routes
app.set("io", io);

io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // Join a particular board room
    socket.on("join_board", ({ boardID, member }) => {
        if (!boardID) return;

        socket.join(boardID);
        socket.data.boardID = boardID;
        socket.data.member = member || "Anonymous";

        io.to(boardID).emit("member_joined", {
            socketID: socket.id,
            member: socket.data.member
        });

        // Send current online members
        const room = io.sockets.adapter.rooms.get(boardID);
        const onlineMembers = [];

        if (room) {
            for (const id of room) {
                onlineMembers.push({
                    socketID: id,
                    member: io.sockets.sockets.get(id)?.data.member
                });
            }
        }

        io.to(boardID).emit("online_members", onlineMembers);
    });

    // Typing indicator
    socket.on("typing", ({ boardID, member }) => {
        socket.to(boardID).emit("user_typing", { member });
    });

    socket.on("stop_typing", ({ boardID, member }) => {
        socket.to(boardID).emit("user_stopped_typing", { member });
    });

    socket.on("leave_board", ({ boardID }) => {
        socket.leave(boardID);
        io.to(boardID).emit("member_left", {
            socketID: socket.id,
            member: socket.data.member
        });
    });

    socket.on("disconnect", () => {
        const { boardID, member } = socket.data;

        if (boardID) {
            io.to(boardID).emit("member_left", {
                socketID: socket.id,
                member
            });

            const room = io.sockets.adapter.rooms.get(boardID);
            const onlineMembers = [];

            if (room) {
                for (const id of room) {
                    onlineMembers.push({
                        socketID: id,
                        member: io.sockets.sockets.get(id)?.data.member
                    });
                }
            }

            io.to(boardID).emit("online_members", onlineMembers);
        }

        console.log("Disconnected:", socket.id);
    });
});

// Keep your existing routes and MongoDB connection
app.use("/api/boards", require("./routes/boardRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

const startServer = async () => {
    await connectDB();

    server.listen(5000, () => {
        console.log("Server running on port 5000");
    });
};

startServer();