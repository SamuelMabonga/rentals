export default async function fetchUnits(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unit`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}