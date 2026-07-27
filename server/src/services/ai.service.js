import {
    GoogleGenerativeAI,
} from "@google/generative-ai";

const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );

const model =
    genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
    });


const generateProjectAnswer = async ({
    question,
    context,
}) => {
    try {
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

        const result =
            await model.generateContent(prompt);

        return result.response.text();

    } catch (error) {

        console.error(
            "Gemini API Error:",
            error
        );

        if (
            error.message?.includes(
                "429"
            )
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

const generateTaskHelp = async ({
    question,
    task,
    projectContext,
}) => {
    try {
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

        const result =
            await model.generateContent(prompt);

        return result.response.text();

    } catch (error) {
        console.error(
            "TASK AI ERROR:",
            error
        );

        if (
            error.message?.includes("429")
        ) {
            throw new Error(
                "AI service quota exceeded. Please try again later."
            );
        }

        throw new Error(
            "Failed to generate task AI response."
        );
    }
};


const generateProjectTasks = async ({
    requirement,
    projectContext,
}) => {
    try {
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

        const result =
            await model.generateContent(prompt);

        const text =
            result.response.text();

        // Remove markdown code fences
        const cleanedText =
            text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

        const parsed =
            JSON.parse(cleanedText);

        return parsed.tasks;

    } catch (error) {
        console.error(
            "AI TASK GENERATION ERROR:",
            error
        );

        if (
            error.message?.includes("429")
        ) {
            throw new Error(
                "AI service quota exceeded. Please try again later."
            );
        }

        throw new Error(
            "Failed to generate project tasks."
        );
    }
};

export {
    generateProjectAnswer,
    generateTaskHelp,
    generateProjectTasks
};