import express, {Express, Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

// Importing user defined files and functions
import User from "./Models/Users";
import userInterface from "./Interfaces/userInterface";

const app: Express = express();

// Adding middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

// Setting up MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/authentication");
mongoose.set("strictQuery", false);

// Adding routes
app.use("/authenticate", require("./Routes/Authenticate"));

app.get("/", async(req: Request, res: Response) => {
    try {
        if(req.cookies.loggedin_user) {
            const decoded_JWT: {ID: string} = jwt.verify(req.cookies.loggedin_user, "Secret-Key");
            const foundUser: userInterface | null = await User.findOne({_id: decoded_JWT.ID});
            if(foundUser) {
                return res.status(200).render("homepage", {
                    name: foundUser.name
                });
            }
        }
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