/**
 * SEARCH ENGINE
 */
function setupSearch(onFilter) {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  if (!input) return;

  function doSearch() {
    const q = input.value.trim().toLowerCase();
    if (clearBtn) clearBtn.style.display = q.length > 0 ? 'inline-flex' : 'none';
    if (typeof onFilter === 'function') onFilter(q);
  }

  input.addEventListener('input', doSearch);
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.focus();
      doSearch();
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    } else if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    } else if (e.key === 'Escape' && document.activeElement === input) {
      input.value = '';
      doSearch();
      input.blur();
    }
  });
}

function filterFormulas(list, query, activeCat) {
  return list.filter(item => {
    const matchesCat = (!activeCat || activeCat.toLowerCase() === 'all') ? true : item.category.toLowerCase() === activeCat.toLowerCase();
    if (!matchesCat) return false;
    if (!query) return true;

    const tMatch = item.title.toLowerCase().includes(query);
    const dMatch = item.description.toLowerCase().includes(query);
    const pMatch = item.plainText.toLowerCase().includes(query);
    const kMatch = item.keywords.some(k => k.toLowerCase().includes(query));
    return tMatch || dMatch || pMatch || kMatch;
  });
}