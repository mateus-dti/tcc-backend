/**
 * Exemplo avançado de uso do OpenRouterService
 * Demonstra conversação com contexto e diferentes modelos
 */

import { getOpenRouterService, OpenRouterMessage } from '../src/services/OpenRouterService';

async function exemploAvancado() {
  console.log('🚀 Exemplo avançado - OpenRouter Service\n');

  try {
    const openRouter = getOpenRouterService();

    // 1. Buscar modelos baratos
    console.log('1. 🔍 Buscando modelos econômicos...');
    const modelosBaratos = await openRouter.getFilteredModels({
      maxPrice: 0.001,
      minContextLength: 4000
    });
    
    console.log(`   📊 Encontrados: ${modelosBaratos.length} modelos econômicos`);
    if (modelosBaratos.length > 0) {
      console.log(`   🎯 Usando: ${modelosBaratos[0].name}`);
    }

    const modeloEscolhido = modelosBaratos[0]?.id || 'openai/gpt-3.5-turbo';

    // 2. Conversa com contexto
    console.log('\n2. 💬 Iniciando conversa com contexto...');
    
    let mensagens: OpenRouterMessage[] = [
      {
        role: 'system',
        content: 'Você é um assistente especializado em programação que responde de forma concisa e prática.'
      },
      {
        role: 'user',
        content: 'Olá! Preciso de ajuda com TypeScript.'
      }
    ];

    let resultado = await openRouter.conversationChat(modeloEscolhido, mensagens, {
      maxTokens: 200,
      temperature: 0.7
    });

    console.log('   🤖 IA:', resultado.response);
    console.log('   📊 Tokens usados:', resultado.usage.total_tokens);

    // Continuar a conversa
    mensagens = resultado.updatedMessages;
    mensagens.push({
      role: 'user',
      content: 'Como criar uma interface TypeScript para uma API REST?'
    });

    resultado = await openRouter.conversationChat(modeloEscolhido, mensagens, {
      maxTokens: 300,
      temperature: 0.7
    });

    console.log('\n   👨‍💻 Pergunta: Como criar uma interface TypeScript para uma API REST?');
    console.log('   🤖 IA:', resultado.response);

    // 3. Calcular custos
    console.log('\n3. 💰 Calculando custos da conversa...');
    const modelo = await openRouter.getModels().then(models => 
      models.find(m => m.id === modeloEscolhido)
    );

    if (modelo) {
      const custoTotal = openRouter.calculateEstimatedCost(
        modelo,
        resultado.usage.prompt_tokens,
        resultado.usage.completion_tokens
      );

      console.log(`   💸 Custo da conversa: $${custoTotal.totalCost.toFixed(6)}`);
      console.log(`   📝 Prompt: $${custoTotal.promptCost.toFixed(6)}`);
      console.log(`   🔄 Completion: $${custoTotal.completionCost.toFixed(6)}`);
    }

    // 4. Comparar modelos
    console.log('\n4. ⚖️ Comparando diferentes modelos...');
    
    const modelos = ['openai/gpt-3.5-turbo', 'anthropic/claude-3-haiku'];
    const pergunta = 'Explique o conceito de API REST em uma frase.';

    for (const modelo of modelos) {
      try {
        const resposta = await openRouter.sendMessage(modelo, pergunta, undefined, {
          maxTokens: 100,
          temperature: 0.5
        });
        
        console.log(`   🎯 ${modelo}:`);
        console.log(`      ${resposta.substring(0, 100)}...`);
      } catch (error) {
        console.log(`   ❌ ${modelo}: Erro - ${error.message}`);
      }
    }

    console.log('\n✅ Exemplo concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Dica: Configure sua OPENROUTER_API_KEY no arquivo .env');
      console.log('   Obtenha sua chave em: https://openrouter.ai/keys');
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  exemploAvancado();
}

export { exemploAvancado };
