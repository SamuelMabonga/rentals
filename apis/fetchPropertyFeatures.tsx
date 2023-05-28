export default async function fetchPropertyFeatures(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/propertyFeatures`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}