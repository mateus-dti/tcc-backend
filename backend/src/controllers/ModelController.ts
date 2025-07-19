import { Request, Response } from 'express';
import { getModelManagerService } from '../services/ModelManagerService';

export class ModelController {

  /**
   * GET /api/models
   * Retorna todos os modelos disponíveis
   */
  static async getAllModels(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      const models = modelManager.getAllModels();

      res.json({
        success: true,
        data: models
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar modelos'
      });
    }
  }

  /**
   * GET /api/models/list
   * Retorna apenas a lista de modelos
   */
  static async getModelsList(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      const models = modelManager.getModelsList();

      res.json({
        success: true,
        data: models,
        count: models.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar lista de modelos'
      });
    }
  }

  /**
   * GET /api/models/category/:categoryId
   * Retorna modelos de uma categoria específica (baseado no provedor)
   */
  static async getModelsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const modelManager = getModelManagerService();
      const models = modelManager.getModelsByCategory(categoryId);

      res.json({
        success: true,
        data: models,
        category: categoryId,
        count: models.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar modelos da categoria'
      });
    }
  }

  /**
   * GET /api/models/:modelId
   * Retorna informações de um modelo específico
   */
  static async getModelById(req: Request, res: Response): Promise<void> {
    try {
      const { modelId } = req.params;
      const modelManager = getModelManagerService();
      const model = modelManager.getModelById(modelId);

      if (!model) {
        res.status(404).json({
          success: false,
          error: 'Modelo não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: model
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar modelo'
      });
    }
  }

  /**
   * GET /api/models/filter
   * Filtra modelos por critérios específicos
   */
  static async filterModels(req: Request, res: Response): Promise<void> {
    try {
      const { name, id, provider } = req.query;

      const modelManager = getModelManagerService();
      
      const filters = {
        name: name as string,
        id: id as string,
        provider: provider as string
      };

      const models = modelManager.filterModels(filters);

      res.json({
        success: true,
        data: models,
        count: models.length,
        filters
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao filtrar modelos'
      });
    }
  }

  /**
   * GET /api/models/recommended
   * Retorna modelos recomendados (gratuitos)
   */
  static async getRecommendedModels(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      const models = modelManager.getRecommendedModels();

      res.json({
        success: true,
        data: models,
        count: models.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar modelos recomendados'
      });
    }
  }

  /**
   * GET /api/models/budget
   * Retorna modelos econômicos (gratuitos)
   */
  static async getBudgetModels(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      const models = modelManager.getBudgetModels();

      res.json({
        success: true,
        data: models,
        count: models.length,
        note: 'Retornando modelos gratuitos'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar modelos econômicos'
      });
    }
  }

  /**
   * GET /api/models/coding
   * Retorna modelos bons para programação
   */
  static async getCodingModels(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      const models = modelManager.getCodingModels();

      res.json({
        success: true,
        data: models,
        count: models.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar modelos para programação'
      });
    }
  }

  /**
   * GET /api/models/large-context
   * Retorna modelos com contexto grande
   */
  static async getLargeContextModels(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      const models = modelManager.getLargeContextModels();

      res.json({
        success: true,
        data: models,
        count: models.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar modelos com contexto grande'
      });
    }
  }

  /**
   * GET /api/models/stats
   * Retorna estatísticas dos modelos
   */
  static async getModelStats(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      const stats = modelManager.getModelStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar estatísticas dos modelos'
      });
    }
  }

  /**
   * GET /api/models/categories
   * Retorna todas as categorias (baseadas nos provedores)
   */
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      const categories = modelManager.getCategories();

      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar categorias'
      });
    }
  }

  /**
   * GET /api/models/features
   * Retorna todas as features disponíveis
   */
  static async getFeatures(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      const features = modelManager.getFeatures();

      res.json({
        success: true,
        data: features,
        count: features.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar features'
      });
    }
  }

  /**
   * GET /api/models/suggest/:useCase
   * Sugere modelos baseado no caso de uso
   */
  static async suggestModels(req: Request, res: Response): Promise<void> {
    try {
      const { useCase } = req.params;
      const modelManager = getModelManagerService();
      const models = modelManager.suggestModels(useCase);

      res.json({
        success: true,
        data: models,
        useCase,
        count: models.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao sugerir modelos'
      });
    }
  }

  /**
   * POST /api/models/reload
   * Recarrega os dados dos modelos do arquivo
   */
  static async reloadModels(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      modelManager.reloadModels();

      res.json({
        success: true,
        message: 'Modelos recarregados com sucesso'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao recarregar modelos'
      });
    }
  }

  /**
   * GET /api/models/search
   * Busca modelos por nome ou ID
   */
  static async searchModels(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Parâmetro de busca "q" é obrigatório'
        });
        return;
      }

      const modelManager = getModelManagerService();
      const models = modelManager.searchModelsByName(q);

      res.json({
        success: true,
        data: models,
        query: q,
        count: models.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar modelos'
      });
    }
  }

  /**
   * GET /api/models/providers
   * Lista todos os provedores disponíveis
   */
  static async getProviders(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      const providers = modelManager.getProviders();

      res.json({
        success: true,
        data: providers,
        count: providers.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar provedores'
      });
    }
  }

  /**
   * GET /api/models/free
   * Retorna apenas modelos gratuitos
   */
  static async getFreeModels(req: Request, res: Response): Promise<void> {
    try {
      const modelManager = getModelManagerService();
      const models = modelManager.getFreeModels();

      res.json({
        success: true,
        data: models,
        count: models.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao buscar modelos gratuitos'
      });
    }
  }
}
