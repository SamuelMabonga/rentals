import { bookingStatistics } from "controllers/booking";
import { staffStatistics } from "controllers/staff";
import { tenantStatistics } from "controllers/tenant";
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
        case "GET":
            staffStatistics(req, res);
            break;

        default:
            res.status(405).end(`Method ${method} not Allowed`);
            break;
    }
}