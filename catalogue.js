/* ==========================================================
   OLIVEBLOOM CATALOGUE: the only file you need to edit.
   HOW TO ADD A LOOK (Pin -> Outfit -> Products):
   1. Copy an outfit block in OUTFITS. Give it a new id and a unique slug (lowercase-with-dashes).
   2. Paste your existing Pin URL into pinUrl and give the Pin an internal pinId (e.g. 'PIN-004'). Use the Pin title as pinTitle.
   3. Put your outfit image in the images/ folder and set image: 'images/your-file.jpg' (or a full https:// URL you are allowed to use).
   4. Copy a product block in PRODUCTS for each item. Paste YOUR product-specific Amazon Associates link into url,
      set marketplace, and change linkStatus from 'placeholder' to 'verified' only after you tested the link.
   5. List the product ids in the outfit's products: [...]. A product id can appear in several outfits.
   6. Check that the products really match the outfit shown. Set status to 'published' (use 'draft' to hide).
   7. Open #/pin-map on your site to review the Pin -> Outfit -> Product table, then point the Pin's destination to the outfit page.
   Buttons stay disabled ("Link coming soon") until linkStatus is not 'placeholder' and the url is an amazon link.
   Everything marked demo:true is sample content. Delete it before launch.
   ========================================================== */

window.SITE = {
  domain: '[YOUR WEBSITE DOMAIN]',
  email: 'snehaprabhakr7@gmail.com',
  pinterest: 'https://in.pinterest.com/olivebloom0192/?actingBusinessId=1121115038397461775',
  trackingId: 'pixeldoodle-21'   // for your reference only; paste full links into products
};

// Editable lists: reorder, add or remove. Trends are starting points, not guaranteed bestsellers.
window.CATEGORIES = ['Dresses','Kurtis, Ethnic & Fusion','Western Outfits','Office Wear','Casual Wear','Winter Outfits','Spring & Summer Outfits','Party & Occasion Wear','Bags','Shoes','Jewellery & Accessories','Capsule Wardrobe Ideas','Global Trend Edits'];
window.TRENDS = ['Brooch styling','Icy blue','Lace details','Utility & linen','Tennis-preppy','Scarf on bag','Polka dot','Poet-core','Burgundy & plum','Plaid & cardigans','White dresses','Capsule wardrobe','Modest fashion','Korean-inspired'];

const PH = '[ADD PRODUCT-SPECIFIC ASSOCIATES LINK]';

window.OUTFITS = [
  { id:'OUT-001', slug:'burgundy-wrap-dress-holiday-evening', title:'Burgundy Wrap Dress for Holiday Evenings',
    desc:'A deep burgundy wrap dress with a structured bag and block-heel boots. Demo content showing the layout.',
    category:'Party & Occasion Wear', tags:['Burgundy & plum','Winter layering'], season:'Winter', occasion:'Party', colour:'Burgundy',
    image:'', pinId:'PIN-001', pinUrl:'[ADD EXISTING PIN URL]', pinTitle:'Burgundy Dress Outfit Ideas for Holiday Parties', mainKeyword:'burgundy dress outfit',
    products:['PRD-001','PRD-002','PRD-003'], status:'published', demo:true },
  { id:'OUT-002', slug:'icy-blue-knit-tailored-trousers', title:'Icy Blue Knit with Tailored Trousers',
    desc:'A cool-toned smart-casual look with silver-tone earrings. Demo content showing the layout.',
    category:'Office Wear', tags:['Icy blue','Capsule wardrobe'], season:'Winter', occasion:'Office', colour:'Blue',
    image:'', pinId:'PIN-002', pinUrl:'[ADD EXISTING PIN URL]', pinTitle:'Icy Blue Outfit Ideas for Work', mainKeyword:'icy blue outfit',
    products:['PRD-004','PRD-005','PRD-006'], status:'published', demo:true },
  { id:'OUT-003', slug:'linen-utility-shirt-summer-set', title:'Linen Utility Shirt Summer Set',
    desc:'Relaxed linen in earthy khaki with flat sandals and a woven bag. Demo content showing the layout.',
    category:'Spring & Summer Outfits', tags:['Utility & linen'], season:'Summer', occasion:'Casual', colour:'Khaki',
    image:'', pinId:'PIN-003', pinUrl:'[ADD EXISTING PIN URL]', pinTitle:'Linen Shirt Outfit Ideas for Warm Days', mainKeyword:'brown linen shirt outfit',
    products:['PRD-007','PRD-008','PRD-002'], status:'draft', demo:true }
];

window.PRODUCTS = [
  { id:'PRD-001', name:'Burgundy wrap dress (example)', category:'Dresses', image:'', marketplace:'Amazon US', url:PH, note:'Check the real listing colour and length before linking.', verified:'', linkStatus:'placeholder' },
  { id:'PRD-002', name:'Structured shoulder bag (example)', category:'Bags', image:'', marketplace:'Amazon US', url:PH, note:'Reusable across several outfits.', verified:'', linkStatus:'placeholder' },
  { id:'PRD-003', name:'Block-heel ankle boots (example)', category:'Shoes', image:'', marketplace:'Amazon US', url:PH, note:'', verified:'', linkStatus:'placeholder' },
  { id:'PRD-004', name:'Icy blue knit top (example)', category:'Western Outfits', image:'', marketplace:'Amazon UK', url:PH, note:'', verified:'', linkStatus:'placeholder' },
  { id:'PRD-005', name:'Tailored straight trousers (example)', category:'Office Wear', image:'', marketplace:'Amazon UK', url:PH, note:'', verified:'', linkStatus:'placeholder' },
  { id:'PRD-006', name:'Silver-tone drop earrings (example)', category:'Jewellery & Accessories', image:'', marketplace:'Amazon UK', url:PH, note:'', verified:'', linkStatus:'placeholder' },
  { id:'PRD-007', name:'Linen utility shirt (example)', category:'Casual Wear', image:'', marketplace:'Amazon AU', url:PH, note:'', verified:'', linkStatus:'placeholder' },
  { id:'PRD-008', name:'Flat leather sandals (example)', category:'Shoes', image:'', marketplace:'Amazon AU', url:PH, note:'', verified:'', linkStatus:'placeholder' }
];
