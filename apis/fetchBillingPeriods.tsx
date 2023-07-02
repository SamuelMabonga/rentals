export default async function fetchBillingPeriods(token: any, method: 'GET' | 'DELETE', id?: any) {
    const url = id ? `${process.env.NEXT_PUBLIC_HOST}/api/billingPeriods/${id}` : `${process.env.NEXT_PUBLIC_HOST}/api/billingPeriods`;
  
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
  
    const requestOptions = {
      method: method,
      headers: headers,
    };
  
    if (method === 'GET') {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } else if (method === 'DELETE') {
      await fetch(url, requestOptions);
      return; // For DELETE, simply return after the request is made
    } else {
      throw new Error('Unsupported method'); // Throw an error for unsupported methods
    }
  }
  