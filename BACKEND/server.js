const express = require("express");
const cors=  require('cors');
const adminRoutes = require("./routes/admin.routes.js");
const voterRoutes = require("./routes/voter.routes.js");
const connectDB = require("./middlewares/connectdb.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/voter", voterRoutes);

app.listen(5000, () => {
    connectDB()
    console.log("Server running on port 5000")
});
