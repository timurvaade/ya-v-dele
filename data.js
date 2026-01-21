// Демо-данные для приложения
window.APP_DATA = {
  lists: [
    {
      id: "shopping",
      title: "Список покупок",
      assignees: [
        { name: "Анна Петрова", initials: "АП" },
        { name: "Иван Смирнов", initials: "ИС" },
        { name: "Лена Карпова", initials: "ЛК" },
        { name: "Мария Орлова", initials: "МО" }
      ],
      items: [
        { 
          id: "t1", 
          title: "Антиколиковая бутылочка 240 мл", 
          tag: "Питание", 
          link: true, 
          due: "today", 
          done: true,
          postponed: false
        },
        { 
          id: "t2", 
          title: "Детское питание NAN", 
          tag: "Питание", 
          link: false, 
          due: "today", 
          done: false,
          postponed: false
        },
        { 
          id: "t3", 
          title: "Памперсы размер 3", 
          tag: "Личное", 
          link: false, 
          due: "today", 
          done: false,
          postponed: false
        }
      ]
    },
    {
      id: "linko",
      title: "Linko",
      assignees: [
        { name: "Сергей Лебедев", initials: "СЛ" },
        { name: "Кирилл Соколов", initials: "КС" }
      ],
      items: [
        { 
          id: "t4", 
          title: "Подготовить презентацию", 
          tag: "Конференция", 
          link: false, 
          due: "later", 
          done: false,
          postponed: false
        },
        { 
          id: "t5", 
          title: "Настроить таргетинг", 
          tag: "Таргет", 
          link: false, 
          due: "later", 
          done: false,
          postponed: false
        }
      ]
    },
    {
      id: "tamga",
      title: "Tamga",
      assignees: [
        { name: "Андрей Егоров", initials: "АЕ" },
        { name: "Марина Фролова", initials: "МФ" },
        { name: "Денис Попов", initials: "ДП" }
      ],
      items: [
        { 
          id: "t6", 
          title: "Заказать футболки с логотипом", 
          tag: "Футболки", 
          link: false, 
          due: "later", 
          done: false,
          postponed: false
        },
        { 
          id: "t7", 
          title: "Запустить рекламную кампанию", 
          tag: "Таргет", 
          link: false, 
          due: "later", 
          done: false,
          postponed: true
        }
      ]
    },
    {
      id: "nio",
      title: "Nio",
      assignees: [
        { name: "Влад Ким", initials: "ВК" }
      ],
      items: [
        { 
          id: "t8", 
          title: "Встреча с клиентом", 
          tag: "встреча", 
          link: false, 
          due: "today", 
          done: false,
          postponed: false
        }
      ]
    },
    {
      id: "exhibition",
      title: "Выставка",
      assignees: [
        { name: "Катя Иванова", initials: "КИ" },
        { name: "Роман Белов", initials: "РБ" },
        { name: "Тимур Саидов", initials: "ТС" },
        { name: "Олег Савин", initials: "ОС" }
      ],
      items: [
        { 
          id: "t9", 
          title: "Подготовить презентацию стенда", 
          tag: "презентация", 
          link: false, 
          due: "later", 
          done: false,
          postponed: false
        }
      ]
    }
  ]
};
