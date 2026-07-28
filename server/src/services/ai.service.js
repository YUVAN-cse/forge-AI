import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// ==========================================
// GROQ AI CLIENT
// ==========================================

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const MODEL = "llama-3.3-70b-versatile";


// ==========================================
// GENERATE AI RESPONSE
// ==========================================

const generateAIResponse = async (prompt) => {
    try {

        console.log(
            "Groq API Key:",
            process.env.GROQ_API_KEY ? "Loaded" : "Missing"
        );

        const response = await groq.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content:
                        "You are ForgeAI, an intelligent AI software development and project management assistant.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.2,
        });

        return response.choices[0].message.content;

    } catch (error) {

        console.error(
            "Groq API Error:",
            error
        );

        if (
            error.status === 429 ||
            error.message?.includes("429")
        ) {
            throw new Error(
                "AI service quota exceeded. Please try again later."
            );
        }

        throw new Error(
            "Failed to generate AI response."
        );
    }
};


// ==========================================
// PROJECT AI ASSISTANT
// ==========================================

const generateProjectAnswer = async ({
    question,
    context,
}) => {

    const prompt = `
You are ForgeAI, an intelligent AI project assistant.

Answer the user's question using ONLY
the provided project context.

Do not invent information.

PROJECT CONTEXT:

${JSON.stringify(context, null, 2)}

USER QUESTION:

${question}

Return a clear and useful answer.
`;

    return await generateAIResponse(prompt);
};


// ==========================================
// TASK AI ASSISTANT
// ==========================================

const generateTaskHelp = async ({
    question,
    task,
    projectContext,
}) => {

    const prompt = `
You are ForgeAI, an AI software development assistant.

You are helping a developer understand and complete a specific task.

TASK:

${JSON.stringify(task, null, 2)}

PROJECT CONTEXT:

${JSON.stringify(projectContext, null, 2)}

USER QUESTION:

${question}

Instructions:

1. Understand the task requirements.
2. Use the project context to provide relevant guidance.
3. Do not invent project information.
4. If the task is unclear, explicitly mention what is missing.
5. Give practical, actionable advice.
6. When appropriate, provide:
   - Explanation
   - Step-by-step implementation approach
   - Potential issues
   - Testing suggestions

Keep the response concise but useful.
`;

    return await generateAIResponse(prompt);
};


// ==========================================
// AI PROJECT TASK GENERATOR
// ==========================================

const generateProjectTasks = async ({
    requirement,
    projectContext,
}) => {

    const prompt = `
You are ForgeAI, an AI project management assistant.

Your job is to break a software requirement into
clear, actionable development tasks.

PROJECT CONTEXT:

${JSON.stringify(projectContext, null, 2)}

NEW REQUIREMENT:

${requirement}

Generate a list of tasks.

Each task must contain:

- title
- description
- priority

Priority must be exactly one of:

LOW
MEDIUM
HIGH

Rules:

1. Generate practical implementation tasks.
2. Do not duplicate tasks that already exist.
3. Keep tasks independent and actionable.
4. Use the existing project context when relevant.
5. Do not include task IDs.
6. Do not include assigned users.
7. Return ONLY valid JSON.
8. The response must follow this exact structure:

{
    "tasks": [
        {
            "title": "Task title",
            "description": "Task description",
            "priority": "HIGH"
        }
    ]
}
`;

    const response =
        await generateAIResponse(prompt);

    try {

        // Remove markdown code fences
        // if the AI wraps the JSON response
        const cleanedText =
            response
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

        const parsed =
            JSON.parse(cleanedText);

        return parsed.tasks;

    } catch (error) {

        console.error(
            "Failed to parse AI task response:",
            response
        );

        throw new Error(
            "AI returned an invalid task format."
        );
    }
};


// ==========================================
// EXPORTS
// ==========================================

export {
    generateProjectAnswer,
    generateTaskHelp,
    generateProjectTasks,
};
