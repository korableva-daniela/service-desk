document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticketForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const formData = new FormData(form);

    // Собираем данные для отправки
    const payload = {
      full_name: formData.get('full_name'),
      department: formData.get('department'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      subject: formData.get('subject'),
      description: formData.get('description'),
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Отправка...';

    // ВАЖНО: замените ссылку на вашу реальную Ссылку для вызова из Yandex Cloud!
    fetch('https://functions.yandexcloud.net/d4ekiprsrpeutdlbaqmt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(result => {
        if (result.status === 'ok') {
          localStorage.setItem('last_ticket_number', result.ticket_id);
          window.location.href = 'thank-you.html';
        } else {
          throw new Error(result.message || 'Ошибка сервера');
        }
      })
      .catch(error => {
        console.error('Ошибка отправки:', error);
        alert('Не удалось отправить заявку. Попробуйте позже.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send"></i> Отправить заявку';
      });
  });
});
