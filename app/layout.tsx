import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achadinhos IA | Ofertas e Promoções",
  description: "Encontre os melhores achadinhos e ofertas da Shopee.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
