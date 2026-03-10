const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_REFERER = 'http://localhost:5173';
const OPENROUTER_TITLE = 'News Regions';
const REWRITE_MODEL = 'google/gemini-3-flash-preview';
const OPENROUTER_API_KEY_STORAGE_KEY = 'openrouter_api_key';

const getEnvValue = (key: string): string | undefined => {
  const viteEnv = (import.meta as any)?.env;

  if (viteEnv?.[key]) {
    return viteEnv[key];
  }

  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }

  return undefined;
};

const getOpenRouterApiKey = (): string | undefined => {
  if (typeof window !== 'undefined') {
    const storedKey = window.localStorage.getItem(OPENROUTER_API_KEY_STORAGE_KEY)?.trim();
    if (storedKey) {
      return storedKey;
    }
  }

  return (
    getEnvValue('VITE_OPENROUTER_API_KEY') ||
    getEnvValue('OPENROUTER_API_KEY') ||
    getEnvValue('VITE_API_KEY') ||
    getEnvValue('API_KEY')
  );
};

export const saveOpenRouterApiKey = (apiKey: string): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(OPENROUTER_API_KEY_STORAGE_KEY, apiKey.trim());
  }
};

export const clearOpenRouterApiKey = (): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(OPENROUTER_API_KEY_STORAGE_KEY);
  }
};

const getResponseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const errorPayload = await response.json();
    return errorPayload?.error?.message || errorPayload?.message || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
};

const normalizeOpenRouterError = (message?: string): string => {
  if (!message) {
    return 'Произошла ошибка при обращении к OpenRouter.';
  }

  if (/user not found/i.test(message)) {
    return 'API Key Error: Пользователь OpenRouter не найден. Проверьте ключ или создайте новый.';
  }

  if (/401|403|api key|unauthorized|invalid key|invalid api key/i.test(message)) {
    return 'API Key Error: Проверьте OpenRouter API key.';
  }

  if (/rate limit/i.test(message)) {
    return 'OpenRouter временно ограничил запросы. Попробуйте позже.';
  }

  return message;
};

const openRouterRequest = async (payload: Record<string, unknown>) => {
  const apiKey = getOpenRouterApiKey();

  if (!apiKey) {
    throw new Error('API Key Error: Укажите OpenRouter API key.');
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': OPENROUTER_REFERER,
      'X-Title': OPENROUTER_TITLE,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await getResponseErrorMessage(response);
    throw new Error(message);
  }

  return response.json();
};

export const generateInfographic = async (topic: string, styleDescription: string, aspectRatio: string, modelName: string): Promise<string> => {

  const prompt = `
    Create a high-quality, educational infographic image.
    Topic: ${topic}
    
    VISUAL STYLE INSTRUCTIONS:
    ${styleDescription}
    
    CRITICAL REQUIREMENTS:
    1. Language: All text MUST be in RUSSIAN language (Русский язык).
    2. Accuracy: Ensure spelling and grammar are perfect.
    3. Accessibility: The content must be easy to understand for all ages.
    4. Layout: Clear hierarchy, using icons and large text for key points.
    
    Do not produce photorealistic images unless the style specifically requests it. Focus on graphic design, clarity, and the requested aesthetic.
  `;

  try {
    const response = await openRouterRequest({
      model: modelName,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      modalities: ['image', 'text'],
      image_config: {
        aspect_ratio: aspectRatio,
        image_size: '1K',
      },
    });

    const images = response?.choices?.[0]?.message?.images;
    const imageUrl = images?.[0]?.image_url?.url;

    if (imageUrl) {
      return imageUrl;
    }

    throw new Error('No image data found in the response.');

  } catch (error: any) {
    console.error('OpenRouter image generation error:', error);
    throw new Error(normalizeOpenRouterError(error.message));
  }
};

export const rewriteText = async (text: string): Promise<string> => {
  try {
    const response = await openRouterRequest({
      model: REWRITE_MODEL,
      messages: [
        {
          role: 'user',
          content: `Ты профессиональный редактор. Твоя задача - переписать (сделать рерайт) предоставленного текста на русском языке.
      
      Требования:
      1. Полностью сохрани исходный смысл и факты.
      2. Сделай текст более читаемым, грамотным и стилистически согласованным.
      3. Убери тавтологию и словесный мусор.
      4. НЕ добавляй отсебятину, вступления (типа "Вот ваш текст") или заключения. Верни ТОЛЬКО переписанный текст.
      
      Исходный текст:
      ${text}`,
        },
      ],
    });

    const rewrittenText = response?.choices?.[0]?.message?.content;

    if (!rewrittenText || typeof rewrittenText !== 'string') {
      throw new Error('Empty response from AI');
    }

    return rewrittenText;
  } catch (error: any) {
    console.error('Rewrite Error:', error);
    throw new Error(normalizeOpenRouterError(error.message));
  }
};

export const checkApiKeySelection = async (): Promise<boolean> => {
  return !!getOpenRouterApiKey();
};

export const openApiKeySelection = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    window.open('https://openrouter.ai/keys', '_blank', 'noopener,noreferrer');
  }
};
