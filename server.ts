import express, {Express, Request, Response, NextFunction} from "express";

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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