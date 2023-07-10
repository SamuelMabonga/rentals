export default async function fetchPropertyTenants(token: string, property: string, page: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/tenant/property?id=${property}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}