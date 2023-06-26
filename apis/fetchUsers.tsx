export default async function fetchUsers(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();
    return data
}