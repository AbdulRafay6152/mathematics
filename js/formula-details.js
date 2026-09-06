/**
 * MODAL DETAILS & CLIPBOARD
 */
let activeFormula = null;

function initFormulaModal() {
  let modal = document.getElementById('formula-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'formula-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-window">
        <button class="modal-close" id="modal-close-btn" aria-label="Close details">✕</button>
        <span class="modal-category-badge" id="modal-category"></span>
        <h2 class="modal-title" id="modal-title"></h2>
        <div class="modal-formula-box" id="modal-formula-display"></div>
        <div class="modal-body-section">
          <div class="modal-section-title">Description</div>
          <p id="modal-description"></p>
        </div>
        <div class="modal-body-section">
          <div class="modal-section-title">Variables & Notation</div>
          <ul class="modal-variables-list" id="modal-variables"></ul>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" id="modal-copy-btn">Copy Plain Formula</button>
          <button class="btn-secondary" id="modal-copy-latex-btn">Copy LaTeX</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    document.getElementById('modal-copy-btn').addEventListener('click', () => {
      if (activeFormula) copyToClipboard(activeFormula.plainText, document.getElementById('modal-copy-btn'));
    });
    document.getElementById('modal-copy-latex-btn').addEventListener('click', () => {
      if (activeFormula) copyToClipboard(activeFormula.latex, document.getElementById('modal-copy-latex-btn'));
    });
  }
}

function openFormulaDetails(id) {
  const item = formulasData.find(f => f.id === id);
  if (!item) return;

  activeFormula = item;
  initFormulaModal();

  const modal = document.getElementById('formula-modal');
  document.getElementById('modal-category').textContent = item.category;
  document.getElementById('modal-title').textContent = item.title;
  document.getElementById('modal-description').textContent = item.description;

  const disp = document.getElementById('modal-formula-display');
  disp.innerHTML = '';
  const mathEl = document.createElement('div');
  mathEl.className = 'formula-math';
  mathEl.textContent = item.plainText;
  disp.appendChild(mathEl);

  if (window.katex && item.latex) {
    try { katex.render(item.latex, mathEl, { displayMode: true, throwOnError: false }); } catch (e) {}
  }

  const varList = document.getElementById('modal-variables');
  varList.innerHTML = '';
  if (item.variables && item.variables.length) {
    item.variables.forEach(v => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${v.name}</strong> <span>${v.desc}</span>`;
      varList.appendChild(li);
    });
  } else {
    varList.innerHTML = '<li><em>Standard variables apply.</em></li>';
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('formula-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.classList.add('copied');
    btn.textContent = 'Copied ✓';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = orig;
    }, 1800);
  });
}