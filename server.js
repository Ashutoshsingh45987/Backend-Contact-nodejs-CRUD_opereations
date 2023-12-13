const express = require ("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const asyncHandler = require("express-async-handler");
const connectDb = require("./config/dbConnection");

connectDb();



const app= express();
const port= process.env.port||5000;

// Middleware to parse JSON data
app.use(express.json());

app.use("/api/contacts", require('./routes/contactRoutes'));
app.use("/api/users", require('./routes/userRoutes'));
app.use(errorHandler);

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})
