const categories = [
  { name: "New Arrivals", count: "24 pieces" },
  { name: "Signature Edit", count: "18 pieces" },
  { name: "Everyday Classics", count: "31 pieces" },
  { name: "Festive Collection", count: "16 pieces" },
];

const products = [
  { code: "PWL-1001", name: "Heritage Edit", price: "₹2,499", tag: "NEW" },
  { code: "PWL-1002", name: "Gharana Classic", price: "₹1,899", tag: "BESTSELLER" },
  { code: "PWL-1003", name: "Festive Signature", price: "₹3,299", tag: "LIMITED" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f0e8]">
      <div className="border-b border-black/10 bg-[#1d1916] px-5 py-2 text-center text-[11px] font-medium tracking-[0.18em] text-[#f5f0e8]">
        PORWAL GHARANA · ONLINE STORE · FREE SHIPPING OFFERS COMING SOON
      </div>

      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#f5f0e8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <button className="text-xs uppercase tracking-[0.22em]">Menu</button>
          <div className="text-center">
            <div className="font-serif text-2xl tracking-[0.08em]">PORWAL</div>
            <div className="text-[9px] tracking-[0.48em] text-[#776e64]">GHARANA</div>
          </div>
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.14em]"><button>Search</button><button>Bag (0)</button></div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#d8c4a4]">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-end px-5 py-12 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl pb-8">
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-black/60">The first Porwal edit</p>
            <h1 className="font-serif text-6xl leading-[.92] tracking-[-0.04em] md:text-8xl">Made to be<br/><em>remembered.</em></h1>
            <p className="mt-8 max-w-md text-sm leading-6 text-black/65">A new online destination for considered pieces, everyday favourites and festive selections from Porwal Gharana.</p>
            <button className="mt-8 border border-[#1d1916] bg-[#1d1916] px-7 py-4 text-xs uppercase tracking-[0.18em] text-[#f5f0e8] transition hover:bg-transparent hover:text-[#1d1916]">Shop collection →</button>
          </div>
          <div className="hidden h-[460px] items-center justify-center lg:flex">
            <div className="h-[390px] w-[300px] rotate-[-5deg] rounded-[150px_150px_24px_24px] border border-black/20 bg-[#efe4d0] shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.25em] text-[#776e64]">Explore</p><h2 className="mt-2 font-serif text-4xl">Shop by edit</h2></div><span className="text-xs text-[#776e64]">{categories.length} collections</span></div>
        <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 md:grid-cols-4">
          {categories.map((item, i) => <div key={item.name} className="group bg-[#fbf8f3] p-7 transition hover:bg-[#1d1916] hover:text-[#f5f0e8]"><div className="mb-20 text-xs text-[#776e64] group-hover:text-[#bda77f]">0{i + 1}</div><h3 className="font-serif text-2xl">{item.name}</h3><p className="mt-2 text-xs opacity-60">{item.count}</p><div className="mt-8 text-xs uppercase tracking-[0.18em] opacity-0 transition group-hover:opacity-100">View edit →</div></div>)}
        </div>
      </section>

      <section className="bg-[#1d1916] px-5 py-20 text-[#f5f0e8] lg:px-8">
        <div className="mx-auto max-w-7xl"><div className="mb-10 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.25em] text-[#bda77f]">Curated now</p><h2 className="mt-2 font-serif text-4xl">The latest pieces</h2></div><button className="text-xs uppercase tracking-[0.18em]">View all →</button></div>
          <div className="grid gap-5 md:grid-cols-3">{products.map((p, i) => <article key={p.code}><div className="relative mb-4 aspect-[4/5] overflow-hidden bg-[#332e28]"><div className="absolute inset-[10%] rotate-2 border border-white/10 bg-[#cbb796]"/><span className="absolute left-4 top-4 text-[9px] tracking-[0.2em] text-black/60">{p.tag}</span><span className="absolute bottom-4 right-4 font-mono text-[9px] text-white/60">{p.code}</span></div><div className="flex justify-between text-sm"><div><h3 className="font-serif text-lg">{p.name}</h3><p className="mt-1 text-xs text-white/50">Available in multiple variants</p></div><span>{p.price}</span></div></article>)}</div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-xs text-[#776e64] md:flex-row md:items-center md:justify-between lg:px-8"><div><span className="font-serif text-lg text-[#1d1916]">PORWAL GHARANA</span><p className="mt-1">Commerce foundation · v0.1</p></div><div className="flex gap-6"><span>Instagram</span><span>Contact</span><span>Policies</span></div></footer>
    </main>
  );
}
