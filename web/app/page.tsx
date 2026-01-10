import Features from "@/components/Features";
import Hero from "@/components/Hero";
import ProblemState from "@/components/problemState";


export default function Home() {
  return (
    <div className="dark:bg-[#050505]">

      <Hero />
      <ProblemState />
      <Features />

    </div>
  );
}
