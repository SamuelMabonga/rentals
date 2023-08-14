export default async function fetchPropertyFeatures(property: string, page: any) {
    if (!property) return new Error("No property Id")
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/propertyFeatures/property?id=${property}&page=${page}`, {
        headers: {
            // Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
        method: "GET"
    });

    const data = await response.json();
    return data
}