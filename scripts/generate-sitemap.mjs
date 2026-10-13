import fs from "fs";
import path from "path";


const SITE_URL = "https://lombok-piknik.vercel.app";


const staticPages = [
  "/",
  "/tours"
];


// ambil data tour manual
const tours = [
  "lombok-island-5d4n",
  "lombok-island-4d3n",
  "north-lombok-3d2n",
  "whale-shark-sumbawa",
  "komodo-sailing-3d2n",
  "lombok-labuan-bajo-4d3n"
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
