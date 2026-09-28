import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

const schema = z.object({ course: z.string().min(40).max(100000), level: z.string().optional() });
const outputShape = { type: 'json_object' as const };

function localSummary(course: string) {
  const sentences = course.split(/(?<=[.!?])\s+/).filter(Boolean);
  const points = sentences.slice(0, 5).map(s => s.replace(/^[-•]\s*/, '').trim());
  return { title: 'Synthèse de ton cours', summary: sentences.slice(0, 3).join(' ') || course.slice(0, 400), keyPoints: points.length ? points : [course.slice(0, 220)], questions: [{ question: 'Quelle est l’idée principale de ce cours ?', options: [points[0] || 'La première notion présentée', 'Un sujet sans rapport', 'Une conclusion absente', 'Aucune idée importante'], answer: 0, explanation: 'La première notion résume le point de départ du contenu fourni.' }, { question: 'Quel élément est explicitement abordé dans le cours ?', options: [points[1] || 'Une notion clé', 'Une information non présente', 'Un exemple impossible', 'Aucune définition'], answer: 0, explanation: 'Cette réponse reprend une notion présente dans le texte.' }] };
}

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Le cours doit contenir entre 40 et 100 000 caractères.' }, { status: 400 });
    const { course, level = 'Université' } = parsed.data;
    if (!process.env.OPENAI_API_KEY) return NextResponse.json(localSummary(course));
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', response_format: outputShape, temperature: 0.3, messages: [{ role: 'system', content: `Tu es un professeur pédagogue. Réponds exclusivement en français et en JSON valide avec les clés title (string), summary (string de 100-180 mots), keyPoints (tableau de 4-6 strings), questions (tableau de 5 objets avec question, options [4 strings], answer (index 0-3), explanation). Adapte le niveau au niveau ${level}. Ne fabrique aucune information absente du cours.` }, { role: 'user', content: `Voici le cours à analyser :\n\n${course}` }] });
    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('Réponse IA vide');
    return NextResponse.json(JSON.parse(content));
  } catch (error) { console.error('summarize_error', error); return NextResponse.json({ error: 'Le traitement a échoué. Vérifie le contenu puis réessaie.' }, { status: 500 }); }
}
