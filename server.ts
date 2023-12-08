import express, {Express, Request, Response, NextFunction} from "express";

const app: Express = express();

app.get("/", async(req: Request, res: Response) => {
    try {
        return res.status(200).send("hello world.");
    }
    catch(error) {
        console.log(error);
    }
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});