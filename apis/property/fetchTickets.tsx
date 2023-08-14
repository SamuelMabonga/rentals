export default async function fetchTickets(id: string, page: number, searchQuery: string, status: string) {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/ticket/property?id=${id}&page=${page}&searchQuery=${searchQuery}&status=${status}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}