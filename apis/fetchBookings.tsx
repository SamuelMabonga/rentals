export default async function fetchBookings(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/booking`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}