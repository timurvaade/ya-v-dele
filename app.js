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

  // Закрытие dropdown при клике вне меню
  document.addEventListener('click', () => {
    document.querySelectorAll('.task-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  });
});

// Модалка подтверждения
function showConfirmModal({ title, message, confirmText = 'Подтвердить', onConfirm }) {
  // Удаляем старую модалку если есть
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';

  const modalTitle = document.createElement('h3');
  modalTitle.className = 'modal__title';
  modalTitle.textContent = title;

  const modalMessage = document.createElement('p');
  modalMessage.className = 'modal__message';
  modalMessage.textContent = message;

  const modalActions = document.createElement('div');
  modalActions.className = 'modal__actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'modal__btn modal__btn--cancel';
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Отмена';
  cancelBtn.addEventListener('click', () => overlay.remove());

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'modal__btn modal__btn--confirm';
  confirmBtn.type = 'button';
  confirmBtn.textContent = confirmText;
  confirmBtn.addEventListener('click', () => {
    overlay.remove();
    if (onConfirm) onConfirm();
  });

  modalActions.appendChild(cancelBtn);
  modalActions.appendChild(confirmBtn);

  modal.appendChild(modalTitle);
  modal.appendChild(modalMessage);
  modal.appendChild(modalActions);
  overlay.appendChild(modal);

  document.body.appendChild(overlay);

  // Закрытие по клику на оверлей
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // Закрытие по Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Фокус на кнопку отмены
  cancelBtn.focus();
}

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
  
  const headLeft = document.createElement('div');
  headLeft.className = 'list-card__head-left';

  const title = document.createElement('h3');
  title.className = 'list-title';
  title.textContent = list.title;

  const countBadge = document.createElement('span');
  countBadge.className = 'list-count';
  countBadge.textContent = tasks.length;

  headLeft.appendChild(title);
  headLeft.appendChild(countBadge);

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toggle-btn';
  toggleBtn.textContent = '▼';
  toggleBtn.setAttribute('aria-label', 'Toggle');

  head.appendChild(headLeft);
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
    toggleBtn.setAttribute('aria-expanded', String(isExpanded));
  });
  
  card.appendChild(head);
  card.appendChild(tasksContainer);
  
  return card;
}

// Создание блока ответственных
function createAssignees(assignees = []) {
  if (!assignees.length) return null;

  const container = document.createElement('div');
  container.className = 'assignees';

  const maxVisible = 3;
  const visibleAssignees = assignees.slice(0, maxVisible);

  visibleAssignees.forEach(person => {
    const avatar = document.createElement('button');
    avatar.className = 'avatar';
    avatar.type = 'button';
    avatar.title = person.name || 'Ответственный';

    const initials = (person.initials || person.name || '?')
      .trim()
      .split(/\s+/)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

    avatar.textContent = initials;

    if (person.avatarUrl) {
      avatar.style.backgroundImage = `url(${person.avatarUrl})`;
      avatar.classList.add('avatar--image');
    }

    container.appendChild(avatar);
  });

  const remaining = assignees.length - maxVisible;
  if (remaining > 0) {
    const more = document.createElement('button');
    more.className = 'avatar avatar--more';
    more.type = 'button';
    more.textContent = `+${remaining}`;
    more.title = `Ещё ${remaining}`;
    container.appendChild(more);
  }

  return container;
}

// Инлайн-редактирование названия задачи
function startInlineEdit(titleLabel, task) {
  const originalText = task.title;
  
  // Создаём input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-title-input';
  input.value = originalText;
  
  // Заменяем label на input
  titleLabel.style.display = 'none';
  titleLabel.parentNode.insertBefore(input, titleLabel.nextSibling);
  input.focus();
  input.select();

  const saveEdit = () => {
    const newValue = input.value.trim();
    if (newValue && newValue !== originalText) {
      task.title = newValue;
      titleLabel.textContent = newValue;
    }
    finishEdit();
  };

  const cancelEdit = () => {
    finishEdit();
  };

  const finishEdit = () => {
    input.remove();
    titleLabel.style.display = '';
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  });

  input.addEventListener('blur', () => {
    saveEdit();
  });
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

  // Аватары ответственных (справа в заголовке задачи)
  const assigneesEl = createAssignees(task.assignees);
  if (assigneesEl) taskHeader.appendChild(assigneesEl);
  
  // Меню задачи (dropdown)
  const menuWrapper = document.createElement('div');
  menuWrapper.className = 'task-menu-wrapper';

  const taskMenuBtn = document.createElement('button');
  taskMenuBtn.className = 'task-menu';
  taskMenuBtn.type = 'button';
  taskMenuBtn.textContent = '⋮';

  const dropdown = document.createElement('div');
  dropdown.className = 'task-dropdown';

  // Пункт: Редактировать
  const editBtn = document.createElement('button');
  editBtn.className = 'task-dropdown__item';
  editBtn.type = 'button';
  editBtn.innerHTML = '✏️ Редактировать';
  editBtn.addEventListener('click', () => {
    dropdown.classList.remove('is-open');
    // Находим label с названием задачи
    const titleLabel = taskContent.querySelector('.task-title');
    if (!titleLabel) return;
    
    startInlineEdit(titleLabel, task);
  });

  // Пункт: Отложить / Вернуть
  const postponeBtn = document.createElement('button');
  postponeBtn.className = 'task-dropdown__item';
  postponeBtn.type = 'button';
  postponeBtn.innerHTML = task.postponed ? '▶️ Вернуть в работу' : '⏸️ Отложить';
  postponeBtn.addEventListener('click', () => {
    dropdown.classList.remove('is-open');
    task.postponed = !task.postponed;
    renderLists();
    updateCounts();
  });

  // Пункт: Удалить
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'task-dropdown__item task-dropdown__item--danger';
  deleteBtn.type = 'button';
  deleteBtn.innerHTML = '🗑️ Удалить';
  deleteBtn.addEventListener('click', () => {
    dropdown.classList.remove('is-open');
    showConfirmModal({
      title: 'Удалить задачу?',
      message: `«${task.title}» будет удалена без возможности восстановления.`,
      confirmText: 'Удалить',
      onConfirm: () => {
        const list = window.APP_DATA.lists.find(l => l.id === listId);
        if (list) {
          const idx = list.items.findIndex(t => t.id === task.id);
          if (idx !== -1) {
            list.items.splice(idx, 1);
            renderLists();
            updateCounts();
          }
        }
      }
    });
  });

  dropdown.appendChild(editBtn);
  dropdown.appendChild(postponeBtn);
  dropdown.appendChild(deleteBtn);

  taskMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Закрываем все другие открытые меню
    document.querySelectorAll('.task-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
    dropdown.classList.toggle('is-open');
  });

  menuWrapper.appendChild(taskMenuBtn);
  menuWrapper.appendChild(dropdown);
  taskHeader.appendChild(menuWrapper);
  
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
  
  // Блок описания (если есть)
  if (task.description) {
    const descBlock = document.createElement('div');
    descBlock.className = 'description-block';

    const descToggle = document.createElement('button');
    descToggle.className = 'description-toggle';
    descToggle.type = 'button';

    const descLabel = document.createElement('span');
    descLabel.textContent = 'описание';

    const descArrow = document.createElement('span');
    descArrow.className = 'description-arrow';
    descArrow.textContent = '▶';

    descToggle.appendChild(descLabel);
    descToggle.appendChild(descArrow);

    const descContent = document.createElement('div');
    descContent.className = 'description-content';
    descContent.textContent = task.description;

    descToggle.addEventListener('click', () => {
      const isOpen = descBlock.classList.toggle('is-open');
      descArrow.textContent = isOpen ? '▼' : '▶';
    });

    descBlock.appendChild(descToggle);
    descBlock.appendChild(descContent);
    taskContent.appendChild(descBlock);
  }
  
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
