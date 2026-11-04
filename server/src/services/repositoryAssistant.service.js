
import {
    buildRepositoryContext,
} from "./repositoryContext.service.js";

import {
    generateRepositoryAnswer,
} from "./ai.service.js";

export const askRepositoryAssistant = async ({
    repositoryId,
    userId,
    question,
}) => {
    const normalizedQuestion = question?.trim();

    if (
        typeof normalizedQuestion !== "string" ||
        !normalizedQuestion ||
        normalizedQuestion.length > 2000
    ) {
        const error = new Error(
            "Question must contain between 1 and 2000 characters."
        );
        error.statusCode = 400;
        throw error;
    }

    const context = await buildRepositoryContext({
        repositoryId,
        userId,
        question: normalizedQuestion,
    });

    if (context.files.length === 0) {
        return {
            answer:
                "I couldn't retrieve any readable source files from this repository, so I can't answer reliably.",
            sources: [],
            retrieval: {
                strategy: context.retrievalStrategy,
                candidateFiles: context.totalCandidateFiles,
                retrievedFiles: 0,
            },
        };
    }

    const aiContext = {
        files: context.files,
        retrievalStrategy: context.retrievalStrategy,
    };

    const answer = await generateRepositoryAnswer({
        question: normalizedQuestion,
        context: aiContext,
    });

    return {
        answer,
        sources: context.retrievedFilePaths,
        retrieval: {
            strategy: context.retrievalStrategy,
            candidateFiles: context.totalCandidateFiles,
            retrievedFiles: context.files.length,
        },
    };
};
