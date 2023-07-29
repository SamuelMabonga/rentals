import { useSession } from 'next-auth/react';
import React from 'react';

export default function SelectRole() {
    // session
    const session: any = useSession()
    console.log("session", session)
    return (
        <div>
            <h1>SelectRole</h1>
        </div>
    )
}