export default async function fetchTicketsStatistics(property: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/ticket/property/statistics?id=${property}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}