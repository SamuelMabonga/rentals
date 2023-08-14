export default async function fetchExtensions(property: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/extension/property?id=${property}`, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
        method: "GET"
    });

    const data = await response.json();
    return data
}