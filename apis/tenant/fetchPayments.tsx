export default async function fetchPayments(token: string, id: string) {
    console.log("fetchPayments", id)
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/payments/tenant?id=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();
    return data
}