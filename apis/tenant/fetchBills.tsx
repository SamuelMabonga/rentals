export default async function fetchBills(token: string, id: string) {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bills/tenant?id=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();
    return data
}