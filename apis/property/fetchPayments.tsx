export default async function fetchPayments(id: string, page: number, searchQuery: string, status: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/payments/property?id=${id}&page=${page}&searchQuery=${searchQuery}&status=${status}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}