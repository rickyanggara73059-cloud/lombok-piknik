import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Clock3,
  MapPin,
  Star,
  CheckCircle
} from "lucide-react";


import { tourCatalogue } from "../data/tourCatalogue";
import { formatTourDisplayPrice, formatTourPriceText, getTourUsdPrice } from "../utils/tourPriceDisplay";
import { SITE } from "../config/site";
import { getDefaultTierIndex, getGuestOptions, getTourBookingMessage, getTourQuote } from "../utils/tourBooking";


export default function TourDetail() {


  const { slug } = useParams();


  const product = tourCatalogue.find(
    (item)=> item.slug === slug
  );


  const [pax,setPax] = useState(1);
  const [selectedTier, setSelectedTier] = useState<number | undefined>();



  if(!product){

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-3xl font-bold">
          Tour Not Found
        </h1>

      </div>

    );

  }

  const isPendingSpeedboat = product.priceBasis === "per_boat" && (product.sellingPriceStatus === "needs_confirmation" || ("operationalStatus" in product && product.operationalStatus === "needs_confirmation"));
  const canonicalUrl = `${SITE.website.replace(/\/$/, "")}/tour/${product.slug}`;

  const guestOptions = getGuestOptions(product);
  const guests = guestOptions.includes(pax) ? pax : (guestOptions[0] ?? 1);
  const tierIndex = selectedTier ?? getDefaultTierIndex(product);
  const groupPricing = product.pricingTiers?.some((tier) => tier.groupSize !== undefined);
  const quote = getTourQuote(product, guests, tierIndex);
  const whatsappMessage = encodeURIComponent(
    quote ? getTourBookingMessage(product, quote) : formatTourPriceText(product.whatsappMessage, product),
  );




  const schema = {

    "@context":"https://schema.org",

    "@type":"TouristTrip",

    name:product.title,

    description:formatTourPriceText(product.description, product),

    image:product.image.startsWith("/") ? `${SITE.website.replace(/\/$/, "")}${product.image}` : product.image,


    ...(product.isPlaceholder ? {} : { offers:{
      "@type":"Offer",
      price:getTourUsdPrice(product),
      priceCurrency:"USD",
      description:"Estimated USD display price; original IDR base retained."
    } })

  };




  return (

<>
<Helmet>

<title>{`${product.title} | ${SITE.name}`}</title>


<meta
name="description"
content={formatTourPriceText(product.description, product)}
/>
<link rel="canonical" href={canonicalUrl} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:image" content={product.image.startsWith("/") ? `${SITE.website.replace(/\/$/, "")}${product.image}` : product.image} />
<meta name="robots" content={isPendingSpeedboat ? "noindex, nofollow" : "index, follow"} />

<script type="application/ld+json">
{JSON.stringify(schema)}
</script>


</Helmet>




<section className="bg-white">


{product.image ? <img

src={product.image ?? undefined}

alt={product.title}

className="
h-[420px]
w-full
object-cover
"

/> : <div className="h-[420px] w-full flex items-center justify-center text-gray-500">Reference image pending</div>}



<div
className="
mx-auto
max-w-7xl
px-6
py-16
"
>



<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
<Link

to="/"

className="
inline-flex
items-center
gap-2
text-yellow-500
"

>

<ArrowLeft size={18}/>

Back Home

</Link>

<a href="#tour-booking" className="inline-flex items-center gap-2 text-yellow-500 lg:hidden">
  Booking
</a>
</div>





<div
className="
grid
gap-8
lg:grid-cols-[minmax(0,13fr)_minmax(0,7fr)]
lg:items-start
"
>




{/* LEFT */}

<div className="min-w-0 break-words">


<span
className="
rounded-full
bg-yellow-100
px-4
py-2
text-sm
font-bold
text-yellow-700
"
>

{product.category}

</span>



<h1
className="
mt-5
text-5xl
font-black
"
>

{product.title}

</h1>




<div
className="
mt-6
flex
flex-wrap
gap-6
text-gray-600
"
>


<div className="flex gap-2 items-center">

<MapPin size={18}/>

{product.location}

</div>



<div className="flex gap-2 items-center">

<Clock3 size={18}/>

{product.duration}

</div>



<div className="flex gap-2 items-center">

<Star size={18} fill="currentColor"/>

{product.rating}

</div>


</div>





<h2 className="mt-10 text-2xl font-bold">
Overview
</h2>


<p className="mt-4 text-gray-600 leading-8">

{formatTourPriceText(product.description, product)}

</p>

{product.overview ? (
  <p className="mt-4 text-gray-600 leading-8">{formatTourPriceText(product.overview, product)}</p>
) : null}



<h2 className="mt-10 text-2xl font-bold">

Highlights

</h2>


<ul className={`mt-5 grid gap-3 ${product.highlights.length > 1 ? "sm:grid-cols-2" : ""}`}>


{product.highlights.map(item=>(

<li
key={item}
className="flex min-w-0 gap-3 text-gray-600"
>

<CheckCircle
size={18}
className="shrink-0 text-yellow-500"
/>

{item}

</li>

))}


</ul>

{product.itinerary?.length ? (
  <>
    <h2 className="mt-10 text-2xl font-bold">Itinerary</h2>
    {product.itinerary.map((day, dayIndex) => (
      <div key={`${dayIndex}-${day.title}`}>
        <h3 className="mt-6 font-bold">
          {/^Day\s+\d+/i.test(day.title) ? day.title : `Day ${dayIndex + 1}: ${day.title}`}
        </h3>
        <ol className="mt-5 space-y-3">
          {day.entries.map((entry, entryIndex) => (
            <li key={`${dayIndex}-${entryIndex}`} className="text-gray-600 leading-8">{entry}</li>
          ))}
        </ol>
      </div>
    ))}
  </>
) : null}

{product.included.length ? (
  <>
    <h2 className="mt-10 text-2xl font-bold">Inclusions</h2>
    <ul className="mt-5 space-y-3">
      {product.included.map((item, index) => (
        <li key={index} className="flex gap-3 text-gray-600">
          <CheckCircle size={18} className="text-yellow-500" />{item}
        </li>
      ))}
    </ul>
  </>
) : null}

{product.mealNotes?.length ? (
  <>
    <h2 className="mt-10 text-2xl font-bold">Meal Notes</h2>
    <ul className="mt-5 space-y-3">
      {product.mealNotes.map((note, index) => (
        <li key={index} className="text-gray-600 leading-8">{note}</li>
      ))}
    </ul>
  </>
) : null}

{product.excludes?.length ? (
  <>
    <h2 className="mt-10 text-2xl font-bold">Exclusions</h2>
    <ul className="mt-5 space-y-3">
      {product.excludes.map((item, index) => (
        <li key={index} className="text-gray-600 leading-8">{item}</li>
      ))}
    </ul>
  </>
) : null}



</div>





{/* RIGHT */}

<aside
id="tour-booking"
className="
h-fit
min-w-0
scroll-mt-24
rounded-3xl
border
p-8
shadow-lg
lg:sticky
lg:top-24
lg:max-h-[calc(100dvh-7rem)]
lg:overflow-y-auto
"
>


<p className="text-gray-500">

{product.priceBasis === "per_boat" ? "Provisional price per boat" : product.pricingTiers?.length ? "Price / Pax" : "Starting From / Pax"}

</p>



<h2
className="
text-3xl
font-black
text-yellow-500
"
>

{formatTourDisplayPrice(product, quote?.unitPrice ?? product.priceIdr)}

</h2>

{product.priceBasis !== "per_boat" ? <p className="mt-3 text-sm text-gray-500">Estimated USD display; totals converted from the original IDR amount and rounded independently.</p> : null}

<p className="mt-6 flex items-center gap-2 text-gray-600">
  <Clock3 size={18} className="shrink-0" />
  {product.duration}
</p>

{product.included.length ? (
  <div className="mt-6">
    <p className="font-bold">Package includes</p>
    <ul className="mt-3 space-y-3 text-sm">
      {product.included.slice(0, 3).map((item, index) => (
        <li key={index} className="flex min-w-0 gap-3 text-gray-600">
          <CheckCircle size={18} className="shrink-0 text-yellow-500" />
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  </div>
) : null}




{product.minimum ? (
  <p className="mt-6 text-gray-600">Minimum: {product.minimum}</p>
) : null}

{product.pricingTiers?.length && !groupPricing ? (
  <>
    <label htmlFor="tour-price-option" className="mt-6 block font-bold">Price Option</label>
    <select
      id="tour-price-option"
      value={tierIndex}
      onChange={(event) => setSelectedTier(Number(event.target.value))}
      className="mt-3 min-w-0 w-full max-w-full rounded-xl border px-4 py-3"
    >
      {product.pricingTiers.map((tier, index) => (
        <option key={tier.name} value={index}>{tier.name} — {formatTourDisplayPrice(product, tier.priceIdr)} / pax</option>
      ))}
    </select>
  </>
) : null}

<label
htmlFor="tour-guests"
className="
mt-6
block
font-bold
"
>

Number of Guests

</label>



<select
id="tour-guests"

value={guests}

onChange={(e)=>setPax(Number(e.target.value))}

className="
mt-3
min-w-0
w-full
max-w-full
rounded-xl
border
px-4
py-3
"

>


{guestOptions.map(num=>(

<option
key={num}
value={num}
>

{num} Pax

</option>

))}


</select>




<div
className="
mt-6
rounded-2xl
bg-gray-50
p-5
"
>


<p className="text-sm text-gray-500">

Total Price ({guests} Pax)

</p>



<p
className="
text-3xl
font-black
text-yellow-500
"
>

{quote ? formatTourDisplayPrice(product, quote.totalPrice, quote.guests) : "Please confirm the price"}

</p>


</div>





<a

href={`https://wa.me/${SITE.whatsapp}?text=${whatsappMessage}`}

target="_blank"

rel="noopener noreferrer"

className="
mt-8
block
rounded-full
bg-yellow-400
px-6
py-4
text-center
font-bold
text-black
hover:bg-yellow-300
"

>

Book via WhatsApp

</a>




</aside>



</div>


</div>


</section>

</>

);


}
