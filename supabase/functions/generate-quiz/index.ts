import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { 
      classLevel, 
      subject, 
      chapters, 
      chapter, 
      difficulty = 'medium', 
      questionCount = 10,
      class: classFromBody 
    } = body;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Handle both 'class' and 'classLevel' parameters
    const selectedClass = classLevel || classFromBody || "Class 10";
    
    // Handle both 'chapters' (array) and 'chapter' (string) parameters
    const chaptersText = chapters ? chapters.join(", ") : (chapter || "General");
    
    const difficultyDescriptions: Record<string, string> = {
      easy: "simple and straightforward, focusing on basic recall and fundamental concepts. Use simple language appropriate for beginners.",
      medium: "moderately challenging, requiring understanding and application of concepts. Include some analytical thinking.",
      hard: "challenging and complex, requiring critical thinking, analysis, and deeper understanding. Include multi-step problems and application-based questions."
    };

    const difficultyInstruction = difficultyDescriptions[difficulty] || difficultyDescriptions.medium;
    
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
            content: `You are an educational quiz generator for Indian school curriculum (NCERT). Generate exactly ${questionCount} multiple choice questions (MCQs) based on the given class level, subject, and chapters.

DIFFICULTY LEVEL: ${difficulty.toUpperCase()}
Questions should be ${difficultyInstruction}

IMPORTANT: You must respond ONLY with a valid JSON array, no additional text or markdown.

Each question must have:
- "id": a unique number (1-${questionCount})
- "question": the question text
- "options": an array of exactly 4 options (A, B, C, D)
- "correctAnswer": the index of the correct option (0-3)
- "explanation": a brief explanation of the correct answer

Make questions age-appropriate for the class level.
Cover the selected chapters proportionally.
All questions should match the ${difficulty} difficulty level consistently.
Base questions on NCERT curriculum content.`
          },
          { 
            role: "user", 
            content: `Generate ${questionCount} ${difficulty.toUpperCase()} level MCQs for:
Class: ${classLevel}
Subject: ${subject}
Chapters: ${chaptersText}

Respond with ONLY a JSON array of questions, no markdown or extra text.`
          }
        ],
        temperature: difficulty === 'easy' ? 0.5 : difficulty === 'hard' ? 0.8 : 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate quiz" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse the JSON response
    let questions;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        questions = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse quiz response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse quiz questions" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generate quiz error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
