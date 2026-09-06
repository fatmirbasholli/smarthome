const header = document.getElementById('header');
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > 20);
});

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('nav--open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.setAttribute('aria-label', isOpen ? 'Stäng meny' : 'Öppna meny');
});

nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav--open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Öppna meny');
  });
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const phone = contactForm.phone.value.trim();
  const city = contactForm.city.value.trim();
  const service = contactForm.service.value;
  const message = contactForm.message.value.trim();

  if (!name || !email) {
    formStatus.textContent = 'Fyll i namn och e-post.';
    formStatus.className = 'form-status form-status--error';
    return;
  }

  const serviceLabels = {
    konsultation: 'Konsultation',
    starter: 'Starter-paket',
    sakerhet: 'Säkerhet Starter',
    tradgard: 'Trädgård Starter',
    energi: 'Energi-paket',
    villa: 'Hela villan',
    support: 'Felsökning / support',
    annat: 'Annat',
  };

  const subject = encodeURIComponent(`Förfrågan: ${serviceLabels[service] || 'Smart hem'} — ${name}`);
  const body = encodeURIComponent(
    `Namn: ${name}\n` +
    `E-post: ${email}\n` +
    `Telefon: ${phone || '—'}\n` +
    `Ort: ${city || '—'}\n` +
    `Tjänst: ${serviceLabels[service] || '—'}\n\n` +
    `Meddelande:\n${message || '—'}`
  );

  window.location.href = `mailto:info@smarthemskane.se?subject=${subject}&body=${body}`;

  formStatus.textContent = 'Din e-postklient öppnas — skicka meddelandet därifrån.';
  formStatus.className = 'form-status form-status--success';
});
