export default async function fetchRolesByUserUserId(userId: string, page: any) {
    if (!userId) {
        return null
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/userRoles/user?userId=${userId}&page=${page}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}