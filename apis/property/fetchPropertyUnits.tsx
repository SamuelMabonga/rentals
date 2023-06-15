export default async function fetchPropertyUnits(token: string, property: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unit?property=${property}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}