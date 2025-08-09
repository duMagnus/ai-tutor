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
