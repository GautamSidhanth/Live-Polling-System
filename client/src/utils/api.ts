const getApiUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }
    return `${url}/api`;
};

const API_BASE_URL = getApiUrl();

export const api = {
  createPoll: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create poll: ${response.status} ${text}`);
    }
    return response.json();
  },

  getCurrentPoll: async () => {
    const response = await fetch(`${API_BASE_URL}/polls/current`);
    if (!response.ok) throw new Error('Failed to fetch poll');
    return response.json();
  },

  submitVote: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit vote');
    return response.json();
  },

  getPollHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/polls/history`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  },
};
