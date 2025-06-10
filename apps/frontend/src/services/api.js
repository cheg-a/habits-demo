const BASE_URL = 'http://127.0.0.1:3000'; // Adjust if your backend runs on a different port

export const loginUser = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Login failed and error response is not valid JSON' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Even if no body, good practice to set
    },
    // No body is typically needed for logout
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Logout failed and error response is not valid JSON' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  // Logout might not return a body or specific data, just a success status
  return response.json(); // Or handle as needed, e.g., return { success: true }
};

export const submitQuestionnaire = async (questionnaireData) => {
  const response = await fetch(`${BASE_URL}/questionnaire`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionnaireData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Questionnaire submission failed and error response is not valid JSON' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const submitDailyReport = async (dailyReportData) => {
  const response = await fetch(`${BASE_URL}/reports/daily`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dailyReportData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Daily report submission failed and error response is not valid JSON' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
