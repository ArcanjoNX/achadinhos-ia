
"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Oferta = {
  id: number;
  nome: string;
  preco: number;
  preco_original?: number | null;
  desconto: number;
  vendas: number;
  imagem: string;
  link_afiliado: string;
  categoria: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const money = (value: number) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function Home() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [selecionado, setSelecionado] = useState<Oferta | null>(null);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [mostrarBoasVindas, setMostrarBoasVindas] = useState(true);

  useEffect(() => {
    async function carregar() {
      if (!supabaseUrl || !supabaseKey) {
        setErro(true);
        setCarregando(false);
        return;
      }

      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
          .from("ofertas")
          .select("*")
          .eq("ativo", true)
          .order("criado_em", { ascending: false });

        if (error) throw error;

        setOfertas((data || []) as Oferta[]);
      } catch {
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  const categorias = useMemo(
    () => [
      "Todas",
      ...Array.from(
        new Set(ofertas.map((p) => p.categoria || "Ofertas"))
      ),
    ],
    [ofertas]
  );

  const filtradas = ofertas.filter((p) => {
    const nome = (p.nome || "").toLowerCase();
    const correspondeBusca = nome.includes(busca.toLowerCase());
    const correspondeCategoria =
      categoria === "Todas" ||
      (p.categoria || "Ofertas") === categoria;

    return correspondeBusca && correspondeCategoria;
  });

  function alternarFavorito(id: number) {
    setFavoritos((atual) =>
      atual.includes(id)
        ? atual.filter((item) => item !== id)
        : [...atual, id]
    );
  }

  return (
    <main className="site">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #050908;
          color: #f4f8f6;
          font-family: Arial, Helvetica, sans-serif;
        }

        button,
        input {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .site {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% -15%, #174b35 0%, transparent 42%),
            radial-gradient(ellipse at 100% 45%, #10251c 0%, transparent 35%),
            #050908;
        }

        .container {
          width: min(1180px, 92%);
          margin: auto;
        }

        .topbar {
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #ffffff12;
        }

        .logo {
          font-size: 23px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .logo span {
          color: #37efa4;
        }

        .status {
          color: #8ba99a;
          font-size: 11px;
          letter-spacing: 1.5px;
        }

        .status i {
          display: inline-block;
          width: 7px;
          height: 7px;
          margin-right: 7px;
          border-radius: 50%;
          background: #36efa2;
          box-shadow: 0 0 12px #36efa2;
        }

        .hero {
          text-align: center;
          padding: 90px 15px 70px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #28694b;
          background: #0b241a;
          color: #5af4b1;
          padding: 10px 17px;
          border-radius: 50px;
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 1.5px;
        }

        .hero h1 {
          font-size: clamp(39px, 7vw, 76px);
          line-height: 1.02;
          letter-spacing: -4px;
          margin: 27px 0 20px;
        }

        .hero h1 span {
          color: #35eca0;
          text-shadow: 0 0 35px #16d98a55;
        }

        .hero p {
          color: #9aada4;
          font-size: 15px;
          line-height: 1.8;
          max-width: 560px;
          margin: auto;
        }

        .search-wrap {
          max-width: 620px;
          margin: 35px auto 0;
          position: relative;
        }

        .search-wrap input {
          width: 100%;
          padding: 19px 22px 19px 52px;
          background: #101a15;
          color: white;
          border: 1px solid #294238;
          border-radius: 14px;
          outline: none;
          transition: .25s;
          font-size: 14px;
        }

        .search-wrap input:focus {
          border-color: #35eca0;
          box-shadow: 0 0 25px #20e99a20;
        }

        .search-icon {
          position: absolute;
          left: 19px;
          top: 16px;
          font-size: 21px;
          color: #38e9a1;
        }

        .benefits {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 25px;
          margin-top: 28px;
          color: #91a69b;
          font-size: 12px;
        }

        .benefits span::before {
          content: "✓";
          color: #29e99a;
          margin-right: 7px;
          font-weight: bold;
        }

        .catalog {
          padding: 25px 0 90px;
        }

        .section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 25px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 27px;
          letter-spacing: -1px;
        }

        .section-heading p {
          color: #84978d;
          font-size: 13px;
          margin: 8px 0 0;
        }

        .count {
          color: #42eaa3;
          font-size: 12px;
          background: #10291e;
          padding: 9px 13px;
          border-radius: 30px;
          white-space: nowrap;
        }

        .categories {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px 0 25px;
          scrollbar-width: none;
        }

        .categories::-webkit-scrollbar {
          display: none;
        }

        .category {
          border: 1px solid #263b32;
          color: #a6b8ae;
          background: #101714;
          padding: 11px 19px;
          border-radius: 30px;
          font-size: 12px;
          white-space: nowrap;
          transition: .2s;
        }

        .category:hover,
        .category.active {
          color: #04150d;
          background: #2be99b;
          border-color: #2be99b;
          box-shadow: 0 0 20px #2be99a30;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .product {
          background: linear-gradient(145deg, #151f1a, #0b110e);
          border: 1px solid #26372e;
          border-radius: 17px;
          overflow: hidden;
          transition: transform .25s, border-color .25s, box-shadow .25s;
          animation: appear .5s ease both;
          min-width: 0;
        }

        .product:hover {
          transform: translateY(-7px);
          border-color: #2be99a;
          box-shadow: 0 15px 35px #0008, 0 0 20px #20e99a12;
        }

        .product-image {
          height: 215px;
          background: #f5f6f5;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform .4s;
        }

        .product:hover .product-image img {
          transform: scale(1.07);
        }

        .discount {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #20d989;
          color: #04170d;
          font-size: 11px;
          font-weight: 900;
          padding: 7px 10px;
          border-radius: 7px;
        }

        .heart {
          position: absolute;
          top: 10px;
          right: 10px;
          border: 0;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          background: #07120dbd;
          color: white;
          font-size: 18px;
          transition: .2s;
        }

        .heart.active {
          color: #ff6684;
          background: #30131e;
        }

        .product-info {
          padding: 16px;
        }

        .product-category {
          color: #42eaa3;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: bold;
        }

        .product-name {
          font-size: 13px;
          line-height: 1.5;
          height: 59px;
          overflow: hidden;
          color: #e5eee8;
          margin: 10px 0 13px;
          cursor: pointer;
        }

        .price {
          color: #39efa3;
          font-size: 23px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .old-price {
          color: #718078;
          text-decoration: line-through;
          font-size: 11px;
          margin-left: 7px;
        }

        .details-button {
          width: 100%;
          margin-top: 15px;
          padding: 12px;
          border: 1px solid #286a4c;
          border-radius: 9px;
          background: #10251a;
          color: #47efa8;
          font-size: 11px;
          font-weight: 900;
          transition: .2s;
        }

        .details-button:hover {
          background: #29e99a;
          color: #04150d;
        }

        .empty {
          text-align: center;
          padding: 65px 20px;
          background: #101713;
          border: 1px solid #26372e;
          border-radius: 18px;
          color: #9bada3;
        }

        .empty-icon {
          font-size: 42px;
          margin-bottom: 15px;
        }

        .empty h3 {
          color: white;
          font-size: 20px;
        }

        .loading {
          text-align: center;
          padding: 65px 20px;
          color: #42eaa3;
        }

        .footer {
          border-top: 1px solid #ffffff12;
          padding: 30px 0;
          text-align: center;
          color: #718078;
          font-size: 12px;
        }

        .modal-bg {
          position: fixed;
          inset: 0;
          z-index: 30;
          background: #000d;
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          animation: appear .25s ease;
        }

        .welcome-modal {
          width: min(570px, 100%);
          max-height: 92vh;
          overflow-y: auto;
          position: relative;
          padding: 38px;
          border: 1px solid #347653;
          border-radius: 24px;
          background:
            radial-gradient(ellipse at 50% 0%, #17452f 0%, transparent 55%),
            linear-gradient(145deg, #111d16, #080e0b);
          box-shadow: 0 25px 100px #000c, 0 0 45px #24e99512;
          text-align: center;
        }

        .welcome-symbol {
          width: 62px;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 1px solid #3a9d6c;
          border-radius: 19px;
          background: #123723;
          color: #54f4ad;
          font-size: 29px;
          box-shadow: 0 0 30px #2be99a22;
        }

        .welcome-label {
          color: #58e9a9;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .welcome-modal h2 {
          margin: 10px 0 12px;
          font-size: clamp(35px, 8vw, 48px);
          line-height: 1;
          letter-spacing: -2px;
          color: #ffffff;
        }

        .welcome-modal h2 span {
          color: #39efa3;
        }

        .welcome-intro {
          color: #b2c3b9;
          font-size: 14px;
          line-height: 1.7;
          margin: 0 auto 25px;
          max-width: 420px;
        }

        .welcome-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #3c7858, transparent);
          margin: 23px 0;
        }

        .welcome-section {
          text-align: left;
          padding: 15px 16px;
          margin-bottom: 11px;
          border: 1px solid #ffffff12;
          border-radius: 13px;
          background: #ffffff06;
        }

        .welcome-section h3 {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0 0 7px;
          color: #e9fff2;
          font-size: 13px;
        }

        .welcome-section h3 span {
          color: #48eca5;
          font-size: 17px;
        }

        .welcome-section p {
          color: #9aada3;
          font-size: 12px;
          line-height: 1.65;
          margin: 0;
        }

        .welcome-time {
          color: #4df0a8 !important;
          font-weight: 900;
        }

        .welcome-warning {
          border-color: #725d2b;
          background: #382d131f;
        }

        .welcome-warning h3 span {
          color: #ffd16a;
        }

        .welcome-warning p {
          color: #c4b99b;
        }

        .welcome-ok {
          width: 100%;
          border: 0;
          border-radius: 12px;
          padding: 16px;
          margin-top: 13px;
          background: linear-gradient(100deg, #39efa3, #19c77d);
          color: #03170c;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 1px;
          box-shadow: 0 8px 25px #20e99a25;
          transition: .2s;
        }

        .welcome-ok:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px #20e99a45;
        }

        .modal {
          width: min(760px, 100%);
          background: #111a15;
          border: 1px solid #32664c;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 80px #000a;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .modal-image {
          background: white;
          min-height: 330px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-image img {
          width: 100%;
          height: 100%;
          max-height: 430px;
          object-fit: contain;
        }

        .modal-info {
          padding: 35px 25px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .modal-info h2 {
          font-size: 19px;
          line-height: 1.5;
        }

        .modal-price {
          font-size: 32px;
          font-weight: 900;
          color: #39efa3;
          margin: 15px 0;
        }

        .buy-button {
          display: block;
          text-align: center;
          text-decoration: none;
          background: #2be99a;
          color: #03160c;
          padding: 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 900;
          margin-top: 15px;
          transition: .2s;
        }

        .buy-button:hover {
          transform: scale(1.03);
          box-shadow: 0 0 25px #2be99a55;
        }

        .close {
          position: absolute;
          right: 12px;
          top: 12px;
          z-index: 2;
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 50%;
          color: white;
          background: #15251c;
          font-size: 20px;
        }

        @keyframes appear {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 950px) {
          .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .topbar {
            height: 65px;
          }

          .logo {
            font-size: 20px;
          }

          .status {
            font-size: 8px;
            letter-spacing: .7px;
          }

          .hero {
            padding: 65px 5px 45px;
          }

          .hero h1 {
            letter-spacing: -2px;
          }

          .hero p {
            font-size: 13px;
          }

          .benefits {
            gap: 12px;
            font-size: 10px;
          }

          .catalog {
            padding-top: 15px;
          }

          .section-heading h2 {
            font-size: 22px;
          }

          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 11px;
          }

          .product {
            border-radius: 13px;
          }

          .product-image {
            height: 155px;
          }

          .product-info {
            padding: 11px;
          }

          .product-name {
            font-size: 11px;
            height: 52px;
          }

          .price {
            font-size: 19px;
          }

          .old-price {
            display: block;
            margin: 5px 0 0;
          }

          .details-button {
            padding: 11px 5px;
            font-size: 10px;
          }

          .welcome-modal {
            padding: 27px 20px;
            border-radius: 19px;
          }

          .welcome-symbol {
            width: 53px;
            height: 53px;
            margin-bottom: 17px;
          }

          .welcome-section {
            padding: 13px;
          }

          .welcome-section p {
            font-size: 11px;
          }

          .modal {
            grid-template-columns: 1fr;
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-image {
            min-height: 210px;
            height: 230px;
          }

          .modal-image img {
            max-height: 230px;
          }

          .modal-info {
            padding: 20px;
          }

          .modal-info h2 {
            font-size: 15px;
          }

          .modal-price {
            font-size: 27px;
          }
        }
      `}</style>

      <div className="container">
        <header className="topbar">
          <div className="logo">
            ACHADINHOS<span> IA</span>
          </div>

          <div className="status">
            <i />
            OFERTAS INTELIGENTES
          </div>
        </header>

        <section className="hero">
          <div className="eyebrow">
            ✦ SEU PRÓXIMO ACHADINHO ESTÁ AQUI
          </div>

          <h1>
            Comprar melhor.
            <br />
            <span>Economizar mais.</span>
          </h1>

          <p>
            Descubra produtos incríveis, encontre ofertas selecionadas
            e aproveite oportunidades sem perder tempo procurando.
          </p>

          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="O que você está procurando?"
            />
          </div>

          <div className="benefits">
            <span>Ofertas selecionadas</span>
            <span>Acesso à Shopee</span>
            <span>Novidades free;
          border-radius: 18px;
          color: #9bada3;
        }

        .empty-icon {
          font-size: 42px;
          margin-bottom: 15px;
        }

        .empty h3 {
          color: white;
          font-size: 20px;
        }

        .loading {
          text-align: center;
          padding: 65px 20px;
          color: #42eaa3;
        }

        .footer {
          border-top: 1px solid #ffffff12;
          padding: 30px 0;
          text-align: center;
          color: #718078;
          font-size: 12px;
        }

        .modal-bg {
          position: fixed;
          inset: 0;
          z-index: 20;
          background: #000c;
          backdrop-filter: blur(9px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          animation: appear .2s ease;
        }

        .modal {
          width: min(760px, 100%);
          background: #111a15;
          border: 1px solid #32664c;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 80px #000a;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .modal-image {
          background: white;
          min-height: 330px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-image img {
          width: 100%;
          height: 100%;
          max-height: 430px;
          object-fit: contain;
        }

        .modal-info {
          padding: 35px 25px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .modal-info h2 {
          font-size: 19px;
          line-height: 1.5;
        }

        .modal-price {
          font-size: 32px;
          font-weight: 900;
          color: #39efa3;
          margin: 15px 0;
        }

        .buy-button {
          display: block;
          text-align: center;
          text-decoration: none;
          background: #2be99a;
          color: #03160c;
          padding: 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 900;
          margin-top: 15px;
          transition: .2s;
        }

        .buy-button:hover {
          transform: scale(1.03);
          box-shadow: 0 0 25px #2be99a55;
        }

        .close {
          position: absolute;
          right: 12px;
          top: 12px;
          z-index: 2;
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 50%;
          color: white;
          background: #15251c;
          font-size: 20px;
        }

        @keyframes appear {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 950px) {
          .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .topbar {
            height: 65px;
          }

          .logo {
            font-size: 20px;
          }

          .status {
            font-size: 9px;
          }

          .hero {
            padding: 65px 5px 45px;
          }

          .hero h1 {
            letter-spacing: -2px;
          }

          .hero p {
            font-size: 13px;
          }

          .benefits {
            gap: 12px;
            font-size: 10px;
          }

          .catalog {
            padding-top: 15px;
          }

          .section-heading h2 {
            font-size: 22px;
          }

          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 11px;
          }

          .product {
            border-radius: 13px;
          }

          .product-image {
            height: 155px;
          }

          .product-info {
            padding: 11px;
          }

          .product-name {
            font-size: 11px;
            height: 52px;
          }

          .price {
            font-size: 19px;
          }

          .old-price {
            display: block;
            margin: 5px 0 0;
          }

          .details-button {
            padding: 11px 5px;
            font-size: 10px;
          }

          .modal {
            grid-template-columns: 1fr;
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-image {
            min-height: 210px;
            height: 230px;
          }

          .modal-image img {
            max-height: 230px;
          }

          .modal-info {
            padding: 20px;
          }

          .modal-info h2 {
            font-size: 15px;
          }

          .modal-price {
            font-size: 27px;
          }
        }
      `}</style>

      <div className="container">
        <header className="topbar">
          <div className="logo">
            ACHADINHOS<span> IA</span>
          </div>
          <div className="status">● OFERTAS INTELIGENTES</div>
        </header>

        <section className="hero">
          <div className="eyebrow">✦ SEU PRÓXIMO ACHADINHO ESTÁ AQUI</div>

          <h1>
            Comprar melhor.
            <br />
            <span>Economizar mais.</span>
          </h1>

          <p>
            Descubra produtos incríveis, encontre ofertas selecionadas
            e aproveite oportunidades sem perder tempo procurando.
          </p>

          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="O que você está procurando?"
            />
          </div>

          <div className="benefits">
            <span>Ofertas selecionadas</span>
            <span>Compra segura na Shopee</span>
            <span>Novidades frequentes</span>
          </div>
        </section>

        <section className="catalog">
          <div className="section-heading">
            <div>
              <h2>Explore os achadinhos</h2>
              <p>Produtos selecionados para você.</p>
            </div>

            <div className="count">
              {filtradas.length} produtos
            </div>
          </div>

          <div className="categories">
            {categorias.map((c) => (
              <button
                key={c}
                className={`category ${categoria === c ? "active" : ""}`}
                onClick={() => setCategoria(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {carregando ? (
            <div className="loading">✦ Carregando achadinhos...</div>
          ) : erro ? (
            <div className="empty">
              <div className="empty-icon">⚠️</div>
              <h3>Não foi possível carregar as ofertas</h3>
              <p>Verifique a conexão com o banco de dados.</p>
            </div>
          ) : filtradas.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">⌕</div>
              <h3>Nenhum produto encontrado</h3>
              <p>
                {busca
                  ? "Tente pesquisar usando outro nome."
                  : "As próximas ofertas aparecerão aqui."}
              </p>
            </div>
          ) : (
            <div className="grid">
              {filtradas.map((p) => (
                <article className="product" key={p.id}>
                  <div
                    className="product-image"
                    onClick={() => setSelecionado(p)}
                  >
                    <img src={p.imagem} alt={p.nome} loading="lazy" />

                    {p.desconto > 0 && (
                      <span className="discount">
                        {p.desconto}% OFF
                      </span>
                    )}

                    <button
                      className={`heart ${
                        favoritos.includes(p.id) ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        alternarFavorito(p.id);
                      }}
                      aria-label="Favoritar produto"
                    >
                      {favoritos.includes(p.id) ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="product-info">
                    <div className="product-category">
                      {p.categoria || "Ofertas"}
                    </div>

                    <div
                      className="product-name"
                      onClick={() => setSelecionado(p)}
                    >
                      {p.nome}
                    </div>

                    <div>
                      <span className="price">{money(p.preco)}</span>
                      {p.preco_original &&
                        p.preco_original > p.preco && (
                          <span className="old-price">
                            {money(p.preco_original)}
                          </span>
                        )}
                    </div>

                    <button
                      className="details-button"
                      onClick={() => setSelecionado(p)}
                    >
                      VER PRODUTO ↗
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          ACHADINHOS IA © 2026 · Encontre. Escolha. Economize.
        </footer>
      </div>

      {selecionado && (
        <div
          className="modal-bg"
          onClick={() => setSelecionado(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            
            <button
              className="close"
              onClick={() => setSelecionado(null)}
            >
              ×
            </button>

            <div className="modal-image">
              <img
                src={selecionado.imagem}
                alt={selecionado.nome}
              />
            </div>

            <div className="modal-info">
              <div className="product-category">
                {selecionado.categoria || "Ofertas"}
              </div>

              <h2>{selecionado.nome}</h2>

              <div className="modal-price">
                {money(selecionado.preco)}
              </div>

              {selecionado.vendas > 0 && (
                <p style={{ color: "#91a69b", fontSize: 12 }}>
                  {selecionado.vendas.toLocaleString("pt-BR")} vendas informadas
                </p>
              )}

              <a
                className="buy-button"
                href={selecionado.link_afiliado}
                target="_blank"
                rel="noopener noreferrer"
              >
                COMPRAR NA SHOPEE ↗
              </a>

              <p style={{ color: "#718078", fontSize: 10, lineHeight: 1.5 }}>
                Você será direcionado à Shopee para conferir o produto,
                o preço e as condições de compra.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

     
