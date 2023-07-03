import { useSession } from "next-auth/react";


export default async function fetchUserTenancies(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/tenant/user?page=3`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();
    return data
}