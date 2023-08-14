import { Schema, model, models } from "mongoose";


const AccountSchema = new Schema({
    id: {
        type: String,
    },
    userId: {
        type: String
    },
    type: {
        type: String,
    },
    provider: {
        type: String,
    },
    providerAccountId: {
        type: String,
    },
    refresh_token: {
        type: String,
    },
    access_token: {
        type: String,
    },
    expires_at: {
        type: Int8Array,
    },
    token_type: {
        type: String,
    },
    scope: {
        type: String,
    },
    id_token: {
        type: String,
    },
    session_state: {
        type: String,
    }

}, {
    timestamps: true
});

//indexed fields for searching
// AccountSchema.index({
//     email: "text",
//     first_name: 'text',
//     last_name: 'text'
// });

const Account = models.Account || model("Account", AccountSchema);

export default Account;
