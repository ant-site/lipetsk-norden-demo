/* Маршрутная схема: линии дорог от Липецка прорисовываются по мере прокрутки, город нажимается – расстояние уходит в калькулятор. */
(function () {
  var sec = document.querySelector('.route'); if (!sec) return;
  var paths = [].slice.call(sec.querySelectorAll('.route__line')), dots = [].slice.call(sec.querySelectorAll('.route__city'));
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var len = paths.map(function (p) { var l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = still ? 0 : l; return l; });
  function frame() {
    var r = sec.getBoundingClientRect(), vh = innerHeight;
    var p = Math.min(1, Math.max(0, (vh * .9 - r.top) / (r.height * .5 + vh * .1)));
    paths.forEach(function (el, i) {
      var a = i * .09, u = Math.min(1, Math.max(0, (p - a) / .5));
      el.style.strokeDashoffset = still ? 0 : len[i] * (1 - u);
      dots[i].classList.toggle('is-on', u > .97 || still);
    });
  }
  if (!still) { addEventListener('scroll', frame, { passive: true }); addEventListener('resize', frame); }
  frame();
  function pick(i) {
    paths.forEach(function (p, k) { p.classList.toggle('is-pick', k === i); dots[k].classList.toggle('is-pick', k === i); });
    sec.querySelectorAll('.route__chip').forEach(function (c, k) { c.setAttribute('aria-pressed', k === i); });
    var km = +dots[i].dataset.km, inp = document.getElementById('f-km');
    if (inp) { inp.value = km; inp.dispatchEvent(new Event('input', { bubbles: true })); }
  }
  sec.addEventListener('click', function (e) {
    var t = e.target.closest('[data-i]'); if (t) pick(+t.dataset.i);
  });
  pick(0);
})();
