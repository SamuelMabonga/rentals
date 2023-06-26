export default async function fetchProperties(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/property`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}