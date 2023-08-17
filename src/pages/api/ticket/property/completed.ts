import {
    ticketCompleted,
    ticketInProgress,
} from "controllers/ticket";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    connectToMongoDB().catch((err) => res.json(err));
    //type of request
    const { method } = req;
    switch (method) {
        case "POST":
            ticketCompleted(req, res);
            break;

        default:
            //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
            res.status(405).end(`Method ${method} not Allowed`);
            break;
    }
}
