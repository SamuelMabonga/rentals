export default async function fetchBills(id: string, page: any, searchQuery: any, status: any) {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bills/tenant?id=${id}&page=${page}&searchQuery=${searchQuery}&status=${status}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}