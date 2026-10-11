import api from "@/lib/axios";
import { CodebaseUnderstanding } from "@/types/intelligence";

export const getRepositoryIntelligence = async (
    repositoryId: string
): Promise<CodebaseUnderstanding> => {
    const response = await api.get(
        `/repositories/${repositoryId}/intelligence`
    );

    return response.data.understanding;
};