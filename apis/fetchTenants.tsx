export default async function fetchTenants(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/tenant`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}