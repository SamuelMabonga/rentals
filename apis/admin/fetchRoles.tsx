export default async function fetchRoles(page: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/roles?page=${page}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();

    return data
}