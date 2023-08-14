import UserRoles from 'models/userRoles';
import Session from 'models/session';
import { connectToMongoDB } from 'lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import User from 'models/user';

export default async function handler(req: any, res: any) {
    await connectToMongoDB().catch((err) => {
        throw new Error(err);
    });

    // const session = await getServerSession({ req });

    const session: any = await getServerSession(req, res, authOptions)

    console.log('SESSION <--->', session);

    const { method } = req;

    switch (method) {
        case 'PUT':
            const { sessionId, roleId } = req.body;

            if (!roleId) {
                return res.status(400).json({ error: 'Session ID and Role ID are required' });
            }

            let user = await User.findOne({ email: session?.user?.email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // user.role = roleId;
            console.log('USER <----', user);

            const data = {
                ...user._doc,
                role: roleId
            }

            user = await User.findByIdAndUpdate(user._id, data, {
                new: true,
            })

            console.log('USER ---->>', user);

            return res.status(200).json({ success: true, data: user });

            // const role = await UserRoles.findById(roleId);

            // if (!role) {
            //     return res.status(404).json({ error: 'Role not found' });
            // }

            // const session = await Session.findById(sessionId);

            // if (!session) {
            //     return res.status(404).json({ error: 'Session not found' });
            // }

            // session.role = role;
            // await session.save();

            // return res.status(200).json({ success: true, data: session });

        default:
            res.setHeader('Allow', ['PUT']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

