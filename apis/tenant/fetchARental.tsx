export default async function fetchARental(token: string, id: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/tenant/user?id=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();
    return data
}