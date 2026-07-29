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


import { products } from "../data/products";
import { SITE } from "../config/site";
import { formatIdr } from "../utils/formatCurrency";


export default function TourDetail() {


  const { slug } = useParams();


  const product = products.find(
    (item)=> item.slug === slug
  );


  const [pax,setPax] = useState(1);



  if(!product){

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-3xl font-bold">
          Tour Not Found
        </h1>

      </div>

    );

  }



  const totalPrice =
    product.priceIdr * pax;




  const whatsappMessage = encodeURIComponent(
`Hello ${SITE.name} 👋

I want to book:

Package:
${product.title}

Guest:
${pax} Pax

Price / Pax:
${formatIdr(product.priceIdr)}

Total Price:
${formatIdr(totalPrice)}

Please send me more information.
`
  );




  const schema = {

    "@context":"https://schema.org",

    "@type":"TouristTrip",

    name:product.title,

    description:product.description,

    image:product.image,


    offers:{
      "@type":"Offer",
      price:product.priceIdr,
      priceCurrency:"IDR"
    }

  };




  return (

<>
<Helmet>

<title>
{product.title} | {SITE.name}
</title>


<meta
name="description"
content={product.description}
/>


<script type="application/ld+json">
{JSON.stringify(schema)}
</script>


</Helmet>




<section className="bg-white">


<img

src={product.image}

alt={product.title}

className="
h-[420px]
w-full
object-cover
"

/>



<div
className="
mx-auto
max-w-7xl
px-6
py-16
"
>



<Link

to="/"

className="
inline-flex
items-center
gap-2
text-yellow-500
mb-8
"

>

<ArrowLeft size={18}/>

Back Home

</Link>





<div
className="
grid
gap-12
lg:grid-cols-[2fr_1fr]
"
>




{/* LEFT */}

<div>


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

{product.description}

</p>




<h2 className="mt-10 text-2xl font-bold">

Highlights

</h2>


<ul className="mt-5 space-y-3">


{product.highlights.map(item=>(

<li
key={item}
className="flex gap-3 text-gray-600"
>

<CheckCircle
size={18}
className="text-yellow-500"
/>

{item}

</li>

))}


</ul>



</div>





{/* RIGHT */}

<aside
className="
h-fit
rounded-3xl
border
p-8
shadow-lg
"
>


<p className="text-gray-500">

Starting From / Pax

</p>



<h2
className="
text-3xl
font-black
text-yellow-500
"
>

{formatIdr(product.priceIdr)}

</h2>





<label
className="
mt-6
block
font-bold
"
>

Number of Guests

</label>



<select

value={pax}

onChange={(e)=>setPax(Number(e.target.value))}

className="
mt-3
w-full
rounded-xl
border
px-4
py-3
"

>


{[1,2,3,4,5,6,7,8,9,10].map(num=>(

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

Total Price ({pax} Pax)

</p>



<p
className="
text-3xl
font-black
text-yellow-500
"
>

{formatIdr(totalPrice)}

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