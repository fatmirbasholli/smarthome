// Hämta nyckel gratis på https://web3forms.com (ange smarthemskane@gmail.com)
const WEB3FORMS_ACCESS_KEY = 'd48405cb-72fc-405a-af8a-5a508cd775ed';

const header = document.getElementById('header');
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const yearEl = document.getElementById('year');

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

function setFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status form-status--${type}`;
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const phone = contactForm.phone.value.trim();
  const city = contactForm.city.value.trim();
  const service = contactForm.service.value;
  const message = contactForm.message.value.trim();
  const serviceLabel = serviceLabels[service] || '—';

  if (!name || !email) {
    setFormStatus('Fyll i namn och e-post.', 'error');
    return;
  }

  if (WEB3FORMS_ACCESS_KEY === 'REPLACE_WITH_YOUR_KEY') {
    setFormStatus('Formuläret är inte konfigurerat ännu. Kontakta oss via e-post.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Skickar...';
  setFormStatus('', '');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Förfrågan: ${serviceLabel} — ${name}`,
        from_name: name,
        email,
        phone: phone || '—',
        city: city || '—',
        service: serviceLabel,
        message: message || '—',
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      contactForm.reset();
      setFormStatus('Tack! Vi har tagit emot din förfrågan och återkommer inom 24 timmar.', 'success');
    } else {
      setFormStatus('Något gick fel. Försök igen eller maila smarthemskane@gmail.com.', 'error');
    }
  } catch {
    setFormStatus('Kunde inte skicka. Kontrollera nätverket eller maila smarthemskane@gmail.com.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Skicka förfrågan';
  }
});
