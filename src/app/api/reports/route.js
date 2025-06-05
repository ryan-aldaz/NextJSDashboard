// Mock data generator functions
const generateSalesData = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    date: `2024-${String(i + 1).padStart(2, '0')}-01`,
    product: `Product ${i + 1}`,
    revenue: Math.floor(Math.random() * 10000),
    units: Math.floor(Math.random() * 100),
    region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)]
  }));
};

const generateInventoryData = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    product: `Product ${i + 1}`,
    sku: `SKU${String(i + 1).padStart(4, '0')}`,
    quantity: Math.floor(Math.random() * 1000),
    location: ['Warehouse A', 'Warehouse B', 'Store 1', 'Store 2'][Math.floor(Math.random() * 4)],
    status: ['In Stock', 'Low Stock', 'Out of Stock'][Math.floor(Math.random() * 3)]
  }));
};

const generateCustomerData = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    customerId: `CUST${String(i + 1).padStart(4, '0')}`,
    name: `Customer ${i + 1}`,
    segment: ['Premium', 'Standard', 'Basic'][Math.floor(Math.random() * 3)],
    totalSpent: Math.floor(Math.random() * 50000),
    lastPurchase: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`
  }));
};

const generateProductData = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    productId: `PROD${String(i + 1).padStart(4, '0')}`,
    name: `Product ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Home', 'Sports'][Math.floor(Math.random() * 4)],
    revenue: Math.floor(Math.random() * 100000),
    profit: Math.floor(Math.random() * 50000),
    rating: (Math.random() * 5).toFixed(1)
  }));
};

const generateOrderData = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    orderId: `ORD${String(i + 1).padStart(4, '0')}`,
    customer: `Customer ${i + 1}`,
    date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
    total: Math.floor(Math.random() * 1000),
    status: ['Completed', 'Processing', 'Shipped'][Math.floor(Math.random() * 3)],
    paymentMethod: ['Credit Card', 'PayPal', 'Bank Transfer'][Math.floor(Math.random() * 3)]
  }));
};

export async function POST(request) {
  const payload = await request.json();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let data;
  switch (payload.type) {
    case 'sales':
      data = generateSalesData();
      break;
    case 'inventory':
      data = generateInventoryData();
      break;
    case 'customers':
      data = generateCustomerData();
      break;
    case 'products':
      data = generateProductData();
      break;
    case 'orders':
      data = generateOrderData();
      break;
    default:
      return new Response(JSON.stringify({ error: 'Invalid report type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
} 