(() => {
  'use strict';

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const allLooks = Array.isArray(window.OUTFITS) ? window.OUTFITS : [];
  const looksList = allLooks.filter((look) => look.status !== 'draft');
  const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  const site = window.SITE || {};
  const productById = (id) => products.find((product) => product.id === id);
  const colours = [
    ['#c9d3b0', '#efe6d2'], ['#e3cfcb', '#f4ebdc'],
    ['#cdd8de', '#f1ece0'], ['#d8cfae', '#f0e9d7']
  ];
  const marketplaceDomains = {
    US: 'amazon.com', UK: 'amazon.co.uk', AU: 'amazon.com.au', CA: 'amazon.ca',
    DE: 'amazon.de', FR: 'amazon.fr', IT: 'amazon.it', ES: 'amazon.es', NL: 'amazon.nl',
    SE: 'amazon.se', PL: 'amazon.pl', BE: 'amazon.com.be', IN: 'amazon.in', SG: 'amazon.sg',
    AE: 'amazon.ae', SA: 'amazon.sa', MX: 'amazon.com.mx', BR: 'amazon.com.br', JP: 'amazon.co.jp'
  };
  const filters = { q: '', category: '', season: '', occasion: '', tag: '', colour: '', marketplace: '' };
  const main = document.getElementById('main');

  function isPlaceholder(value) {
    return !value || /^\s*\[/.test(String(value));
  }

  function verifiedAmazonProduct(product) {
    if (!product || product.linkStatus !== 'verified' || isPlaceholder(product.url)) return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(product.verified || '')) return false;
    const parsedDate = new Date(`${product.verified}T00:00:00Z`);
    if (Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== product.verified) return false;

    let url;
    try { url = new URL(product.url); } catch { return false; }
    if (url.protocol !== 'https:' || url.username || url.password || !url.pathname || url.pathname === '/') return false;
    const expectedDomain = (product.marketplace || '').match(/^Amazon\s+([A-Z]{2})$/i);
    if (!expectedDomain || !marketplaceDomains[expectedDomain[1].toUpperCase()]) return false;
    if (url.hostname.toLowerCase().replace(/^www\./, '') !== marketplaceDomains[expectedDomain[1].toUpperCase()]) return false;
    return /\/(?:dp|gp\/product|gp\/aw\/d)\/[A-Z0-9]{10}(?:[/?]|$)/i.test(url.pathname);
  }

  function setMeta(title, description, indexable = true) {
    document.title = title;
    document.querySelector('meta[name="description"]').content = description;
    document.getElementById('robots').content = indexable ? 'index,follow' : 'noindex,nofollow';
  }

  function uniqueValues(key) {
    return [...new Set(looksList.flatMap((look) => [].concat(look[key] || [])))].sort();
  }

  function imageBlock(src, alt, index = 0, className = '') {
    const [from, to] = colours[Math.abs(index) % colours.length];
    const safeImage = !isPlaceholder(src) ? `<img class="visual-photo" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.remove()">` : '';
    return `<div class="visual ${className}" style="--visual-a:${from};--visual-b:${to}" role="img" aria-label="${esc(alt)}">${safeImage}<span class="visual-label">${esc(alt)}</span></div>`;
  }

  function lookTags(look) {
    return `<div class="card-kicker"><span class="tag">${esc(look.category)}</span><span class="tag">${esc(look.season)}</span>${look.demo ? '<span class="tag tag-demo">Demo content</span>' : ''}</div>`;
  }

  function lookCard(look) {
    const index = allLooks.indexOf(look);
    const product = getProducts(look).find(verifiedAmazonProduct);
    const imageLink = product
      ? `href="${esc(product.url)}" target="_blank" rel="sponsored nofollow noopener noreferrer" aria-label="Shop ${esc(look.title)} on Amazon"`
      : `href="#/look/${encodeURIComponent(look.slug)}" aria-label="View ${esc(look.title)}"`;

    return `<article class="look-card">
      <a class="look-card-link" ${imageLink}>
        ${imageBlock(look.image, look.title, index)}
      </a>
      ${product ? '<p class="card-affiliate-note">As an Amazon Associate I earn from qualifying purchases.</p>' : ''}
      ${lookTags(look)}
      <h3><a href="#/look/${encodeURIComponent(look.slug)}">${esc(look.title)}</a></h3>
      <p>${esc(look.desc)}</p>
      <a class="text-link" href="#/look/${encodeURIComponent(look.slug)}">Shop this look <span aria-hidden="true">↗</span></a>
    </article>`;
  }

  function getProducts(look) {
    return (look.products || []).map(productById).filter(Boolean);
  }

  function getMarketplaces(look) {
    return getProducts(look).map((product) => product.marketplace);
  }

  function disclosureNote(extraClass = '') {
    return `<p class="note ${extraClass}">As an Amazon Associate I earn from qualifying purchases. OliveBloom may earn a commission from qualifying purchases through affiliate links, at no extra cost to you.</p>`;
  }

  function homePage() {
    setMeta('OliveBloom — Style that feels like you', 'Wearable outfit inspiration and thoughtful fashion finds, curated for real life.');
    const featured = looksList.slice(0, 3);
    const newLooks = [...looksList].reverse().slice(0, 3);
    const categories = Array.isArray(window.CATEGORIES) ? window.CATEGORIES : [];
    const trends = Array.isArray(window.TRENDS) ? window.TRENDS : [];

    return `<div class="wrap">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">Wear it your way · OliveBloom edit</p>
          <h1 id="hero-title">Style that feels <em>like you.</em></h1>
          <p class="lede">Wearable outfit ideas, thoughtful finishing touches, and a little inspiration for getting dressed on your own terms.</p>
          <div class="hero-actions"><a class="button" href="#/looks">Explore the looks <span aria-hidden="true">↗</span></a><a class="button button-outline" href="#/about">Meet OliveBloom</a></div>
          <p class="hero-note">Ideas to make your own. Shop only what works for you.</p>
        </div>
        <div class="hero-art" role="img" aria-label="Botanical fashion moodboard in soft olive, cream and wine tones">
          <div class="art-caption art-caption-one">Thoughtful layers<small>Everyday, reimagined</small></div>
          <div class="art-caption art-caption-two">A softer kind of statement<small>Make it your own</small></div>
          <div class="hero-seal">Wear<br>what<br>works</div>
        </div>
      </section>
    </div>
    <section class="section section-paper"><div class="wrap">
      <div class="section-heading"><div><p class="eyebrow">A little inspiration</p><h2>Featured outfits</h2></div><a class="text-link" href="#/looks">See all looks <span aria-hidden="true">↗</span></a></div>
      <div class="grid">${featured.map(lookCard).join('') || '<p class="empty-state">Add published outfits to catalogue.js to begin your collection.</p>'}</div>
    </div></section>
    <section class="section"><div class="wrap"><p class="eyebrow">Small details, fresh perspective</p><h2>Trend notes</h2><p class="trend-intro">A handful of ideas to play with, not rules to follow. Keep what feels right; leave the rest.</p><ul class="chip-list">${trends.map((trend) => `<li><a href="#/looks/tag/${encodeURIComponent(trend)}">${esc(trend)}</a></li>`).join('')}</ul></div></section>
    <section class="section section-paper"><div class="wrap"><p class="eyebrow">Find your starting point</p><h2>Browse by category</h2><div class="category-list">${categories.map((category) => `<a href="#/looks/cat/${encodeURIComponent(category)}">${esc(category)} <span aria-hidden="true">↗</span></a>`).join('')}</div></div></section>
    <section class="section"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">Just added</p><h2>More to explore</h2></div></div><div class="grid">${newLooks.map(lookCard).join('') || '<p class="empty-state">New outfit ideas will appear here as they are added.</p>'}</div></div></section>
    <section class="section section-paper"><div class="wrap manifesto"><blockquote>Good style should feel like yours—not like a rulebook.</blockquote><div class="manifesto-copy"><p>OliveBloom pairs wearable pieces with coordinated shoes, bags, and finishing touches, then links items individually so you can choose what you actually need.</p><p>Weather, seasons, and personal style look different everywhere. These edits are starting points—adapt them to your own climate, comfort, and budget.</p><a class="text-link" href="#/about">A little more about us <span aria-hidden="true">↗</span></a></div></div></section>`;
  }

  function filterSelect(key, label, values) {
    const options = values.map((value) => `<option value="${esc(value)}"${filters[key] === value ? ' selected' : ''}>${esc(value)}</option>`).join('');
    return `<select data-filter="${key}" aria-label="Filter by ${label.toLowerCase()}"><option value="">${label}</option>${options}</select>`;
  }

  function filteredLooks() {
    const query = filters.q.trim().toLowerCase();
    return looksList.filter((look) => {
      const searchable = [look.title, look.category, ...(look.tags || [])].join(' ').toLowerCase();
      return (!query || searchable.includes(query)) &&
        (!filters.category || look.category === filters.category) &&
        (!filters.season || look.season === filters.season) &&
        (!filters.occasion || look.occasion === filters.occasion) &&
        (!filters.tag || (look.tags || []).includes(filters.tag)) &&
        (!filters.colour || look.colour === filters.colour) &&
        (!filters.marketplace || getMarketplaces(look).includes(filters.marketplace));
    });
  }

  function updateLookGrid() {
    const grid = document.getElementById('look-grid');
    if (!grid) return;
    const result = filteredLooks();
    grid.innerHTML = result.length ? result.map(lookCard).join('') : '<p class="empty-state">No looks match those filters yet. Try a broader search or clear a filter.</p>';
    const count = document.getElementById('result-count');
    if (count) count.textContent = `${result.length} ${result.length === 1 ? 'look' : 'looks'}`;
  }

  function looksPage(filterType = '', encodedValue = '') {
    Object.keys(filters).forEach((key) => { filters[key] = ''; });
    let selectedValue = encodedValue;
    try { selectedValue = decodeURIComponent(encodedValue); } catch { /* Keep the safe, encoded text. */ }
    if (filterType === 'cat') filters.category = selectedValue;
    if (filterType === 'tag') filters.tag = selectedValue;
    setMeta('Shop the Looks | OliveBloom', 'Browse outfit ideas by category, season, occasion and style.');
    const marketplaceList = [...new Set(looksList.flatMap(getMarketplaces))].sort();
    const categories = [...new Set([...(window.CATEGORIES || []), ...uniqueValues('category')])].sort();
    return `<section class="wrap section section-tight" aria-labelledby="looks-title">
      <div class="page-intro"><p class="eyebrow">The OliveBloom wardrobe</p><h1 id="looks-title">Shop the Looks</h1><p class="lede">Browse wearable outfit ideas, then make each one your own. Product links are added only after they have been checked.</p>${disclosureNote()}</div>
      <div class="catalogue-tools" role="search">
        <input type="search" data-filter="q" placeholder="Search outfits" aria-label="Search outfits" value="${esc(filters.q)}">
        ${filterSelect('category', 'Category', categories)}
        ${filterSelect('season', 'Season', uniqueValues('season'))}
        ${filterSelect('occasion', 'Occasion', uniqueValues('occasion'))}
        ${filterSelect('tag', 'Style or trend', uniqueValues('tags'))}
        ${filterSelect('marketplace', 'Marketplace', marketplaceList)}
      </div>
      <p class="result-count" id="result-count" aria-live="polite"></p>
      <div class="grid" id="look-grid"></div>
    </section>`;
  }

  function productCard(product, index) {
    const available = verifiedAmazonProduct(product);
    return `<article class="product-card">
      <div class="product-swatch" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div>
      <div><h3>${esc(product.name)}</h3><p class="product-meta">${esc(product.marketplace)}, ${esc(product.category)}</p>
        ${product.note ? `<p class="product-note">${esc(product.note)}</p>` : ''}
        ${available
          ? `<a class="button" href="${esc(product.url)}" target="_blank" rel="sponsored noopener noreferrer" data-product-id="${esc(product.id)}">${esc(product.cta || 'View product on Amazon')} <span aria-hidden="true">↗</span></a><p class="product-note">Affiliate link to ${esc(product.marketplace)}. As an Amazon Associate I earn from qualifying purchases.</p>`
          : `<button class="button" type="button" disabled aria-describedby="status-${esc(product.id)}">Link coming soon</button>`}
        <small class="link-status" id="status-${esc(product.id)}">${available ? 'Affiliate link checked ' + esc(product.verified) : 'Shopping link unavailable — demonstration or unverified listing.'}</small>
      </div>
    </article>`;
  }

  function lookPage(slug) {
    const look = looksList.find((entry) => entry.slug === slug);
    if (!look) {
      setMeta('Look not found | OliveBloom', 'This outfit could not be found.', false);
      return `<section class="wrap section"><div class="empty-state">This outfit was not found. <a href="#/looks">Browse all looks</a>.</div></section>`;
    }
    setMeta(`${look.title} | OliveBloom`, look.desc);
    const related = looksList.filter((entry) => entry !== look && (entry.category === look.category || (entry.tags || []).some((tag) => (look.tags || []).includes(tag)))).slice(0, 3);
    const productList = getProducts(look);
    return `<section class="wrap section section-tight">
      <p><a class="text-link" href="#/looks">← Back to all looks</a></p>
      <div class="detail-layout">
        <div class="detail-visual">${imageBlock(look.image, look.title, allLooks.indexOf(look))}</div>
        <div class="detail-copy">
          ${lookTags(look)}
          <div class="card-kicker"><span class="tag">${esc(look.occasion)}</span>${(look.tags || []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join('')}</div>
          <h1>${esc(look.title)}</h1>
          <p>${esc(look.desc)}</p>
          ${disclosureNote()}
          <p class="product-note">Outfit imagery may be illustrative. Colours, fabrics and cuts can differ; check the original product listing for exact details.</p>
          <h2 class="product-heading">Shop the Outfit</h2>
          <div class="product-list">${productList.map(productCard).join('') || '<p class="empty-state">Products for this look are being added.</p>'}</div>
        </div>
      </div>
      ${related.length ? `<div class="related"><div class="section-heading"><div><p class="eyebrow">A similar feeling</p><h2>More looks</h2></div></div><div class="grid">${related.map(lookCard).join('')}</div></div>` : ''}
    </section>`;
  }

  const legalStarter = '<p class="legal-label">Starter text — review before publishing</p><p>This page is an unfinished starter template, not legal advice and not a statement that the site meets any particular legal requirement. Replace it with accurate information for your business and the places where you operate.</p>';
  const pageBody = {
    about: () => {
      setMeta('About OliveBloom', 'Learn about OliveBloom’s approach to wearable fashion inspiration.');
      return `<section class="wrap section prose"><p class="eyebrow">The thought behind the edit</p><h1>About OliveBloom</h1><p class="lede">A place for wearable ideas, small details, and finding your own way into a look.</p><p>OliveBloom curates affordable, elegant fashion inspiration and coordinated accessories. Each outfit is organized into separate pieces so you can choose what suits your own wardrobe.</p><p>These styling notes are starting points, not promises about trends or product availability. Add your own story here and include only facts you can stand behind.</p></section>`;
    },
    contact: () => {
      setMeta('Contact OliveBloom', 'Contact details for OliveBloom.');
      const email = !isPlaceholder(site.email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email || '');
      const domain = site.domain || '[YOUR WEBSITE DOMAIN]';
      let safeDomain = '';
      if (!isPlaceholder(domain)) {
        try {
          const parsed = new URL(/^https:\/\//i.test(domain) ? domain : `https://${domain}`);
          if (parsed.protocol === 'https:' && !parsed.username && !parsed.password && parsed.hostname.includes('.')) safeDomain = parsed.origin;
        } catch { /* Keep an unverified domain as plain text. */ }
      }
      const pinterest = validPinterestUrl(site.pinterest);
      return `<section class="wrap section prose"><p class="eyebrow">A note to OliveBloom</p><h1>Contact</h1><p class="lede">For questions about the edits or the site, use the contact details below.</p><div class="contact-card"><p><strong>Website</strong><br>${safeDomain ? `<a href="${esc(safeDomain)}">${esc(domain)}</a>` : esc(domain)}</p><p><strong>Email</strong><br>${email ? `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : esc(site.email || '[YOUR CONTACT EMAIL]')}</p><p><strong>Pinterest</strong><br>${pinterest ? `<a href="${esc(site.pinterest)}" target="_blank" rel="noopener noreferrer">${esc(site.pinterest)}</a>` : esc(site.pinterest || '[YOUR PINTEREST PROFILE URL]')}</p><p>${email ? 'These details are from the site catalogue. No contact form is connected.' : 'Website, email, and Pinterest details are setup placeholders until real information is supplied. No contact form is connected.'}</p></div></section>`;
    },
    disclosure: () => {
      setMeta('Affiliate Disclosure | OliveBloom', 'How OliveBloom affiliate links work.');
      return `<section class="wrap section prose"><p class="eyebrow">Shopping transparently</p><h1>Affiliate Disclosure</h1><p><strong>As an Amazon Associate I earn from qualifying purchases.</strong></p><p>OliveBloom may earn a commission when you buy through affiliate links, at no extra cost to you where applicable. Product details, prices, and availability are controlled by the retailer and may change. Outfit imagery may be illustrative; check the retailer listing for exact product details.</p><p>Only product-specific links that have been checked are enabled. A product marked “Link coming soon” is not currently available to shop through this site.</p></section>`;
    },
    privacy: () => {
      setMeta('Privacy Policy | OliveBloom', 'Privacy policy starter template for OliveBloom.', false);
      return `<section class="wrap section prose"><p class="eyebrow">Site information</p><h1>Privacy Policy</h1>${legalStarter}<p>[REVIEW] Describe any information collected, why it is collected, retention periods, analytics and cookie use, third-party services, and how visitors can contact you about privacy.</p></section>`;
    },
    terms: () => {
      setMeta('Terms | OliveBloom', 'Terms starter template for OliveBloom.', false);
      return `<section class="wrap section prose"><p class="eyebrow">Site information</p><h1>Terms</h1>${legalStarter}<p>[REVIEW] Describe site use, content ownership, third-party websites and retailers, affiliate relationships, product details, and any appropriate limitations.</p></section>`;
    }
  };

  function validPinterestUrl(value) {
    if (isPlaceholder(value)) return false;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password && /(^|\.)pinterest\.(com|co\.uk)$/i.test(url.hostname);
    } catch { return false; }
  }

  function pinMapPage() {
    setMeta('Pin Map | OliveBloom', 'Editor reference map for Pinterest pins, outfits, and affiliate products.', false);
    const rows = allLooks.map((look) => {
      const productsInLook = (look.products || []).map(productById).filter(Boolean);
      const rawPinUrl = !isPlaceholder(look.pinUrl) && validPinterestUrl(look.pinUrl)
        ? `<a href="${esc(look.pinUrl)}" target="_blank" rel="noopener noreferrer">Open Pin ↗</a>`
        : esc(look.pinUrl || '[ADD EXISTING PIN URL]');
      const mappedProducts = productsInLook.map((product) => `${esc(product.id)}: ${esc(product.url)} (${esc(product.linkStatus)})`).join('<br>');
      return `<tr><td>${esc(look.pinId)}</td><td>${rawPinUrl}</td><td>${esc(look.pinTitle)}</td><td><a href="#/look/${encodeURIComponent(look.slug)}">/#/look/${esc(look.slug)}</a></td><td>${esc(look.id)}</td><td>${esc((look.products || []).join(', '))}</td><td><code>${mappedProducts}</code></td><td>${esc(look.mainKeyword)}</td><td>${esc(look.category)}</td><td>${esc(look.status)}${look.demo ? ' (demo)' : ''}</td></tr>`;
    }).join('');
    return `<section class="wrap section"><p class="eyebrow">Editorial workspace</p><h1>Pin Map</h1><p class="note">Editor reference for mapping each Pin to a look and its products. The catalogue currently contains demonstration records. Remove the public footer link or keep this page unlisted before launch.</p><div class="table-wrap"><table class="pin-table"><thead><tr>${['Pin ID', 'Pin URL', 'Pin title', 'Website destination', 'Outfit ID', 'Product IDs', 'Affiliate URLs (status)', 'Main keyword', 'Category', 'Status'].map((heading) => `<th scope="col">${heading}</th>`).join('')}</tr></thead><tbody>${rows || '<tr><td colspan="10">No outfits are listed in catalogue.js yet.</td></tr>'}</tbody></table></div></section>`;
  }

  function routeSegments() {
    const route = (location.hash || '#/').replace(/^#\/?/, '');
    return route.split('/').map((part) => {
      try { return decodeURIComponent(part); } catch { return part; }
    });
  }

  function renderRoute() {
    const [route, first, second] = routeSegments();
    if (!route) main.innerHTML = homePage();
    else if (route === 'looks') main.innerHTML = looksPage(first || '', second || '');
    else if (route === 'look') main.innerHTML = lookPage(first || '');
    else if (route === 'pin-map') main.innerHTML = pinMapPage();
    else if (pageBody[route]) main.innerHTML = pageBody[route]();
    else {
      setMeta('Page not found | OliveBloom', 'This page could not be found.', false);
      main.innerHTML = `<section class="wrap section"><div class="empty-state">Page not found. <a href="#/">Return to OliveBloom</a>.</div></section>`;
    }

    const primaryRoute = route === 'look' ? 'looks' : route;
    document.querySelectorAll('.main-nav a').forEach((link) => {
      const linkRoute = link.getAttribute('href').replace(/^#\/?/, '');
      if (linkRoute === primaryRoute || (!primaryRoute && !linkRoute)) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (route === 'looks') updateLookGrid();
    document.getElementById('current-year').textContent = String(new Date().getFullYear());
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  document.addEventListener('input', (event) => {
    const key = event.target?.dataset?.filter;
    if (!key) return;
    filters[key] = event.target.value;
    updateLookGrid();
  });
  document.addEventListener('change', (event) => {
    const key = event.target?.dataset?.filter;
    if (!key) return;
    filters[key] = event.target.value;
    updateLookGrid();
  });
  document.addEventListener('click', (event) => {
    const productLink = event.target.closest('a[data-product-id]');
    if (productLink) document.dispatchEvent(new CustomEvent('ob:productclick', { detail: { productId: productLink.dataset.productId } }));
  });

  const footerPinterest = document.getElementById('footer-pinterest');
  if (validPinterestUrl(site.pinterest)) footerPinterest.innerHTML = `<a href="${esc(site.pinterest)}" target="_blank" rel="noopener noreferrer">Pinterest ↗</a>`;
  else footerPinterest.textContent = `Pinterest: ${site.pinterest || '[YOUR PINTEREST PROFILE URL]'}`;
  const footerEmail = document.getElementById('footer-email');
  if (!isPlaceholder(site.email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email || '')) footerEmail.innerHTML = `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`;
  else footerEmail.textContent = `Email: ${site.email || '[YOUR CONTACT EMAIL]'}`;

  window.addEventListener('hashchange', renderRoute);
  renderRoute();
})();
