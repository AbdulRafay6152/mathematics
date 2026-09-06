/**
 * MATH FORMULA LIBRARY - MAIN CONTROLLER & CARD RENDERER
 * Top-Right Copy Button & Expandable Description Drawer
 */

function renderFormulaCard(item, relativeRoot = "") {
  const card = document.createElement('article');
  card.className = 'formula-card';
  card.dataset.id = item.id;
  card.dataset.category = item.category;

  const watermarkText = item.category.toUpperCase();

  card.innerHTML = `
    <div class="card-header-bar">
      <span class="card-meta-tag">${item.category}</span>
      <button class="btn-card-copy" title="Copy Formula" aria-label="Copy formula ${item.title}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span class="copy-label">Copy</span>
      </button>
    </div>

    <div class="card-stage">
      <div class="card-watermark" aria-hidden="true">${watermarkText}</div>
      <div class="card-math-box">
        <div class="formula-math">${item.plainText}</div>
      </div>
    </div>

    <div class="card-body">
      <h3 class="card-title">${item.title}</h3>
      <div class="card-footer-row">
        <span class="card-details-trigger" role="button" tabindex="0">Full variables →</span>
        <button class="btn-pill-desc" aria-expanded="false">
          <span class="desc-btn-text">Description</span>
          <span class="desc-arrow">▾</span>
        </button>
      </div>
    </div>

    <div class="card-drawer">
      <div class="card-drawer-inner">
        <div class="card-drawer-content">
          <div class="card-drawer-label">Description</div>
          <p class="card-drawer-text">${item.description}</p>
        </div>
      </div>
    </div>
  `;

  // Render KaTeX notation if library is present
  const mathEl = card.querySelector('.formula-math');
  if (window.katex && item.latex) {
    try {
      katex.render(item.latex, mathEl, {
        throwOnError: false,
        displayMode: true
      });
    } catch (e) {
      mathEl.textContent = item.plainText;
    }
  }

  // Top-Right Copy Button (stops propagation so it does NOT expand the card)
  const copyBtn = card.querySelector('.btn-card-copy');
  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    copyToClipboard(item.plainText, copyBtn);
  });

  // Expandable Description Toggle
  const descBtn = card.querySelector('.btn-pill-desc');
  const descText = descBtn.querySelector('.desc-btn-text');

  descBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = card.classList.toggle('is-expanded');
    descBtn.setAttribute('aria-expanded', isExpanded);
    descText.textContent = isExpanded ? 'Hide' : 'Description';
  });

  // Modal details trigger
  const detailsTrigger = card.querySelector('.card-details-trigger');
  detailsTrigger.addEventListener('click', () => {
    openFormulaDetails(item.id);
  });
  detailsTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFormulaDetails(item.id);
    }
  });

  return card;
}

function renderFormulaGrid(containerId, itemsList, relativeRoot = "") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  if (!itemsList || itemsList.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 14px auto;">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>No formulas found</h3>
        <p>Try searching for another mathematical concept, symbol, or theorem.</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();
  itemsList.forEach(item => {
    fragment.appendChild(renderFormulaCard(item, relativeRoot));
  });
  container.appendChild(fragment);
}

function renderCategoryPills(containerId, activeCat = 'all', onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const categories = [
    "all", "Algebra", "Trigonometry", "Geometry", "Calculus",
    "Differentiation", "Integration", "Probability", "Statistics",
    "Coordinate Geometry", "Sequences & Series", "Logarithms",
    "Exponents", "Matrices", "Vectors", "Mensuration", "Mathematical Constants"
  ];

  container.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `category-pill ${cat.toLowerCase() === activeCat.toLowerCase() ? 'active' : ''}`;
    btn.textContent = cat === 'all' ? 'All Formulas' : cat;

    btn.addEventListener('click', () => {
      container.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      if (typeof onSelect === 'function') {
        onSelect(cat);
      }
    });

    container.appendChild(btn);
  });
}