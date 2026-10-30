import { formatMAD } from "./selectors.js";

const STATUS_CLASSES = {
  "Livree": "text-bg-success",
  "En attente": "text-bg-warning",
  "Annulee": "text-bg-danger"
};

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

function statusBadge(status) {
  const cssClass = STATUS_CLASSES[status] || "text-bg-secondary";
  return `<span class="badge ${cssClass}">${escapeHtml(status)}</span>`;
}

export function renderIndicators(indicators) {
  const container = document.getElementById("indicators");
  container.innerHTML = indicators.map(indicator => `
    <div class="col-6 col-lg">
      <div class="card h-100">
        <div class="card-body">
          <div class="text-muted small">${escapeHtml(indicator.label)}</div>
          <div class="indicator-value">${escapeHtml(indicator.value)}</div>
        </div>
      </div>
    </div>
  `).join("");
}

export function renderOrders(summaries) {
  const container = document.getElementById("orders-container");

  if (summaries.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info mb-0">Aucune location ne correspond à votre recherche. Modifiez les filtres.</div>
      </div>`;
    return;
  }

  container.innerHTML = summaries.map(order => `
    <div class="col-12 col-md-6 col-xl-4">
      <div class="card order-card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <h2 class="h5 mb-0">Location #${order.id}</h2>
            ${statusBadge(order.status)}
          </div>
          <div>Spectateur : ${escapeHtml(order.customerName)}</div>
          <div class="text-muted">${escapeHtml(order.city)} - ${escapeHtml(order.date)}</div>
          <div>${order.itemCount} titre(s)</div>
          <div class="fw-bold">Total : ${formatMAD(order.total)}</div>
          <button class="btn btn-outline-primary btn-sm" data-order-id="${order.id}">Voir le détail</button>
        </div>
      </div>
    </div>
  `).join("");
}

export function populateCategories(categories) {
  const select = document.getElementById("category-select");
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

export function showOrderDetail(detail) {
  document.getElementById("order-modal-title").textContent = `Location #${detail.id}`;

  const rows = detail.lines.map(line => `
    <tr>
      <td>${escapeHtml(line.name)} <span class="text-muted small">(${escapeHtml(line.category)})</span></td>
      <td class="text-end">${formatMAD(line.price)}</td>
      <td class="text-end">${line.quantity}</td>
      <td class="text-end">${formatMAD(line.amount)}</td>
    </tr>
  `).join("");

  document.getElementById("order-modal-body").innerHTML = `
    <dl class="row mb-3">
      <dt class="col-sm-3">Spectateur</dt><dd class="col-sm-9">${escapeHtml(detail.customerName)}</dd>
      <dt class="col-sm-3">Ville</dt><dd class="col-sm-9">${escapeHtml(detail.city)}</dd>
      <dt class="col-sm-3">Date</dt><dd class="col-sm-9">${escapeHtml(detail.date)}</dd>
      <dt class="col-sm-3">Statut</dt><dd class="col-sm-9">${statusBadge(detail.status)}</dd>
    </dl>
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Titre</th>
            <th class="text-end">Prix de location</th>
            <th class="text-end">Quantité</th>
            <th class="text-end">Montant</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <th colspan="3" class="text-end">Total</th>
            <th class="text-end">${formatMAD(detail.total)}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  const modalElement = document.getElementById("order-modal");
  bootstrap.Modal.getOrCreateInstance(modalElement).show();
}

export function showError(message) {
  const zone = document.getElementById("error-zone");
  zone.textContent = message;
  zone.classList.remove("d-none");
}

export function hideError() {
  document.getElementById("error-zone").classList.add("d-none");
}