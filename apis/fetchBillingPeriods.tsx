export default async function fetchBillingPeriods(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/billingPeriods`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return data
}