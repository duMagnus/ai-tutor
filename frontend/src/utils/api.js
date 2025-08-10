import axios from "axios";

// Utility to send a message to the LLM Firebase Function
export const sendMessageToLLM = async (prompt) => {
  try {
    // Use the deployed Firebase Function URL
    const response = await axios.post(
      "https://us-central1-ai-tutor-52b5b.cloudfunctions.net/llmHandler",
      { prompt }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao comunicar com o LLM:", error);
    throw error;
  }
};

export const streamMessageToLLM = (prompt, onChunk, onDone, onError) => {
  const url = `https://us-central1-ai-tutor-52b5b.cloudfunctions.net/llmHandler/stream?prompt=${encodeURIComponent(
    prompt
  )}`;
  const eventSource = new EventSource(url);
  let buffer = "";
  eventSource.onmessage = (event) => {
    if (event.data === "[DONE]") {
      onDone(buffer);
      eventSource.close();
    } else if (event.data.startsWith("[ERROR]")) {
      onError(event.data);
      eventSource.close();
    } else {
      // Decode the chunk to restore newlines and special characters
      const decodedChunk = decodeURIComponent(event.data);
      buffer += decodedChunk;
      onChunk(buffer);
    }
  };
  eventSource.onerror = (err) => {
    onError("Erro ao comunicar com o LLM.");
    eventSource.close();
  };
  return eventSource;
};

export const signup = async (data) => {
  try {
    const response = await axios.post(
      "https://us-central1-ai-tutor-52b5b.cloudfunctions.net/llmHandler/api/signup",
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getUserInfo = async (uid) => {
  try {
    const response = await axios.get(
      `https://us-central1-ai-tutor-52b5b.cloudfunctions.net/llmHandler/api/userinfo?uid=${uid}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getParentChildren = async (parentUid) => {
  try {
    const response = await axios.get(
      `https://us-central1-ai-tutor-52b5b.cloudfunctions.net/llmHandler/api/parent/children?parentUid=${parentUid}`
    );
    return response.data.children;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const generateCurriculum = async ({ parentId, childId, subject, ageRange }) => {
  try {
    const response = await axios.post(
      'https://us-central1-ai-tutor-52b5b.cloudfunctions.net/llmHandler/api/generateCurriculum',
      { parentId, childId, subject, ageRange }
    );
    // Response now includes: curriculumId, title, overview, objectives, keyConcepts, lessons, assessment, resources
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Approve curriculum API utility
export const approveCurriculum = async ({ curriculumId, parentId, childId }) => {
  try {
    const response = await axios.post(
      "https://us-central1-ai-tutor-52b5b.cloudfunctions.net/llmHandler/api/approveCurriculum",
      {
        curriculumId,
        parentId,
        childId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao aprovar o currículo:", error);
    throw error;
  }
};

export const requestCurriculumChanges = async ({ curriculumId, parentId, changeRequest }) => {
  try {
    const response = await axios.post(
      "https://us-central1-ai-tutor-52b5b.cloudfunctions.net/llmHandler/api/requestCurriculumChanges",
      { curriculumId, parentId, changeRequest }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao solicitar alterações no currículo:", error);
    throw error;
  }
};

export const cancelCurriculum = async ({ curriculumId, parentId }) => {
  try {
    const response = await axios.post(
      "https://us-central1-ai-tutor-52b5b.cloudfunctions.net/llmHandler/api/cancelCurriculum",
      { curriculumId, parentId }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao cancelar o currículo:", error);
    throw error;
  }
};

export const getApprovedCurriculaForChild = async (childId) => {
  try {
    const response = await axios.get(
      `https://us-central1-ai-tutor-52b5b.cloudfunctions.net/llmHandler/api/child/approvedCurricula?childId=${childId}`
    );
    return response.data.curricula;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
