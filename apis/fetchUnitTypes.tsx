export default async function fetchUnitTypes(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unitType`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}