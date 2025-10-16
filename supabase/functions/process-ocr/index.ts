import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { imageUrl, documentType } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "imageUrl is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Definir prompts específicos por tipo de documento
    const prompts = {
      canhoto: `Analise esta imagem de canhoto de entrega e extraia as seguintes informações em formato JSON:
        - delivery_date: Data de entrega (formato YYYY-MM-DD)
        - delivery_time: Hora de entrega (formato HH:MM)
        - receiver_name: Nome de quem recebeu
        - receiver_signature: Indicar se tem assinatura (sim/não)
        - observations: Quaisquer observações anotadas
        
        Retorne APENAS o JSON, sem texto adicional.`,
      
      RG: `Analise esta imagem de RG e extraia as seguintes informações em formato JSON:
        - document_number: Número do RG
        - issue_date: Data de emissão (formato YYYY-MM-DD)
        - issuing_agency: Órgão emissor
        - holder_name: Nome do titular
        
        Retorne APENAS o JSON, sem texto adicional.`,
      
      CPF: `Analise esta imagem de CPF e extraia as seguintes informações em formato JSON:
        - document_number: Número do CPF
        - issue_date: Data de emissão (formato YYYY-MM-DD)
        - holder_name: Nome do titular
        
        Retorne APENAS o JSON, sem texto adicional.`,
      
      CNH: `Analise esta imagem de CNH e extraia as seguintes informações em formato JSON:
        - document_number: Número da CNH
        - issue_date: Data de emissão (formato YYYY-MM-DD)
        - expiry_date: Data de validade (formato YYYY-MM-DD)
        - issuing_agency: Órgão emissor
        - holder_name: Nome do titular
        - category: Categoria da CNH
        
        Retorne APENAS o JSON, sem texto adicional.`
    };

    const prompt = prompts[documentType as keyof typeof prompts] || prompts.canhoto;

    console.log(`Processing OCR for ${documentType}`);

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
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const extractedText = data.choices[0].message.content;

    console.log("OCR Result:", extractedText);

    // Tentar parsear o JSON extraído
    let parsedData;
    try {
      // Remover markdown code blocks se existirem
      const cleanText = extractedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      parsedData = { raw_text: extractedText };
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: parsedData,
        raw_text: extractedText
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in process-ocr function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});