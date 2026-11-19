const STORAGE_KEY = 'my-tasks-v1';

const form = document.getElementById('add-form');
const input = document.getElementById('task-input');
const list = document.getElementById('list');
const emptyEl = document.getElementById('empty');
const summary = document.getElementById('summary');
const clearBtn = document.getElementById('clear-done');
const filterBtns = document.querySelectorAll('.filter');

let tasks = load();
let filter = 'all';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const fa = new Intl.NumberFormat('fa-IR');

function render() {
  const visible = tasks.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  );

  list.innerHTML = '';
  visible.forEach(t => {
    const li = document.createElement('li');
    li.className = 'item' + (t.done ? ' done' : '');

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = t.done;
    cb.setAttribute('aria-label', 'انجام شد');
    cb.addEventListener('change', () => {
      t.done = cb.checked;
      save();
      render();
    });

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = t.text;

    const del = document.createElement('button');
    del.className = 'del';
    del.type = 'button';
    del.textContent = 'حذف';
    del.addEventListener('click', () => {
      tasks = tasks.filter(x => x.id !== t.id);
      save();
      render();
    });

    li.append(cb, text, del);
    list.appendChild(li);
  });

  const remaining = tasks.filter(t => !t.done).length;
  summary.textContent = tasks.length
    ? `${fa.format(remaining)} کار باقی مانده از ${fa.format(tasks.length)} کار`
    : 'هنوز کاری ثبت نشده';

  emptyEl.hidden = visible.length > 0;
  if (!visible.length) {
    emptyEl.textContent = tasks.length
      ? 'در این فهرست کاری نیست.'
      : 'اولین کارت را در کادر بالا بنویس و افزودن را بزن.';
  }

  clearBtn.hidden = !tasks.some(t => t.done);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  tasks.unshift({ id: Date.now(), text: value, done: false });
  input.value = '';
  save();
  render();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.toggle('active', b === btn));
    render();
  });
});

clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
});

render();
