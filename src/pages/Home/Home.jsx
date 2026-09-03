import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories"
import FeaturedProducts from "../../components/home/FeaturedProducts";
import Promotions from "../../components/home/Promotions";
import Seo from "../../components/seo/Seo";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Seo
        title="Trinity Party & Events | Artículos para Fiestas"
        description="Decoraciones, regalos, cotillones y artículos para fiestas y celebraciones inolvidables."
      />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Promotions />
    </main>
  );
}
