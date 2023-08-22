export default async function fetchTenantBillsStatistics(id: string) {
    console.log("fetchPayments", id)
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bills/tenant/statistics?id=${id}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}