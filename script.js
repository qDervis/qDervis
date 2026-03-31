// ============================================================
// script.js — M.D. Tate Portfolyo
// ============================================================

// ── CURSOR ──
const cd = document.getElementById('cd');
const cr = document.getElementById('cr');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cd.style.left = mx + 'px';
  cd.style.top  = my + 'px';
});

(function tick() {
  rx += (mx - rx) * .11;
  ry += (my - ry) * .11;
  cr.style.left = rx + 'px';
  cr.style.top  = ry + 'px';
  requestAnimationFrame(tick);
})();

document.querySelectorAll('a, button, .proj-item, .soc-item, .gal-item').forEach(el => {
  el.addEventListener('mouseenter', () => { cd.classList.add('hover'); cr.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cd.classList.remove('hover'); cr.classList.remove('hover'); });
});


// ── CURSOR İZ EFEKTİ ──
const izler = [];
const IZ_SAYISI = 12;
for (let i = 0; i < IZ_SAYISI; i++) {
  const iz = document.createElement('div');
  iz.style.cssText = `
    position:fixed;pointer-events:none;z-index:99990;
    width:${6 - i * 0.4}px;height:${6 - i * 0.4}px;
    background:rgba(201,168,76,${0.35 - i * 0.025});
    border-radius:50%;top:0;left:0;
    transform:translate(-50%,-50%);
    transition:opacity .3s;
  `;
  document.body.appendChild(iz);
  izler.push({ el: iz, x: 0, y: 0 });
}

(function izTick() {
  let px = mx, py = my;
  izler.forEach((iz, i) => {
    const nx = px + (iz.x - px) * (0.35 + i * 0.04);
    const ny = py + (iz.y - py) * (0.35 + i * 0.04);
    iz.x = nx; iz.y = ny;
    iz.el.style.left = nx + 'px';
    iz.el.style.top  = ny + 'px';
    px = nx; py = ny;
  });
  requestAnimationFrame(izTick);
})();


// ── PARALLAX ──
window.addEventListener('scroll', () => {
  const foto = document.querySelector('.hero-foto');
  if (foto) foto.style.transform = 'translateY(calc(-50% + ' + (window.scrollY * 0.25) + 'px))';
  const glow = document.querySelector('.hero-glow');
  if (glow) glow.style.transform = 'translateY(' + (window.scrollY * 0.15) + 'px)';
});


// ── LOADING ──
const gBar = document.getElementById('g-bar');
const gPct = document.getElementById('g-pct');
let pct = 0;

const gInt = setInterval(() => {
  pct += Math.random() * 13 + 3;
  if (pct >= 100) {
    pct = 100;
    clearInterval(gInt);
    setTimeout(() => {
      const g = document.getElementById('giris');
      g.classList.add('kapani');
      setTimeout(() => g.style.display = 'none', 900);
    }, 350);
  }
  gBar.style.width = pct + '%';
  gPct.textContent = Math.floor(pct);
}, 75);


// ── NAV ──
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 60);
});


// ── SAYFA GEÇİŞ ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const pt = document.getElementById('pt');
    pt.classList.add('in');
    setTimeout(() => {
      t.scrollIntoView({ behavior: 'instant' });
      pt.classList.remove('in');
      pt.classList.add('out');
      setTimeout(() => pt.classList.remove('out'), 700);
    }, 600);
  });
});


// ── MOBİL MENU ──
let mobOpen = false;

function hamToggle() {
  mobOpen = !mobOpen;
  document.getElementById('mob').classList.toggle('open', mobOpen);
  document.getElementById('ham').classList.toggle('open', mobOpen);
}

function mobKapat() {
  mobOpen = false;
  document.getElementById('mob').classList.remove('open');
  document.getElementById('ham').classList.remove('open');
}

document.getElementById('ham').addEventListener('click', hamToggle);
document.querySelectorAll('.mob-menu a').forEach(a => {
  a.addEventListener('click', mobKapat);
});


// ── REVEAL ──
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('on');
}), { threshold: .08 });

document.querySelectorAll('.reveal, .sec').forEach(el => io.observe(el));

const skillIO = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    e.target.querySelectorAll('.skill-fill').forEach(b => b.style.width = b.dataset.w + '%');
  }
}), { threshold: .3 });

document.querySelectorAll('#beceriler').forEach(b => skillIO.observe(b));


// ── HARF HARF BAŞLIK ──
function splitBaslik() {
  document.querySelectorAll('.sec-title').forEach(el => {
    if (el.closest('.sinema')) return;
    const parcalar = el.innerHTML.split(/(<br\s*\/?>)/gi);
    el.innerHTML = parcalar.map(parca => {
      if (/<br\s*\/?>/.test(parca)) return parca;
      return parca.split('').map(ch => {
        if (ch === ' ') return '<span style="display:inline-block;width:.28em"> </span>';
        return `<span class="harf" style="display:inline-block;opacity:0;transform:translateY(40px) rotate(8deg);transition:opacity .5s ease,transform .5s ease">${ch}</span>`;
      }).join('');
    }).join('');
  });

  const harfIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.harf').forEach((h, i) => {
        setTimeout(() => {
          h.style.opacity = '1';
          h.style.transform = 'translateY(0) rotate(0deg)';
        }, i * 38);
      });
      harfIO.unobserve(e.target);
    }
  }), { threshold: .15 });

  document.querySelectorAll('.sec-title').forEach(el => {
    if (!el.closest('.sinema')) harfIO.observe(el);
  });
}
splitBaslik();


// ── PROJE ÖNİZLEME ──
const pp    = document.getElementById('pp');
const ppImg = document.getElementById('pp-img');

document.querySelectorAll('.proj-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const img = el.dataset.img;
    if (img) { ppImg.src = img; pp.classList.add('show'); }
  });
  el.addEventListener('mouseleave', () => pp.classList.remove('show'));
  el.addEventListener('mousemove', e => {
    pp.style.left = (e.clientX + 18) + 'px';
    pp.style.top  = (e.clientY - 88) + 'px';
  });
});


// ── FİLTRE ──
document.querySelectorAll('.f-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.f;
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    document.querySelectorAll('.proj-item').forEach(k => {
      const cat = k.dataset.cat || '';
      if (f === 'hepsi' || cat.includes(f)) {
        k.style.display = 'grid';
        k.style.opacity = '0';
        k.style.transform = 'translateY(24px)';
        setTimeout(() => {
          k.style.transition = 'opacity .4s, transform .4s';
          k.style.opacity    = '1';
          k.style.transform  = 'translateY(0)';
        }, 40);
      } else {
        k.style.display = 'none';
      }
    });
  });
});


// ── ANALOG SAAT ──
const cvs  = document.getElementById('saatCvs');
const ctx2 = cvs.getContext('2d');
const W = 148, H = 148, CX = 74, CY = 74, R = 64;

function drawClock() {
  const now = new Date();
  const sn = now.getSeconds(), dk = now.getMinutes(), sa = now.getHours() % 12;
  ctx2.clearRect(0, 0, W, H);
  ctx2.beginPath(); ctx2.arc(CX, CY, R, 0, Math.PI * 2);
  ctx2.fillStyle = '#060e1e'; ctx2.fill();
  ctx2.strokeStyle = 'rgba(201,168,76,.14)'; ctx2.lineWidth = 1; ctx2.stroke();
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2, main = i % 5 === 0;
    const x1 = CX + Math.cos(a) * (R - 3), y1 = CY + Math.sin(a) * (R - 3);
    const x2 = CX + Math.cos(a) * (R - (main ? 13 : 7)), y2 = CY + Math.sin(a) * (R - (main ? 13 : 7));
    ctx2.beginPath(); ctx2.moveTo(x1, y1); ctx2.lineTo(x2, y2);
    ctx2.strokeStyle = main ? 'rgba(255,255,255,.65)' : 'rgba(255,255,255,.13)';
    ctx2.lineWidth = main ? 1.8 : 1; ctx2.stroke();
  }
  ctx2.font = 'bold 10px Inter,sans-serif';
  ctx2.fillStyle = 'rgba(255,255,255,.45)';
  ctx2.textAlign = 'center'; ctx2.textBaseline = 'middle';
  [[12, -Math.PI / 2], [3, 0], [6, Math.PI / 2], [9, Math.PI]].forEach(([n, a]) =>
    ctx2.fillText(n, CX + Math.cos(a) * (R - 22), CY + Math.sin(a) * (R - 22))
  );
  const saA = ((sa + dk / 60) / 12) * Math.PI * 2 - Math.PI / 2;
  ctx2.beginPath(); ctx2.moveTo(CX - Math.cos(saA) * 8, CY - Math.sin(saA) * 8);
  ctx2.lineTo(CX + Math.cos(saA) * 31, CY + Math.sin(saA) * 31);
  ctx2.strokeStyle = '#fff'; ctx2.lineWidth = 4; ctx2.lineCap = 'round'; ctx2.stroke();
  const dkA = ((dk + sn / 60) / 60) * Math.PI * 2 - Math.PI / 2;
  ctx2.beginPath(); ctx2.moveTo(CX - Math.cos(dkA) * 10, CY - Math.sin(dkA) * 10);
  ctx2.lineTo(CX + Math.cos(dkA) * 46, CY + Math.sin(dkA) * 46);
  ctx2.strokeStyle = '#fff'; ctx2.lineWidth = 2.5; ctx2.lineCap = 'round'; ctx2.stroke();
  const snA = (sn / 60) * Math.PI * 2 - Math.PI / 2;
  ctx2.beginPath(); ctx2.moveTo(CX - Math.cos(snA) * 13, CY - Math.sin(snA) * 13);
  ctx2.lineTo(CX + Math.cos(snA) * 54, CY + Math.sin(snA) * 54);
  ctx2.strokeStyle = '#C9A84C'; ctx2.lineWidth = 1.5; ctx2.lineCap = 'round'; ctx2.stroke();
  ctx2.beginPath(); ctx2.arc(CX, CY, 5, 0, Math.PI * 2); ctx2.fillStyle = '#C9A84C'; ctx2.fill();
  ctx2.beginPath(); ctx2.arc(CX, CY, 2.5, 0, Math.PI * 2); ctx2.fillStyle = '#060e1e'; ctx2.fill();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  document.getElementById('digTime').textContent = h + ':' + m + ':' + s;
  const G = ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
  const AY = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  document.getElementById('calSub').textContent = G[now.getDay()] + ' ' + now.getDate() + ' ' + AY[now.getMonth()] + ' ' + now.getFullYear();
  document.getElementById('bugun').textContent = now.getDate() + ' ' + AY[now.getMonth()];
}
setInterval(drawClock, 1000);
drawClock();


// ── TAKVİM ──
function buildCal() {
  const now = new Date();
  const AYT = ['OCAK','ŞUBAT','MART','NİSAN','MAYIS','HAZİRAN','TEMMUZ','AĞUSTOS','EYLÜL','EKİM','KASIM','ARALIK'];
  document.getElementById('calMonth').textContent = AYT[now.getMonth()] + ' ' + now.getFullYear();
  const g = document.getElementById('calGrid');
  g.innerHTML = '';
  ['Pt','Sa','Ça','Pe','Cu','Ct','Pa'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-hdr';
    el.textContent = d;
    g.appendChild(el);
  });
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  let off = first.getDay() - 1;
  if (off < 0) off = 6;
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  for (let i = 0; i < off; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    g.appendChild(el);
  }
  for (let i = 1; i <= last; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day' + (i === now.getDate() ? ' today' : '');
    el.textContent = i;
    g.appendChild(el);
  }
}
buildCal();


// ── ZİYARETÇİ ──
if (!sessionStorage.getItem('sayildi')) {
  sessionStorage.setItem('sayildi', '1');
  let v = parseInt(localStorage.getItem('ziyaretci') || '0') + 1;
  localStorage.setItem('ziyaretci', v);
}
document.getElementById('ziyaretci').textContent = localStorage.getItem('ziyaretci') || '1';


// ── YORUMLAR ──
function yorumlariYukle() {
  const ys = JSON.parse(localStorage.getItem('yorumlar') || '[]');
  const l  = document.getElementById('yorumList');
  if (!ys.length) {
    l.innerHTML = '<p style="color:rgba(255,255,255,.18);text-align:center;padding:28px 0;font-size:13px;letter-spacing:1px;">Henüz yorum yok</p>';
    return;
  }
  l.innerHTML = '';
  ys.forEach(y => {
    const card = document.createElement('div'); card.className = 'yorum-card';
    const name = document.createElement('div'); name.className = 'y-name'; name.textContent = y.isim;
    const text = document.createElement('div'); text.className = 'y-text'; text.textContent = y.metin;
    const date = document.createElement('div'); date.className = 'y-date'; date.textContent = y.tarih;
    card.appendChild(name); card.appendChild(text); card.appendChild(date);
    l.appendChild(card);
  });
}

function yorumEkle() {
  const isim  = document.getElementById('yIsim').value.trim();
  const metin = document.getElementById('yMetin').value.trim();
  if (!isim || !metin) { alert('Lütfen adını ve yorumunu yaz!'); return; }
  const ys = JSON.parse(localStorage.getItem('yorumlar') || '[]');
  if (ys.length >= 100) { alert('Maksimum yorum sayısına ulaşıldı.'); return; }
  ys.push({ isim, metin, tarih: new Date().toLocaleDateString('tr-TR') });
  try { localStorage.setItem('yorumlar', JSON.stringify(ys)); } catch (e) { alert('Depolama dolu.'); return; }
  document.getElementById('yIsim').value  = '';
  document.getElementById('yMetin').value = '';
  yorumlariYukle();
}

document.querySelector('#yorumlar .btn').addEventListener('click', yorumEkle);
yorumlariYukle();


// ── TYPEWRITER ──
const twCumleler = ['Kodlamayı seviyorum.','Her gün bir şey öğreniyorum.','Web dünyasını keşfediyorum.','Yaratıcı projeler üretiyorum.'];
const twEl = document.getElementById('heroTw');
let twC = 0, twCh = 0, twSil = false, twBekle = 0;

function twAdim() {
  if (!twEl) return;
  const c = twCumleler[twC];
  if (twBekle > 0) { twBekle--; setTimeout(twAdim, 80); return; }
  if (!twSil) {
    twEl.textContent = c.slice(0, ++twCh);
    if (twCh === c.length) { twSil = true; twBekle = 22; }
    setTimeout(twAdim, 80);
  } else {
    twEl.textContent = c.slice(0, --twCh);
    if (twCh === 0) { twSil = false; twC = (twC + 1) % twCumleler.length; twBekle = 8; }
    setTimeout(twAdim, twCh === 0 ? 80 : 42);
  }
}
setTimeout(twAdim, 2000);


// ── SÖZLER ──
function shuffle(a) {
  const c = [...a];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

const sozler = [
  {soz:'Beni öldürmeyen şey güçlendirir.',kisi:'Nietzsche',tarih:'MS 1888'},
  {soz:'İnsan aşılması gereken bir şeydir.',kisi:'Nietzsche',tarih:'MS 1883'},
  {soz:'Uçuruma uzun süre bakarsan, uçurum da sana bakar.',kisi:'Nietzsche',tarih:'MS 1886'},
  {soz:'Acı çekmeden büyümek mümkün değildir.',kisi:'Nietzsche',tarih:'MS 1884'},
  {soz:'Kalabalıktan kaç; kalabalık seni küçük yapar.',kisi:'Nietzsche',tarih:'MS 1883'},
  {soz:'Konfor insanı öldürür; tehlike onu uyandırır.',kisi:'Nietzsche',tarih:'MS 1882'},
  {soz:'Zayıflar intikam alır, güçlüler affeder, daha güçlüler unutur.',kisi:'Nietzsche',tarih:'MS 1887'},
  {soz:'Kendine saygısı olmayanın başkasına saygısı da olmaz.',kisi:'Nietzsche',tarih:'MS 1886'},
  {soz:'Çoğunluk yanılır; doğru olan her zaman yalnızdır.',kisi:'Nietzsche',tarih:'MS 1885'},
  {soz:'Tanrı öldü ve onu biz öldürdük.',kisi:'Nietzsche',tarih:'MS 1882'},
  {soz:'İnsanlar hakikati değil, rahatlatıcı yalanları tercih eder.',kisi:'Nietzsche',tarih:'MS 1886'},
  {soz:'Sürü içgüdüsü üstün insanı her zaman bastırmaya çalışır.',kisi:'Nietzsche',tarih:'MS 1886'},
  {soz:'Yaratmak için önce yıkman gerekir.',kisi:'Nietzsche',tarih:'MS 1883'},
  {soz:'En derin düşünceler en sert acılardan doğar.',kisi:'Nietzsche',tarih:'MS 1884'},
  {soz:'Hayatı sevmek için önce acıyı kucaklamalısın.',kisi:'Nietzsche',tarih:'MS 1882'},
  {soz:'Savaş kazanılmadan önce zihinlerde kazanılır.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'Düşmanını öldürmek istemiyorsan, onu anla.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'Hız savaşın ruhudur; fırsatı kaçırmak ölümdür.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'Liderin cesareti orduyu yarı kazandırır.',kisi:'Julius Caesar',tarih:'MÖ 50'},
  {soz:'Savaş sanatı, düşmanı savaşmadan yenmektir.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'En iyi generalin kazandığı savaş, hiç yapılmayan savaştır.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'Ordunu besle, yoksa düşmanın seni besler.',kisi:'Napolyon Bonaparte',tarih:'MS 1800'},
  {soz:'Rakibin güçlü olduğu yerde savaşma, zayıf olduğu yerde vur.',kisi:'Napolyon Bonaparte',tarih:'MS 1806'},
  {soz:'Strateji olmadan güç, patlamaya hazır bir bombadır.',kisi:'Clausewitz',tarih:'MS 1832'},
  {soz:'Kaybeden her savaşçı, önce zihninde yenik düşmüştür.',kisi:'Miyamoto Musashi',tarih:'MS 1645'},
  {soz:'Kılıcını çekmeden düşmanını öldür.',kisi:'Miyamoto Musashi',tarih:'MS 1645'},
  {soz:'Savaşçı ölümden korkmaz, anlamsız yaşamaktan korkar.',kisi:'Miyamoto Musashi',tarih:'MS 1645'},
  {soz:'Hayat adil değildir. Bunu ne kadar erken öğrenirsen o kadar iyidir.',kisi:'John F. Kennedy',tarih:'MS 1963'},
  {soz:'İnsanlar seni sevdiği için değil, işlerine geldiği için yanındadır.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'Zayıflık bir seçimdir, güç de.',kisi:'Marcus Aurelius',tarih:'MS 170'},
  {soz:'Acı veren gerçek, tatlı yalandan bin kat iyidir.',kisi:'Dostoyevski',tarih:'MS 1864'},
  {soz:'Dünya iyileri değil, güçlüleri ödüllendirir.',kisi:'Nietzsche',tarih:'MS 1883'},
  {soz:'Çoğu insan düşünmekten kaçar çünkü düşünmek acıtır.',kisi:'Bertrand Russell',tarih:'MS 1950'},
  {soz:'Gerçeği aramak cesaret ister, çünkü gerçek her zaman güzel değildir.',kisi:'Dostoyevski',tarih:'MS 1866'},
  {soz:'İnsanlar seni değiştiremezseler seni yok etmeye çalışırlar.',kisi:'Nietzsche',tarih:'MS 1885'},
  {soz:'Bir insan ne kadar az bilirse o kadar kesin konuşur.',kisi:'Bertrand Russell',tarih:'MS 1948'},
  {soz:'Kalabalık her zaman yanılır; çünkü doğru olmak kolay değildir.',kisi:'Sokrates',tarih:'MÖ 400'},
  {soz:'Çoğunluğun onayı doğruluğun kanıtı değildir.',kisi:'Sokrates',tarih:'MÖ 399'},
  {soz:'Acıyı kabul etmeyenler, büyümeyi de reddeder.',kisi:'Carl Jung',tarih:'MS 1930'},
  {soz:'İktidar yalnız güçlü olana verilmez, onu almayı bilene verilir.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'Güçlü olmak yetmez, gücünü doğru yerde kullanmayı bil.',kisi:'Marcus Aurelius',tarih:'MS 175'},
  {soz:'Kral olmak isteyen, önce kendine hükmetmeyi öğrenir.',kisi:'Platon',tarih:'MÖ 380'},
  {soz:'Güce sahip olan konuşmaz; konuşan henüz güce sahip değildir.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'İktidar insanı değiştirmez, onu ortaya çıkarır.',kisi:'Abraham Lincoln',tarih:'MS 1863'},
  {soz:'Zayıf lider affeder, güçlü lider hesap sorar.',kisi:'Julius Caesar',tarih:'MÖ 48'},
  {soz:'Korku geçici bir silah; saygı kalıcı bir zırhdır.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'En büyük güç, ihtiyaç duymamaktır.',kisi:'Seneca',tarih:'MS 60'},
  {soz:'Gücünü göstermek zorunda kalıyorsan, gücünü zaten kaybetmişsindir.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'Tahta oturan değil, tahtı elinde tutan kazanır.',kisi:'Otto von Bismarck',tarih:'MS 1870'},
  {soz:'Düşen kalkar; kalkmayan zaten düşmemiştir, çürümüştür.',kisi:'Nietzsche',tarih:'MS 1883'},
  {soz:'Fırtınada eğilen ağaç, dimdik duran kayadan daha uzun yaşar.',kisi:'Lao Tzu',tarih:'MÖ 500'},
  {soz:'Hayatta kalan en güçlü değil, en uyumlu olandır.',kisi:'Charles Darwin',tarih:'MS 1859'},
  {soz:'Karanlık ne kadar uzun olursa olsun, şafak mutlaka söker.',kisi:'Viktor Frankl',tarih:'MS 1946'},
  {soz:'Acı geçer, ama vazgeçmenin pişmanlığı ömür boyu sürer.',kisi:'Viktor Frankl',tarih:'MS 1946'},
  {soz:'Direnç kas gibidir; kullandıkça güçlenir.',kisi:'Marcus Aurelius',tarih:'MS 170'},
  {soz:'Çukura düştüğünde kazma durur, tırmanmaya başlarsın.',kisi:'Winston Churchill',tarih:'MS 1940'},
  {soz:'En büyük zafer, bir kez daha ayağa kalkmaktır.',kisi:'Nelson Mandela',tarih:'MS 1994'},
  {soz:'Yıkılmak sonu değildir; yıkılmış kalmak öyledir.',kisi:'Ernest Hemingway',tarih:'MS 1952'},
  {soz:'Savaşmaktan yorulabilirsin ama pes etmek yasak.',kisi:'Miyamoto Musashi',tarih:'MS 1645'},
  {soz:'Güçlü olan acı çekmez; acıya rağmen devam edendir.',kisi:'Marcus Aurelius',tarih:'MS 175'},
  {soz:'İmkânsız, korkakların sözlüğünde bulunur.',kisi:'Napolyon Bonaparte',tarih:'MS 1804'},
  {soz:'Hız, taktiklerin ruhudur.',kisi:'Napolyon Bonaparte',tarih:'MS 1805'},
  {soz:'Savaşta en önemli şey hızdır.',kisi:'Napolyon Bonaparte',tarih:'MS 1806'},
  {soz:'Asker gibi düşün, kral gibi karar ver.',kisi:'Napolyon Bonaparte',tarih:'MS 1807'},
  {soz:'Strateji olmadan taktik, zafere giden yolun gürültüsüdür.',kisi:'Napolyon Bonaparte',tarih:'MS 1810'},
  {soz:'Düşmanını ve kendini bil, yüz savaşta tehlikede olmazsın.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'Savaşın en yüksek sanatı, savaşmadan düşmanı yenmektir.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'Fırsatlar bekleyenlere değil, hazır olanlara gelir.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'Galip gelen ordu, önce kazanır sonra savaşır.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'Hızlı hareket et, düşmanın planlarını boz.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'Zayıf görün, güçlü ol. Uzak görün, yakın ol.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'Her savaş kazanılmadan önce kazanılır.',kisi:'Sun Tzu',tarih:'MÖ 500'},
  {soz:'Aslan olmak yeterli değildir; tilki de olmalısın.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'Amaç, araçları meşrulaştırır.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'Fırsatı yakalayan kazanır, bekleyen kaybeder.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'İnsanlar babalarının ölümünü affeder; mallarının kaybını asla.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'Halk ne istediğini bilmez; ama ne istemediğini çok iyi bilir.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'Kendi silahına sahip olmayan prens, güvende değildir.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'Savaşı ertelemek onu ortadan kaldırmaz, yalnızca düşman lehine geciktirir.',kisi:'Machiavelli',tarih:'MS 1513'},
  {soz:'Büyük olmak istiyorsan, önce küçük işleri büyük yap.',kisi:'Büyük İskender',tarih:'MÖ 334'},
  {soz:'Dünyayı fethettim ama kendimi fethetmek daha zordu.',kisi:'Büyük İskender',tarih:'MÖ 323'},
  {soz:'Diz çökmek ölümden beterdir.',kisi:'Büyük İskender',tarih:'MÖ 330'},
  {soz:'Geldim, gördüm, yendim.',kisi:'Julius Caesar',tarih:'MÖ 47'},
  {soz:'Roma bir günde kurulmadı.',kisi:'Julius Caesar',tarih:'MÖ 50'},
  {soz:'Zayıf olanlar asla affetmez. Affetmek, güçlülerin özelliğidir.',kisi:'Julius Caesar',tarih:'MÖ 49'},
  {soz:'Ya bir yol bulurum, ya da bir yol açarım.',kisi:'Hannibal Barca',tarih:'MÖ 218'},
  {soz:'Alpler aşılamaz diyenlere: izleyin.',kisi:'Hannibal Barca',tarih:'MÖ 218'},
  {soz:'Düşmanını tanımak, savaşın yarısını kazanmaktır.',kisi:'Hannibal Barca',tarih:'MÖ 216'},
  {soz:"Roma'yı içten çürüt, dışarıdan yıkmana gerek kalmaz.",kisi:'Hannibal Barca',tarih:'MÖ 210'},
  {soz:'Güçlü kişi, öfkesine hâkim olandır.',kisi:'Hz. Muhammed',tarih:'MS 620'},
  {soz:'Yarın ölecekmiş gibi ahiretine çalış, hiç ölmeyecekmiş gibi dünyana çalış.',kisi:'Hz. Muhammed',tarih:'MS 620'},
  {soz:'Kolaylık zorluktan doğar.',kisi:'Hz. Muhammed',tarih:'MS 615'},
  {soz:"İlim Çin'de de olsa gidiniz.",kisi:'Hz. Muhammed',tarih:'MS 618'},
  {soz:'Eğer korkuyorsan, savaşma. Savaşıyorsan, korkma.',kisi:'Cengiz Han',tarih:'MS 1206'},
  {soz:'Dünyanın en güçlü savaşçısı, kendini yenendir.',kisi:'Cengiz Han',tarih:'MS 1210'},
  {soz:'Ben Tanrının cezasıyım.',kisi:'Cengiz Han',tarih:'MS 1219'},
  {soz:'İtaat etmeyi bilmeyen, emretmeyi de bilemez.',kisi:'Cengiz Han',tarih:'MS 1200'},
  {soz:'Hayatta en hakiki mürşit ilimdir.',kisi:'Atatürk',tarih:'MS 1923'},
  {soz:'Zafer, zafer benimdir diyebilenindir.',kisi:'Atatürk',tarih:'MS 1921'},
  {soz:'Asla, asla, asla vazgeçme.',kisi:'Winston Churchill',tarih:'MS 1941'},
  {soz:'Tarih, cesur olanların yanında durur.',kisi:'Winston Churchill',tarih:'MS 1940'},
  {soz:'İstanbul fethedilebilir, çünkü ben inanıyorum.',kisi:'Fatih Sultan Mehmet',tarih:'MS 1453'},
  {soz:'Ya büyük bir devlet kurarım ya da büyük bir devlet için ölürüm.',kisi:'Fatih Sultan Mehmet',tarih:'MS 1453'},
  {soz:'Korkuyu yenersen her şeyi yenersin.',kisi:'Selahaddin Eyyubi',tarih:'MS 1187'},
  {soz:'Merhamet güçsüzlük değil, güç göstergesidir.',kisi:'Selahaddin Eyyubi',tarih:'MS 1187'},
  {soz:'Fethetmek yetmez, tutmak gerekir.',kisi:'Yavuz Sultan Selim',tarih:'MS 1514'},
  {soz:'Adalet mülkün temelidir.',kisi:'Kanuni Sultan Süleyman',tarih:'MS 1520'},
  {soz:'Kanla yazılan tarih, mürekkeple silinmez.',kisi:'Attila Hun',tarih:'MS 450'},
  {soz:'Kılıcım kanunumdur.',kisi:'Attila Hun',tarih:'MS 445'},
  {soz:'Bildiğim tek şey, hiçbir şey bilmediğimdir.',kisi:'Sokrates',tarih:'MÖ 399'},
  {soz:'Haksızlığa uğramak, haksızlık yapmaktan iyidir.',kisi:'Sokrates',tarih:'MÖ 400'},
  {soz:'Kendini tanı.',kisi:'Sokrates',tarih:'MÖ 410'},
  {soz:'Mükemmellik bir eylem değil, bir alışkanlıktır.',kisi:'Aristoteles',tarih:'MÖ 350'},
  {soz:'İnsan doğası gereği bilmek ister.',kisi:'Aristoteles',tarih:'MÖ 350'},
  {soz:'Güçlü olan hayatta kalır, güçlü olmayan yok olur.',kisi:'Nietzsche',tarih:'MS 1883'},
  {soz:'Kendini aşmayan insan, yerinde sayar.',kisi:'Nietzsche',tarih:'MS 1885'},
  {soz:'Karanlıkla yüzleşmezsen, aydınlığa ulaşamazsın.',kisi:'Carl Jung',tarih:'MS 1912'},
  {soz:'Her şey alınabilir bir insandan; son özgürlük hariç.',kisi:'Viktor Frankl',tarih:'MS 1946'},
  {soz:'Neden yaşadığını bilen, nasıl yaşayacağını bulur.',kisi:'Viktor Frankl',tarih:'MS 1946'},
  {soz:'Aynı nehre iki kez giremezsin.',kisi:'Heraklitos',tarih:'MÖ 500'},
  {soz:'Savaş, her şeyin babasıdır.',kisi:'Heraklitos',tarih:'MÖ 500'},
  {soz:'Düşünüyorum, öyleyse varım.',kisi:'Descartes',tarih:'MS 1637'},
  {soz:'Bilgi güçtür.',kisi:'Francis Bacon',tarih:'MS 1597'},
  {soz:'Zorlukların ortasında fırsat yatar.',kisi:'Albert Einstein',tarih:'MS 1920'},
  {soz:'Hayal gücü bilgiden daha önemlidir.',kisi:'Albert Einstein',tarih:'MS 1929'},
  {soz:'Eğitim, geleceğe açılan en güçlü silahtır.',kisi:'Nelson Mandela',tarih:'MS 1990'},
  {soz:'Güçlüler istediklerini yapar, zayıflar katlanmak zorunda kalır.',kisi:'Thucydides',tarih:'MÖ 431'},
  {soz:'Büyük imparatorluklar büyük cesaretten doğar.',kisi:'Voltaire',tarih:'MS 1750'},
  {soz:'Savaş, politikanın başka araçlarla devamıdır.',kisi:'Clausewitz',tarih:'MS 1832'},
  {soz:'En iyi savunma, taarruztur.',kisi:'George Washington',tarih:'MS 1776'},
  {soz:'Tarihi yapanlar, onu yazanlar değil, yaşayanlardır.',kisi:'Otto von Bismarck',tarih:'MS 1870'},
  {soz:'Kalkmayan götü kimse kaldıramaz.',kisi:'Erkan Aktürk',tarih:'MS 2025'},
  {soz:'Şu an tek sorun burada olmamız.',kisi:'Erkan Aktürk',tarih:'MS 2025'},
  {soz:'Geçer miyim la?',kisi:'Erkan Aktürk',tarih:'MS 2025'},
  {soz:'Bu gökler, bu yollar beni nasıl affedecek?',kisi:'Erkan Aktürk',tarih:'MS 2025'},
];

let deck = shuffle(sozler);
let di = Math.floor(Math.random() * deck.length);

function nextIdx() {
  if (di >= deck.length) { deck = shuffle(sozler); di = 0; }
  return di++;
}

let sozInterval = null;

function showSoz(i) {
  const s = document.getElementById('sinSoz');
  const k = document.getElementById('sinKisi');
  const t = document.getElementById('sinTarih');
  s.classList.remove('on'); k.classList.remove('on'); t.classList.remove('on');
  s.textContent = ''; k.textContent = ''; t.textContent = '';
  if (sozInterval) { clearInterval(sozInterval); sozInterval = null; }
  setTimeout(() => {
    const txt = '"' + deck[i].soz + '"';
    let j = 0;
    s.classList.add('on');
    sozInterval = setInterval(() => {
      if (j < txt.length) { s.textContent += txt[j++]; }
      else {
        clearInterval(sozInterval); sozInterval = null;
        setTimeout(() => {
          k.textContent = '— ' + deck[i].kisi; k.classList.add('on');
          setTimeout(() => { t.textContent = deck[i].tarih; t.classList.add('on'); }, 200);
        }, 320);
      }
    }, 36);
  }, 380);
}

showSoz(nextIdx());
setInterval(() => showSoz(nextIdx()), 8500);


// ── SEKME DEĞİŞİNCE DÜZELT ──
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    const s = document.getElementById('sinSoz');
    const k = document.getElementById('sinKisi');
    const t = document.getElementById('sinTarih');
    if (sozInterval) { clearInterval(sozInterval); sozInterval = null; }
    if (s) { s.textContent = ''; s.classList.remove('on'); }
    if (k) { k.textContent = ''; k.classList.remove('on'); }
    if (t) { t.textContent = ''; t.classList.remove('on'); }
    setTimeout(() => showSoz(nextIdx()), 300);
  }
});


// ── İSTATİSTİK ──
const baslangic = new Date('2024-09-01T00:00:00');
const simdi = new Date();
const gn = Math.floor((simdi - baslangic) / (1000 * 60 * 60 * 24));
document.getElementById('gunSayac').innerHTML = gn + '<span class="stat-unit">gün</span>';


// ── CANLI VERİLER ──
fetch('https://api.open-meteo.com/v1/forecast?latitude=38.35&longitude=38.31&current_weather=true')
  .then(r => { if (!r.ok) throw new Error(); return r.json(); })
  .then(d => {
    const k = d.current_weather.weathercode;
    document.getElementById('hava').textContent = Math.round(d.current_weather.temperature) + '°C';
    document.getElementById('havaDurum').textContent = k === 0 ? '☀️ Açık' : k < 3 ? '⛅ Parçalı' : k < 60 ? '☁️ Bulutlu' : '🌧️ Yağmurlu';
  })
  .catch(() => { document.getElementById('hava').textContent = '--°'; document.getElementById('havaDurum').textContent = 'Veri yok'; });

fetch('https://api.exchangerate-api.com/v4/latest/USD')
  .then(r => { if (!r.ok) throw new Error(); return r.json(); })
  .then(d => {
    document.getElementById('dolar').textContent = d.rates.TRY.toFixed(2) + '₺';
    document.getElementById('euro').textContent  = (d.rates.TRY / d.rates.EUR).toFixed(2) + '₺';
  })
  .catch(() => { document.getElementById('dolar').textContent = '--₺'; document.getElementById('euro').textContent = '--₺'; });

fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
  .then(r => { if (!r.ok) throw new Error(); return r.json(); })
  .then(d => { document.getElementById('btc').textContent = '$' + d.bitcoin.usd.toLocaleString('tr-TR'); })
  .catch(() => { document.getElementById('btc').textContent = '--$'; });


// ── MDT TANITIM ──
(function () {
  let cur = 0, playing = false;
  const sls  = ['mS1','mS2','mS3','mS4'];
  const cnts = ['01 / 04','02 / 04','03 / 04','04 / 04'];
  const T = id => document.getElementById(id);
  function cnt(el, to, dur, sx) {
    let v = 0; const st = to / (dur / 30);
    const iv = setInterval(() => { v = Math.min(v + st, to); el.textContent = Math.round(v) + (sx || ''); if (v >= to) clearInterval(iv); }, 30);
  }
  function tw(el, tx, sp, cb) {
    let i = 0; el.style.width = '0'; el.style.borderRight = '2px solid #C9A84C';
    const iv = setInterval(() => {
      el.textContent = tx.slice(0, ++i); el.style.width = 'auto';
      if (i >= tx.length) { clearInterval(iv); setTimeout(() => { el.style.borderRight = 'none'; if (cb) cb(); }, 600); }
    }, sp);
  }
  function parts() {
    const c = T('mParts'); c.innerHTML = '';
    [15,25,35,45,55,65,75,85].forEach((p, i) => {
      const el = document.createElement('div'); el.className = 'mdt-part';
      el.style.left = p + '%'; el.style.bottom = (5 + Math.random() * 10) + '%';
      el.style.animationDuration = (5 + Math.random() * 5) + 's';
      el.style.animationDelay = (i * .4) + 's';
      el.style.setProperty('--dx', (Math.random() * 28 - 14) + 'px');
      c.appendChild(el);
    });
  }
  function r1() {
    T('mP').style.width = '0%';
    const lo = T('mLM'), g1 = T('mG1'), g2 = T('mG2');
    lo.style.opacity = '0'; lo.style.transition = 'opacity .8s';
    setTimeout(() => lo.style.opacity = '1', 300);
    setTimeout(() => { if (g1) { g1.style.opacity = '.7'; g2.style.opacity = '.5'; } setTimeout(() => { if (g1) { g1.style.opacity = '0'; g2.style.opacity = '0'; } }, 200); }, 1000);
    setTimeout(() => { if (g1) { g1.style.opacity = '.6'; g2.style.opacity = '.4'; } setTimeout(() => { if (g1) { g1.style.opacity = '0'; g2.style.opacity = '0'; } }, 150); }, 1600);
    const br = T('mBr'); br.style.transition = 'opacity .8s,transform .8s'; br.style.transform = 'translateY(20px)';
    setTimeout(() => { br.style.opacity = '1'; br.style.transform = 'translateY(0)'; }, 1200);
    T('mSb').style.transition = 'opacity .8s'; setTimeout(() => T('mSb').style.opacity = '1', 1700);
    T('mDv').style.opacity = '1'; setTimeout(() => { T('mDv').style.transition = 'width .8s'; T('mDv').style.width = '200px'; }, 2000);
    T('mP').style.width = '25%';
  }
  function r2() {
    T('mP').style.width = '25%';
    T('mS2H').style.transition = 'opacity .6s'; setTimeout(() => T('mS2H').style.opacity = '1', 400);
    T('mSG').style.transition = 'opacity .6s'; setTimeout(() => T('mSG').style.opacity = '1', 700);
    setTimeout(() => { cnt(T('mN1'),4,1000,'+'); cnt(T('mN2'),6,1200,''); cnt(T('mN3'),3200,1500,'+'); cnt(T('mN4'),2024,1800,''); }, 900);
    T('mS2S').style.transition = 'opacity .6s'; setTimeout(() => T('mS2S').style.opacity = '1', 2000);
    T('mP').style.width = '50%';
  }
  function r3() {
    T('mP').style.width = '50%';
    T('mTL').style.transition = 'opacity .6s'; setTimeout(() => T('mTL').style.opacity = '1', 400);
    setTimeout(() => { tw(T('mTT'), 'Kalıcı olmak bir karardır.', 80, () => { const s = T('mTS'); s.style.transition = 'opacity .8s,transform .8s'; s.style.transform = 'translateY(10px)'; setTimeout(() => { s.style.opacity = '1'; s.style.transform = 'translateY(0)'; }, 100); }); }, 700);
    T('mP').style.width = '75%';
  }
  function r4() {
    T('mP').style.width = '75%'; parts();
    T('mFL').style.transition = 'opacity 1s'; setTimeout(() => T('mFL').style.opacity = '1', 400);
    const fn = T('mFN'); fn.style.transition = 'opacity .8s,transform .8s'; fn.style.transform = 'translateY(20px)';
    setTimeout(() => { fn.style.opacity = '1'; fn.style.transform = 'translateY(0)'; }, 900);
    const li = T('mFLi'); li.style.transition = 'height .8s,opacity .8s'; li.style.opacity = '1';
    setTimeout(() => li.style.height = '60px', 1300);
    T('mFT').style.transition = 'opacity .8s'; setTimeout(() => T('mFT').style.opacity = '1', 1800);
    T('mFY').style.transition = 'opacity .8s'; setTimeout(() => T('mFY').style.opacity = '1', 2200);
    setTimeout(() => { ['mSL1','mSL2','mBG'].forEach(id => { const el = T(id); if (el) { el.style.transition = 'opacity 1s'; el.style.opacity = '1'; } }); }, 2500);
    const b = T('mBtn');
    b.textContent = '↺ Tekrar İzle';
    b.onclick = () => {
      document.getElementById(sls[cur]).classList.remove('on');
      cur = 0; document.getElementById(sls[0]).classList.add('on');
      T('mC').textContent = cnts[0];
      const btn = T('mBtn'); btn.textContent = 'Devam →'; btn.onclick = window.mdtNext;
      playing = false; r1();
    };
    T('mP').style.width = '100%';
  }
  const runners = [r1, r2, r3, r4];
  function wipe(cb) {
    const w = T('mW');
    w.style.transition = 'transform .4s cubic-bezier(.7,0,.3,1)';
    w.style.transformOrigin = 'left'; w.style.transform = 'scaleX(1)';
    setTimeout(() => { cb(); w.style.transformOrigin = 'right'; w.style.transform = 'scaleX(0)'; }, 420);
  }
  window.mdtNext = function () {
    if (playing) return; playing = true;
    const nx = (cur + 1) % sls.length;
    wipe(() => {
      document.getElementById(sls[cur]).classList.remove('on');
      document.getElementById(sls[nx]).classList.add('on');
      T('mC').textContent = cnts[nx]; cur = nx;
      if (nx < sls.length - 1) { const b = T('mBtn'); b.textContent = 'Devam →'; b.onclick = window.mdtNext; }
      runners[cur]();
      setTimeout(() => playing = false, 600);
    });
  };
  document.getElementById('mBtn').addEventListener('click', window.mdtNext);
  r1();
})();


// ── F1 SÖZLER ──
const f1Sozler = [
  {pilot:'Ayrton Senna',takim:'McLaren · 3x Şampiyon',renk:'#00D2BE',soz:'Yarış bitene kadar hiçbir şey bitmez. Pist sana söz vermez, sen ona söz verirsin.'},
  {pilot:'Fernando Alonso',takim:'Renault · 2x Şampiyon',renk:'#FF8000',soz:'Frenleme. Yeter ki hayallerin tam gaz olsun.'},
  {pilot:'Lewis Hamilton',takim:'Mercedes · 7x Şampiyon',renk:'#00D2BE',soz:'Şampiyonluk bir an değil, yüzlerce küçük kararın toplamıdır.'},
  {pilot:'Max Verstappen',takim:'Red Bull · 4x Şampiyon',renk:'#3671C6',soz:'Pistte kazanmak için önce korkularını yenmelisin.'},
  {pilot:'Charles Leclerc',takim:'Ferrari',renk:'#DC0000',soz:'Hızın sınırları, cesaretinle belirlenir.'},
  {pilot:'Michael Schumacher',takim:'Ferrari · 7x Şampiyon',renk:'#DC0000',soz:'Sınırlar aklınızdadır. Onları bir kez aşarsanız, artık orada değillerdir.'},
  {pilot:'Niki Lauda',takim:'Ferrari · 3x Şampiyon',renk:'#DC0000',soz:'Risk almak korkutucudur. Ama risk almamak daha da korkutucudur.'},
  {pilot:'Sebastian Vettel',takim:'Red Bull · 4x Şampiyon',renk:'#3671C6',soz:'Pistte her saniye savaşırsın. Zafer, o savaşın ödülüdür.'},
  {pilot:'Carlos Sainz',takim:'Ferrari → Williams',renk:'#DC0000',soz:'Açıkçası ne yaptığımı ben bile bilmiyordum.'},
  {pilot:'Jenson Button',takim:'Brawn GP · 2009 Şampiyonu',renk:'#AAAAAA',soz:'Hız bağımlılıktır. Bir kez hissedersen, bırakamazsın.'},
  {pilot:'Lance Stroll',takim:'Aston Martin',renk:'#358C75',soz:'Durmak, hayallerini yarı yolda bırakmaktır.'},
  {pilot:'Ayrton Senna',takim:'McLaren · Efsane',renk:'#00D2BE',soz:'Kazanmak her şey değildir, ama kazanmak istememek hiçbir şeydir.'}
];

let f1AktifIdx = 0, f1Interval = null, f1ProgressVal = 0;

function f1AracGec(cb) {
  const arac = document.getElementById('f1Arac');
  if (!arac) { if (cb) cb(); return; }
  arac.style.transition = 'none';
  arac.style.left = '110%';
  arac.getBoundingClientRect();
  arac.style.transition = 'left 1.6s cubic-bezier(.4,0,.2,1)';
  arac.style.left = '-15%';
  setTimeout(() => { if (cb) cb(); }, 700);
}

function f1SozGoster(idx) {
  const s = f1Sozler[idx];
  const badge = document.getElementById('f1Badge');
  const metin = document.getElementById('f1SozMetin');
  const altbilgi = document.getElementById('f1AltBilgi');
  const pilotBadge = document.getElementById('f1PilotBadge');
  const pilotAd = document.getElementById('f1PilotAd');
  const takimAd = document.getElementById('f1TakimAd');
  const takimRenk = document.getElementById('f1TakimRenk');
  const sayac = document.getElementById('f1SayacEl');
  if (!metin) return;
  if (badge) badge.classList.remove('on');
  metin.classList.remove('on');
  if (altbilgi) altbilgi.classList.remove('on');
  f1AracGec(() => {
    if (sayac) sayac.textContent = String(idx + 1).padStart(2,'0') + ' / ' + String(f1Sozler.length).padStart(2,'0');
    if (pilotBadge) pilotBadge.textContent = s.pilot.toUpperCase();
    metin.textContent = '"' + s.soz + '"';
    if (pilotAd) pilotAd.textContent = s.pilot;
    if (takimAd) takimAd.textContent = s.takim;
    if (takimRenk) takimRenk.style.background = s.renk;
    setTimeout(() => { if (badge) badge.classList.add('on'); }, 50);
    setTimeout(() => { metin.classList.add('on'); }, 200);
    setTimeout(() => { if (altbilgi) altbilgi.classList.add('on'); }, 400);
  });
}

function f1SozGit(idx) {
  f1AktifIdx = ((idx % f1Sozler.length) + f1Sozler.length) % f1Sozler.length;
  f1SozGoster(f1AktifIdx);
  f1ProgressSifirla();
}

function f1ProgressSifirla() {
  if (f1Interval) clearInterval(f1Interval);
  f1ProgressVal = 0;
  const prog = document.getElementById('f1Progress');
  if (prog) prog.style.width = '0%';
  const sure = 7500, adim = 100;
  f1Interval = setInterval(() => {
    f1ProgressVal += (adim / sure) * 100;
    if (prog) prog.style.width = Math.min(f1ProgressVal, 100) + '%';
    if (f1ProgressVal >= 100) {
      f1AktifIdx = (f1AktifIdx + 1) % f1Sozler.length;
      f1SozGoster(f1AktifIdx);
      f1ProgressVal = 0;
      if (prog) prog.style.width = '0%';
    }
  }, adim);
}

document.querySelector('.f1soz-btn.prev').addEventListener('click', () => f1SozGit(f1AktifIdx - 1));
document.querySelector('.f1soz-btn.next').addEventListener('click', () => f1SozGit(f1AktifIdx + 1));

window.addEventListener('load', () => {
  setTimeout(() => { f1SozGoster(0); f1ProgressSifirla(); }, 800);
});