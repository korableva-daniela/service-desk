// Проверка статуса заявки.
// На этом этапе работает на демо-данных (заглушка),
// пока не подключена YDB через API Gateway.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('statusForm');
  const resultCard = document.getElementById('resultCard');
  const notFound = document.getElementById('notFound');
  if (!form) return;

  // Демо-база: несколько примеров, чтобы страница не была пустой.
  // Позже заменится реальным запросом к API Gateway → Cloud Function → YDB.
  const demoDB = {
    'SD-000123': {
      ticket_id: 'SD-000123',
      subject: 'Не работает 1С',
      category: 'Программное обеспечение',
      urgency: 'высокая',
      assignee: 'Мария (приложения)',
      status: 'в работе',
      created_at: '2026-09-28T10:15:00Z',
      sla_resolve_deadline: '2026-09-29T18:00:00Z'
    },
    'SD-000124': {
      ticket_id: 'SD-000124',
      subject: 'Нужен доступ к папке маркетинга',
      category: 'Доступы',
      urgency: 'средняя',
      assignee: 'Анна (системный админ)',
      status: 'закрыта',
      created_at: '2026-09-27T14:30:00Z',
      sla_resolve_deadline: '2026-09-29T18:00:00Z'
    },
    'SD-000125': {
      ticket_id: 'SD-000125',
      subject: 'Не работает VPN',
      category: 'Сеть',
      urgency: 'критично',
      assignee: 'Игорь (сетевой инженер)',
      status: 'эскалирована',
      created_at: '2026-09-29T09:00:00Z',
      sla_resolve_deadline: '2026-09-29T13:00:00Z'
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('ticketId').value.trim().toUpperCase();

    resultCard.classList.add('d-none');
    notFound.classList.add('d-none');

    const ticket = demoDB[id];

    if (!ticket) {
      notFound.classList.remove('d-none');
      return;
    }

    // Заполняем карточку
    document.getElementById('resTicketId').textContent = ticket.ticket_id;
    document.getElementById('resSubject').textContent = ticket.subject;
    document.getElementById('resCategory').textContent = ticket.category;
    document.getElementById('resUrgency').textContent = ticket.urgency;
    document.getElementById('resAssignee').textContent = ticket.assignee;
    document.getElementById('resCreated').textContent =
      new Date(ticket.created_at).toLocaleString('ru-RU');
    document.getElementById('resSla').textContent =
      new Date(ticket.sla_resolve_deadline).toLocaleString('ru-RU');

    // Бейдж статуса
    const statusBadge = document.getElementById('resStatus');
    statusBadge.textContent = ticket.status;
    statusBadge.className = 'badge fs-6 ' + statusClass(ticket.status);

    resultCard.classList.remove('d-none');
  });

  function statusClass(status) {
    switch (status) {
      case 'новая':         return 'bg-secondary';
      case 'назначена':     return 'bg-primary';
      case 'в работе':      return 'bg-warning text-dark';
      case 'на проверке':   return 'bg-info text-dark';
      case 'закрыта':       return 'bg-success';
      case 'эскалирована':  return 'bg-danger';
      default:              return 'bg-secondary';
    }
  }
});