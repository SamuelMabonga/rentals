export default async function fetchPropertyUnits(property: string, page: any, searchQuery: any, status: any) {
    // if (!property || !token) return
    console.log("fetchPropertyUnits", property, page, searchQuery, status)
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unit/property?id=${property}&page=${page}&searchQuery=${searchQuery}&status=${status}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();

    return data
}