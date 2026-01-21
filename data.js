// Демо-данные для приложения
window.APP_DATA = {
  lists: [
    {
      id: "shopping",
      title: "Список покупок",
      items: [
        { 
          id: "t1", 
          title: "Антиколиковая бутылочка 240 мл", 
          tag: "Питание", 
          link: true, 
          due: "today", 
          done: true,
          postponed: false,
          description: "Обязательно купить две бутылочки, для 0 и 3/4 месяца",
          assignees: [
            { name: "Анна", avatarUrl: "https://i.pravatar.cc/80?u=anna" },
            { name: "Иван", avatarUrl: "https://i.pravatar.cc/80?u=ivan" },
            { name: "Лена", avatarUrl: "https://i.pravatar.cc/80?u=lena" },
            { name: "Мария", avatarUrl: "https://i.pravatar.cc/80?u=maria" },
            { name: "Петр", avatarUrl: "https://i.pravatar.cc/80?u=petr" },
            { name: "Олег", avatarUrl: "https://i.pravatar.cc/80?u=oleg" }
          ]
        },
        { 
          id: "t2", 
          title: "Детское питание NAN", 
          tag: "Питание", 
          link: false, 
          due: "today", 
          done: false,
          postponed: false,
          assignees: [
            { name: "Сергей", avatarUrl: "https://i.pravatar.cc/80?u=sergey" }
          ]
        },
        { 
          id: "t3", 
          title: "Памперсы размер 3", 
          tag: "Личное", 
          link: false, 
          due: "today", 
          done: false,
          postponed: false,
          assignees: []
        }
      ]
    },
    {
      id: "linko",
      title: "Linko",
      items: [
        { 
          id: "t4", 
          title: "Подготовить презентацию", 
          tag: "Конференция", 
          link: false, 
          due: "later", 
          done: false,
          postponed: false,
          description: "Нужно подготовить 15 слайдов с графиками продаж за последний квартал",
          assignees: [
            { name: "Кирилл", avatarUrl: "https://i.pravatar.cc/80?u=kirill" },
            { name: "Денис", avatarUrl: "https://i.pravatar.cc/80?u=denis" }
          ]
        },
        { 
          id: "t5", 
          title: "Настроить таргетинг", 
          tag: "Таргет", 
          link: false, 
          due: "later", 
          done: false,
          postponed: false,
          assignees: [
            { name: "Марина", avatarUrl: "https://i.pravatar.cc/80?u=marina" },
            { name: "Влад", avatarUrl: "https://i.pravatar.cc/80?u=vlad" },
            { name: "Катя", avatarUrl: "https://i.pravatar.cc/80?u=katya" },
            { name: "Роман", avatarUrl: "https://i.pravatar.cc/80?u=roman" }
          ]
        }
      ]
    },
    {
      id: "tamga",
      title: "Tamga",
      items: [
        { 
          id: "t6", 
          title: "Заказать футболки с логотипом", 
          tag: "Футболки", 
          link: false, 
          due: "later", 
          done: false,
          postponed: false,
          assignees: [
            { name: "Андрей", avatarUrl: "https://i.pravatar.cc/80?u=andrey" }
          ]
        },
        { 
          id: "t7", 
          title: "Запустить рекламную кампанию", 
          tag: "Таргет", 
          link: false, 
          due: "later", 
          done: false,
          postponed: true,
          assignees: [
            { name: "Тимур", avatarUrl: "https://i.pravatar.cc/80?u=timur" },
            { name: "Олег", avatarUrl: "https://i.pravatar.cc/80?u=oleg2" },
            { name: "Саша", avatarUrl: "https://i.pravatar.cc/80?u=sasha" }
          ]
        }
      ]
    },
    {
      id: "nio",
      title: "Nio",
      items: [
        { 
          id: "t8", 
          title: "Встреча с клиентом", 
          tag: "встреча", 
          link: false, 
          due: "today", 
          done: false,
          postponed: false,
          assignees: [
            { name: "Влад", avatarUrl: "https://i.pravatar.cc/80?u=vlad2" }
          ]
        }
      ]
    },
    {
      id: "exhibition",
      title: "Выставка",
      items: [
        { 
          id: "t9", 
          title: "Подготовить презентацию стенда", 
          tag: "презентация", 
          link: false, 
          due: "later", 
          done: false,
          postponed: false,
          assignees: [
            { name: "Катя", avatarUrl: "https://i.pravatar.cc/80?u=katya2" },
            { name: "Роман", avatarUrl: "https://i.pravatar.cc/80?u=roman2" },
            { name: "Тимур", avatarUrl: "https://i.pravatar.cc/80?u=timur2" },
            { name: "Олег", avatarUrl: "https://i.pravatar.cc/80?u=oleg3" },
            { name: "Саша", avatarUrl: "https://i.pravatar.cc/80?u=sasha2" }
          ]
        }
      ]
    }
  ]
};
