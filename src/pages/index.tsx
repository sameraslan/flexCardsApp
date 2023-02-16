import Seo from "@/components/Seo";
import Layout from "@/layouts/Layout";
import Features from "@/views/index/Features";
import Hero from "@/views/index/Hero";
import Testimonials from "@/views/index/Testimonials";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
    </Layout>
  );
}
