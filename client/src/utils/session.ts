const STORAGE_KEY = 'chatSessionId';

export const getSessionId = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const setSessionId = (id: string): void => {
  localStorage.setItem(STORAGE_KEY, id);
};

export const clearSessionId = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const syncSessionId = (
  responseSessionId: string,
  currentSessionId: string | undefined,
  updateState: (id: string) => void
): string => {
  if (!currentSessionId && responseSessionId) {
    updateState(responseSessionId);
    setSessionId(responseSessionId);
    return responseSessionId;
  }
  return currentSessionId || responseSessionId; // Return current or fallback to response
};
