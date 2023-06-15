export default async function fetchAUnit(token: string, id: string) {
    if (!id) return

    console.log("UNIT ID", id)
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unit?id=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();
    return data
}