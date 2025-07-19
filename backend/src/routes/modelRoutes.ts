import { Router } from 'express';
import { ModelController } from '../controllers/ModelController';

const router = Router();

// Rotas para listagem geral
router.get('/', ModelController.getAllModels);
router.get('/list', ModelController.getModelsList);

// Rotas para busca e filtros
router.get('/search', ModelController.searchModels);
router.get('/filter', ModelController.filterModels);

// Rotas para categorias e metadados
router.get('/categories', ModelController.getCategories);
router.get('/features', ModelController.getFeatures);
router.get('/stats', ModelController.getModelStats);
router.get('/providers', ModelController.getProviders);

// Rotas para filtros específicos
router.get('/recommended', ModelController.getRecommendedModels);
router.get('/budget', ModelController.getBudgetModels);
router.get('/coding', ModelController.getCodingModels);
router.get('/large-context', ModelController.getLargeContextModels);
router.get('/free', ModelController.getFreeModels);

// Rotas para sugestões
router.get('/suggest/:useCase', ModelController.suggestModels);

// Rotas para modelos específicos e categorias (devem vir por último)
router.get('/category/:categoryId', ModelController.getModelsByCategory);
router.get('/:modelId', ModelController.getModelById);

// Rota para recarregar dados
router.post('/reload', ModelController.reloadModels);

export { router as default };
