export default async function fetchPropertyUnitTypes(token: string, property: string, page: any) {
    // if (!property || !token) return
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unitTypes/property?id=${property}&page=${page}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}