import { Roboto } from "next/font/google";

export const metadata = {
  title: "PruebaBliss",
  description: "El traductor de Bliss para todos",
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function sublayout({ children }) {
  return (
    <div className={roboto.className}>
      <p>Prueba Layout</p>
      {children}
    </div>
  );
}
