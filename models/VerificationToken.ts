import { Schema, model, models } from "mongoose";


const VerificationTokenSchema = new Schema({
    identifier: {
        type: String,
    },
    token: {
        type: String,
    },
    expires: {
        type: String,
    },
}, {
    timestamps: true
});

//indexed fields for searching
// SessionSchema.index({
//     email: "text",
//     first_name: 'text',
//     last_name: 'text'
// });

const VerificationToken = models.VerificationToken || model("VerificationToken", VerificationTokenSchema);

export default VerificationToken;
