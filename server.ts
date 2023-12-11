import express, {Express, Request, Response, NextFunction} from "express";
import mongoose from "mongoose";

const app: Express = express();

// Adding middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Setting up MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/authentication");
mongoose.set("strictQuery", false);

// Adding routes
app.use("/authenticate", require("./Routes/Authenticate"));

app.get("/", async(req: Request, res: Response) => {
    try {
        return res.status(200).render("homepage", {
            message: ""
        });
    }
    catch(error) {
        console.log(error);
    }
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});