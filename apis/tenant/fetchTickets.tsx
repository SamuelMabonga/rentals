export default async function fetchTickets(token: string, id: string) {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/ticket/tenant?id=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();
    return data
}