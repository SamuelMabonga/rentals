export default async function fetchAProperty(id: string) {
    // if (!id) return new Error("No property Id")
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/property?id=${id}`, {
        headers: {
            // Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        method: "GET"
    });

    const data = await response.json();
    return data
}