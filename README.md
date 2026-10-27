# OliveBloom

A responsive fashion inspiration and editable affiliate catalogue website. It uses plain HTML, CSS, and JavaScript; no build step or package installation is required. `catalogue.js` is the editable source for the brand settings, categories, trends, outfits, Pins, and products.

## Preview locally

Serve this folder over HTTP rather than opening the HTML file directly, so browser routes and images behave consistently. For example, run `python3 -m http.server 3000 --bind 0.0.0.0` from this directory and open the local site.

## Edit the catalogue

Update `SITE` in `catalogue.js` with real domain, contact, Pinterest, and Associates account information. Replace sample outfits and products with content you have rights to use. Add authorized image files under an `images/` folder or use image URLs you are allowed to use, then set each outfit/product `image` value.

A product button is enabled only when all of these conditions are met: `linkStatus` is `verified`; `verified` is a real `YYYY-MM-DD` check date; `url` is a secure Amazon marketplace URL matching the product's `marketplace`; and the URL points directly to an Amazon product identifier. Only mark product-specific Associates links verified after checking them yourself. Do not reuse a link for a different item.

## Before launch

- Remove all `demo: true` records and replace all `[PLACEHOLDER]` values with real details.
- Confirm each outfit image is authorized and each linked product matches the pictured outfit.
- Test each product-specific Associates link and marketplace, then record its check date.
- Review the Privacy and Terms pages; the included copy is explicitly starter text, not finalized legal content.
- Add accurate domain, email, Pinterest profile, and Pin URLs. No form submission, analytics, or email delivery is configured.
- Review the public Pin Map footer link and remove it if editor information should not be public.
- Check the site on a phone, including filters, navigation, outfit details, and any enabled shopping links.
- Show the Amazon Associate statement wherever required, including the Pinterest profile.

Do not claim the site is live, forms send email, or products are available until those details and links have been reviewed and tested.
