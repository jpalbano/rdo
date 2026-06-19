// Service Worker — RDO Albano
// Para forçar atualização do app nos celulares, basta mudar o número da versão abaixo.
const VERSAO = 'rdo-albano-v3';
const ARQUIVOS = [
  './RDO_Campo_Albano.html',
  './manifest.json'
];

// instala e guarda os arquivos em cache
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

// ativa a versão nova e remove caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== VERSAO).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// estratégia: rede primeiro (pega atualização), cache como reserva (funciona offline)
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const copia = resp.clone();
        caches.open(VERSAO).then(c => c.put(e.request, copia));
        return resp;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./RDO_Campo_Albano.html')))
  );
});
