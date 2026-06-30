import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/ApiError.js";

let client = null;

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new ApiError(
      503,
      "Api Key is not configured in .env file, or is invalid. Service Unavailable",
    );
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

const MODEL = () => process.env.GEMINI_MODEL || "gemini-2.5-flash";
export const isAIConfigured = () => Boolean(process.env.GEMINI_API_KEY);

const generateJSON = async (prompt, schema) => {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: MODEL(),
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.6,
      },
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error("💥", "Gemini JSON error: ", err, err?.message);
    throw new ApiError(
      500,
      err?.message || "AI Request failed, please try again.",
    );
  }
};

const generateText = async (prompt, temperature = 0.7) => {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: MODEL(),
      contents: prompt,
      config: {
        temperature,
      },
    });
    return response.text.trim();
  } catch (err) {
    console.error("💥", "Gemini text error: ", err, err?.message);
    throw new ApiError(
      502,
      err?.message || "AI Request failed, please try again.",
    );
  }
};

export const generateLeadSummary = async (lead) => {
  const prompt = `You are and expert B2B sales analyst for a CRM called TTP CRM. 
    Analyse the following sales lead and produce a concise assessment.

    Lead details:
    - Lead name: ${lead.name || "N/A"}
    - Lead company: ${lead.company || "N/A"}
    - Lead email: ${lead.email || "N/A"}
    - Current pipline stage: ${lead.status || "New"}
    - Potential deal value: ${lead.value || 0}
    - Lead status: ${lead.status}
    - Lead source: ${lead.source}
    - Lead notes: ${lead.notes}

    Return JSON only.`;

  const schema = {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "2-3 sentences executive summarizing the lead.",
      },
      riskScore: {
        type: "integer",
        description: "The risk score of the lead. 0 (safe) to 100 (high risk).",
      },
      suggestedPriority: {
        type: "string",
        enum: ["Low", "Medium", "High"],
      },
      nextBestAction: {
        type: "string",
        description: "The next best action to take for the lead.",
      },
    },
    required: ["summary", "riskScore", "suggestedPriority", "nextBestAction"],
  };
  return generateJSON(prompt, schema);
};

export const generateEmail = async ({ lead, purpose, tone, sender }) => {
  const prompt = `You are a senior sales rep writing on behalf of ${sender?.name || "our team"} ${
    sender?.company ? `at ${sender?.company}` : ""
  }.
  
    Write a professional sales email.
    purpose: ${purpose || "Follow-up"}
    desired tone: ${tone || "Friendly & professional"}

    Recipient details:
    lead name: ${lead?.name || "there"}
    lead company: ${lead?.company || "N/A"}
    Pipeline stage: ${lead?.status || "New"}
    Context / notes: ${lead?.notes || "none"}
  
    Return JSON only with a compelling subject line and a complete email body.
    Use line breaks (\\n) in the body. Keep it under 180 words. Sign off as ${sender?.name || "the TTP CRM team"}.`;

  const schema = {
    type: "object",
    properties: {
      subject: {
        type: "string",
      },
      body: {
        type: "string",
      },
    },
    required: ["subject", "body"],
  };
  return generateJSON(prompt, schema);
};

export const generateSalesInsights = async (pipelineStats) => {
  const prompt = `You are a revenue-operations advisor. Given this snapshot of a stats pipline. 
  Identify what is working, what is at risk, and concrete actions to improve conversation.
  
  Pipeline sanpshot (JSON):
  ${JSON.stringify(pipelineStats, null, 2)}

  Return JSON only.`;

  const schema = {
    type: "object",
    properties: {
      headline: {
        type: "string",
        description: "One-sentence summary of pipeline health",
      },
      insights: {
        type: "array",
        description: "3-5 specific, data-driven observations",
        items: { type: "string" },
      },
      recommendations: {
        type: "array",
        description: "3-5 prioritized, actionable recommendations",
        items: { type: "string" },
      },
      healthScore: {
        type: "integer",
        description: "Overall pipeline health, 0-100",
      },
    },

    required: ["headline", "insights", "recommendations", "healthScore"],
  };

  return generateJSON(prompt, schema);
};

export { generateText };
