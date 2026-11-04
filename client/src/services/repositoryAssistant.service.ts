
import api from "@/lib/axios";

export interface RepositoryAssistantResult {
    answer: string;
    sources: string[];
    retrieval: {
        strategy: string;
        candidateFiles: number;
        retrievedFiles: number;
    };
}

export const askRepositoryAssistant = async (
    repositoryId: string,
    question: string
): Promise<RepositoryAssistantResult> => {
    const response = await api.post(
        `/repositories/${repositoryId}/assistant`,
        { question }
    );

    return response.data.result;
};
