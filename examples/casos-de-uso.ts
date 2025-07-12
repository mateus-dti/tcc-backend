/**
 * Casos de uso específicos para diferentes tipos de aplicação
 */

import { getOpenRouterService } from '../src/services/OpenRouterService';

export class OpenRouterUseCases {
  private openRouter = getOpenRouterService();

  /**
   * Caso de uso: Chatbot de atendimento ao cliente
   */
  async chatbotAtendimento(mensagemUsuario: string, contextoConversa: string[] = []) {
    const systemPrompt = `
Você é um assistente de atendimento ao cliente profissional e prestativo.
Suas características:
- Sempre cordial e empático
- Oferece soluções práticas
- Escalona para humano quando necessário
- Responde em português brasileiro
- Mantém o tom profissional mas amigável
`;

    const mensagens = [
      { role: 'system' as const, content: systemPrompt },
      ...contextoConversa.map((msg, index) => {
        const role = index % 2 === 0 ? 'user' : 'assistant';
        return {
          role: role as 'user' | 'assistant',
          content: msg
        };
      }),
      { role: 'user' as const, content: mensagemUsuario }
    ];

    return await this.openRouter.conversationChat(
      'anthropic/claude-3-sonnet', // Bom para conversas naturais
      mensagens,
      { maxTokens: 500, temperature: 0.7 }
    );
  }

  /**
   * Caso de uso: Geração de código
   */
  async geradorCodigo(descricao: string, linguagem: string = 'TypeScript') {
    const systemPrompt = `
Você é um expert em programação especializado em ${linguagem}.
Gere código limpo, bem documentado e seguindo as melhores práticas.
Inclua comentários explicativos quando necessário.
Responda APENAS com código, sem explicações adicionais.
`;

    return await this.openRouter.sendMessage(
      'anthropic/claude-3-opus', // Excelente para código
      descricao,
      systemPrompt,
      { maxTokens: 1000, temperature: 0.3 }
    );
  }

  /**
   * Caso de uso: Análise de sentimento
   */
  async analiseSentimento(texto: string) {
    const systemPrompt = `
Analise o sentimento do texto fornecido.
Responda APENAS em formato JSON com:
{
  "sentimento": "positivo|negativo|neutro",
  "confianca": 0.0-1.0,
  "emocoes": ["alegria", "tristeza", "raiva", "medo", "surpresa"],
  "resumo": "breve explicação"
}
`;

    const resposta = await this.openRouter.sendMessage(
      'openai/gpt-3.5-turbo', // Bom custo-benefício para análise
      texto,
      systemPrompt,
      { maxTokens: 200, temperature: 0.1 }
    );

    try {
      return JSON.parse(resposta);
    } catch {
      return { erro: 'Falha ao processar análise', resposta };
    }
  }

  /**
   * Caso de uso: Tradução inteligente
   */
  async traducaoInteligente(texto: string, idiomaDestino: string = 'inglês') {
    const systemPrompt = `
Você é um tradutor profissional especializado.
Traduza o texto mantendo:
- Contexto cultural apropriado
- Tom e estilo originais
- Expressões idiomáticas equivalentes
- Formalidade adequada

Responda APENAS com a tradução, sem explicações.
`;

    return await this.openRouter.sendMessage(
      'openai/gpt-4', // Melhor para nuances linguísticas
      `Traduza para ${idiomaDestino}: "${texto}"`,
      systemPrompt,
      { maxTokens: 300, temperature: 0.2 }
    );
  }

  /**
   * Caso de uso: Sumarização de documentos
   */
  async sumarizarDocumento(documento: string, tamanho: 'curto' | 'medio' | 'longo' = 'medio') {
    const maxTokens = { curto: 150, medio: 300, longo: 500 };
    
    const systemPrompt = `
Crie um resumo ${tamanho} do documento fornecido.
Mantenha os pontos principais e informações críticas.
Use linguagem clara e objetiva.
Organize em tópicos quando apropriado.
`;

    return await this.openRouter.sendMessage(
      'anthropic/claude-3-sonnet', // Bom para sumarização
      documento,
      systemPrompt,
      { maxTokens: maxTokens[tamanho], temperature: 0.4 }
    );
  }

  /**
   * Caso de uso: Classificação de conteúdo
   */
  async classificarConteudo(conteudo: string, categorias: string[]) {
    const systemPrompt = `
Classifique o conteúdo nas seguintes categorias: ${categorias.join(', ')}.
Responda em formato JSON:
{
  "categoria_principal": "nome_da_categoria",
  "confianca": 0.0-1.0,
  "categorias_secundarias": ["cat1", "cat2"],
  "justificativa": "breve explicação"
}
`;

    const resposta = await this.openRouter.sendMessage(
      'openai/gpt-3.5-turbo',
      conteudo,
      systemPrompt,
      { maxTokens: 200, temperature: 0.1 }
    );

    try {
      return JSON.parse(resposta);
    } catch {
      return { erro: 'Falha ao processar classificação', resposta };
    }
  }

  /**
   * Caso de uso: Geração de conteúdo criativo
   */
  async gerarConteudoCreativo(tipo: string, tema: string, estilo: string = 'profissional') {
    const systemPrompt = `
Você é um escritor criativo especializado em ${tipo}.
Estilo: ${estilo}
Crie conteúdo original, envolvente e bem estruturado.
Adapte a linguagem ao público-alvo apropriado.
`;

    return await this.openRouter.sendMessage(
      'anthropic/claude-3-opus', // Excelente para criatividade
      `Crie um(a) ${tipo} sobre: ${tema}`,
      systemPrompt,
      { maxTokens: 800, temperature: 0.8 }
    );
  }

  /**
   * Caso de uso: FAQ automático
   */
  async responderFAQ(pergunta: string, baseConhecimento: string) {
    const systemPrompt = `
Você é um assistente especializado em responder perguntas baseado na base de conhecimento fornecida.
Regras:
- Use APENAS informações da base de conhecimento
- Se não souber, diga "Não encontrei essa informação"
- Seja preciso e direto
- Cite a fonte quando relevante

Base de conhecimento:
${baseConhecimento}
`;

    return await this.openRouter.sendMessage(
      'openai/gpt-3.5-turbo',
      pergunta,
      systemPrompt,
      { maxTokens: 400, temperature: 0.2 }
    );
  }

  /**
   * Utilitário: Escolher melhor modelo para tarefa
   */
  async escolherMelhorModelo(tipoTarefa: string) {
    const recomendacoes = {
      'codigo': ['anthropic/claude-3-opus', 'openai/gpt-4'],
      'conversa': ['anthropic/claude-3-sonnet', 'openai/gpt-3.5-turbo'],
      'analise': ['openai/gpt-4', 'anthropic/claude-3-opus'],
      'traducao': ['openai/gpt-4', 'anthropic/claude-3-sonnet'],
      'criativo': ['anthropic/claude-3-opus', 'openai/gpt-4'],
      'rapido_barato': ['openai/gpt-3.5-turbo', 'anthropic/claude-3-haiku']
    };

    return recomendacoes[tipoTarefa] || recomendacoes['conversa'];
  }
}

// Exemplo de uso
async function exemploUsoCases() {
  const useCases = new OpenRouterUseCases();

  try {
    console.log('🔧 Testando casos de uso específicos...\n');

    // 1. Análise de sentimento
    console.log('1. 😊 Análise de sentimento:');
    const sentimento = await useCases.analiseSentimento(
      'Adorei o produto! Chegou rápido e a qualidade é excelente!'
    );
    console.log('   Resultado:', sentimento);

    // 2. Geração de código
    console.log('\n2. 💻 Geração de código:');
    const codigo = await useCases.geradorCodigo(
      'Função para validar email em TypeScript'
    );
    console.log('   Código gerado:', codigo.substring(0, 200) + '...');

    // 3. Tradução
    console.log('\n3. 🌍 Tradução inteligente:');
    const traducao = await useCases.traducaoInteligente(
      'Que legal! Esse projeto está ficando incrível.',
      'inglês'
    );
    console.log('   Tradução:', traducao);

    console.log('\n✅ Casos de uso testados com sucesso!');

  } catch (error) {
    console.error('❌ Erro nos casos de uso:', error.message);
  }
}

export { exemploUsoCases };

if (require.main === module) {
  exemploUsoCases();
}
