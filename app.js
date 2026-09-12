const search = document.querySelector('#search');
const sections = [...document.querySelectorAll('.command-section')];
const rows = [...document.querySelectorAll('.command-row')];
const navLinks = [...document.querySelectorAll('#contents a')];
const status = document.querySelector('#result-count');
const clear = document.querySelector('#clear-search');
const empty = document.querySelector('#empty');
const toast = document.querySelector('#toast');
let toastTimer;

function filterCommands() {
  const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let count = 0;
  for (const section of sections) {
    let matches = 0;
    for (const row of section.querySelectorAll('.command-row')) {
      const haystack = `${section.dataset.title} ${row.textContent}`.toLowerCase();
      row.hidden = !words.every(word => haystack.includes(word));
      if (!row.hidden) matches++;
    }
    section.hidden = matches === 0;
    section.querySelector('.section-count').textContent = `${matches} examples`;
    count += matches;
  }
  for (const link of navLinks) link.hidden = document.getElementById(link.hash.slice(1)).hidden;
  clear.hidden = !words.length;
  empty.hidden = count !== 0;
  document.body.classList.toggle('searching', words.length > 0);
  status.textContent = words.length ? `${count} matching ${count === 1 ? 'example' : 'examples'}` : `${rows.length} examples across ${sections.length} topics`;
}
search.addEventListener('input', filterCommands);
clear.addEventListener('click', () => { search.value = ''; filterCommands(); search.focus(); });
document.querySelector('#reset-search').addEventListener('click', () => clear.click());
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
    event.preventDefault(); search.focus();
  }
  if (event.key === 'Escape' && document.activeElement === search) clear.click();
});

document.querySelector('#document').addEventListener('click', async event => {
  const button = event.target.closest('.copy-button');
  if (!button) return;
  const code = button.closest('.command-row').querySelector('code');
  try {
    await navigator.clipboard.writeText(code.textContent);
    toast.textContent = 'Command copied';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges(); selection.addRange(range);
    toast.textContent = 'Copy unavailable. Text selected; press Ctrl+C or ⌘C.';
  }
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
});

document.querySelector('#print').addEventListener('click', () => window.print());
document.querySelector('#text-size').addEventListener('change', event => {
  document.documentElement.style.setProperty('--reading-scale', event.target.value);
});
document.querySelector('#topic-select').addEventListener('change', event => {
  if (!event.target.value) return;
  search.value = ''; filterCommands();
  location.hash = event.target.value;
});

const observer = new IntersectionObserver(entries => {
  const current = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
  if (!current) return;
  for (const link of navLinks) {
    if (link.hash === `#${current.target.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  document.querySelector('#current-topic').textContent = current.target.dataset.title;
}, { rootMargin: '-12% 0px -65% 0px' });
sections.forEach(section => observer.observe(section));
filterCommands();
