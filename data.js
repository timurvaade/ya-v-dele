// Демо-данные для приложения (структура соответствует Google Sheets)
window.APP_DATA = {
  lists: [
    {
      id: "shopping",
      title: "Список покупок",
      items: [
        { 
          id: "17000001", 
          title: "Антиколиковая бутылочка 240 мл", 
          category: "Питание", 
          status: "closed",
          description: "Обязательно купить две бутылочки, для 0 и 3/4 месяца",
          link: "https://ozon.ru/product/123",
          assignee: "Анна, Иван, Лена, Мария, Петр, Олег",
          due_date: "2026-01-25",
          created_at: "2026-01-20"
        },
        { 
          id: "17000002", 
          title: "Детское питание NAN", 
          category: "Питание", 
          status: "open",
          description: "",
          link: "",
          assignee: "Сергей",
          due_date: "2026-01-26",
          created_at: "2026-01-20"
        },
        { 
          id: "17000003", 
          title: "Памперсы размер 3", 
          category: "Личное", 
          status: "risk",
          description: "Срочно нужны, заканчиваются",
          link: "",
          assignee: "",
          due_date: "2026-01-22",
          created_at: "2026-01-18"
        },
        { 
          id: "17000010", 
          title: "Купить соску", 
          category: "Личное", 
          status: "open",
          description: "",
          link: "",
          assignee: "Анна",
          due_date: "2026-01-22",
          created_at: "2026-01-21"
        }
      ]
    },
    {
      id: "linko",
      title: "Linko",
      items: [
        { 
          id: "17000004", 
          title: "Подготовить презентацию", 
          category: "Конференция", 
          status: "open",
          description: "Нужно подготовить 15 слайдов с графиками продаж за последний квартал",
          link: "",
          assignee: "Кирилл, Денис",
          due_date: "2026-02-01",
          created_at: "2026-01-15"
        },
        { 
          id: "17000005", 
          title: "Настроить таргетинг", 
          category: "Таргет", 
          status: "risk",
          description: "",
          link: "",
          assignee: "Марина, Влад, Катя, Роман",
          due_date: "2026-01-28",
          created_at: "2026-01-10"
        }
      ]
    },
    {
      id: "tamga",
      title: "Tamga",
      items: [
        { 
          id: "17000006", 
          title: "Заказать футболки с логотипом", 
          category: "Футболки", 
          status: "open",
          description: "",
          link: "https://printbar.ru/order/456",
          assignee: "Андрей",
          due_date: "2026-02-10",
          created_at: "2026-01-12"
        },
        { 
          id: "17000007", 
          title: "Запустить рекламную кампанию", 
          category: "Таргет", 
          status: "risk",
          description: "Бюджет согласован, ждём креативы",
          link: "",
          assignee: "Тимур, Олег, Саша",
          due_date: "2026-01-30",
          created_at: "2026-01-08"
        }
      ]
    },
    {
      id: "nio",
      title: "Nio",
      items: [
        { 
          id: "17000008", 
          title: "Встреча с клиентом", 
          category: "Встреча", 
          status: "open",
          description: "",
          link: "https://meet.google.com/abc-defg-hij",
          assignee: "Влад",
          due_date: "2026-01-27",
          created_at: "2026-01-21"
        }
      ]
    },
    {
      id: "exhibition",
      title: "Выставка",
      items: [
        { 
          id: "17000009", 
          title: "Подготовить презентацию стенда", 
          category: "Презентация", 
          status: "open",
          description: "Дизайн утверждён, нужно напечатать",
          link: "",
          assignee: "Катя, Роман, Тимур, Олег, Саша",
          due_date: "2026-03-01",
          created_at: "2026-01-05"
        }
      ]
    }
  ]
};
