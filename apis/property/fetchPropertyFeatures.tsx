export default async function fetchPropertyFeatures(property: string) {
    // if (!id) return new Error("No property Id")
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/propertyFeatures/property?id=${property}`, {
        headers: {
            // Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
        method: "GET"
    });

    const data = await response.json();
    return data
}