(function () {
  'use strict';
  var NEW_DAYS = __NEW_DAYS__;

  // "New" badge: computed in the browser, so it disappears on time without a rebuild.
  var now = Date.now();
  document.querySelectorAll('[data-created]').forEach(function (el) {
    var t = Date.parse(el.getAttribute('data-created'));
    if (t && now - t < NEW_DAYS * 864e5) {
      var badge = el.querySelector('.badge.new');
      if (badge) badge.hidden = false;
    }
  });

  var grid = document.getElementById('grid');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var input = document.getElementById('q');
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  var total = cards.length;

  var params = new URLSearchParams(location.search);
  var state = { cat: params.get('c') || '', q: params.get('q') || '' };
  if (!chips.some(function (c) { return c.getAttribute('data-cat') === state.cat; })) state.cat = '';
  input.value = state.q;

  function norm(s) {
    return s.toLowerCase().replace(/[׳״'"`״׳]/g, '').replace(/\s+/g, ' ').trim();
  }

  function matches(card, q) {
    if (state.cat && card.getAttribute('data-cat') !== state.cat) return false;
    if (!q) return true;
    if (/^\d+$/.test(q)) return card.getAttribute('data-code') === q;
    return norm(card.getAttribute('data-name')).indexOf(q) !== -1;
  }

  function render() {
    var q = norm(state.q);
    var shown = 0;
    cards.forEach(function (card) {
      var ok = matches(card, q);
      card.hidden = !ok;
      if (ok) shown++;
    });
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-cat') === state.cat));
    });
    count.textContent = shown === total ? total + ' המלצות' : shown + ' מתוך ' + total + ' המלצות';
    empty.hidden = shown !== 0;

    var p = new URLSearchParams();
    if (state.cat) p.set('c', state.cat);
    if (state.q) p.set('q', state.q);
    var qs = p.toString();
    try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '')); } catch (e) { /* embedded previews */ }
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      state.cat = c.getAttribute('data-cat');
      render();
    });
  });
  input.addEventListener('input', function () {
    state.q = input.value;
    render();
  });
  document.getElementById('reset').addEventListener('click', function () {
    state.cat = '';
    state.q = '';
    input.value = '';
    render();
    input.focus();
  });

  render();
})();
