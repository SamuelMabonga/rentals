export default async function fetchOccupancy(property: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/property/occupancy?id=${property}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}