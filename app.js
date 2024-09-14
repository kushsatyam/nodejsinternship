const express = require('express');
const app = express();
const cors = require('cors');
const connectDb = require("./utils/db");
const authRoute = require("./routes/authRoute");

app.use(express.json());
app.use(cors({origin: "*"}));

app.use("/api",authRoute);

const PORT = 5000;

connectDb().then(()=>{
    app.listen(PORT,()=>{
        console.log('Server is listen on port', PORT);
    })
});