export default async function fetchStaff(property: string, page: any, searchQuery: string, status: string) {
    // if (!property) return new Error("No property Id")
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/staff/property?id=${property}&page=${page}&searchQuery=${searchQuery}&status=${status}`, {
        headers: {
            // Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
        method: "GET"
    });

    const data = await response.json();
    return data
}