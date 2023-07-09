export default async function fetchProperties() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/property`, {
        headers: {
            // Authorization: `Bearer ${token}`,
            Accept: "application/json",

        },
        method: "GET"
    });

    const data = await response.json();

    return data
}