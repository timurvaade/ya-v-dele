// Глобальное состояние
let currentFilter = 'today'; // all, today, later
let currentStatusFilter = 'all'; // all, open, closed, postponed

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initFilters();
  initFAB();
  renderLists();
  updateCounts();
});

// Инициализация табов
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Убираем активный класс со всех табов
      tabs.forEach(t => t.classList.remove('is-active'));
      // Добавляем активный класс на текущий таб
      tab.classList.add('is-active');
      // Меняем фильтр
      currentFilter = tab.dataset.filter;
      // Перерисовываем списки
      renderLists();
      updateCounts();
    });
  });
}

// Инициализация фильтров статуса
function initFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Убираем активный класс со всех фильтров
      filters.forEach(f => f.classList.remove('is-active'));
      // Добавляем активный класс на текущий фильтр
      filter.classList.add('is-active');
      // Меняем фильтр статуса
      const filterText = filter.querySelector('.filter-label').textContent.trim();
      if (filterText === 'все') currentStatusFilter = 'all';
      else if (filterText === 'открыто') currentStatusFilter = 'open';
      else if (filterText === 'закрыто') currentStatusFilter = 'closed';
      else if (filterText === 'отложено') currentStatusFilter = 'postponed';
      // Перерисовываем списки
      renderLists();
    });
  });
}

// Инициализация FAB кнопки
function initFAB() {
  const fab = document.querySelector('.fab');
  fab.addEventListener('click', () => {
    alert('Создание нового списка (в разработке)');
  });
}

// Фильтрация задач по текущему фильтру
function filterTasks(tasks) {
  return tasks.filter(task => {
    // Фильтр по времени (all, today, later)
    let matchesTimeFilter = true;
    if (currentFilter === 'today') {
      matchesTimeFilter = task.due === 'today';
    } else if (currentFilter === 'later') {
      matchesTimeFilter = task.due === 'later';
    }
    
    // Фильтр по статусу (all, open, closed, postponed)
    let matchesStatusFilter = true;
    if (currentStatusFilter === 'open') {
      matchesStatusFilter = !task.done && !task.postponed;
    } else if (currentStatusFilter === 'closed') {
      matchesStatusFilter = task.done;
    } else if (currentStatusFilter === 'postponed') {
      matchesStatusFilter = task.postponed;
    }
    
    return matchesTimeFilter && matchesStatusFilter;
  });
}

// Рендер списков
function renderLists() {
  const container = document.getElementById('lists-container');
  container.innerHTML = '';
  
  if (!window.APP_DATA || !window.APP_DATA.lists) {
    console.error('Данные не найдены');
    return;
  }
  
  window.APP_DATA.lists.forEach(list => {
    const filteredTasks = filterTasks(list.items);
    
    // Не показываем список, если в нём нет задач после фильтрации
    if (filteredTasks.length === 0) return;
    
    const listCard = createListCard(list, filteredTasks);
    container.appendChild(listCard);
  });
}

// Создание карточки списка
function createListCard(list, tasks) {
  const card = document.createElement('div');
  card.className = 'list-card';
  card.dataset.listId = list.id;
  
  // Заголовок списка
  const head = document.createElement('div');
  head.className = 'list-card__head';
  
  const title = document.createElement('h3');
  title.className = 'list-title';
  title.textContent = list.title;
  
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toggle-btn';
  toggleBtn.textContent = '▼';
  toggleBtn.setAttribute('aria-label', 'Toggle');
  
  head.appendChild(title);
  head.appendChild(toggleBtn);
  
  // Контейнер задач
  const tasksContainer = document.createElement('div');
  tasksContainer.className = 'tasks';
  tasksContainer.style.display = 'none'; // По умолчанию скрыто
  
  tasks.forEach(task => {
    const taskElement = createTaskElement(task, list.id);
    tasksContainer.appendChild(taskElement);
  });
  
  // Обработчик раскрытия/скрытия
  toggleBtn.addEventListener('click', () => {
    const isExpanded = card.classList.toggle('is-expanded');
    tasksContainer.style.display = isExpanded ? 'flex' : 'none';
    toggleBtn.textContent = isExpanded ? '▲' : '▼';
  });
  
  card.appendChild(head);
  card.appendChild(tasksContainer);
  
  return card;
}

// Создание элемента задачи
function createTaskElement(task, listId) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';
  if (task.done) taskDiv.classList.add('is-completed');
  
  // Левая часть (чекбокс)
  const taskLeft = document.createElement('div');
  taskLeft.className = 'task__left';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'checkbox';
  checkbox.id = task.id;
  checkbox.checked = task.done;
  
  checkbox.addEventListener('change', () => {
    task.done = checkbox.checked;
    taskDiv.classList.toggle('is-completed', task.done);
    updateCounts();
  });
  
  taskLeft.appendChild(checkbox);
  
  // Контент задачи
  const taskContent = document.createElement('div');
  taskContent.className = 'task__content';
  
  // Заголовок с тегом и меню
  const taskHeader = document.createElement('div');
  taskHeader.className = 'task-header';
  
  if (task.tag) {
    const pill = document.createElement('span');
    pill.className = `pill pill--${getTagColor(task.tag)}`;
    pill.textContent = task.tag;
    taskHeader.appendChild(pill);
  }
  
  const taskMenu = document.createElement('button');
  taskMenu.className = 'task-menu';
  taskMenu.textContent = '⋮';
  taskMenu.addEventListener('click', () => {
    alert('Меню задачи (в разработке)');
  });
  taskHeader.appendChild(taskMenu);
  
  taskContent.appendChild(taskHeader);
  
  // Название задачи
  const taskTitle = document.createElement('label');
  taskTitle.className = 'task-title';
  taskTitle.setAttribute('for', task.id);
  taskTitle.textContent = task.title;
  taskContent.appendChild(taskTitle);
  
  // Ссылка (если есть)
  if (task.link) {
    const taskLink = document.createElement('a');
    taskLink.className = 'task-link-ref';
    taskLink.href = '#';
    taskLink.textContent = 'ссылка';
    taskLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Переход по ссылке (в разработке)');
    });
    taskContent.appendChild(taskLink);
  }
  
  // Описание (если нужно)
  const descToggle = document.createElement('button');
  descToggle.className = 'description-toggle';
  descToggle.textContent = 'описание ▼';
  descToggle.addEventListener('click', () => {
    alert('Показать описание (в разработке)');
  });
  taskContent.appendChild(descToggle);
  
  taskDiv.appendChild(taskLeft);
  taskDiv.appendChild(taskContent);
  
  return taskDiv;
}

// Получение цвета тега
function getTagColor(tag) {
  const colors = {
    'Питание': 'blue',
    'Личное': 'blue',
    'Финансы': 'green',
    'Семья': 'red',
    'Проект': 'cyan',
    'Операционка': 'violet',
    'Конференция': 'green',
    'Таргет': 'brown',
    'Футболки': 'red',
    'встреча': 'teal',
    'презентация': 'violet'
  };
  return colors[tag] || 'blue';
}

// Обновление счётчиков
function updateCounts() {
  if (!window.APP_DATA) return;
  
  let totalAll = 0;
  let totalOpen = 0;
  let totalClosed = 0;
  let totalPostponed = 0;
  
  window.APP_DATA.lists.forEach(list => {
    const filteredTasks = filterTasks(list.items);
    totalAll += filteredTasks.length;
    
    filteredTasks.forEach(task => {
      if (task.done) totalClosed++;
      else if (task.postponed) totalPostponed++;
      else totalOpen++;
    });
  });
  
  // Обновляем счётчики в фильтрах
  const filters = document.querySelectorAll('.filter-btn');
  filters.forEach(filter => {
    const label = filter.querySelector('.filter-label').textContent.trim();
    const count = filter.querySelector('.filter-count');
    
    if (label === 'все') count.textContent = totalAll;
    else if (label === 'открыто') count.textContent = totalOpen;
    else if (label === 'закрыто') count.textContent = totalClosed;
    else if (label === 'отложено') count.textContent = totalPostponed;
  });
}
