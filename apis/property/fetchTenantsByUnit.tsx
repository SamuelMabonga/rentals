export default async function fetchTenantsByUnit(property: string, unit: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unit/property/tenant?id=${property}&unit=${unit}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();

    return data
}