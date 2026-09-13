"use client";

import { useMemo, useState } from "react";

type Product={code:string;name:string;category:string;price:number;mrp:number;color:string;rating:number;reviews:number;badge?:string};
const products:Product[]=[
 {code:"PWL-1001",name:"Kashvi Silk Saree",category:"Silk Sarees",price:2499,mrp:3999,color:"Wine",rating:4.6,reviews:128,badge:"Bestseller"},
 {code:"PWL-1002",name:"Banarasi Weave Saree",category:"Banarasi",price:3199,mrp:4999,color:"Maroon",rating:4.7,reviews:94,badge:"Popular"},
 {code:"PWL-1003",name:"Festive Zari Saree",category:"Festive",price:2899,mrp:4599,color:"Green",rating:4.5,reviews:76},
 {code:"PWL-1004",name:"Soft Linen Saree",category:"Daily Wear",price:1499,mrp:2199,color:"Beige",rating:4.4,reviews:61},
 {code:"PWL-1005",name:"Designer Embroidery Saree",category:"Designer",price:3799,mrp:5999,color:"Navy",rating:4.8,reviews:113,badge:"Top Rated"},
 {code:"PWL-1006",name:"Classic Printed Saree",category:"Daily Wear",price:1199,mrp:1799,color:"Pink",rating:4.3,reviews:48},
 {code:"PWL-1007",name:"Riwaayat Kanjivaram",category:"Silk Sarees",price:4299,mrp:6999,color:"Purple",rating:4.9,reviews:82},
 {code:"PWL-1008",name:"Lightweight Party Saree",category:"Party Wear",price:2299,mrp:3499,color:"Black",rating:4.5,reviews:67}
];
const cats=["All","Silk Sarees","Banarasi","Designer","Festive","Daily Wear","Party Wear","Best Sellers","New Arrivals"];
const money=(n:number)=>`₹${n.toLocaleString("en-IN")}`;
const heroPhoto="https://images.unsplash.com/photo-1710972199689-90fbb468e901?auto=format&fit=crop&fm=jpg&q=82&w=1600";

export default function Home(){
 const [q,setQ]=useState(""),[cat,setCat]=useState("All"),[sort,setSort]=useState("featured"),[cart,setCart]=useState<Product[]>([]),[view,setView]=useState<Product|null>(null),[cartOpen,setCartOpen]=useState(false);
 const list=useMemo(()=>{const x=products.filter(p=>(cat==="All"||p.category===cat)&&`${p.name} ${p.category} ${p.code} ${p.color}`.toLowerCase().includes(q.toLowerCase()));if(sort==="low")x.sort((a,b)=>a.price-b.price);if(sort==="high")x.sort((a,b)=>b.price-a.price);if(sort==="rating")x.sort((a,b)=>b.rating-a.rating);return x},[q,cat,sort]);
 const add=(p:Product)=>{setCart(c=>[...c,p]);setView(null);setCartOpen(true)};
 const subtotal=cart.reduce((s,p)=>s+p.price,0),delivery=cart.length>=3?0:cart.length?99:0;
 return <main className="storefront">
  <header className="site-header"><div className="header-main">
   <button className="brand" aria-label="Porwal Gharana home" onClick={()=>{setCat("All");setQ("")}}><span className="brand-logo"><span>PG</span></span><span className="brand-text"><strong>PORWAL<br/>GHARANA</strong><small>ONLINE STORE</small></span></button>
   <div className="search-box"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search for sarees, collections and more"/><button aria-label="Search">⌕</button></div>
   <div className="header-actions"><button><span>♙</span><small>Account</small></button><button><span>▣</span><small>Orders</small></button><button onClick={()=>setCartOpen(true)} className="cart-btn"><span>🛒</span><small>Cart</small>{cart.length>0&&<b>{cart.length}</b>}</button></div>
  </div><nav className="category-nav"><button className="all-categories">☰ All Categories</button>{cats.slice(1).map(c=><button key={c} className={cat===c?"active":""} onClick={()=>setCat(cats.includes(c)&&!['Best Sellers','New Arrivals'].includes(c)?c:'All')}>{c}</button>)}</nav></header>

  <section className="hero">
   <div className="hero-copy"><p className="eyebrow">PORWAL GHARANA SAREES</p><h1>Beautiful sarees.<br/><em>Simple shopping.</em></h1><p className="hero-subtitle">Silk, Banarasi, festive, designer and everyday sarees for every occasion.</p><button className="primary-button" onClick={()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"})}>Shop all sarees →</button><div className="trust-row"><span>✓ Secure checkout</span><span>✓ Easy ordering</span><span>✓ India delivery</span></div></div>
   <div className="hero-image-wrap"><img src={heroPhoto} alt="Woman wearing a blue saree" className="hero-image"/><div className="hero-tag"><span className="mini-logo">PG</span><span><strong>Porwal Gharana</strong><small>Sarees for every occasion</small></span></div></div>
  </section>

  <section className="quick-links">{cats.slice(1,7).map(c=><button key={c} onClick={()=>{setCat(c);document.getElementById("products")?.scrollIntoView({behavior:"smooth"})}}>{c}</button>)}</section>

  <section id="products" className="products-section"><div className="section-heading"><div><p className="eyebrow">SHOP PORWAL GHARANA</p><h2>Popular sarees</h2></div><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="rating">Top Rated</option></select></div><div className="filter-row">{cats.slice(0,7).map(c=><button key={c} className={cat===c?"selected":""} onClick={()=>setCat(c)}>{c}</button>)}</div>
   <div className="product-grid">{list.map(p=>{const discount=Math.round((1-p.price/p.mrp)*100);return <article className="product-card" key={p.code} onClick={()=>setView(p)}><div className="product-photo"><div className="saree-placeholder"><span>PORWAL</span><strong>{p.color}</strong><small>SAREE</small></div>{p.badge&&<span className="badge">{p.badge}</span>}</div><div className="product-info"><p className="product-code">{p.code}</p><h3>{p.name}</h3><div className="rating"><span>★ {p.rating}</span><small>({p.reviews})</small></div><div className="price-line"><strong>{money(p.price)}</strong><del>{money(p.mrp)}</del><b>{discount}% off</b></div><button onClick={e=>{e.stopPropagation();add(p)}}>Add to Cart</button></div></article>})}</div>
  </section>

  <section className="service-strip"><div><strong>🚚 Easy delivery</strong><span>India-wide delivery options</span></div><div><strong>↩ Easy ordering</strong><span>Simple shopping experience</span></div><div><strong>🔒 Secure checkout</strong><span>Protected payment flow</span></div><div><strong>☎ Support</strong><span>We're here to help</span></div></section>
  <footer className="footer"><strong>PORWAL GHARANA</strong><span>Online saree store · Silk · Banarasi · Designer · Festive · Daily Wear</span></footer>

  {view&&<div className="modal-backdrop" onClick={()=>setView(null)}><div className="product-modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setView(null)}>×</button><div className="modal-visual"><div className="saree-placeholder large"><span>PORWAL</span><strong>{view.color}</strong><small>SAREE</small></div></div><div className="modal-details"><p className="product-code">{view.code}</p><h2>{view.name}</h2><p>{view.category} · {view.color}</p><div className="rating"><span>★ {view.rating}</span><small>{view.reviews} reviews</small></div><div className="price-line big"><strong>{money(view.price)}</strong><del>{money(view.mrp)}</del></div><button className="primary-button" onClick={()=>add(view)}>Add to Cart</button></div></div></div>}
  {cartOpen&&<div className="drawer-backdrop" onClick={()=>setCartOpen(false)}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><h2>Your Cart</h2><button onClick={()=>setCartOpen(false)}>×</button></div>{cart.length===0?<div className="empty-cart"><strong>Your cart is empty</strong><span>Add sarees to continue shopping.</span></div>:<><div className="cart-items">{cart.map((p,i)=><div className="cart-item" key={`${p.code}-${i}`}><div className="mini-product">{p.color}</div><div><strong>{p.name}</strong><small>{p.code}</small><b>{money(p.price)}</b></div><button onClick={()=>setCart(c=>c.filter((_,idx)=>idx!==i))}>×</button></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Delivery</span><strong>{delivery?money(delivery):"FREE"}</strong></div><div className="total"><span>Total</span><strong>{money(subtotal+delivery)}</strong></div><button className="primary-button">Proceed to Checkout</button></div></>}</aside></div>}
 </main>
}
