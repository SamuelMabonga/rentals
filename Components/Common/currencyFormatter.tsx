export default function currencyFormatter(amount: any, currency: any) {
    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency ?? 'UGX' });
    const formattedCurrency = currencyFormatter.format(amount);
    return formattedCurrency
}

