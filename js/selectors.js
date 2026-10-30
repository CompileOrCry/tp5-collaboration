export function getCustomerById(customers, customerId) {
  return customers.find(customer => customer.id === customerId);
}

export function getProductById(products, productId) {
  return products.find(product => product.id === productId);
}

export function getLineAmount(product, quantity) {
  return product ? product.price * quantity : 0;
}

export function getOrderTotal(order, products) {
  let total = 0;
  order.items.forEach(item => {
    const product = getProductById(products, item.productId);
    total += getLineAmount(product, item.quantity);
  });
  return total;
}

export function buildOrderSummary(order, customers, products) {
  const customer = getCustomerById(customers, order.customerId);
  return {
    id: order.id,
    customerName: customer ? customer.name : "Spectateur inconnu",
    city: customer ? customer.city : "-",
    date: order.date,
    status: order.status,
    itemCount: order.items.length,
    total: getOrderTotal(order, products)
  };
}

export function buildOrderDetail(order, customers, products) {
  const summary = buildOrderSummary(order, customers, products);
  const lines = order.items.map(item => {
    const product = getProductById(products, item.productId);
    return {
      name: product ? product.name : "Titre inconnu",
      category: product ? product.category : "-",
      price: product ? product.price : 0,
      quantity: item.quantity,
      amount: getLineAmount(product, item.quantity)
    };
  });
  return { ...summary, lines };
}

export function getCategories(products) {
  const categories = [];
  products.forEach(product => {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  });
  return categories.sort();
}

export function filterOrders(currentState) {
  const { orders, customers, products, search, status, category } = currentState;
  const term = search.trim().toLowerCase();

  return orders.filter(order => {
    const customer = getCustomerById(customers, order.customerId);
    const matchSearch = term === "" || (customer && customer.name.toLowerCase().includes(term));
    const matchStatus = status === "all" || order.status === status;
    const matchCategory = category === "all" || order.items.some(item => {
      const product = getProductById(products, item.productId);
      return product && product.category === category;
    });
    return matchSearch && matchStatus && matchCategory;
  });
}

export function getIndicators(currentState) {
  const { customers, products, orders } = currentState;
  let cumulativeAmount = 0;
  let pendingCount = 0;

  orders.forEach(order => {
    if (order.status !== "Annulee") {
      cumulativeAmount += getOrderTotal(order, products);
    }
    if (order.status === "En attente") {
      pendingCount += 1;
    }
  });

  return [
    { label: "Spectateurs", value: customers.length },
    { label: "Titres au catalogue", value: products.length },
    { label: "Locations", value: orders.length },
    { label: "Montant cumulé (hors annulées)", value: formatMAD(cumulativeAmount) },
    { label: "Locations en attente", value: pendingCount }
  ];
}

export function formatMAD(amount) {
  return amount.toLocaleString("fr-FR") + " MAD";
}