const getKyivISOString = () => {
  const now = new Date();
  // Отримуємо зміщення часового поясу в хвилинах і конвертуємо в мілісекунди
  const offset = now.getTimezoneOffset() * 60000;

  // Створюємо дату в часовому поясі Києва
  const kyivTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Europe/Kyiv' }),
  );

  // Формуємо ISO-подібний рядок без символу 'Z' (який означає UTC)
  const pad = (num: number) => String(num).padStart(2, '0');

  return `${kyivTime.getFullYear()}-${pad(kyivTime.getMonth() + 1)}-${pad(kyivTime.getDate())}T${pad(kyivTime.getHours())}:${pad(kyivTime.getMinutes())}:${pad(kyivTime.getSeconds())}.000Z`;
};

export const timestamp = getKyivISOString();

// Результат:
// createdAt: timestamp,
// updatedAt: timestamp
