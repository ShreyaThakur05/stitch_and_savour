// Excel export utility
export const exportToExcel = (data, filename = 'export.csv') => {
  const csvContent = data.map(row => 
    Object.values(row).map(value => 
      typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    ).join(',')
  ).join('\n');
  
  const headers = Object.keys(data[0] || {}).join(',');
  const fullContent = headers + '\n' + csvContent;
  
  const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportOrdersToExcel = (orders) => {
  const exportData = orders.map(order => ({
    'Order ID': order.orderNumber,
    'Customer Name': order.customerName,
    'Email': order.customerEmail || 'N/A',
    'Phone': order.phone || 'N/A',
    'Total Amount': order.total,
    'Payment Method': order.paymentMethod === 'qr' ? 'Online' : 'COD',
    'Payment Status': order.paymentMethod === 'qr' ? 'Paid' : 'Pending',
    'Order Status': order.status,
    'Order Date': new Date(order.createdAt).toLocaleDateString(),
    'Delivery Deadline': new Date(order.estimatedDelivery).toLocaleDateString(),
    'Items': order.items?.map(item => `${item.name} (${item.quantity})`).join('; ') || 'N/A',
    'Category': order.items?.[0]?.category || 'Mixed'
  }));
  
  exportToExcel(exportData, `orders_${new Date().toISOString().split('T')[0]}.csv`);
};