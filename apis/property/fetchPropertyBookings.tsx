export default async function fetchPropertyBookings(token: string, property: string, page: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/booking/property?id=${property}&page=${page}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}