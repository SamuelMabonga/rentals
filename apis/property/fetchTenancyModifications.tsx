export default async function fetchTenancyModifications(property: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/tenancyModification/property?id=${property}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();

    return data
}