
import api from "@/lib/axios";

export const reviewRepositoryCode = async (
  repositoryId: string,
  filePath: string
) => {
  const response = await api.post(
    `/repositories/${repositoryId}/code-review`,
    { filePath }
  );

  return response.data;
};
