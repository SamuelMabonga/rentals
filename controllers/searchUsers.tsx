import User from "models/user";


// get all properties
export async function searchUsers(req: any, res: any) {
    try {
        const { search } = req.query

        console.log("SEARCH TERM", search)

        await User.find({ $text: { $search: search } })
            .then((results) => {
                // Process the search results
                res.status(200).json({
                    success: true,
                    msg: "Users searched successfully",
                    data: results,
                });
            })
            .catch((err) => {
                // Handle the error
                res.status(400).json({
                    success: false,
                    msg: "Failed to search users",
                    data: err,
                });
            });



    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "Failed to search users",
            data: error,
        });
        console.log(error);
    }
}
