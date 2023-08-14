export default async function fetchPropertyBookings(property: string, page: any, searchQuery: any, status: any) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/booking/property?id=${property}&page=${page}&searchQuery=${searchQuery}&status=${status}`,
        {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
            method: "GET"
        }
    );

    const data = await response.json();

    return data
}