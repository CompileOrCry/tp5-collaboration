import { state, setData, setSearch, setStatus, setCategory, setError } from "./state.js";
import { loadAllData } from "./dataService.js";
import {
  filterOrders,
  buildOrderSummary,
  buildOrderDetail,
  getCategories,
  getIndicators
} from "./selectors.js";
import {
  renderIndicators,
  renderOrders,
  populateCategories,
  showOrderDetail,
  showError,
  hideError
} from "./view.js";

function render() {
  renderIndicators(getIndicators(state));

  const visibleOrders = filterOrders(state);
  const summaries = visibleOrders.map(order =>
    buildOrderSummary(order, state.customers, state.products)
  );
  renderOrders(summaries);
}

function bindEvents() {
  document.getElementById("search-input").addEventListener("input", event => {
    setSearch(event.target.value);
    render();
  });

  document.getElementById("status-select").addEventListener("change", event => {
    setStatus(event.target.value);
    render();
  });

  document.getElementById("category-select").addEventListener("change", event => {
    setCategory(event.target.value);
    render();
  });

  document.getElementById("orders-container").addEventListener("click", event => {
    const button = event.target.closest("[data-order-id]");
    if (!button) return;

    const orderId = Number(button.dataset.orderId);
    const order = state.orders.find(item => item.id === orderId);
    if (order) {
      showOrderDetail(buildOrderDetail(order, state.customers, state.products));
    }
  });
}

async function init() {
  try {
    const data = await loadAllData();
    setData(data);
    hideError();
    populateCategories(getCategories(state.products));
    bindEvents();
    render();
  } catch (error) {
    console.error("Initialisation impossible :", error);
    const message = "Les données n'ont pas pu être chargées. Vérifiez les fichiers JSON dans le dossier data/ et lancez le projet avec un serveur local.";
    setError(message);
    showError(`${message} (${error.message})`);
  }
}

init();