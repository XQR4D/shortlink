const longUrlInput = document.getElementById('longUrl');
const shortenBtn = document.getElementById('shortenBtn');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');
const shortUrlDisplay = document.getElementById('shortUrlDisplay');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const qrContainer = document.getElementById('qrcode');

let currentShortUrl = '';

const showError = (msg) => {
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
  resultEl.classList.add('hidden');
};

const showResult = (shortUrl) => {
  currentShortUrl = shortUrl;
  shortUrlDisplay.textContent = shortUrl;
  resultEl.classList.remove('hidden');
  errorEl.classList.add('hidden');

  qrContainer.innerHTML = '';
  new QRCode(qrContainer, {
    text: shortUrl,
    width: 220,
    height: 220,
    colorDark: '#000000',
    colorLight: '#ffffff',
  });
};

shortenBtn.onclick = async () => {
  const input = longUrlInput.value.trim();
  if (!input) return showError('Type link');

  let url;
  try {
    url = new URL(input.startsWith('http') ? input : 'https://' + input);
  } catch {
    return showError('Invalid format link');
  }

  shortenBtn.disabled = true;
  shortenBtn.textContent = '...';

  try {
    const response = await fetch(
      `https://clck.ru/--?url=${encodeURIComponent(url.toString())}`
    );
    if (!response.ok) throw new Error();
    const text = await response.text();
    const trimmed = text.trim();
    if (trimmed.startsWith('http') && trimmed.includes('clck.ru')) {
      showResult(trimmed);
    } else {
      throw new Error();
    }
  } catch {
    showError('We dont short u link. Try again later.');
  } finally {
    shortenBtn.disabled = false;
    shortenBtn.textContent = 'Gooo!';
  }
};

copyBtn.onclick = () => {
  navigator.clipboard.writeText(currentShortUrl);
  alert('Link success copied!');
};

shareBtn.onclick = () => {
  if (navigator.share) {
    navigator
      .share({
        title: 'Short link',
        text: 'This short link on my source',
        url: currentShortUrl,
      })
      .catch(() => {});
  } else {
    alert('Function «Share» doesnt support in this browser');
  }
};

longUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') shortenBtn.click();
});