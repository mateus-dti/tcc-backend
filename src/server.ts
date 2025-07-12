import app from './app';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API: http://localhost:${PORT}/api`);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recebido. Desligando servidor graciosamente...');
  server.close(() => {
    console.log('✅ Servidor fechado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT recebido. Desligando servidor graciosamente...');
  server.close(() => {
    console.log('✅ Servidor fechado');
    process.exit(0);
  });
});

export default server;
