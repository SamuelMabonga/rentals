import {
    createStaff,
    deleteStaff,
    fetchAllStaffByProperty,
    fetchAllStaffs,
    fetchSingleStaff,
    searchStaff,
    updateStaff,
} from "controllers/staff";
import authenticateUser from "helpers/authenticate_user";
import { connectToMongoDB } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // const decodedToken = authenticateUser(req, res);

    // if (!decodedToken?.user?._id) {
    //     return res.status(401).json({
    //         success: false,
    //         msg: "Not Authorized",
    //     });
    // }

    connectToMongoDB().catch((err) => res.json(err));

    // USER
    // const { _id, role } = decodedToken.user;

    //type of request
    const { method } = req;

    // Property ID
    const property = req.body.property || req.query.id
    const searchQuery: any = req.query.searchQuery

    // Reject if no property provided
    if (!property) {
        return res.status(400).json({
            success: false,
            msg: "No property provided",
        });
    }

    // Get permissions
    // const userRoles = decodedToken.userRoles
    // const userPropertyRoles = userRoles?.find((role: any) => role.property === property)
    // const permissions = userPropertyRoles?.role?.permissions

    switch (method) {
        case "GET":
            // const getPermission = permissions?.find((permission: any) => permission.name === "View staff")
            // if (!getPermission) {
            //     return res.status(401).json({
            //         success: false,
            //         msg: "Not Authorized",
            //     });
            // }
            // if (id) {
            //   fetchSingleStaff(req, res);
            // } else 
            if (searchQuery) {
              searchStaff(req, res);
            } else {
            fetchAllStaffByProperty(req, res);
            }
            break;
        case "POST":
            // const postPermission = permissions?.find((permission: any) => permission.name === "Create staff")
            // if (!postPermission) {
            //     return res.status(401).json({
            //         success: false,
            //         msg: "Not Authorized",
            //     });
            // }

            createStaff(req, res);
            break;
        case "PUT":
            // const putPermission = permissions?.find((permission: any) => permission.name === "Edit staff")
            // if (!putPermission) {
            //     return res.status(401).json({
            //         success: false,
            //         msg: "Not Authorized",
            //     });
            // }

            updateStaff(req, res);
            break;
        case "DELETE":
            // const deletePermission = permissions?.find((permission: any) => permission.name === "Delete staff")
            // if (!deletePermission) {
            //     return res.status(401).json({
            //         success: false,
            //         msg: "Not Authorized",
            //     });
            // }

            deleteStaff(req, res);
            break;
        default:
            //   res.setHeaders("Allow", ["GET", "PUT", "DELETE", "POST", "PATCH"]);
            res.status(405).end(`Method ${method} not Allowed`);
            break;
    }
}
