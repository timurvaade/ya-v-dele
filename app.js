// Глобальное состояние
let currentFilter = 'all'; // all, today, week, later
let currentStatusFilter = 'all'; // all, open, closed, risk
let searchQuery = ''; // поисковый запрос
let expandedLists = new Set(); // ID раскрытых списков

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initFilters();
  initSearch();
  initFAB();
  initCurrentDate();
  renderLists();
  updateCounts();

  // Закрытие dropdown при клике вне меню
  document.addEventListener('click', () => {
    document.querySelectorAll('.task-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  });
});

// Инициализация поиска
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  if (!searchInput) return;

  let debounceTimer;
  
  const updateSearch = () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderLists();
    updateCounts();
    
    // Показываем/скрываем кнопку очистки
    if (clearBtn) {
      clearBtn.classList.toggle('is-visible', searchInput.value.length > 0);
    }
  };

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateSearch, 200);
  });

  // Очистка поиска
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.classList.remove('is-visible');
      renderLists();
      updateCounts();
      searchInput.focus();
    });
  }
}

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
      else if (filterText === 'в риске') currentStatusFilter = 'risk';
      // Перерисовываем списки
      renderLists();
    });
  });
}

// Инициализация FAB кнопки
function initFAB() {
  const fab = document.querySelector('.fab');
  fab.addEventListener('click', () => {
    alert('Создание новой задачи (в разработке)');
  });
}

// Инициализация текущей даты
function initCurrentDate() {
  const dateEl = document.getElementById('current-date');
  if (!dateEl) return;

  const now = new Date();
  const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  
  const dayName = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  
  dateEl.textContent = `${dayName}, ${day} ${month}`;
}

// Проверка, является ли дата "сегодня"
function isToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const date = new Date(dateStr);
  return date.toDateString() === today.toDateString();
}

// Проверка, является ли дата "на этой неделе"
function isThisWeek(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const date = new Date(dateStr);
  const weekFromNow = new Date(today);
  weekFromNow.setDate(today.getDate() + 7);
  return date >= today && date <= weekFromNow;
}

// Форматирование даты для отображения
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

// Фильтрация задач по текущему фильтру
function filterTasks(tasks) {
  return tasks.filter(task => {
    // Фильтр по статусу (all, open, closed, risk)
    let matchesStatusFilter = true;
    if (currentStatusFilter === 'open') {
      matchesStatusFilter = task.status === 'open';
    } else if (currentStatusFilter === 'closed') {
      matchesStatusFilter = task.status === 'closed';
    } else if (currentStatusFilter === 'risk') {
      matchesStatusFilter = task.status === 'risk';
    }

    // Фильтр по поисковому запросу
    let matchesSearch = true;
    if (searchQuery) {
      const title = (task.title || '').toLowerCase();
      const description = (task.description || '').toLowerCase();
      const category = (task.category || '').toLowerCase();
      const assignee = (task.assignee || '').toLowerCase();
      
      matchesSearch = title.includes(searchQuery) ||
                      description.includes(searchQuery) ||
                      category.includes(searchQuery) ||
                      assignee.includes(searchQuery);
    }
    
    return matchesStatusFilter && matchesSearch;
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
    
    // Проверяем, совпадает ли название списка с поиском
    const listTitleMatches = searchQuery && 
      list.title.toLowerCase().includes(searchQuery);
    
    // Показываем список если:
    // 1. Есть задачи после фильтрации, ИЛИ
    // 2. Название списка совпадает с поиском (тогда показываем все задачи по статусу)
    let tasksToShow = filteredTasks;
    if (listTitleMatches && filteredTasks.length === 0) {
      // Если название совпало, но задач нет — показываем задачи без поискового фильтра
      tasksToShow = filterTasksByStatus(list.items);
    }
    
    if (tasksToShow.length === 0 && !listTitleMatches) return;
    
    // Автораскрытие при поиске
    const autoExpand = !!searchQuery;
    const listCard = createListCard(list, tasksToShow, autoExpand);
    container.appendChild(listCard);
  });
}

// Фильтрация только по статусу (без поиска)
function filterTasksByStatus(tasks) {
  return tasks.filter(task => {
    if (currentStatusFilter === 'all') return true;
    return task.status === currentStatusFilter;
  });
}

// Создание карточки списка
function createListCard(list, tasks, autoExpand = false) {
  // Проверяем, был ли список открыт ранее
  const wasExpanded = expandedLists.has(list.id);
  const shouldExpand = autoExpand || wasExpanded;

  const card = document.createElement('div');
  card.className = 'list-card';
  if (shouldExpand) card.classList.add('is-expanded');
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
  tasksContainer.style.display = shouldExpand ? 'flex' : 'none';
  
  tasks.forEach(task => {
    const taskElement = createTaskElement(task, list.id);
    tasksContainer.appendChild(taskElement);
  });

  // Кнопка "Добавить задачу"
  const addTaskBtn = document.createElement('button');
  addTaskBtn.className = 'add-task-btn';
  addTaskBtn.type = 'button';
  addTaskBtn.textContent = '+ Добавить задачу';
  addTaskBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showAddTaskInput(list, tasksContainer, addTaskBtn);
  });
  tasksContainer.appendChild(addTaskBtn);
  
  // Обработчик раскрытия/скрытия — клик на весь заголовок
  head.style.cursor = 'pointer';
  head.addEventListener('click', () => {
    const isExpanded = card.classList.toggle('is-expanded');
    tasksContainer.style.display = isExpanded ? 'flex' : 'none';
    toggleBtn.setAttribute('aria-expanded', String(isExpanded));
    
    // Сохраняем состояние
    if (isExpanded) {
      expandedLists.add(list.id);
    } else {
      expandedLists.delete(list.id);
    }
  });
  
  card.appendChild(head);
  card.appendChild(tasksContainer);
  
  return card;
}

// Показать инпут для добавления задачи
function showAddTaskInput(list, tasksContainer, addTaskBtn) {
  // Если уже есть инпут — фокусируемся на нём
  const existingInput = tasksContainer.querySelector('.add-task-input');
  if (existingInput) {
    existingInput.focus();
    return;
  }

  // Скрываем кнопку
  addTaskBtn.style.display = 'none';

  // Создаём контейнер для инпута
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'add-task-wrapper';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'add-task-input';
  input.placeholder = 'Название задачи...';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'add-task-save';
  saveBtn.type = 'button';
  saveBtn.textContent = '✓';

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(saveBtn);
  tasksContainer.appendChild(inputWrapper);

  input.focus();

  const saveTask = () => {
    const title = input.value.trim();
    if (title) {
      // Создаём новую задачу
      const today = new Date().toISOString().split('T')[0];
      const newTask = {
        id: String(Date.now()),
        title: title,
        category: '',
        status: 'open',
        description: '',
        link: '',
        assignee: '',
        due_date: today,
        created_at: today
      };
      
      // Добавляем в данные
      list.items.push(newTask);
      
      // Перерисовываем
      renderLists();
      updateCounts();
    } else {
      cancelInput();
    }
  };

  const cancelInput = () => {
    inputWrapper.remove();
    addTaskBtn.style.display = '';
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTask();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelInput();
    }
  });

  input.addEventListener('blur', (e) => {
    // Если клик был на кнопку сохранения — не отменяем
    if (e.relatedTarget === saveBtn) return;
    setTimeout(() => {
      if (document.activeElement !== saveBtn) {
        cancelInput();
      }
    }, 100);
  });

  saveBtn.addEventListener('click', saveTask);
}

// Парсинг строки assignee в массив объектов
function parseAssignees(assigneeStr) {
  if (!assigneeStr || !assigneeStr.trim()) return [];
  return assigneeStr.split(',').map(name => ({
    name: name.trim()
  }));
}

// Создание блока ответственных
function createAssignees(assigneeStr) {
  const assignees = parseAssignees(assigneeStr);
  if (!assignees.length) return null;

  const container = document.createElement('div');
  container.className = 'assignees';

  const maxVisible = 2;
  const visibleAssignees = assignees.slice(0, maxVisible);

  visibleAssignees.forEach(person => {
    const avatar = document.createElement('button');
    avatar.className = 'avatar';
    avatar.type = 'button';
    avatar.title = person.name;

    // Берём первую букву имени
    const initial = person.name.charAt(0).toUpperCase();
    avatar.textContent = initial;

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
  if (task.status === 'closed') taskDiv.classList.add('is-completed');
  if (task.status === 'risk') taskDiv.classList.add('is-risk');
  
  // Левая часть (чекбокс)
  const taskLeft = document.createElement('div');
  taskLeft.className = 'task__left';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'checkbox';
  checkbox.id = `task-${task.id}`;
  checkbox.checked = task.status === 'closed';
  
  checkbox.addEventListener('change', () => {
    task.status = checkbox.checked ? 'closed' : 'open';
    taskDiv.classList.toggle('is-completed', task.status === 'closed');
    taskDiv.classList.remove('is-risk');
    updateCounts();
  });
  
  taskLeft.appendChild(checkbox);
  
  // Контент задачи
  const taskContent = document.createElement('div');
  taskContent.className = 'task__content';
  
  // Заголовок с категорией и меню
  const taskHeader = document.createElement('div');
  taskHeader.className = 'task-header';
  
  if (task.category) {
    const pill = document.createElement('span');
    pill.className = `pill pill--${getCategoryColor(task.category)}`;
    pill.textContent = task.category;
    taskHeader.appendChild(pill);
  }

  // Правая часть заголовка (ответственные + меню)
  const headerRight = document.createElement('div');
  headerRight.className = 'task-header__right';

  // Аватары ответственных
  const assigneesEl = createAssignees(task.assignee);
  if (assigneesEl) headerRight.appendChild(assigneesEl);
  
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

  // Пункт: В риске / Убрать из риска
  const riskBtn = document.createElement('button');
  riskBtn.className = 'task-dropdown__item';
  riskBtn.type = 'button';
  riskBtn.innerHTML = task.status === 'risk' ? '✅ Убрать из риска' : '⚠️ В риске';
  riskBtn.addEventListener('click', () => {
    dropdown.classList.remove('is-open');
    task.status = task.status === 'risk' ? 'open' : 'risk';
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
  dropdown.appendChild(riskBtn);
  dropdown.appendChild(deleteBtn);

  taskMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Закрываем все другие открытые меню
    document.querySelectorAll('.task-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
    dropdown.classList.toggle('is-open');
  });

  menuWrapper.appendChild(taskMenuBtn);
  menuWrapper.appendChild(dropdown);
  headerRight.appendChild(menuWrapper);
  taskHeader.appendChild(headerRight);
  
  taskContent.appendChild(taskHeader);
  
  // Название задачи
  const taskTitle = document.createElement('label');
  taskTitle.className = 'task-title';
  taskTitle.setAttribute('for', `task-${task.id}`);
  taskTitle.textContent = task.title;
  taskContent.appendChild(taskTitle);

  // Дата (если есть)
  if (task.due_date) {
    const dueDateEl = document.createElement('span');
    dueDateEl.className = 'task-due-date';
    dueDateEl.textContent = formatDate(task.due_date);
    taskContent.appendChild(dueDateEl);
  }
  
  // Ссылка (если есть)
  if (task.link) {
    const taskLink = document.createElement('a');
    taskLink.className = 'task-link-ref';
    taskLink.href = task.link;
    taskLink.target = '_blank';
    taskLink.rel = 'noopener noreferrer';
    taskLink.textContent = 'ссылка';
    taskContent.appendChild(taskLink);
  }
  
  // Блок описания
  const descBlock = document.createElement('div');
  descBlock.className = 'description-block';

  if (task.description) {
    // Текст описания
    const descText = document.createElement('span');
    descText.className = 'description-text';
    descText.textContent = task.description;
    descBlock.appendChild(descText);

    // Иконка редактирования (всегда видна)
    const editIcon = document.createElement('button');
    editIcon.className = 'description-edit-icon';
    editIcon.type = 'button';
    editIcon.innerHTML = '✎';
    editIcon.title = 'Редактировать';
    editIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      showEditDescriptionInput(task, descBlock, descText);
    });
    descBlock.appendChild(editIcon);

    // Стрелка (скрыта по умолчанию, видна только если overflow)
    const descArrow = document.createElement('span');
    descArrow.className = 'description-arrow';
    descArrow.textContent = '▼'; // вниз = развернуть
    descBlock.appendChild(descArrow);

    // Проверяем overflow после рендера
    setTimeout(() => {
      if (descText.scrollHeight > descText.clientHeight) {
        descBlock.classList.add('has-overflow');
      }
    }, 0);

    descBlock.addEventListener('click', (e) => {
      // Не раскрываем если клик на иконку редактирования
      if (e.target.closest('.description-edit-icon')) return;
      if (!descBlock.classList.contains('has-overflow') && !descBlock.classList.contains('is-open')) return;
      
      const isOpen = descBlock.classList.toggle('is-open');
      descArrow.textContent = isOpen ? '▲' : '▼'; // вверх = свернуть
    });
  } else {
    // Кнопка "добавить описание"
    descBlock.classList.add('is-empty');
    const addDescBtn = document.createElement('button');
    addDescBtn.className = 'add-desc-btn';
    addDescBtn.type = 'button';
    addDescBtn.textContent = '+ добавить описание';
    addDescBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showAddDescriptionInput(task, taskContent, descBlock);
    });
    descBlock.appendChild(addDescBtn);
  }

  taskContent.appendChild(descBlock);
  
  taskDiv.appendChild(taskLeft);
  taskDiv.appendChild(taskContent);
  
  return taskDiv;
}

// Показать инпут для добавления описания
function showAddDescriptionInput(task, taskContent, descBlock) {
  descBlock.style.display = 'none';

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'add-desc-wrapper';

  const textarea = document.createElement('textarea');
  textarea.className = 'add-desc-input';
  textarea.placeholder = 'Введите описание...';
  textarea.rows = 2;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'add-desc-buttons';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'add-desc-save';
  saveBtn.type = 'button';
  saveBtn.textContent = 'Сохранить';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'add-desc-cancel';
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Отмена';

  btnGroup.appendChild(cancelBtn);
  btnGroup.appendChild(saveBtn);
  inputWrapper.appendChild(textarea);
  inputWrapper.appendChild(btnGroup);
  taskContent.appendChild(inputWrapper);

  textarea.focus();

  const save = () => {
    const value = textarea.value.trim();
    if (value) {
      task.description = value;
      renderLists();
      updateCounts();
    } else {
      cancel();
    }
  };

  const cancel = () => {
    inputWrapper.remove();
    descBlock.style.display = '';
  };

  saveBtn.addEventListener('click', save);
  cancelBtn.addEventListener('click', cancel);

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  });
}

// Показать инпут для редактирования описания
function showEditDescriptionInput(task, descBlock, descText) {
  const originalText = task.description;
  
  // Скрываем блок описания
  descBlock.style.display = 'none';
  
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'add-desc-wrapper';

  const textarea = document.createElement('textarea');
  textarea.className = 'add-desc-input';
  textarea.value = originalText;
  textarea.rows = 3;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'add-desc-buttons';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'add-desc-save';
  saveBtn.type = 'button';
  saveBtn.textContent = 'Сохранить';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'add-desc-cancel';
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Отмена';

  btnGroup.appendChild(cancelBtn);
  btnGroup.appendChild(saveBtn);
  inputWrapper.appendChild(textarea);
  inputWrapper.appendChild(btnGroup);
  
  descBlock.parentNode.insertBefore(inputWrapper, descBlock.nextSibling);
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);

  const save = () => {
    const value = textarea.value.trim();
    if (value) {
      task.description = value;
      renderLists();
      updateCounts();
    } else {
      cancel();
    }
  };

  const cancel = () => {
    inputWrapper.remove();
    descBlock.style.display = '';
  };

  saveBtn.addEventListener('click', save);
  cancelBtn.addEventListener('click', cancel);

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  });
}

// Получение цвета категории
function getCategoryColor(category) {
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
    'Встреча': 'teal',
    'Презентация': 'violet'
  };
  return colors[category] || 'blue';
}

// Обновление счётчиков
function updateCounts() {
  if (!window.APP_DATA) return;
  
  let totalAll = 0;
  let totalOpen = 0;
  let totalClosed = 0;
  let totalRisk = 0;
  
  window.APP_DATA.lists.forEach(list => {
    list.items.forEach(task => {
      totalAll++;
      if (task.status === 'closed') totalClosed++;
      else if (task.status === 'risk') totalRisk++;
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
    else if (label === 'в риске') count.textContent = totalRisk;
  });
}
