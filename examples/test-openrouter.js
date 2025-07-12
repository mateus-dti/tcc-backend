#!/usr/bin/env node

/**
 * Script de exemplo para testar a integração OpenRouter
 * Execute: node examples/test-openrouter.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testOpenRouterIntegration() {
  console.log('🔍 Testando integração OpenRouter...\n');

  try {
    // 1. Health Check
    console.log('1. 🏥 Verificando health check...');
    const healthResponse = await axios.get(`${BASE_URL}/chat/health`);
    console.log('   ✅ Status:', healthResponse.data.data.openRouterApi ? 'OK' : 'FAIL');
    console.log('   📅 Timestamp:', healthResponse.data.data.timestamp);

    // 2. Listar alguns modelos
    console.log('\n2. 📋 Listando modelos filtrados (GPT)...');
    const modelsResponse = await axios.get(`${BASE_URL}/chat/models/filtered?search=gpt&maxPrice=0.01`);
    console.log(`   📊 Encontrados: ${modelsResponse.data.count} modelos`);
    
    if (modelsResponse.data.data.length > 0) {
      console.log('   🎯 Primeiro modelo:', modelsResponse.data.data[0].name);
      console.log('   💰 Preço prompt:', modelsResponse.data.data[0].pricing.prompt);
    }

    // 3. Enviar mensagem simples
    console.log('\n3. 💬 Enviando mensagem simples...');
    const messageResponse = await axios.post(`${BASE_URL}/chat/message`, {
      model: 'openai/gpt-3.5-turbo',
      message: 'Diga "Olá mundo" em português',
      maxTokens: 50
    });
    
    console.log('   📝 Resposta:', messageResponse.data.data.response);

    // 4. Calcular custo estimado
    console.log('\n4. 💸 Calculando custo estimado...');
    const costResponse = await axios.post(`${BASE_URL}/chat/cost-estimate`, {
      modelId: 'openai/gpt-3.5-turbo',
      promptTokens: 100,
      completionTokens: 50
    });
    
    console.log('   💰 Custo total estimado: $', costResponse.data.data.cost.totalCost.toFixed(6));

    console.log('\n✅ Todos os testes passaram!');

  } catch (error) {
    console.error('\n❌ Erro durante o teste:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', error.response.data);
    } else {
      console.error('   Mensagem:', error.message);
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Dica: Certifique-se de que o servidor está rodando em http://localhost:3000');
    }
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  testOpenRouterIntegration();
}

module.exports = { testOpenRouterIntegration };
