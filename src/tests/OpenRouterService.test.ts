import { OpenRouterService } from '../services/OpenRouterService';

// Mock do axios para testes
jest.mock('axios');

describe('OpenRouterService', () => {
  let service: OpenRouterService;
  
  beforeEach(() => {
    // Configurar variável de ambiente de teste
    process.env.OPENROUTER_API_KEY = 'test-api-key';
    service = new OpenRouterService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if no API key is provided', () => {
      delete process.env.OPENROUTER_API_KEY;
      
      expect(() => {
        new OpenRouterService();
      }).toThrow('OpenRouter API key is required');
    });

    it('should accept API key as parameter', () => {
      delete process.env.OPENROUTER_API_KEY;
      
      expect(() => {
        new OpenRouterService('custom-api-key');
      }).not.toThrow();
    });
  });

  describe('sendMessage', () => {
    it('should send a simple message successfully', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Test response'
            }
          }]
        }
      };

      // Mock do cliente axios
      const mockPost = jest.fn().mockResolvedValue(mockResponse);
      (service as any).client.post = mockPost;

      const result = await service.sendMessage(
        'openai/gpt-3.5-turbo',
        'Test message'
      );

      expect(result).toBe('Test response');
      expect(mockPost).toHaveBeenCalledWith('/chat/completions', {
        model: 'openai/gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: 'Test message'
        }],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 1.0
      });
    });

    it('should include system prompt when provided', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Test response'
            }
          }]
        }
      };

      const mockPost = jest.fn().mockResolvedValue(mockResponse);
      (service as any).client.post = mockPost;

      await service.sendMessage(
        'openai/gpt-3.5-turbo',
        'Test message',
        'You are a helpful assistant'
      );

      expect(mockPost).toHaveBeenCalledWith('/chat/completions', {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant'
          },
          {
            role: 'user',
            content: 'Test message'
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 1.0
      });
    });
  });

  describe('getModels', () => {
    it('should fetch models successfully', async () => {
      const mockModels = {
        data: {
          data: [
            {
              id: 'openai/gpt-3.5-turbo',
              name: 'GPT-3.5 Turbo',
              context_length: 4096,
              pricing: {
                prompt: '0.0015',
                completion: '0.002'
              }
            }
          ]
        }
      };

      const mockGet = jest.fn().mockResolvedValue(mockModels);
      (service as any).client.get = mockGet;

      const result = await service.getModels();

      expect(result).toEqual(mockModels.data.data);
      expect(mockGet).toHaveBeenCalledWith('/models');
    });
  });

  describe('getFilteredModels', () => {
    it('should filter models by search term', async () => {
      const mockModels = [
        {
          id: 'openai/gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          context_length: 4096,
          pricing: { prompt: '0.0015', completion: '0.002' },
          top_provider: {}
        },
        {
          id: 'anthropic/claude-3-opus',
          name: 'Claude 3 Opus',
          context_length: 200000,
          pricing: { prompt: '0.000015', completion: '0.000075' },
          top_provider: {}
        }
      ];

      // Mock getModels method
      jest.spyOn(service, 'getModels').mockResolvedValue(mockModels);

      const result = await service.getFilteredModels({ search: 'gpt' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('GPT-3.5 Turbo');
    });

    it('should filter models by max price', async () => {
      const mockModels = [
        {
          id: 'cheap-model',
          name: 'Cheap Model',
          context_length: 4096,
          pricing: { prompt: '0.001', completion: '0.002' },
          top_provider: {}
        },
        {
          id: 'expensive-model',
          name: 'Expensive Model',
          context_length: 4096,
          pricing: { prompt: '0.01', completion: '0.02' },
          top_provider: {}
        }
      ];

      jest.spyOn(service, 'getModels').mockResolvedValue(mockModels);

      const result = await service.getFilteredModels({ maxPrice: 0.005 });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Cheap Model');
    });
  });

  describe('calculateEstimatedCost', () => {
    it('should calculate cost correctly', () => {
      const model = {
        id: 'test-model',
        name: 'Test Model',
        context_length: 4096,
        pricing: {
          prompt: '0.001',
          completion: '0.002'
        },
        top_provider: {}
      };

      const result = service.calculateEstimatedCost(model, 1000, 500);

      expect(result.promptCost).toBe(0.000001); // (1000/1000000) * 0.001
      expect(result.completionCost).toBe(0.000001); // (500/1000000) * 0.002
      expect(result.totalCost).toBe(0.000002);
    });
  });

  describe('healthCheck', () => {
    it('should return true when API is working', async () => {
      jest.spyOn(service, 'getModels').mockResolvedValue([]);

      const result = await service.healthCheck();

      expect(result).toBe(true);
    });

    it('should return false when API fails', async () => {
      jest.spyOn(service, 'getModels').mockRejectedValue(new Error('API Error'));

      const result = await service.healthCheck();

      expect(result).toBe(false);
    });
  });
});
