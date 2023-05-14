import { createUser } from '@/utils/user.controller';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method==='POST') {
        const {email, password, ...otherProps} = req.body;
        if (!email || !email.includes('@') || !password) {
            res.status(422).json({ message: 'Invalid Data' });
            return;
        }
        const data: any = await createUser({email, password, ...otherProps})
        console.log("dataaaa", data.name)
        if (data.name === "Error") {

            console.log("FAILEDDD")
            res.status(422).json({ message: 'User already exists' });
            return;
        }

        // sign in the user
        res.status(201).json({ message: 'User created',...data });
        return
    }else{
        res.status(500).send({message:'Invalid Route'})
    }
}