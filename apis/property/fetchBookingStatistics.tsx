export default async function fetchBookingStatistics(property: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/booking/property/statistics?id=${property}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}