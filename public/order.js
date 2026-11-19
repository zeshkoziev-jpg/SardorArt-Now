document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('go-to-bot-btn');
  
  if (btn) {
    btn.addEventListener('click', () => {
      // BU YERGA O'ZINGIZNING YANGI BOTINGIZ NOMINI YOZING
      const botUsername = 'SardorZakaz_bot'; 
      
      // Havolani to'g'ri formatda ochish
      const url = `https://t.me/${botUsername}?start=order`;
      
      // Yangi oynada ochish
      window.open(url, '_blank');
    });
  }
});