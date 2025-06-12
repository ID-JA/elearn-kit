const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors(
    {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: ["Content-Type", "Authorization"],
    }
));



app.use("/api/courses", require("./routes/courses"));

app.listen(3001, '0.0.0.0', async () => {
    console.log(`Server running on port 3001`);
});