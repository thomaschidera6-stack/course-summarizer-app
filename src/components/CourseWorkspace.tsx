'use client';

import { useMemo, useState } from 'react';

type QuizQuestion = { question: string; options: string[]; answer: number; explanation: string };
type Result = { title: string; summary: string; keyPoints: string[]; questions: QuizQuestion[] };

const demoText = `La photosynthèse est le processus par lequel les plantes vertes transforment l'énergie lumineuse en énergie chimique. Elle se déroule principalement dans les chloroplastes. Le dioxyde de carbone et l'eau sont transformés en glucose et en dioxygène grâce à la lumière. La chlorophylle capte cette lumière. Ce mécanisme est essentiel à la vie car il produit de l'oxygène et constitue la base de nombreuses chaînes alimentaires.`;

export default function CourseWorkspace() {
  const [course, setCourse] = useState('');
  const [level, setLevel] = useState('Université');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const wordCount = useMemo(() => course.trim() ? course.trim().split(/\s+/).length : 0, [course]);

  async function summarize() {
    if (course.trim().length < 40) { setError('Ajoute au moins 40 caractères pour obtenir un résultat.'); return; }
    setLoading(true); setError(''); setResult(null); setScore(null);
    try {
      const response = await fetch('/api/summarize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ course, level }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Une erreur est survenue.');
      setResult(data);
    } catch (e) { setError(e instanceof Error ? e.message : 'Impossible de traiter le cours.'); }
    finally { setLoading(false); }
  }

  function evaluate() { if (!result) return; setScore(result.questions.reduce((total, q, i) => total + (selected[i] === q.answer ? 1 : 0), 0)); }

  return <div className="mt-14 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
    <section className="card p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-black">Ton cours</h2><p className="mt-1 text-sm text-slate-500">Colle le contenu à analyser</p></div><span className="pill bg-mint text-emerald-700">Étape 1</span></div>
      <textarea value={course} onChange={e => setCourse(e.target.value)} placeholder="Colle ici ton cours, tes notes ou un chapitre entier..." className="h-80 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 leading-7 outline-none transition focus:border-brand focus:ring-4 focus:ring-indigo-100" />
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400"><span>{wordCount} mot{wordCount > 1 ? 's' : ''}</span><button onClick={() => setCourse(demoText)} className="font-bold text-brand hover:underline">Charger un exemple</button></div>
      <div className="mt-6 flex items-center gap-3"><label className="text-sm font-bold">Niveau</label><select value={level} onChange={e => setLevel(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option>Lycée</option><option>Université</option><option>Professionnel</option><option>Expert</option></select></div>
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button onClick={summarize} disabled={loading} className="mt-7 w-full rounded-2xl bg-brand px-5 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">{loading ? 'Analyse en cours...' : 'Générer mon résumé →'}</button>
    </section>
    <section className="card min-h-[500px] p-6 md:p-8">
      {!result && !loading && <div className="grid h-full place-items-center text-center"><div><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-3xl">✦</div><h2 className="text-xl font-black">Ton espace de révision</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Ton résumé structuré et tes questions interactives apparaîtront ici.</p></div></div>}
      {loading && <div className="grid h-full place-items-center text-center"><div><div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-brand" /><p className="font-bold">Lecture et synthèse du cours...</p><p className="mt-2 text-sm text-slate-500">Création de questions pédagogiques</p></div></div>}
      {result && <div><div className="flex items-center justify-between"><div><span className="pill bg-indigo-50 text-brand">Résumé généré</span><h2 className="mt-3 text-2xl font-black">{result.title}</h2></div>{score !== null && <div className="rounded-2xl bg-mint px-4 py-3 text-center"><b className="block text-2xl text-emerald-700">{score}/{result.questions.length}</b><small className="text-emerald-700">Résultat</small></div>}</div><p className="mt-5 leading-7 text-slate-600">{result.summary}</p><h3 className="mt-7 font-black">À retenir</h3><ul className="mt-3 space-y-3">{result.keyPoints.map((point, i) => <li key={i} className="flex gap-3 text-sm leading-6 text-slate-600"><span className="mt-1 text-brand">●</span>{point}</li>)}</ul><div className="my-8 h-px bg-slate-100" /><div className="flex items-center justify-between"><h3 className="font-black">Quiz de compréhension</h3><span className="text-sm text-slate-500">{result.questions.length} questions</span></div><div className="mt-4 space-y-5">{result.questions.map((q, i) => <div key={i} className="rounded-2xl bg-slate-50 p-4"><p className="font-bold">{i + 1}. {q.question}</p><div className="mt-3 grid gap-2">{q.options.map((option, j) => <button key={j} onClick={() => setSelected({ ...selected, [i]: j })} className={`rounded-xl border p-3 text-left text-sm transition ${selected[i] === j ? 'border-brand bg-indigo-50 text-brand' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>{option}</button>)}</div>{score !== null && <p className={`mt-3 text-sm ${selected[i] === q.answer ? 'text-emerald-600' : 'text-red-600'}`}>{selected[i] === q.answer ? '✓ Bonne réponse — ' : '✗ À revoir — '}{q.explanation}</p>}</div>)}</div><button onClick={evaluate} className="mt-6 w-full rounded-2xl border-2 border-brand py-3 font-bold text-brand hover:bg-indigo-50">Valider mes réponses</button></div>}
    </section>
  </div>;
}
