import { Schema, model, models } from "mongoose";


const SessionSchema = new Schema({
    id: {
        type: String,
    },
    expires: {
        type: String,
    },
    sessionToken: {
        type: String,
    },
    userId: {
        type: String,
    },
    role: {
        type: Object,
    }
}, {
    timestamps: true
});

//indexed fields for searching
// SessionSchema.index({
//     email: "text",
//     first_name: 'text',
//     last_name: 'text'
// });

const Session = models.Session || model("Session", SessionSchema);

export default Session;
