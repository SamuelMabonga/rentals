export default async function fetchPropertyUnitTypes(property: string) {
    // if (!property || !token) return
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unitTypes/property?id=${property}`, {
        headers: {
            // Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}