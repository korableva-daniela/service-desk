document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('statusForm');
  const resultCard = document.getElementById('resultCard');
  const notFound = document.getElementById('notFound');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('ticketId').value.trim().toUpperCase();

    resultCard.classList.add('d-none');
    notFound.classList.add('d-none');

    // Запрос к Cloud Function для получения статуса
   
    fetch(`https://functions.yandexcloud.net/d4encghgeriphl6r1pe4?id=${encodeURIComponent(id)}`)
      .then(response => {
        if (response.status === 404) {
          throw new Error('not_found');
        }
        if (!response.ok) {
          throw new Error('server_error');
        }
        return response.json();
      })
      .then(ticket => {
        // Заполняем карточку
        document.getElementById('resTicketId').textContent = ticket.ticket_id;
        document.getElementById('resSubject').textContent = ticket.subject;
        document.getElementById('resCategory').textContent = ticket.category;
        document.getElementById('resUrgency').textContent = ticket.urgency;
        document.getElementById('resAssignee').textContent = ticket.assignee;
        document.getElementById('resCreated').textContent =
          ticket.created_at ? new Date(ticket.created_at).toLocaleString('ru-RU') : '—';
        document.getElementById('resSla').textContent =
          ticket.sla_deadline ? new Date(ticket.sla_deadline).toLocaleString('ru-RU') : '—';

        // Бейдж статуса
        const statusBadge = document.getElementById('resStatus');
        statusBadge.textContent = ticket.status;
        statusBadge.className = 'badge fs-6 ' + statusClass(ticket.status);

        resultCard.classList.remove('d-none');
      })
      .catch(error => {
        if (error.message === 'not_found') {
          notFound.classList.remove('d-none');
        } else {
          console.error('Ошибка:', error);
          alert('Не удалось получить статус заявки. Попробуйте позже.');
        }
      });
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
