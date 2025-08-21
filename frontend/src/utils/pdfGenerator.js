import jsPDF from 'jspdf';

export const generateInvoicePDF = (order) => {
  const pdf = new jsPDF();
  
  // Header - Business Details
  pdf.setFontSize(22);
  pdf.setTextColor(139, 69, 19);
  pdf.text('Stitch & Savour', 20, 25);
  
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Homemade Food & Handcrafted Crochet Products', 20, 35);
  pdf.text('Contact: +91 9970944685 | Email: sangita.shreyas@gmail.com', 20, 42);
  
  // Invoice Title & Number
  pdf.setFontSize(18);
  pdf.setTextColor(0, 0, 0);
  pdf.text('INVOICE', 150, 25);
  
  pdf.setFontSize(10);
  pdf.text(`Invoice #: ${order.orderNumber}`, 150, 35);
  pdf.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 150, 42);
  
  // Separator line
  pdf.setLineWidth(0.5);
  pdf.line(20, 50, 190, 50);
  
  // Customer Details Section
  pdf.setFontSize(12);
  pdf.setTextColor(139, 69, 19);
  pdf.text('Bill To:', 20, 65);
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  // Get customer data from localStorage order
  const storedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
  const fullOrder = storedOrders.find(o => o.orderNumber === order.orderNumber) || order;
  
  pdf.text(`Name: ${order.customerName || fullOrder.customerName || 'Customer'}`, 20, 75);
  
  // Get phone from order or user profile, avoid 'N/A'
  const phoneNumber = order.customerPhone || fullOrder.customerPhone || order.phone || fullOrder.phone;
  if (phoneNumber && phoneNumber !== 'N/A') {
    pdf.text(`Phone: ${phoneNumber}`, 20, 82);
  }
  
  // Payment Method
  pdf.text(`Payment: ${order.paymentMethod === 'qr' ? 'Online Payment' : 'Cash on Delivery'}`, 120, 75);
  
  // Items Table Header
  const tableStartY = 100;
  pdf.setFillColor(245, 245, 245);
  pdf.rect(20, tableStartY - 5, 170, 12, 'F');
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Item', 25, tableStartY);
  pdf.text('Qty', 120, tableStartY);
  pdf.text('Price', 140, tableStartY);
  pdf.text('Total', 165, tableStartY);
  
  // Items List
  let yPos = tableStartY + 15;
  pdf.setFontSize(9);
  
  order.items?.forEach((item) => {
    const itemPrice = item.finalPrice || item.price;
    const itemTotal = item.quantity * itemPrice;
    const itemName = item.selectedWeight ? `${item.name} (${item.selectedWeight})` : item.name;
    const hasLargeQuantity = (item.category === 'food' && item.quantity > 5) || (item.category === 'crochet' && item.quantity > 3);
    
    pdf.text(itemName.length > 35 ? itemName.substring(0, 35) + '...' : itemName, 25, yPos);
    pdf.text(item.quantity.toString(), 125, yPos);
    pdf.text(`Rs.${itemPrice}`, 140, yPos);
    pdf.text(`Rs.${itemTotal}`, 165, yPos);
    
    if (hasLargeQuantity) {
      yPos += 8;
      pdf.setFontSize(7);
      pdf.setTextColor(255, 140, 0);
      pdf.text('* Large quantity - delivery time may vary, owner will inform soon', 25, yPos);
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      yPos += 8;
    } else {
      yPos += 12;
    }
  });
  
  // Total Section
  pdf.setLineWidth(0.3);
  pdf.line(120, yPos + 5, 190, yPos + 5);
  
  yPos += 15;
  pdf.setFontSize(11);
  pdf.setTextColor(139, 69, 19);
  pdf.text(`Total Amount: Rs.${order.total || order.totalAmount}`, 120, yPos);
  
  // Footer
  yPos += 25;
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Thank you for choosing Stitch & Savour!', 20, yPos);
  pdf.text('For any queries, contact us at +91 9970944685', 20, yPos + 7);
  
  // Download
  pdf.save(`Invoice-${order.orderNumber}.pdf`);
};