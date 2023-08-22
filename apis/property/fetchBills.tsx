export default async function fetchBills(property: string, page: any, searchQuery: string, status: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bills/property?id=${property}&page=${page}&searchQuery=${searchQuery}&status=${status}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}