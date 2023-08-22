export default async function fetchTenancyModifications(property: string, page: number, searchQuery: string, status: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/tenancyModification/property?id=${property}&page=${page}&searchQuery=${searchQuery}&status=${status}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();

    return data
}