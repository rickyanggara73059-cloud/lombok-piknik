import fs from "fs";
import path from "path";


const SITE_URL = "https://lombokpiknik.com";


const staticPages = [
  "",
  "/#tours",
  "/#gallery",
  "/#contact"
];


// ambil data tour manual
const tours = [
  "gili-3-islands-tour-lombok",
  "sembalun-rinjani-experience-lombok",
  "kuta-mandalika-tour-lombok",
  "lombok-waterfall-adventure",
  "mount-rinjani-trekking-lombok",
  "lombok-city-tour-souvenir"
];



const urls = [

  ...staticPages.map(
    page => `
<url>
  <loc>${SITE_URL}${page}</loc>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`
  ),



  ...tours.map(
    slug => `
<url>
  <loc>${SITE_URL}/tour/${slug}</loc>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>`
  )

];



const sitemap = `<?xml version="1.0" encoding="UTF-8"?>

<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.join("\n")}

</urlset>
`;



const outputPath = path.resolve(
  "public",
  "sitemap.xml"
);



fs.writeFileSync(
  outputPath,
  sitemap.trim()
);



console.log(
  "✅ Sitemap generated successfully"
);