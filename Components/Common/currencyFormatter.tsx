export default function currencyFormatter(amount: any, currency: any, style: any = 'currency') {
    const currencyFormatter = new Intl.NumberFormat('en-US', { style: style, currency: currency ?? 'UGX',  });
    const formattedCurrency = currencyFormatter.format(amount);
    return formattedCurrency
    
}

