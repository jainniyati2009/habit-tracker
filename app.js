/* ═══════════════════════════════════════════════
   Habitly — Enhanced App Logic
   ═══════════════════════════════════════════════ */

// ── Helpers ──
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function parseKey(k) { const [y,m,d]=k.split('-').map(Number); return new Date(y,m-1,d,12); }
function weekStart(d) { const x=new Date(d); x.setDate(x.getDate()-x.getDay()); x.setHours(12,0,0,0); return x; }
function weekDays(s) { return Array.from({length:7},(_,i)=>{const d=new Date(s);d.setDate(d.getDate()+i);return d}); }
function uid() { return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
function escHTML(s) { const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
function clamp(v,lo,hi) { return Math.max(lo,Math.min(hi,v)); }

// ═══════════════════════════════════
// QUOTES
// ═══════════════════════════════════
const QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "We are what we repeatedly do. Excellence is not an act, but a habit. — Aristotle",
  "Small daily improvements over time lead to stunning results. — Robin Sharma",
  "Success is the sum of small efforts repeated day in and day out. — Robert Collier",
  "Motivation is what gets you started. Habit is what keeps you going. — Jim Ryun",
  "A journey of a thousand miles begins with a single step. — Lao Tzu",
  "You do not rise to the level of your goals. You fall to the level of your systems. — James Clear",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "It does not matter how slowly you go as long as you do not stop. — Confucius",
  "Discipline is choosing between what you want now and what you want most. — Abraham Lincoln",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Start where you are. Use what you have. Do what you can. — Arthur Ashe",
  "The best time to plant a tree was 20 years ago. The second best time is now. — Chinese Proverb",
  "Habits are the compound interest of self-improvement. — James Clear",
  "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
  "What you do every day matters more than what you do once in a while. — Gretchen Rubin",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "First forget inspiration. Habit is more dependable. — Octavia Butler",
  "Champions keep playing until they get it right. — Billie Jean King",
  "Progress, not perfection. — Unknown",
];

// ═══════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════
const TEMPLATES = [
  { name:'Morning Workout', icon:'🏋️', category:'health', color:'#10b981', priority:'high' },
  { name:'Read 30 Minutes', icon:'📖', category:'mind', color:'#6366f1', priority:'medium' },
  { name:'Drink 8 Glasses of Water', icon:'💧', category:'health', color:'#3b82f6', priority:'high' },
  { name:'Meditate 10 Minutes', icon:'🧘', category:'mind', color:'#8b5cf6', priority:'medium' },
  { name:'Journal', icon:'📝', category:'creative', color:'#f59e0b', priority:'low' },
  { name:'No Social Media', icon:'📵', category:'productivity', color:'#ef4444', priority:'high' },
  { name:'Walk 10,000 Steps', icon:'🚶', category:'health', color:'#14b8a6', priority:'medium' },
  { name:'Study 1 Hour', icon:'📚', category:'productivity', color:'#6366f1', priority:'high' },
  { name:'Practice Instrument', icon:'🎸', category:'creative', color:'#ec4899', priority:'medium' },
  { name:'Call a Friend', icon:'📞', category:'social', color:'#f43f5e', priority:'low' },
  { name:'Healthy Breakfast', icon:'🥗', category:'health', color:'#84cc16', priority:'medium' },
  { name:'Sleep by 11 PM', icon:'😴', category:'health', color:'#8b5cf6', priority:'high' },
  { name:'Learn Something New', icon:'💡', category:'mind', color:'#f97316', priority:'medium' },
  { name:'No Junk Food', icon:'🚫', category:'health', color:'#ef4444', priority:'medium' },
  { name:'Stretch / Yoga', icon:'🤸', category:'health', color:'#14b8a6', priority:'low' },
  { name:'Clean / Organize', icon:'🧹', category:'productivity', color:'#06b6d4', priority:'low' },
];

// ═══════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════
const ACHIEVEMENTS = [
  { id:'first_habit',   icon:'🌱', name:'First Seed',          desc:'Create your first habit', check: s => s.habits.length >= 1 },
  { id:'five_habits',   icon:'🌿', name:'Growing Garden',      desc:'Create 5 habits',         check: s => s.habits.length >= 5 },
  { id:'ten_habits',    icon:'🌳', name:'Forest Builder',      desc:'Create 10 habits',        check: s => s.habits.length >= 10 },
  { id:'first_check',   icon:'✅', name:'First Step',          desc:'Complete a habit for the first time', check: s => Object.keys(s.log).length >= 1 },
  { id:'streak_3',      icon:'🔥', name:'On Fire',             desc:'Reach a 3-day streak',    check: s => s.habits.some(h => calcStreak(h) >= 3) },
  { id:'streak_7',      icon:'💥', name:'Week Warrior',        desc:'Reach a 7-day streak',    check: s => s.habits.some(h => calcStreak(h) >= 7) },
  { id:'streak_14',     icon:'⚡', name:'Unstoppable',         desc:'Reach a 14-day streak',   check: s => s.habits.some(h => calcStreak(h) >= 14) },
  { id:'streak_30',     icon:'🏆', name:'Monthly Champion',    desc:'Reach a 30-day streak',   check: s => s.habits.some(h => calcStreak(h) >= 30) },
  { id:'streak_100',    icon:'💎', name:'Diamond Discipline',  desc:'Reach a 100-day streak',  check: s => s.habits.some(h => calcStreak(h) >= 100) },
  { id:'perfect_day',   icon:'⭐', name:'Perfect Day',         desc:'Complete all habits in a day', check: s => hasPerfectDay(s) },
  { id:'perfect_week',  icon:'🌟', name:'Perfect Week',        desc:'7 perfect days in a row', check: s => hasPerfectWeekStreak(s) },
  { id:'fifty_checks',  icon:'📊', name:'Half Century',        desc:'Complete 50 total check-ins', check: s => Object.keys(s.log).length >= 50 },
  { id:'hundred_checks',icon:'💯', name:'Century Club',        desc:'Complete 100 total check-ins', check: s => Object.keys(s.log).length >= 100 },
  { id:'five_hundred',  icon:'🚀', name:'Rocket Fuel',         desc:'Complete 500 total check-ins', check: s => Object.keys(s.log).length >= 500 },
  { id:'night_owl',     icon:'🦉', name:'Night Owl',           desc:'Complete a habit after 10 PM', check: s => s.nightOwl },
  { id:'early_bird',    icon:'🐦', name:'Early Bird',          desc:'Complete a habit before 7 AM', check: s => s.earlyBird },
  { id:'level_5',       icon:'🎖️', name:'Rank Up',             desc:'Reach Level 5',           check: s => calcLevel(s.xp).level >= 5 },
  { id:'level_10',      icon:'👑', name:'Royalty',              desc:'Reach Level 10',          check: s => calcLevel(s.xp).level >= 10 },
  { id:'all_categories',icon:'🌈', name:'Renaissance',         desc:'Have habits in every category', check: s => hasAllCategories(s) },
  { id:'dark_mode',     icon:'🌙', name:'Dark Side',           desc:'Enable dark mode',        check: s => s.usedDarkMode },
];

// ═══════════════════════════════════
// STATE
// ═══════════════════════════════════
const STATE_KEY = 'habitly_data_v2';
const THEME_KEY = 'habitly_theme';
const ACCENT_KEY = 'habitly_accent';
const ONBOARD_KEY = 'habitly_onboarded';

let state = {
  habits: [],
  log: {},
  xp: 0,
  unlockedAchievements: [],
  nightOwl: false,
  earlyBird: false,
  usedDarkMode: false,
  soundEnabled: true,
  customOrder: [],
};

let currentWeekStart = weekStart(new Date());
let selectedDate = new Date();
let editingHabitId = null;
let activeFilter = 'all';
let searchQuery = '';
let sortMode = 'custom';
let onboardingStep = 0;

// ── Persistence ──
function save() { localStorage.setItem(STATE_KEY, JSON.stringify(state)); }
function load() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      state.habits = p.habits || [];
      state.log = p.log || {};
      state.xp = p.xp || 0;
      state.unlockedAchievements = p.unlockedAchievements || [];
      state.nightOwl = p.nightOwl || false;
      state.earlyBird = p.earlyBird || false;
      state.usedDarkMode = p.usedDarkMode || false;
      state.soundEnabled = p.soundEnabled !== undefined ? p.soundEnabled : true;
      state.customOrder = p.customOrder || [];
    }
  } catch(e) { console.warn('Load failed',e); }
}

// ═══════════════════════════════════
// THEME & ACCENT
// ═══════════════════════════════════
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  $('#themeToggle .icon-btn__icon').textContent = theme === 'dark' ? '☀️' : '🌙';
  if ($('#darkModeToggle')) $('#darkModeToggle').checked = theme === 'dark';
  if (theme === 'dark') { state.usedDarkMode = true; save(); checkAchievements(); }
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(cur === 'dark' ? 'light' : 'dark');
}
function applyAccent(accent) {
  document.documentElement.setAttribute('data-accent', accent);
  localStorage.setItem(ACCENT_KEY, accent);
  renderThemeGrid();
}
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const savedAccent = localStorage.getItem(ACCENT_KEY);
  if (savedTheme) applyTheme(savedTheme);
  else if (window.matchMedia('(prefers-color-scheme:dark)').matches) applyTheme('dark');
  if (savedAccent) applyAccent(savedAccent);
}

const ACCENT_OPTIONS = [
  { id:'indigo', color:'#6366f1', label:'Indigo' },
  { id:'rose', color:'#f43f5e', label:'Rose' },
  { id:'emerald', color:'#10b981', label:'Emerald' },
  { id:'amber', color:'#f59e0b', label:'Amber' },
  { id:'sky', color:'#0ea5e9', label:'Sky' },
  { id:'violet', color:'#8b5cf6', label:'Violet' },
  { id:'pink', color:'#ec4899', label:'Pink' },
  { id:'teal', color:'#14b8a6', label:'Teal' },
  { id:'orange', color:'#f97316', label:'Orange' },
  { id:'cyan', color:'#06b6d4', label:'Cyan' },
];

function renderThemeGrid(containerId = 'themeGrid') {
  const grid = $(containerId === 'themeGrid' ? '#themeGrid' : '#onboardingThemes');
  if (!grid) return;
  const current = document.documentElement.getAttribute('data-accent') || 'indigo';
  grid.innerHTML = ACCENT_OPTIONS.map(a => `
    <div class="theme-swatch${a.id===current?' active':''}"
         style="background:${a.color}" data-accent="${a.id}" data-label="${a.label}"
         onclick="applyAccent('${a.id}')" title="${a.label}"></div>
  `).join('');
}

// ═══════════════════════════════════
// VIEWS
// ═══════════════════════════════════
function switchView(v) {
  $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  $$('.view').forEach(el => el.classList.remove('view--active'));
  $(`#${v}View`).classList.add('view--active');
  if (v === 'stats') renderStats();
  if (v === 'achievements') renderAchievements();
  if (v === 'settings') { renderThemeGrid(); renderTemplates('settingsTemplates'); }
}

// ═══════════════════════════════════
// XP & LEVEL SYSTEM
// ═══════════════════════════════════
const XP_PER_CHECK = 10;
const XP_PER_STREAK_BONUS = 5;     // bonus per streak day beyond 3
const XP_PER_PERFECT_DAY = 50;
const XP_PER_ACHIEVEMENT = 100;

function calcLevel(xp) {
  // Each level requires progressively more XP
  let level = 1, required = 100, totalNeeded = 0;
  while (xp >= totalNeeded + required) {
    totalNeeded += required;
    level++;
    required = Math.floor(100 * Math.pow(1.3, level - 1));
  }
  const progress = xp - totalNeeded;
  return { level, progress, required, totalXP: xp };
}

function addXP(amount) {
  const before = calcLevel(state.xp);
  state.xp += amount;
  const after = calcLevel(state.xp);
  save();
  updateXPDisplay();
  if (after.level > before.level) {
    showToast(`🎉 Level Up! You're now Level ${after.level}!`);
    burstConfetti();
  }
  checkAchievements();
}

function updateXPDisplay() {
  const { level, progress, required } = calcLevel(state.xp);
  $('#levelText').textContent = `Lv ${level}`;
  $('#xpText').textContent = `${progress}/${required} XP`;
  const pct = (progress / required) * 100;
  $('#xpFill').style.width = `${pct}%`;
}

// ═══════════════════════════════════
// WEEK / DAY NAVIGATION
// ═══════════════════════════════════
function renderWeekLabel() {
  const days = weekDays(currentWeekStart);
  const f = days[0], l = days[6];
  $('#weekLabel').textContent = f.getMonth() === l.getMonth()
    ? `${MONTH_NAMES[f.getMonth()]} ${f.getDate()}–${l.getDate()}, ${f.getFullYear()}`
    : `${MONTH_NAMES[f.getMonth()]} ${f.getDate()} – ${MONTH_NAMES[l.getMonth()]} ${l.getDate()}, ${l.getFullYear()}`;
}

function renderDayBar() {
  const days = weekDays(currentWeekStart);
  const todayK = dateKey(new Date()), selK = dateKey(selectedDate);
  const bar = $('#dayBar');
  bar.innerHTML = '';
  days.forEach(d => {
    const dk = dateKey(d);
    const pill = document.createElement('button');
    pill.className = 'day-pill';
    if (dk === selK) pill.classList.add('active');
    if (dk === todayK) pill.classList.add('today');
    const habitsForDay = state.habits.filter(h => h.days.includes(d.getDay()));
    const doneCount = habitsForDay.filter(h => state.log[`${h.id}:${dk}`]).length;
    if (habitsForDay.length > 0 && doneCount === habitsForDay.length) pill.classList.add('all-done');
    pill.innerHTML = `<span class="day-pill__name">${DAY_NAMES[d.getDay()]}</span><span class="day-pill__date">${d.getDate()}</span>`;
    pill.addEventListener('click', () => { selectedDate = d; renderDayBar(); renderHabits(); updateProgressRing(); });
    bar.appendChild(pill);
  });
}

function goToWeek(off) {
  const d = new Date(currentWeekStart);
  d.setDate(d.getDate() + off * 7);
  currentWeekStart = d;
  selectedDate = new Date(d);
  renderWeekLabel(); renderDayBar(); renderHabits(); updateProgressRing();
}

function goToToday() {
  const t = new Date();
  currentWeekStart = weekStart(t);
  selectedDate = t;
  renderWeekLabel(); renderDayBar(); renderHabits(); updateProgressRing();
}

// ═══════════════════════════════════
// PROGRESS RING
// ═══════════════════════════════════
function updateProgressRing() {
  const today = new Date();
  const selK = dateKey(selectedDate);
  const habitsForDay = state.habits.filter(h => h.days.includes(selectedDate.getDay()));
  const done = habitsForDay.filter(h => state.log[`${h.id}:${selK}`]).length;
  const total = habitsForDay.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Ring animation
  const circle = $('#progressCircle');
  const circumference = 2 * Math.PI * 52; // r=52
  circle.style.strokeDashoffset = circumference - (pct / 100) * circumference;

  $('#progressPct').textContent = `${pct}%`;

  // Greeting
  const hour = today.getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  $('#greeting').textContent = `${greeting}! 👋`;

  // Summary
  if (total === 0) {
    $('#todaySummary').textContent = 'No habits scheduled for this day.';
  } else if (done === total) {
    $('#todaySummary').textContent = `🎉 All ${total} habits completed! You're crushing it!`;
  } else {
    $('#todaySummary').textContent = `${done} of ${total} habits done. ${total - done} more to go — you got this!`;
  }
}

// ═══════════════════════════════════
// QUOTE
// ═══════════════════════════════════
function refreshQuote() {
  const idx = Math.floor(Math.random() * QUOTES.length);
  $('#quoteText').textContent = `"${QUOTES[idx]}"`;
}

// ═══════════════════════════════════
// HABIT RENDERING
// ═══════════════════════════════════
function getFilteredHabits() {
  const dow = selectedDate.getDay();
  let habits = state.habits.filter(h => h.days.includes(dow));

  if (activeFilter !== 'all') {
    habits = habits.filter(h => h.category === activeFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    habits = habits.filter(h => h.name.toLowerCase().includes(q) || h.category.includes(q));
  }

  const selK = dateKey(selectedDate);

  switch (sortMode) {
    case 'name':
      habits.sort((a,b) => a.name.localeCompare(b.name));
      break;
    case 'streak':
      habits.sort((a,b) => calcStreak(b) - calcStreak(a));
      break;
    case 'completion': {
      habits.sort((a,b) => {
        const aD = state.log[`${a.id}:${selK}`] ? 1 : 0;
        const bD = state.log[`${b.id}:${selK}`] ? 1 : 0;
        return aD - bD; // uncompleted first
      });
      break;
    }
    case 'priority': {
      const prio = { high: 0, medium: 1, low: 2 };
      habits.sort((a,b) => (prio[a.priority]||1) - (prio[b.priority]||1));
      break;
    }
    case 'custom':
      if (state.customOrder.length) {
        habits.sort((a,b) => {
          const ai = state.customOrder.indexOf(a.id);
          const bi = state.customOrder.indexOf(b.id);
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        });
      }
      break;
  }

  return habits;
}

function renderHabits() {
  const list = $('#habitList');
  const selK = dateKey(selectedDate);
  const habits = getFilteredHabits();

  if (habits.length === 0) {
    const noHabitsAtAll = state.habits.length === 0;
    list.innerHTML = `
      <div class="habit-list__empty">
        <div class="habit-list__empty-icon">${noHabitsAtAll ? '🌱' : '🔍'}</div>
        <div class="habit-list__empty-text">${noHabitsAtAll ? 'No habits yet' : 'No matching habits'}</div>
        <div class="habit-list__empty-sub">${noHabitsAtAll ? 'Tap + to create your first habit' : 'Try a different filter or day'}</div>
      </div>`;
    return;
  }

  list.innerHTML = '';
  habits.forEach((habit, idx) => {
    const logKey = `${habit.id}:${selK}`;
    const done = !!state.log[logKey];
    const streak = calcStreak(habit);

    const card = document.createElement('div');
    card.className = `habit-card${done ? ' completed' : ''}`;
    card.style.setProperty('--habit-color', habit.color);
    card.dataset.habitId = habit.id;
    card.draggable = true;

    const wkDays = weekDays(currentWeekStart);
    const dots = wkDays.map(d => {
      const dk = dateKey(d);
      const filled = !!state.log[`${habit.id}:${dk}`];
      const isToday = dk === dateKey(new Date());
      return `<span class="habit-card__week-dot${filled?' filled':''}${isToday?' today-dot':''}"></span>`;
    }).join('');

    const prioClass = `habit-card__priority--${habit.priority||'medium'}`;
    const prioLabel = { high:'High', medium:'Med', low:'Low' }[habit.priority||'medium'];

    card.innerHTML = `
      <span class="habit-card__drag" title="Drag to reorder">⠿</span>
      <label class="habit-card__check">
        <input type="checkbox" ${done?'checked':''} />
        <span class="habit-card__checkmark">${done?'✓':''}</span>
      </label>
      <span class="habit-card__icon">${habit.icon||'📌'}</span>
      <div class="habit-card__info">
        <div class="habit-card__name">${escHTML(habit.name)}</div>
        <div class="habit-card__meta">
          <span class="habit-card__streak ${streak===0?'habit-card__streak--zero':''}">🔥 ${streak}d</span>
          <span class="habit-card__priority ${prioClass}">${prioLabel}</span>
          <span>${habit.category}</span>
          ${habit.note ? '<span class="habit-card__note-icon" title="'+escHTML(habit.note)+'">📝</span>' : ''}
        </div>
      </div>
      <div class="habit-card__week">${dots}</div>
      <button class="habit-card__edit icon-btn" title="Edit">✏️</button>
    `;

    // Checkbox toggle
    const cb = card.querySelector('input[type="checkbox"]');
    cb.addEventListener('change', () => {
      if (cb.checked) {
        state.log[logKey] = true;
        // XP
        let xpGain = XP_PER_CHECK;
        if (streak >= 3) xpGain += XP_PER_STREAK_BONUS;
        addXP(xpGain);
        // Time-based achievements
        const h = new Date().getHours();
        if (h >= 22 || h < 4) { state.nightOwl = true; save(); }
        if (h >= 4 && h < 7) { state.earlyBird = true; save(); }
        // Perfect day check
        const habitsForDay = state.habits.filter(hb => hb.days.includes(selectedDate.getDay()));
        const allDone = habitsForDay.every(hb => state.log[`${hb.id}:${selK}`]);
        if (allDone && habitsForDay.length > 0) {
          addXP(XP_PER_PERFECT_DAY);
          showToast('🎉 Perfect Day! All habits done!');
          burstConfetti();
        } else {
          showToast(`✅ ${habit.name} +${xpGain}XP`);
        }
        playSound('complete');
      } else {
        delete state.log[logKey];
        state.xp = Math.max(0, state.xp - XP_PER_CHECK);
        updateXPDisplay();
      }
      save();
      renderHabits(); renderDayBar(); updateProgressRing();
      checkAchievements();
    });

    // Edit button
    card.querySelector('.habit-card__edit').addEventListener('click', e => {
      e.stopPropagation();
      openEditDialog(habit.id);
    });

    // Drag & drop
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', habit.id);
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('dragover', e => { e.preventDefault(); card.classList.add('drag-over'); });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', e => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const fromId = e.dataTransfer.getData('text/plain');
      reorderHabit(fromId, habit.id);
    });

    list.appendChild(card);
  });
}

function reorderHabit(fromId, toId) {
  if (fromId === toId) return;
  // Build order from current visible habits
  const habitIds = getFilteredHabits().map(h => h.id);
  const fromIdx = habitIds.indexOf(fromId);
  const toIdx = habitIds.indexOf(toId);
  if (fromIdx === -1 || toIdx === -1) return;
  habitIds.splice(fromIdx, 1);
  habitIds.splice(toIdx, 0, fromId);
  state.customOrder = habitIds;
  save();
  renderHabits();
}

// ═══════════════════════════════════
// STREAKS
// ═══════════════════════════════════
function calcStreak(habit) {
  let streak = 0;
  const today = new Date(); today.setHours(12,0,0,0);
  let d = new Date(today);
  if (!state.log[`${habit.id}:${dateKey(d)}`]) d.setDate(d.getDate()-1);
  for (let i=0;i<365;i++) {
    if (!habit.days.includes(d.getDay())) { d.setDate(d.getDate()-1); continue; }
    if (state.log[`${habit.id}:${dateKey(d)}`]) { streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}

// ═══════════════════════════════════
// ACHIEVEMENT HELPERS
// ═══════════════════════════════════
function hasPerfectDay(s) {
  const today = new Date();
  for (let i=0;i<30;i++) {
    const d = new Date(today); d.setDate(d.getDate()-i);
    const dk = dateKey(d);
    const hForDay = s.habits.filter(h => h.days.includes(d.getDay()));
    if (hForDay.length > 0 && hForDay.every(h => s.log[`${h.id}:${dk}`])) return true;
  }
  return false;
}

function hasPerfectWeekStreak(s) {
  const today = new Date();
  let streak = 0;
  for (let i=0;i<60;i++) {
    const d = new Date(today); d.setDate(d.getDate()-i);
    const dk = dateKey(d);
    const hForDay = s.habits.filter(h => h.days.includes(d.getDay()));
    if (hForDay.length === 0) continue;
    if (hForDay.every(h => s.log[`${h.id}:${dk}`])) { streak++; }
    else { streak = 0; }
    if (streak >= 7) return true;
  }
  return false;
}

function hasAllCategories(s) {
  const cats = new Set(s.habits.map(h => h.category));
  return ['health','mind','productivity','social','creative','other'].every(c => cats.has(c));
}

function checkAchievements() {
  ACHIEVEMENTS.forEach(a => {
    if (state.unlockedAchievements.includes(a.id)) return;
    if (a.check(state)) {
      state.unlockedAchievements.push(a.id);
      state.xp += XP_PER_ACHIEVEMENT;
      save();
      showAchievementPopup(a);
    }
  });
  updateXPDisplay();
}

function showAchievementPopup(a) {
  const popup = $('#achievementPopup');
  $('#achievementPopupIcon').textContent = a.icon;
  $('#achievementPopupName').textContent = a.name;
  popup.style.display = 'block';
  playSound('achievement');
  setTimeout(() => { popup.style.display = 'none'; }, 3500);
}

function renderAchievements() {
  const grid = $('#achievementsGrid');
  const unlocked = state.unlockedAchievements.length;
  const total = ACHIEVEMENTS.length;
  $('#achievementsSub').textContent = `${unlocked} / ${total} unlocked`;

  grid.innerHTML = ACHIEVEMENTS.map(a => {
    const isUnlocked = state.unlockedAchievements.includes(a.id);
    return `
      <div class="achievement-card ${isUnlocked?'unlocked':'locked'}">
        <div class="achievement-card__icon">${isUnlocked ? a.icon : '🔒'}</div>
        <div class="achievement-card__name">${a.name}</div>
        <div class="achievement-card__desc">${a.desc}</div>
      </div>`;
  }).join('');
}

// ═══════════════════════════════════
// SOUND EFFECTS
// ═══════════════════════════════════
const audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : null;

function playSound(type) {
  if (!state.soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'complete') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, audioCtx.currentTime);
      osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'achievement') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, audioCtx.currentTime);
      osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.15);
      osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.3);
      osc.frequency.setValueAtTime(1047, audioCtx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.7);
    }
  } catch(e) { /* silent fail */ }
}

// ═══════════════════════════════════
// ADD / EDIT DIALOG
// ═══════════════════════════════════
const habitDialog = $('#habitDialog');
const habitForm = $('#habitForm');

function openAddDialog() {
  editingHabitId = null;
  $('#dialogTitle').textContent = 'New Habit';
  $('#habitName').value = '';
  $('#habitIcon').value = '';
  $('#habitPriority').value = 'medium';
  $('#habitNote').value = '';
  $('input[name="category"][value="health"]').checked = true;
  $('input[name="color"][value="#6366f1"]').checked = true;
  $$('input[name="days"]').forEach(cb => cb.checked = true);
  $('#dialogDelete').style.display = 'none';
  $('#dialogArchive').style.display = 'none';
  habitDialog.showModal();
  $('#habitName').focus();
}

function openEditDialog(id) {
  const h = state.habits.find(x => x.id === id);
  if (!h) return;
  editingHabitId = id;
  $('#dialogTitle').textContent = 'Edit Habit';
  $('#habitName').value = h.name;
  $('#habitIcon').value = h.icon || '';
  $('#habitPriority').value = h.priority || 'medium';
  $('#habitNote').value = h.note || '';
  const cat = $(`input[name="category"][value="${h.category}"]`);
  if (cat) cat.checked = true;
  const col = $(`input[name="color"][value="${h.color}"]`);
  if (col) col.checked = true;
  $$('input[name="days"]').forEach(cb => cb.checked = h.days.includes(Number(cb.value)));
  $('#dialogDelete').style.display = 'inline-flex';
  $('#dialogArchive').style.display = 'inline-flex';
  habitDialog.showModal();
  $('#habitName').focus();
}

function closeDialog() { habitDialog.close(); }

function saveHabit() {
  const name = $('#habitName').value.trim();
  if (!name) return;
  const icon = $('#habitIcon').value.trim() || '📌';
  const category = $('input[name="category"]:checked').value;
  const color = $('input[name="color"]:checked').value;
  const days = $$('input[name="days"]:checked').map(cb => Number(cb.value));
  const priority = $('#habitPriority').value;
  const note = $('#habitNote').value.trim();

  if (days.length === 0) { showToast('⚠️ Select at least one day'); return; }

  if (editingHabitId) {
    const h = state.habits.find(x => x.id === editingHabitId);
    if (h) { Object.assign(h, { name, icon, category, color, days, priority, note }); showToast('✏️ Habit updated'); }
  } else {
    const newHabit = { id: uid(), name, icon, category, color, days, priority, note, createdAt: dateKey(new Date()) };
    state.habits.push(newHabit);
    state.customOrder.push(newHabit.id);
    showToast('🌱 Habit created!');
    addXP(5);
  }
  save(); closeDialog(); renderHabits(); renderDayBar(); updateProgressRing();
  checkAchievements();
}

// Delete flow
const confirmDialog = $('#confirmDialog');
let confirmAction = null;

function promptDelete() {
  const id = editingHabitId;
  habitDialog.close();
  $('#confirmTitle').textContent = 'Delete Habit?';
  $('#confirmText').textContent = 'This will permanently remove the habit and all its history. This cannot be undone.';
  confirmAction = () => {
    state.habits = state.habits.filter(h => h.id !== id);
    state.customOrder = state.customOrder.filter(x => x !== id);
    Object.keys(state.log).forEach(k => { if (k.startsWith(id+':')) delete state.log[k]; });
    save(); showToast('🗑️ Habit deleted');
    renderHabits(); renderDayBar(); updateProgressRing();
  };
  confirmDialog.showModal();
}

function promptArchive() {
  const id = editingHabitId;
  const h = state.habits.find(x => x.id === id);
  if (!h) return;
  habitDialog.close();
  $('#confirmTitle').textContent = 'Archive Habit?';
  $('#confirmText').textContent = `"${h.name}" will be hidden from your tracker but its history is preserved. You can find it in settings.`;
  confirmAction = () => {
    h.archived = true;
    save(); showToast('📦 Habit archived');
    renderHabits(); renderDayBar(); updateProgressRing();
  };
  confirmDialog.showModal();
}

function promptResetAll() {
  $('#confirmTitle').textContent = '⚠️ Reset All Data?';
  $('#confirmText').textContent = 'This will erase ALL habits, history, XP, and achievements. This cannot be undone.';
  confirmAction = () => {
    localStorage.removeItem(STATE_KEY);
    location.reload();
  };
  confirmDialog.showModal();
}

// ═══════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════
function renderTemplates(containerId) {
  const container = $(`#${containerId}`);
  if (!container) return;
  const existingNames = new Set(state.habits.map(h => h.name));
  container.innerHTML = TEMPLATES.map(t => {
    const exists = existingNames.has(t.name);
    return `<button class="template-btn${exists?' added':''}" data-template="${escHTML(t.name)}"
      onclick="addFromTemplate('${escHTML(t.name)}')">${t.icon} ${t.name}${exists?' ✓':''}</button>`;
  }).join('');
}

function addFromTemplate(name) {
  const t = TEMPLATES.find(x => x.name === name);
  if (!t) return;
  if (state.habits.some(h => h.name === t.name)) { showToast('Already added!'); return; }
  const newH = { id: uid(), name: t.name, icon: t.icon, category: t.category, color: t.color, priority: t.priority, days: [0,1,2,3,4,5,6], note: '', createdAt: dateKey(new Date()) };
  state.habits.push(newH);
  state.customOrder.push(newH.id);
  save();
  showToast(`${t.icon} ${t.name} added!`);
  addXP(5);
  renderHabits(); renderDayBar(); updateProgressRing();
  renderTemplates('onboardingTemplates');
  renderTemplates('settingsTemplates');
  checkAchievements();
}

// ═══════════════════════════════════
// STATS VIEW
// ═══════════════════════════════════
function renderStats() {
  renderOverviewCards();
  renderStatsDetail();
}

function renderOverviewCards() {
  const grid = $('#statsGrid');
  const today = new Date(), todayDK = dateKey(today);
  const habitsToday = state.habits.filter(h => !h.archived && h.days.includes(today.getDay()));
  const doneToday = habitsToday.filter(h => state.log[`${h.id}:${todayDK}`]).length;
  const pctToday = habitsToday.length > 0 ? Math.round((doneToday/habitsToday.length)*100) : 0;
  const bestStreak = state.habits.length > 0 ? Math.max(0,...state.habits.filter(h=>!h.archived).map(calcStreak)) : 0;
  const totalChecks = Object.keys(state.log).length;
  const { level } = calcLevel(state.xp);

  // Week %
  const wkD = weekDays(weekStart(today));
  let weekDone=0, weekTotal=0;
  wkD.forEach(d=>{const dk=dateKey(d);state.habits.filter(h=>!h.archived).forEach(h=>{if(h.days.includes(d.getDay())){weekTotal++;if(state.log[`${h.id}:${dk}`])weekDone++}})});
  const pctWeek = weekTotal>0?Math.round((weekDone/weekTotal)*100):0;

  // Perfect days (30d)
  let perfectDays=0;
  for(let i=0;i<30;i++){
    const d=new Date(today);d.setDate(d.getDate()-i);const dk=dateKey(d);
    const hd=state.habits.filter(h=>!h.archived&&h.days.includes(d.getDay()));
    if(hd.length>0&&hd.every(h=>state.log[`${h.id}:${dk}`]))perfectDays++;
  }

  grid.innerHTML = `
    <div class="stat-card"><div class="stat-card__value">${state.habits.filter(h=>!h.archived).length}</div><div class="stat-card__label">Active Habits</div></div>
    <div class="stat-card"><div class="stat-card__value">${pctToday}%</div><div class="stat-card__label">Today</div></div>
    <div class="stat-card"><div class="stat-card__value">${pctWeek}%</div><div class="stat-card__label">This Week</div></div>
    <div class="stat-card"><div class="stat-card__value">🔥 ${bestStreak}</div><div class="stat-card__label">Best Streak</div></div>
    <div class="stat-card"><div class="stat-card__value">${totalChecks}</div><div class="stat-card__label">Total Check-ins</div></div>
    <div class="stat-card"><div class="stat-card__value">⭐ ${perfectDays}</div><div class="stat-card__label">Perfect Days (30d)</div></div>
    <div class="stat-card"><div class="stat-card__value">Lv ${level}</div><div class="stat-card__label">Current Level</div></div>
    <div class="stat-card"><div class="stat-card__value">${state.unlockedAchievements.length}/${ACHIEVEMENTS.length}</div><div class="stat-card__label">Badges</div></div>
  `;
}

function renderStatsDetail() {
  const detail = $('#statsDetail');
  const activeHabits = state.habits.filter(h => !h.archived);
  if (activeHabits.length === 0) {
    detail.innerHTML = '<div class="habit-list__empty"><div class="habit-list__empty-icon">📊</div><div class="habit-list__empty-text">No data yet</div></div>';
    return;
  }

  const today = new Date();

  // 30-day completion bars
  const bars = activeHabits.map(h => {
    let done=0, total=0;
    for(let i=0;i<30;i++){const d=new Date(today);d.setDate(d.getDate()-i);if(h.days.includes(d.getDay())){total++;if(state.log[`${h.id}:${dateKey(d)}`])done++}}
    return { habit:h, pct: total>0?Math.round((done/total)*100):0 };
  }).sort((a,b) => b.pct-a.pct);

  const barsHTML = bars.map(({habit:h, pct}) => `
    <div class="progress-item">
      <span class="progress-item__icon">${h.icon||'📌'}</span>
      <div class="progress-item__info">
        <div class="progress-item__name">${escHTML(h.name)}</div>
        <div class="progress-item__bar"><div class="progress-item__fill" style="width:${pct}%;background:${h.color}"></div></div>
      </div>
      <span class="progress-item__pct">${pct}%</span>
    </div>`).join('');

  // 90-day heatmaps
  const heatmaps = activeHabits.map(h => {
    let cells='';
    for(let i=89;i>=0;i--){
      const d=new Date(today);d.setDate(d.getDate()-i);const dk=dateKey(d);
      const filled=state.log[`${h.id}:${dk}`];
      const sched=h.days.includes(d.getDay());
      cells+=`<span class="heatmap__cell${filled?' filled':''}" style="--habit-color:${h.color}${!sched?';opacity:.2':''}" title="${MONTH_NAMES[d.getMonth()]} ${d.getDate()}${filled?' ✓':sched?' ✗':' (off)'}"></span>`;
    }
    return `<div><div class="heatmap__habit-name">${h.icon||'📌'} ${escHTML(h.name)} — 🔥 ${calcStreak(h)}d streak</div><div class="heatmap__row">${cells}</div></div>`;
  }).join('');

  // Weekly trend (last 8 weeks)
  const trendData = [];
  for (let w=7;w>=0;w--) {
    const ws = new Date(today); ws.setDate(ws.getDate() - w*7);
    const we = weekStart(ws);
    const wd = weekDays(we);
    let done=0,total=0;
    wd.forEach(d=>{const dk=dateKey(d);activeHabits.forEach(h=>{if(h.days.includes(d.getDay())){total++;if(state.log[`${h.id}:${dk}`])done++}})});
    trendData.push({ label:`W${8-w}`, pct: total>0?Math.round((done/total)*100):0 });
  }

  detail.innerHTML = `
    <div class="stats-section">
      <h3 class="stats-section__title">📊 30-Day Completion Rate</h3>
      ${barsHTML}
    </div>
    <div class="stats-section">
      <h3 class="stats-section__title">📈 Weekly Trend (8 weeks)</h3>
      <canvas id="trendCanvas" class="trend-chart"></canvas>
    </div>
    <div class="stats-section">
      <h3 class="stats-section__title">🗓️ 90-Day Activity</h3>
      <div class="heatmap">${heatmaps}</div>
    </div>
  `;

  // Draw trend chart
  requestAnimationFrame(() => drawTrendChart(trendData));
}

function drawTrendChart(data) {
  const canvas = $('#trendCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const W = rect.width, H = rect.height;
  const pad = { t:20, r:20, b:40, l:40 };
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;

  // Background grid
  const style = getComputedStyle(document.documentElement);
  const textColor = style.getPropertyValue('--text-muted').trim() || '#999';
  const borderColor = style.getPropertyValue('--border').trim() || '#eee';
  const accentColor = style.getPropertyValue('--accent').trim() || '#6366f1';

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  for (let i=0;i<=4;i++) {
    const y = pad.t + cH - (i/4)*cH;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+cW,y); ctx.stroke();
    ctx.fillStyle = textColor; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(`${i*25}%`, pad.l-8, y+4);
  }

  // Data points
  const points = data.map((d,i) => ({
    x: pad.l + (i/(data.length-1))*cW,
    y: pad.t + cH - (d.pct/100)*cH,
    label: d.label, pct: d.pct,
  }));

  // Gradient fill
  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t+cH);
  grad.addColorStop(0, accentColor+'40');
  grad.addColorStop(1, accentColor+'05');
  ctx.beginPath();
  ctx.moveTo(points[0].x, pad.t+cH);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length-1].x, pad.t+cH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  points.forEach((p,i) => i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Points & labels
  points.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2);
    ctx.fillStyle = accentColor; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x,p.y,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = textColor; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(p.label, p.x, pad.t+cH+20);
    ctx.fillText(`${p.pct}%`, p.x, p.y-10);
  });
}

// ═══════════════════════════════════
// DATA EXPORT / IMPORT
// ═══════════════════════════════════
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `habitly-backup-${dateKey(new Date())}.json`; a.click();
  URL.revokeObjectURL(url);
  showToast('📦 Data exported!');
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.habits || !data.log) throw new Error('Invalid format');
      state = { ...state, ...data };
      save();
      showToast('📥 Data imported!');
      renderAll();
    } catch(e) { showToast('❌ Invalid file'); }
  };
  reader.readAsText(file);
}

// ═══════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════
function showOnboarding() {
  if (localStorage.getItem(ONBOARD_KEY)) return;
  $('#onboarding').style.display = 'flex';
  renderThemeGrid('onboardingThemes');
  renderTemplates('onboardingTemplates');
}

function nextOnboarding() {
  onboardingStep++;
  $$('.onboarding__step').forEach(s => s.style.display = 'none');
  const step = $(`.onboarding__step[data-step="${onboardingStep}"]`);
  if (step) {
    step.style.display = 'block';
    $$('.onboarding__dot').forEach((d,i) => d.classList.toggle('active', i===onboardingStep));
    if (onboardingStep === 1) renderThemeGrid('onboardingThemes');
    if (onboardingStep === 2) renderTemplates('onboardingTemplates');
  }
}

function finishOnboarding() {
  localStorage.setItem(ONBOARD_KEY, '1');
  $('#onboarding').style.display = 'none';
  renderAll();
}

// Make globally accessible
window.nextOnboarding = nextOnboarding;
window.finishOnboarding = finishOnboarding;
window.refreshQuote = refreshQuote;
window.applyAccent = applyAccent;
window.exportData = exportData;
window.addFromTemplate = addFromTemplate;
window.promptResetAll = promptResetAll;

// ═══════════════════════════════════
// TOAST
// ═══════════════════════════════════
function showToast(msg) {
  const c = $('#toastContainer');
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ═══════════════════════════════════
// CONFETTI 🎊
// ═══════════════════════════════════
function burstConfetti() {
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const colors = [accent,'#ec4899','#10b981','#f59e0b','#3b82f6','#8b5cf6','#f43f5e','#14b8a6'];
  const particles = Array.from({length:100},()=>({
    x:canvas.width/2, y:canvas.height/2,
    vx:(Math.random()-.5)*18, vy:Math.random()*-16-4,
    size:Math.random()*8+4,
    color:colors[Math.floor(Math.random()*colors.length)],
    rotation:Math.random()*360, rv:(Math.random()-.5)*14, life:1,
  }));
  let frame=0;
  (function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive=false;
    particles.forEach(p=>{
      if(p.life<=0)return; alive=true;
      p.x+=p.vx; p.vy+=0.35; p.y+=p.vy; p.rotation+=p.rv; p.life-=0.01;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rotation*Math.PI/180);
      ctx.globalAlpha=Math.max(0,p.life); ctx.fillStyle=p.color;
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.6); ctx.restore();
    });
    if(alive&&frame++<200) requestAnimationFrame(animate); else canvas.remove();
  })();
}

// ═══════════════════════════════════
// RENDER ALL
// ═══════════════════════════════════
function renderAll() {
  renderWeekLabel();
  renderDayBar();
  renderHabits();
  updateProgressRing();
  updateXPDisplay();
  refreshQuote();
}

// ═══════════════════════════════════
// EVENT BINDINGS
// ═══════════════════════════════════
function bindEvents() {
  // Theme
  $('#themeToggle').addEventListener('click', toggleTheme);
  if ($('#darkModeToggle')) {
    $('#darkModeToggle').addEventListener('change', e => applyTheme(e.target.checked ? 'dark' : 'light'));
  }

  // Sound toggle
  if ($('#soundToggle')) {
    $('#soundToggle').checked = state.soundEnabled;
    $('#soundToggle').addEventListener('change', e => { state.soundEnabled = e.target.checked; save(); });
  }

  // Tabs
  $$('.tab-btn').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));

  // Week nav
  $('#prevWeek').addEventListener('click', () => goToWeek(-1));
  $('#nextWeek').addEventListener('click', () => goToWeek(1));
  $('#todayBtn').addEventListener('click', goToToday);

  // FAB
  $('#addHabitBtn').addEventListener('click', openAddDialog);

  // Dialog
  $('#dialogCancel').addEventListener('click', closeDialog);
  $('#dialogDelete').addEventListener('click', promptDelete);
  $('#dialogArchive').addEventListener('click', promptArchive);
  habitForm.addEventListener('submit', e => { e.preventDefault(); saveHabit(); });
  habitDialog.addEventListener('click', e => { if(e.target===habitDialog) closeDialog(); });

  // Confirm dialog
  $('#confirmCancel').addEventListener('click', () => confirmDialog.close());
  $('#confirmOK').addEventListener('click', () => { if(confirmAction) confirmAction(); confirmAction=null; confirmDialog.close(); });
  confirmDialog.addEventListener('click', e => { if(e.target===confirmDialog) confirmDialog.close(); });

  // Search
  $('#searchInput').addEventListener('input', e => { searchQuery = e.target.value; renderHabits(); });

  // Filter chips
  $$('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.filter;
      $$('.filter-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === activeFilter));
      renderHabits();
    });
  });

  // Sort
  $('#sortSelect').addEventListener('change', e => { sortMode = e.target.value; renderHabits(); });

  // Import
  $('#importFile').addEventListener('change', e => { if(e.target.files[0]) importData(e.target.files[0]); });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (habitDialog.open || confirmDialog.open) return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    switch(e.key) {
      case 'n': case 'N': openAddDialog(); break;
      case 't': case 'T': goToToday(); break;
      case 'd': case 'D': toggleTheme(); break;
      case 'ArrowLeft': goToWeek(-1); break;
      case 'ArrowRight': goToWeek(1); break;
      case '1': switchView('tracker'); break;
      case '2': switchView('stats'); break;
      case '3': switchView('achievements'); break;
      case '4': switchView('settings'); break;
    }
  });
}

// ═══════════════════════════════════
// INIT
// ═══════════════════════════════════
function init() {
  load();
  initTheme();
  bindEvents();
  renderAll();
  showOnboarding();
  checkAchievements();
}

document.addEventListener('DOMContentLoaded', init);
