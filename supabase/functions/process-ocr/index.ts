import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, documentType } = await req.json();

    if (!imageUrl || !documentType) {
      return new Response(
        JSON.stringify({ error: "imageUrl e documentType são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    let systemPrompt = "";
    
    if (documentType === "delivery_receipt") {
      systemPrompt = `Você é um assistente especializado em extrair informações de canhotos de entrega.
Analise a imagem e extraia as seguintes informações em formato JSON:
{
  "delivery_date": "YYYY-MM-DD",
  "delivery_time": "HH:MM",
  "receiver_name": "nome do recebedor",
  "receiver_signature": "descrição da assinatura se visível",
  "observations": "observações relevantes"
}
Se algum campo não estiver visível ou legível, retorne null para esse campo.`;
    } else if (["RG", "CPF", "CNH"].includes(documentType)) {
      systemPrompt = `Você é um assistente especializado em extrair informações de documentos brasileiros.
Analise a imagem do documento (${documentType}) e extraia as seguintes informações em formato JSON:
{
  "document_number": "número do documento",
  "issue_date": "YYYY-MM-DD",
  "expiry_date": "YYYY-MM-DD",
  "issuing_agency": "órgão emissor"
}
Se algum campo não estiver visível ou legível, retorne null para esse campo.`;
    } else {
      return new Response(
        JSON.stringify({ error: "Tipo de documento inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processando OCR para:", documentType);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Por favor, extraia as informações deste documento:",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na API Lovable AI:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente mais tarde." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao seu workspace Lovable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Resposta inválida da API");
    }

    // Tentar extrair JSON da resposta
    let extractedData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        extractedData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      extractedData = { raw_content: content };
    }

    console.log("OCR processado com sucesso");

    return new Response(
      JSON.stringify({
        success: true,
        data: extractedData,
        raw_response: content,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro no process-ocr:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
