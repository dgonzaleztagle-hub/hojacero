import { NextResponse } from 'next/server';

const GEN_AI_KEY = process.env.GOOGLE_AI_KEY;

export async function POST(req: Request) {
    if (!GEN_AI_KEY) {
        return NextResponse.json({ success: false, error: 'API Key Missing' }, { status: 500 });
    }

    try {
        const { mode, platform, objective, prompt, clientData } = await req.json();

        // 1. Construct the System Prompt based on Mode & Inputs
        let systemInstruction = "";
        let userMessage = prompt;

        if (mode === 'DEV') {
            systemInstruction = `You are DANIEL, a Senior DevOps & Solutions Architect. 
            Style: Technical, precise, pragmatic. Use bullet points and code blocks.
            Goal: Architect a robust technical solution based on the user's request.
            Structure:
            1. Architecture Overview (Stack choice)
            2. Data Model (Schema suggestion)
            3. Key API Endpoints
            4. Infrastructure (Deployment, CI/CD)
            `;
        } else if (mode === 'MARKETING') {
            systemInstruction = `You are GASTON, a World-Class Digital Marketing Strategist.
            Style: Persuasive, data-driven, creative but focused on ROI.
            Context: The user wants a campaign for Platform: "${platform}" with Objective: "${objective}".
            
            IF PLATFORM IS GOOGLE ADS:
            - Focus on Keywords (Match types), Negative Keywords, Headline structure (30 chars), Descriptions (90 chars).
            
            IF PLATFORM IS META ADS (Facebook/Instagram):
            - Focus on Audiences (Interests/Lookalikes), Visual Hook ideas, Ad Copy (Primary Text, Headline, CTA).
            
            IF PLATFORM IS EMAIL STRATEGY:
            - Focus on Subject Lines (High Open Rate), Body Copy structure (AIDA), CTA.
            
            Goal: Generate a ready-to-implement strategy.
            `;
        } else if (mode === 'CLIENT_WIZARD') {
            // For the Client Wizard (The "Canvas" input)
            systemInstruction = `You are the ARCHITECT of HojaCero.
            Analyze the following client brief and generate a technical project summary.
            Output format: Highly structured text block tailored for an agency internal team.
            Include:
            - Vibe Assessment (Based on "Soul")
            - Recommended Tech Stack
            - Core Features List
            - Potential Challenges
            `;
            userMessage = `Client Identity: ${clientData.identity}\nActivity: ${clientData.activity}\nVision: ${clientData.vision}\nFunctionality: ${clientData.functionality}\nAssets: ${clientData.assets}\nSoul: ${clientData.soul}`;
        }

        // 2. Call Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEN_AI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `SYSTEM: ${systemInstruction}\n\nUSER REQUEST: ${userMessage}` }]
                }]
            })
        });

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No candidates returned from AI');
        }

        const generatedText = data.candidates[0].content.parts[0].text;

        return NextResponse.json({ success: true, result: generatedText });

    } catch (error: any) {
        console.error('AI Gen Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
