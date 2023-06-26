export default async function fetchPropertyUnitTypes(token: string, property: string) {
    // if (!property || !token) return
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unitTypes/property?id=${property}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}