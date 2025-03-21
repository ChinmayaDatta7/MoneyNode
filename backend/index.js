import express from "express";
import cors from "cors";

const rootRouter = require("./routes/index.js");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
  console.log("Server is running at 3000");
});
