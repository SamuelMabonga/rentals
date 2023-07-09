export default async function fetchFeatures(token: string, page: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/feature?page=${page}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}