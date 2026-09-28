import CourseWorkspace from '@/components/CourseWorkspace';

export default function Home() {
  return (
    <main className="gradient min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-xl font-black tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">C</span> ClairCours</div>
        <span className="pill bg-white text-slate-500 shadow-sm">Assistant d’apprentissage</span>
      </nav>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <div className="max-w-3xl"><p className="mb-4 font-bold uppercase tracking-[.2em] text-brand">Comprendre. Réviser. Réussir.</p><h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">Ton cours devient un <span className="text-brand">plan de réussite.</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Colle ton cours, obtiens une synthèse claire, puis teste tes connaissances avec des questions adaptées.</p></div>
        <CourseWorkspace />
      </section>
    </main>
  );
}
