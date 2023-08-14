export default async function fetchBillsStatistics(property: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bills/property/statistics?id=${property}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}