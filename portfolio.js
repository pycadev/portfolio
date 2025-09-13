document.addEventListener('DOMContentLoaded', () => {
  // Menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('show');
    menuToggle.textContent = isExpanded ? '☰' : '✕';
    menuToggle.focus();
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
      if (navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      }
    });
  });

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
    themeToggle.querySelector('.icon').classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    const icon = themeToggle.querySelector('.icon');
    if (isDark) {
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      icon.classList.replace('fa-sun', 'fa-moon');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Form handling
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    if (!data.name || !data.email || !data.message || !validateEmail(data.email)) {
      alert('Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring!');
      return;
    }

    try {
      // Replace with actual API endpoint if available
      // const response = await fetch('https://your-api-endpoint', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // if (!response.ok) throw new Error('Server xatosi');
      alert('Xabar muvaffaqiyatli yuborildi! Tez orada javob beraman.');
      contactForm.reset();
    } catch (error) {
      alert('Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.');
      console.error('Form submission error:', error);
    }
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
  }

  // Intersection Observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -70px 0px' });

  document.querySelectorAll('.section, .card, .project-card, .demo-container').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Parallax effect for project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateX(${y / 50}deg) rotateY(${-x / 50}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // Keyboard and touch accessibility
  document.querySelectorAll('.project-card, .demo-container, .contact-links a').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = el.querySelector('a');
        if (link) link.click();
      }
    });
    el.addEventListener('touchstart', () => el.classList.add('hover'), { passive: true });
    el.addEventListener('touchend', () => el.classList.remove('hover'), { passive: true });
  });

  // Algorithm demo
  const canvas = document.getElementById('algorithm-canvas');
  const ctx = canvas.getContext('2d');
  const startDemoBtn = document.getElementById('start-demo');
  const algorithmSelect = document.getElementById('algorithm-select');

  let bars = Array(20).fill().map(() => Math.floor(Math.random() * 100) + 10);
  let isAnimating = false;

  function drawBars(array) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / array.length;
    array.forEach((height, i) => {
      ctx.fillStyle = `hsl(${i * 15}, 70%, 60%)`;
      ctx.fillRect(i * barWidth, canvas.height - height * 3, barWidth - 2, height * 3);
    });
  }

  async function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          drawBars(arr);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
  }

  async function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  }

  async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] <= pivot) {
        i++;
        [arr[j], arr[i]] = [arr[i], arr[j]];
        drawBars(arr);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    drawBars(arr);
    await new Promise(resolve => setTimeout(resolve, 100));
    return i + 1;
  }

  startDemoBtn.addEventListener('click', async () => {
    if (isAnimating) return;
    isAnimating = true;
    startDemoBtn.disabled = true;
    const algorithm = algorithmSelect.value;
    const arr = [...bars];
    if (algorithm === 'bubble') await bubbleSort(arr);
    else if (algorithm === 'quick') await quickSort(arr);
    isAnimating = false;
    startDemoBtn.disabled = false;
  });

  // Initial draw
  drawBars(bars);

  // Reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }

  console.log('Samirbek Jabborovning kreativ portfolio sayti muvaffaqiyatli yuklandi.');
});