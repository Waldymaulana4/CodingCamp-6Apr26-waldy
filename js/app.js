'use strict';

// ── Storage Helpers ────────────────────────────────────────
function storageGet(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? [];
  } catch {
    return [];
  }
}

function storageSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

// ── Greeting Module ────────────────────────────────────────
const greetingModule = {
  init() {
    const greetingEl = document.querySelector('#greeting-text');
    const clockEl = document.querySelector('#clock');
    const dateEl = document.querySelector('#date');

    function tick() {
      const now = new Date();
      greetingEl.textContent =
        now.getHours() < 12 ? 'Good Morning' :
        now.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

      clockEl.textContent =
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0');

      dateEl.textContent = now.toDateString();
    }

    tick();
    setInterval(tick, 1000);
  },
};

// ── Timer Module (UPDATED) ─────────────────────────────────
const timerModule = (() => {
  let remaining = 1500;
  let intervalId = null;
  let displayEl = null;
  const STORAGE_KEY = 'pd_timer';

  function formatMMSS(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateDisplay() {
    displayEl.textContent = formatMMSS(remaining);
  }

  function tick() {
    if (remaining <= 0) return;
    remaining--;
    updateDisplay();

    if (remaining === 0) {
      stop();
      alert('Waktu selesai!');
    }
  }

  function start() {
    if (!intervalId) intervalId = setInterval(tick, 1000);
  }

  function stop() {
    clearInterval(intervalId);
    intervalId = null;
  }

  function reset() {
    stop();
    const saved = localStorage.getItem(STORAGE_KEY);
    remaining = saved ? parseInt(saved) : 1500;
    updateDisplay();
  }

  function setCustom(minutes) {
    if (!minutes || minutes <= 0) return;
    remaining = minutes * 60;
    localStorage.setItem(STORAGE_KEY, remaining);
    updateDisplay();
  }

  return {
    init() {
      displayEl = document.querySelector('#timer-display');

      document.querySelector('#btn-start').onclick = start;
      document.querySelector('#btn-stop').onclick = stop;
      document.querySelector('#btn-reset').onclick = reset;

      // custom timer
      const input = document.querySelector('#pomodoro-input');
      const btn = document.querySelector('#set-pomodoro');

      if (btn) {
        btn.addEventListener('click', () => {
          const val = parseInt(input.value);
          setCustom(val);
        });
      }

      reset();
    }
  };
})();

// ── Todo Module (UPDATED SORT) ─────────────────────────────
const todoModule = (() => {
  const KEY = 'pd_tasks';
  let tasks = [];
  let filter = 'all';

  function save() {
    storageSet(KEY, tasks);
  }

  function render() {
    const list = document.querySelector('#todo-list');
    list.innerHTML = '';

    let filtered = tasks;

    if (filter === 'active') {
      filtered = tasks.filter(t => !t.done);
    } else if (filter === 'done') {
      filtered = tasks.filter(t => t.done);
    }

    filtered.forEach(task => {
      const li = document.createElement('li');

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = task.done;
      cb.onchange = () => {
        task.done = !task.done;
        save();
        render();
      };

      const span = document.createElement('span');
      span.textContent = task.text;
      if (task.done) span.style.textDecoration = 'line-through';

      const del = document.createElement('button');
      del.textContent = 'X';
      del.onclick = () => {
        tasks = tasks.filter(t => t.id !== task.id);
        save();
        render();
      };

      li.append(cb, span, del);
      list.appendChild(li);
    });
  }

  return {
    init() {
      tasks = storageGet(KEY);

      document.querySelector('#todo-form').onsubmit = (e) => {
        e.preventDefault();
        const input = document.querySelector('#todo-input');

        if (!input.value.trim()) return;

        tasks.push({
          id: Date.now(),
          text: input.value,
          done: false
        });

        input.value = '';
        save();
        render();
      };

      // SORT BUTTONS
      document.querySelector('#sort-all')?.addEventListener('click', () => {
        filter = 'all';
        render();
      });

      document.querySelector('#sort-active')?.addEventListener('click', () => {
        filter = 'active';
        render();
      });

      document.querySelector('#sort-done')?.addEventListener('click', () => {
        filter = 'done';
        render();
      });

      render();
    }
  };
})();

// ── Links Module (UNCHANGED) ───────────────────────────────
const linksModule = (() => {
  const KEY = 'pd_links';
  let links = [];

  function save() {
    storageSet(KEY, links);
  }

  function render() {
    const panel = document.querySelector('#links-panel');
    panel.innerHTML = '';

    links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.label;
      a.target = '_blank';

      const btn = document.createElement('button');
      btn.textContent = 'X';
      btn.onclick = () => {
        links = links.filter(l => l.id !== link.id);
        save();
        render();
      };

      panel.append(a, btn);
    });
  }

  return {
    init() {
      links = storageGet(KEY);

      document.querySelector('#links-form').onsubmit = (e) => {
        e.preventDefault();

        const label = document.querySelector('#links-label').value;
        const url = document.querySelector('#links-url').value;

        if (!label || !url) return;

        links.push({ id: Date.now(), label, url });
        save();
        render();
      };

      render();
    }
  };
})();

// ── Theme Module ───────────────────────────────────────────
const themeModule = (() => {
  const KEY = 'pd_theme';

  function apply(theme) {
    document.body.classList.toggle('light', theme === 'light');
  }

  return {
    init() {
      const saved = localStorage.getItem(KEY) || 'dark';
      apply(saved);

      document.querySelector('#toggle-theme')?.addEventListener('click', () => {
        const current = localStorage.getItem(KEY) || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(KEY, next);
        apply(next);
      });
    }
  };
})();

// ── Bootstrap ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  greetingModule.init();
  timerModule.init();
  todoModule.init();
  linksModule.init();
  themeModule.init(); // ← penting (tadi belum ada)
});