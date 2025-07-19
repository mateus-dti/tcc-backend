import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface OpenRouterChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export interface OpenRouterUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenRouterChoice[];
  usage: OpenRouterUsage;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
  top_provider: {
    max_completion_tokens?: number;
  };
}

export class OpenRouterService {
  private client: AxiosInstance;
  private apiKey: string;
  private baseURL = 'https://openrouter.ai/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required. Set OPENROUTER_API_KEY environment variable or pass it to the constructor.');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.HTTP_REFERER || 'http://localhost:3000',
        'X-Title': process.env.APP_NAME || 'TCC Backend'
      },
      timeout: 60000 // 60 segundos timeout
    });
  }

  /**
   * Envia mensagens para um modelo LLM específico
   */
  async chat(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    try {
      const response: AxiosResponse<OpenRouterResponse> = await this.client.post('/chat/completions', request);
      return response.data;
    } catch (error: any) {
      console.error('Error in OpenRouter chat:', error.response?.data || error.message);
      throw new Error(`OpenRouter API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Obtém a lista de modelos disponíveis
   */
  async getModels(): Promise<OpenRouterModel[]> {
    try {
      const response: AxiosResponse<{ data: OpenRouterModel[] }> = await this.client.get('/models');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching models:', error.response?.data || error.message);
      throw new Error(`Failed to fetch models: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Filtra modelos por critérios específicos
   */
  async getFilteredModels(filters: {
    maxPrice?: number;
    minContextLength?: number;
    provider?: string;
    search?: string;
  } = {}): Promise<OpenRouterModel[]> {
    const models = await this.getModels();
    
    return models.filter(model => {
      if (filters.maxPrice) {
        const promptPrice = parseFloat(model.pricing.prompt);
        const completionPrice = parseFloat(model.pricing.completion);
        if (promptPrice > filters.maxPrice || completionPrice > filters.maxPrice) {
          return false;
        }
      }

      if (filters.minContextLength && model.context_length < filters.minContextLength) {
        return false;
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!model.name.toLowerCase().includes(searchLower) && 
            !model.id.toLowerCase().includes(searchLower) &&
            !(model.description?.toLowerCase().includes(searchLower))) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Envia uma mensagem simples para um modelo específico
   */
  async sendMessage(
    model: string, 
    message: string, 
    systemPrompt?: string,
    options: {
      maxTokens?: number;
      temperature?: number;
      topP?: number;
    } = {}
  ): Promise<string> {
    const messages: OpenRouterMessage[] = [];
    
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    messages.push({
      role: 'user',
      content: message
    });

    const request: OpenRouterRequest = {
      model,
      messages,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1.0
    };

    const response = await this.chat(request);
    
    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    }

    throw new Error('No response received from the model');
  }

  /**
   * Conversa em contexto (mantém histórico de mensagens)
   */
  async conversationChat(
    model: string,
    messages: OpenRouterMessage[],
    options: {
      maxTokens?: number;
      temperature?: number;
      topP?: number;
    } = {}
  ): Promise<{
    response: string;
    updatedMessages: OpenRouterMessage[];
    usage: OpenRouterUsage;
  }> {
    const request: OpenRouterRequest = {
      model,
      messages,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1.0
    };

    const response = await this.chat(request);
    
    if (response.choices && response.choices.length > 0) {
      const assistantMessage: OpenRouterMessage = {
        role: 'assistant',
        content: response.choices[0].message.content
      };

      return {
        response: response.choices[0].message.content,
        updatedMessages: [...messages, assistantMessage],
        usage: response.usage
      };
    }

    throw new Error('No response received from the model');
  }

  /**
   * Obtém informações sobre custos estimados
   */
  calculateEstimatedCost(model: OpenRouterModel, promptTokens: number, completionTokens: number): {
    promptCost: number;
    completionCost: number;
    totalCost: number;
  } {
    const promptPrice = parseFloat(model.pricing.prompt);
    const completionPrice = parseFloat(model.pricing.completion);

    const promptCost = (promptTokens / 1000000) * promptPrice;
    const completionCost = (completionTokens / 1000000) * completionPrice;

    return {
      promptCost,
      completionCost,
      totalCost: promptCost + completionCost
    };
  }

  /**
   * Verifica se a API está funcionando
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.getModels();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Instância singleton do serviço
let openRouterService: OpenRouterService | null = null;

export const getOpenRouterService = (apiKey?: string): OpenRouterService => {
  if (!openRouterService) {
    openRouterService = new OpenRouterService(apiKey);
  }
  return openRouterService;
};