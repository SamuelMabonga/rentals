export default async function fetchAProperty(token: string, id: string) {
    console.log("PROPERTY ID", id)
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/property?id=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}