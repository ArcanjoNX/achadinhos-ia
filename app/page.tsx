
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Oferta = {
  id: number;
  nome: string;
  preco: number;
  desconto: number;
  imagem: string;
  link_afiliado: string;
  categoria: string;
};

export default function Home() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from("ofertas")
        .select("*")
        .eq("ativo", true)
        .order("criado_em", { ascending: false });

      if (!error && data) setOfertas(data);
      setCarregando(false);
    }

    carregar();
  }, []);

  const categorias = [
    "Todas",
    ...Array.from(new Set(ofertas.map((p) => p.categoria || "Ofertas"))),
  ];

  const filtradas = ofertas.filter((p) => {
    const correspondeBusca = p.nome
      .toLowerCase()
      .includes(busca.toLowerCase());

    const correspondeCategoria =
      categoria === "Todas" || p.categoria === categoria;

    return correspondeBusca && correspondeCategoria;
  });

  return (
    <main style={{ background: "#080b10", minHeight: "100vh", color: "white", fontFamily: "Arial, sans-serif" }}>
      <header style={{ padding: "22px 6%", borderBottom: "1px solid #202733", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#00e68a", fontSize: 25, margin: 0 }}>
          ACHADINHOS<span style={{ color: "white" }}> IA</span>
        </h1>
        <span style={{ color: "#00e68a", fontSize: 13 }}>OFERTAS INTELIGENTES</span>
      </header>

      <section style={{ padding: "55px 6%", background: "linear-gradient(120deg,#10251e,#080b10)" }}>
        <p style={{ color: "#00e68a", fontWeight: "bold" }}>ECONOMIZE NAS SUAS COMPRAS</p>
        <h2 style={{ fontSize: "clamp(30px,5vw,48px)", margin: "12px 0" }}>
          Os melhores achadinhos<br />em um só lugar.
        </h2>
        <p style={{ color: "#aab3c0" }}>
          Ofertas selecionadas diretamente da Shopee.
        </p>

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar produtos..."
          style={{ width: "100%", maxWidth: 500, padding: 16, borderRadius: 10, border: "1px solid #344238", background: "#111820", color: "white", fontSize: 16, marginTop: 15 }}
        />
      </section>

      <section style={{ padding: "30px 6%" }}>
        <h2 style={{ fontSize: 23 }}>Explore as ofertas</h2>

        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "12px 0 25px" }}>
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              style={{ padding: "10px 18px", borderRadius: 30, border: "1px solid #00b879", background: categoria === c ? "#00b879" : "#111820", color: "white", whiteSpace: "nowrap", cursor: "pointer" }}
            >
              {c}
            </button>
          ))}
        </div>

        {carregando ? (
          <p>Carregando ofertas...</p>
        ) : filtradas.length === 0 ? (
          <p style={{ color: "#aab3c0" }}>Nenhuma oferta encontrada.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 18 }}>
            {filtradas.map((p) => (
              <article key={p.id} style={{ background: "#131a23", border: "1px solid #26313d", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ background: "white", height: 190, position: "relative" }}>
                  <img src={p.imagem} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  {p.desconto > 0 && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#00b879", color: "#00170e", padding: "6px 9px", borderRadius: 6, fontWeight: "bold", fontSize: 12 }}>
                      {p.desconto}% OFF
                    </span>
                  )}
                </div>

                <div style={{ padding: 14 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.4, minHeight: 58 }}>
                    {p.nome}
                  </p>
                  <strong style={{ fontSize: 22, color: "#00e68a" }}>
                    R$ {Number(p.preco).toFixed(2).replace(".", ",")}
                  </strong>

                  <a
                    href={p.link_afiliado}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", textAlign: "center", background: "#00b879", color: "#00170e", padding: 12, borderRadius: 8, fontWeight: "bold", textDecoration: "none", marginTop: 15 }}
                  >
                    COMPRAR NA SHOPEE
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer style={{ textAlign: "center", padding: 30, color: "#77818e", borderTop: "1px solid #202733", fontSize: 13 }}>
        Achadinhos IA © 2026 · Ofertas atualizadas automaticamente.
      </footer>
    </main>
  );
      }

