import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SPECIES } from "@/lib/species";

export const runtime = "edge";

const SYSTEM = `Eres "Guía del bosque", el asistente de FungiPath, una app de micología predictiva.
Hablas en español, en lenguaje llano y cálido, sin jerga técnica innecesaria.
REGLAS DE SEGURIDAD INNEGOCIABLES:
- NUNCA autorices el consumo de una seta. Nunca digas "cómelo" o "es seguro comerlo".
- Ante cualquier duda de identificación, recomienda SIEMPRE consultar a un micólogo o experto local presencial.
- Si una especie es tóxica o mortal, dilo de forma clara y rotunda, y advierte de sus sosias.
- Recuerda que una foto o descripción no basta para identificar con seguridad.
Ayudas con: dónde y cuándo buscar, cómo cosechar sin dañar el micelio, identificación educativa,
interpretación de las predicciones, y consejos de campo. Eres conciso y práctico.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Falta ANTHROPIC_API_KEY" }, { status: 500 });

    const anthropic = new Anthropic({ apiKey });

    // contexto opcional: hotspots del usuario, especie consultada, etc.
    const ctx = context
      ? `\n\nContexto actual del usuario:\n${JSON.stringify(context).slice(0, 2000)}`
      : "";
    const speciesList = SPECIES.map((s) => `${s.n} (${s.com}) — ${s.edib}`).join("\n");

    const resp = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: SYSTEM + ctx + `\n\nEspecies en catálogo:\n${speciesList}`,
      messages: messages,
    });

    const text = resp.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n");

    return NextResponse.json({ reply: text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
