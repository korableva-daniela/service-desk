// Обработка отправки формы заявки.
// На этом этапе форма НЕ отправляет данные в облако —
// она собирает JSON и выводит его в консоль,
// чтобы определить структуру для будущего API.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticketForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Проверка валидности средствами Bootstrap
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Собираем данные
    const formData = new FormData(form);

    // Генерируем номер заявки (заглушка; в облаке его выдаст Cloud Function)
    const now = new Date();
    const seq = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
    const ticketNumber = `SD-${seq}`;

    const payload = {
      ticket_id: ticketNumber,
      full_name: formData.get('full_name'),
      department: formData.get('department'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      subject: formData.get('subject'),
      description: formData.get('description'),
      user_priority: formData.get('user_priority'),
      attachment_name: formData.get('attachment')?.name || null,
      created_at: now.toISOString()
    };

    // Пока просто выводим — позже здесь будет fetch() на API Gateway
    console.log('📨 Заявка сформирована:', payload);
    console.log('📦 JSON для отправки в облако:', JSON.stringify(payload, null, 2));

    // Сохраняем номер заявки, чтобы показать на странице «спасибо»
    localStorage.setItem('last_ticket_number', ticketNumber);

    // Переходим на страницу благодарности
    window.location.href = 'thank-you.html';
  });
});