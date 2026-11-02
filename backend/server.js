const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./db");
const errorMiddleware = require("./middleware/errorMiddleware");
const app = express();
const taskRoutes = require("./routes/taskRoutes");

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exitCode = 1;
    }
};

startServer();