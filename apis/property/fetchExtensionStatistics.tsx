export default async function fetchExtensionStatistics(property: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/extension/property/statistics?id=${property}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}