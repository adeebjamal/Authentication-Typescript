import express, {Request, Response, Router} from "express";

const router: Router = express.Router();

router.post("/register", async(req: Request, res: Response) => {
    try {
        console.log(req.body);
        return res.status(200).render("homepage", {
            message: ""
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).render("homepage", {
            message: "Internal Server Error."
        });
    }
});

module.exports = router;