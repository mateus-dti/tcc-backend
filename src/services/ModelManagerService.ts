import * as fs from 'fs';
import * as path from 'path';

export interface SimpleModel {
  id: string;
  name: string;
}

export interface SimpleModelData {
  models: SimpleModel[];
}

export class ModelManagerService {
  private modelsData!: SimpleModelData;
  private readonly dataPath = path.join(__dirname, '../../data/available-models.json');

  constructor() {
    this.loadModelsData();
  }

  /**
   * Carrega os dados dos modelos do arquivo JSON
   */
  private loadModelsData(): void {
    try {
      const dataString = fs.readFileSync(this.dataPath, 'utf-8');
      this.modelsData = JSON.parse(dataString);
    } catch (error) {
      console.error('Erro ao carregar dados dos modelos:', error);
      throw new Error('Falha ao carregar configuração dos modelos');
    }
  }

  /**
   * Recarrega os dados dos modelos do arquivo
   */
  public reloadModels(): void {
    this.loadModelsData();
  }

  /**
   * Retorna todos os modelos
   */
  public getAllModels(): SimpleModelData {
    return this.modelsData;
  }

  /**
   * Retorna apenas a lista de modelos
   */
  public getModelsList(): SimpleModel[] {
    return this.modelsData.models;
  }

  /**
   * Busca um modelo específico por ID
   */
  public getModelById(modelId: string): SimpleModel | null {
    return this.modelsData.models.find(model => model.id === modelId) || null;
  }

  /**
   * Busca modelos por nome (busca parcial)
   */
  public searchModelsByName(searchTerm: string): SimpleModel[] {
    const term = searchTerm.toLowerCase();
    return this.modelsData.models.filter(model => 
      model.name.toLowerCase().includes(term) || 
      model.id.toLowerCase().includes(term)
    );
  }

  /**
   * Filtra modelos por critérios
   */
  public filterModels(filters: {
    name?: string;
    id?: string;
    provider?: string;
  }): SimpleModel[] {
    let filteredModels = this.modelsData.models;

    if (filters.name) {
      const term = filters.name.toLowerCase();
      filteredModels = filteredModels.filter(model => 
        model.name.toLowerCase().includes(term)
      );
    }

    if (filters.id) {
      const term = filters.id.toLowerCase();
      filteredModels = filteredModels.filter(model => 
        model.id.toLowerCase().includes(term)
      );
    }

    if (filters.provider) {
      const term = filters.provider.toLowerCase();
      filteredModels = filteredModels.filter(model => 
        model.id.toLowerCase().includes(term)
      );
    }

    return filteredModels;
  }

  /**
   * Obtém modelos gratuitos (que contêm ":free" no ID)
   */
  public getFreeModels(): SimpleModel[] {
    return this.modelsData.models.filter(model => 
      model.id.includes(':free')
    );
  }

  /**
   * Obtém modelos por provedor
   */
  public getModelsByProvider(provider: string): SimpleModel[] {
    return this.modelsData.models.filter(model => 
      model.id.startsWith(provider.toLowerCase())
    );
  }

  /**
   * Obtém lista de provedores únicos
   */
  public getProviders(): string[] {
    const providers = new Set<string>();
    
    this.modelsData.models.forEach(model => {
      const provider = model.id.split('/')[0];
      if (provider) {
        providers.add(provider);
      }
    });

    return Array.from(providers).sort();
  }

  /**
   * Obtém modelos recomendados (modelos gratuitos por padrão)
   */
  public getRecommendedModels(): SimpleModel[] {
    return this.getFreeModels();
  }

  /**
   * Obtém modelos econômicos (modelos gratuitos)
   */
  public getBudgetModels(): SimpleModel[] {
    return this.getFreeModels();
  }

  /**
   * Obtém modelos bons para programação (baseado em palavras-chave)
   */
  public getCodingModels(): SimpleModel[] {
    const codingKeywords = ['deepseek', 'code', 'programming', 'claude', 'gpt'];
    return this.modelsData.models.filter(model => 
      codingKeywords.some(keyword => 
        model.name.toLowerCase().includes(keyword) || 
        model.id.toLowerCase().includes(keyword)
      )
    );
  }

  /**
   * Obtém modelos com contexto grande (baseado em palavras-chave)
   */
  public getLargeContextModels(): SimpleModel[] {
    const largeContextKeywords = ['claude', 'gemini', 'gpt-4'];
    return this.modelsData.models.filter(model => 
      largeContextKeywords.some(keyword => 
        model.name.toLowerCase().includes(keyword) || 
        model.id.toLowerCase().includes(keyword)
      )
    );
  }

  /**
   * Obtém estatísticas dos modelos
   */
  public getModelStats(): {
    totalModels: number;
    freeModels: number;
    paidModels: number;
    providers: number;
    byProvider: Record<string, number>;
  } {
    const totalModels = this.modelsData.models.length;
    const freeModels = this.getFreeModels().length;
    const paidModels = totalModels - freeModels;
    const providers = this.getProviders();
    
    const byProvider: Record<string, number> = {};
    providers.forEach(provider => {
      byProvider[provider] = this.getModelsByProvider(provider).length;
    });

    return {
      totalModels,
      freeModels,
      paidModels,
      providers: providers.length,
      byProvider
    };
  }

  /**
   * Obtém categorias baseadas nos provedores
   */
  public getCategories(): Array<{
    id: string;
    name: string;
    description: string;
    count: number;
  }> {
    const providers = this.getProviders();
    return providers.map(provider => ({
      id: provider,
      name: provider.charAt(0).toUpperCase() + provider.slice(1),
      description: `Modelos do provedor ${provider}`,
      count: this.getModelsByProvider(provider).length
    }));
  }

  /**
   * Obtém features baseadas em análise dos modelos
   */
  public getFeatures(): Array<{
    id: string;
    name: string;
    description: string;
    count: number;
  }> {
    return [
      {
        id: 'free',
        name: 'Gratuito',
        description: 'Modelos de uso gratuito',
        count: this.getFreeModels().length
      },
      {
        id: 'coding',
        name: 'Programação',
        description: 'Modelos especializados em código',
        count: this.getCodingModels().length
      },
      {
        id: 'large-context',
        name: 'Contexto Grande',
        description: 'Modelos com grande capacidade de contexto',
        count: this.getLargeContextModels().length
      }
    ];
  }

  /**
   * Busca modelos por categoria (baseado no provedor)
   */
  public getModelsByCategory(categoryId: string): SimpleModel[] {
    return this.getModelsByProvider(categoryId);
  }

  /**
   * Sugere modelos baseado no caso de uso
   */
  public suggestModels(useCase: string): SimpleModel[] {
    const suggestions: Record<string, string[]> = {
      'coding': ['deepseek', 'claude', 'gpt'],
      'conversation': ['mistral', 'gemma', 'claude'],
      'free': [':free'],
      'translation': ['gpt', 'claude', 'mistral'],
      'analysis': ['claude', 'gpt', 'gemini'],
      'creative': ['claude', 'gpt', 'mistral'],
      'fast': ['gemma', 'mistral', 'kimi']
    };

    const keywords = suggestions[useCase.toLowerCase()] || [];
    
    if (keywords.length === 0) {
      return this.modelsData.models.slice(0, 5); // Retorna os primeiros 5 se não encontrar
    }

    const suggestedModels = this.modelsData.models.filter(model => 
      keywords.some(keyword => 
        model.name.toLowerCase().includes(keyword) || 
        model.id.toLowerCase().includes(keyword)
      )
    );

    return suggestedModels.length > 0 ? suggestedModels : this.modelsData.models.slice(0, 5);
  }

  /**
   * Adiciona um novo modelo (para administração)
   */
  public addModel(model: SimpleModel): void {
    const existingModel = this.getModelById(model.id);
    if (existingModel) {
      throw new Error(`Modelo com ID '${model.id}' já existe`);
    }

    this.modelsData.models.push(model);
    this.saveModelsData();
  }

  /**
   * Remove um modelo por ID
   */
  public removeModel(modelId: string): boolean {
    const initialLength = this.modelsData.models.length;
    this.modelsData.models = this.modelsData.models.filter(model => model.id !== modelId);
    
    if (this.modelsData.models.length < initialLength) {
      this.saveModelsData();
      return true;
    }
    
    return false;
  }

  /**
   * Atualiza um modelo existente
   */
  public updateModel(modelId: string, updatedModel: Partial<SimpleModel>): boolean {
    const modelIndex = this.modelsData.models.findIndex(model => model.id === modelId);
    
    if (modelIndex === -1) {
      return false;
    }

    this.modelsData.models[modelIndex] = {
      ...this.modelsData.models[modelIndex],
      ...updatedModel
    };

    this.saveModelsData();
    return true;
  }

  /**
   * Salva os dados dos modelos no arquivo JSON
   */
  private saveModelsData(): void {
    try {
      const dataString = JSON.stringify(this.modelsData, null, 2);
      fs.writeFileSync(this.dataPath, dataString, 'utf-8');
    } catch (error) {
      console.error('Erro ao salvar dados dos modelos:', error);
      throw new Error('Falha ao salvar configuração dos modelos');
    }
  }
}

// Instância singleton do serviço
let modelManagerService: ModelManagerService | null = null;

export const getModelManagerService = (): ModelManagerService => {
  if (!modelManagerService) {
    modelManagerService = new ModelManagerService();
  }
  return modelManagerService;
};
