export default async function fetchUnits(token: string, unitType: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unit?unitType=${unitType}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}