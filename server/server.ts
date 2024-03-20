import express, { Response, Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import loginRoutes from "./routes/loginRoutes";
import signupRoutes from "./routes/signupRoutes";
import categoryRoutes from "./routes/categoryRoutes";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("on the server!");
});

app.use("/login", loginRoutes);

app.use("/signup", signupRoutes);

app.use("/category", categoryRoutes);

app.listen(port, () => console.log(`Server started at port ${port}`));
