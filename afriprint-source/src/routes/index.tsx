import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { MapPin, Phone, Mail, ShoppingCart, Printer, Scissors, Truck, Check } from "lucide-react";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Afriprint | Dye Sublimation, DTF & Textile Printing in Fordsburg" },
      { name: "description", content: "Afriprint offers dye sublimation, DTF and full textile printing — school uniforms, sportswear, corporate wear and more. Emster Center, Fordsburg." },
      { property: "og:title", content: "Afriprint | Sublimation & DTF Printing" },
      { property: "og:description", content: "School uniforms, sportswear, corporate wear, caps and bags — printed in-house in Fordsburg." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [big, setBig] = useState(false);
  useEffect(() => {
    let x = 0, y = 0, rx = 0, ry = 0, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      setBig(!!(e.target as HTMLElement).closest("a,button,[data-hover]"));
      document.documentElement.style.setProperty("--mx", `${x}px`);
      document.documentElement.style.setProperty("--my", `${y}px`);
      // ink splatter trail
      if (Math.random() < 0.25) {
        const s = document.createElement("span");
        const size = 4 + Math.random() * 10;
        s.className = `pointer-events-none fixed z-40 rounded-full ${Math.random() > 0.5 ? "bg-primary" : "bg-secondary"} transition-all duration-700`;
        Object.assign(s.style, { left: `${x}px`, top: `${y}px`, width: `${size}px`, height: `${size}px` });
        document.body.appendChild(s);
        requestAnimationFrame(() => { s.style.opacity = "0"; s.style.transform = `translate(${(Math.random() - 0.5) * 60}px, ${20 + Math.random() * 40}px) scale(0.2)`; });
        setTimeout(() => s.remove(), 700);
      }
    };
    const loop = () => {
      rx += (x - rx) * 0.15; ry += (y - ry) * 0.15;
      if (dot.current) dot.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    loop();
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="pointer-events-none hidden [@media(pointer:fine)]:block">
      <div ref={dot} className="fixed left-0 top-0 z-50 h-2 w-2 rounded-full bg-primary" />
      <div ref={ring} className={`fixed left-0 top-0 z-50 h-10 w-10 rounded-full border-2 border-primary transition-[scale,background-color] duration-200 ${big ? "scale-150 bg-primary/20" : ""}`} />
    </div>
  );
}

function Magnetic({ children, href, className }: { children: ReactNode; href: string; className: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
  };
  return (
    <a ref={ref} href={href} onMouseMove={move} onMouseLeave={() => (ref.current!.style.transform = "")}
      className={`inline-flex items-center gap-2 px-7 py-4 font-display text-lg uppercase tracking-wide transition-transform duration-200 ease-out ${className}`}>
      {children}
    </a>
  );
}

function TiltCard({ title, items, n }: { title: string; items: string[]; n: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    ref.current!.style.transform = `perspective(800px) rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 14}deg)`;
    ref.current!.style.setProperty("--x", `${px * 100}%`);
    ref.current!.style.setProperty("--y", `${py * 100}%`);
  };
  return (
    <div ref={ref} data-hover onMouseMove={move} onMouseLeave={() => (ref.current!.style.transform = "")}
      className="group relative overflow-hidden border border-border bg-card p-8 transition-transform duration-200 ease-out [background-image:radial-gradient(circle_at_var(--x,50%)_var(--y,50%),color-mix(in_oklab,var(--primary)_22%,transparent),transparent_60%)]">
      <span className="font-display text-6xl text-outline opacity-60">{n}</span>
      <h3 className="mt-4 font-display text-3xl uppercase text-primary">{title}</h3>
      <ul className="mt-6 space-y-3">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-3 font-semibold"><Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{i}</li>
        ))}
      </ul>
    </div>
  );
}

const services = [
  { n: "01", title: "Sublimation", items: ["School Uniforms", "Matric Jackets", "Sportswear", "Corporate & Medical Wear", "Traditional Wear", "Promotional T-Shirts", "Bags & Full Width Fabric"] },
  { n: "02", title: "DTF Printing", items: ["All Kinds of Apparel", "Caps & Headwear", "Bags & Accessories"] },
  { n: "03", title: "Textile Solution", items: ["Roll to Roll Printing", "End-to-End In-House Supply Chain", "Production Management"] },
];
const steps = [
  { icon: ShoppingCart, label: "Supplying Material" },
  { icon: Printer, label: "Printing" },
  { icon: Scissors, label: "Sewing" },
  { icon: Truck, label: "Delivery" },
];

function Index() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Cursor />
      {/* spotlight following mouse */}
      <div className="pointer-events-none fixed inset-0 z-0 [background:radial-gradient(500px_circle_at_var(--mx,50%)_var(--my,30%),color-mix(in_oklab,var(--secondary)_14%,transparent),transparent_70%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="#" className="font-display text-3xl tracking-wide">AFRI<span className="text-primary">PRINT</span></a>
        <nav className="hidden gap-8 font-semibold uppercase md:flex">
          <a href="#services" className="hover:text-primary">Services</a>
          <a href="#process" className="hover:text-primary">Process</a>
          <a href="#contact" className="hover:text-primary">Contact</a>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-10 lg:grid-cols-2"
        onMouseMove={(e) => setTilt({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 })}>
        <div>
          <p className="inline-block bg-primary px-3 py-1 font-display uppercase tracking-wider text-primary-foreground">Dye Sublimation • DTF • Textile</p>
          <h1 className="mt-6 font-display text-6xl uppercase leading-[0.9] md:text-8xl">
            Print it <span className="text-primary">bold.</span><br />Wear it <span className="text-secondary">loud.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">From school uniforms to sportswear, caps and corporate wear — we supply, print, sew and deliver, all in-house in Fordsburg.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Magnetic href="https://wa.me/27812335189" className="bg-primary text-primary-foreground"><Phone className="h-5 w-5" />WhatsApp Us</Magnetic>
            <Magnetic href="#services" className="border-2 border-foreground">Our Services</Magnetic>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 stripes opacity-30 [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]"
            style={{ transform: `translate(${tilt.x * -40}px, ${tilt.y * -40}px)` }} />
          <img src={hero} alt="Sublimation printed sportswear jersey and cap" width={1280} height={1280}
            className="relative transition-transform duration-300 ease-out"
            style={{ transform: `perspective(1000px) rotateY(${tilt.x * 16}deg) rotateX(${tilt.y * -16}deg) translate(${tilt.x * 20}px, ${tilt.y * 20}px)` }} />
        </div>
      </section>

      <div className="relative z-10 -rotate-2 overflow-hidden bg-primary py-4 text-primary-foreground">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-3xl uppercase">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["School Uniforms", "Matric Jackets", "Sportswear", "Caps", "Corporate Wear", "DTF Transfers", "Roll to Roll", "Bags"].map((t) => <span key={k + t}>{t} ✦</span>))}
        </div>
      </div>

      <section id="services" className="relative z-10 mx-auto max-w-7xl px-6 py-28">
        <h2 className="font-display text-5xl uppercase md:text-7xl">What we <span className="text-primary">print</span></h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">{services.map((s) => <TiltCard key={s.n} {...s} />)}</div>
      </section>

      <section id="process" className="relative z-10 border-y border-border bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-5xl uppercase md:text-7xl">End-to-end, <span className="text-secondary">in-house</span></h2>
          <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
            {steps.map(({ icon: Icon, label }, i) => (
              <div key={label} data-hover className="group text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-primary">
                  <Icon className="h-12 w-12 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <p className="mt-4 font-display text-sm text-muted-foreground">STEP {i + 1}</p>
                <p className="font-display text-xl uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative z-10 mx-auto max-w-7xl px-6 py-28">
        <div className="relative overflow-hidden bg-primary p-10 text-primary-foreground md:p-16">
          <h2 className="font-display text-5xl uppercase md:text-7xl">Let's print something.</h2>
          <div className="mt-10 grid gap-6 text-lg font-semibold md:grid-cols-3">
            <a href="https://wa.me/27812335189" className="flex items-center gap-3 hover:underline"><Phone />081 233 5189</a>
            <a href="mailto:sales@afriprintsa.com" className="flex items-center gap-3 hover:underline"><Mail />sales@afriprintsa.com</a>
            <a href="https://maps.google.com/?q=50+Clare+Rd+Fordsburg" className="flex items-center gap-3 hover:underline"><MapPin className="shrink-0" />Ground Floor, Emster Center, 50 Clare Rd, Fordsburg</a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Afriprint. Dye Sublimation • DTF • Textile Printing.
      </footer>
    </div>
  );
}
