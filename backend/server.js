require("dotenv").config();
const express = require("express");

const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const morgan = require("morgan");
const connectDB = require("./config/db");
const helmet = require("helmet");
const pizzaRoutes = require('./routes/pizzaRoutes')
const OrderRoutes = require('./routes/orderRoutes')




const app = express();

//--------------------------------Connect to MongoDB
connectDB();


//--------------------------------Middleware

app.use(cors({origin: "http://localhost:5173",
     credentials: true}));


//--------------------Without this: req.body is undefined
app.use(express.json());

//------------------------Security Headers

app.use(helmet());

app.use(morgan("dev"));


//--------------------------------Routes

app.use("/api/auth", authRoutes);
app.use("/api/pizzas", pizzaRoutes);
app.use('/api/orders', OrderRoutes);


//--------------------------------Start Server

app.get("/api/health", (req, res) => {
res.json({
     success: true,
      message: "API is healthy",
      environment: process.env.NODE_ENV
 });
});
    


//------------------------------404 Not Found Handler

app.use((req, res) => {
     res.status(404).json({
          success: false,
          message: "Route not found"
     });
});


//--------------------------------Error Handler
app.use(errorHandler);


app.listen(process.env.PORT, () => {
     console.log(`Server running on port ${process.env.PORT}`);
     console.log(`environment:${process.env.NODE_ENV}`);
});
