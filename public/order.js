document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('go-to-bot-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      // BU YERGA YANGI BOTINGIZNING NOMINI YOZING (@ belgisisiz)
      const botUsername = 'sizning_yangi_botingiz'; 
      window.open`(https://t.me/${botUsername}?start=order', '_blank')`;
    });
  }
});