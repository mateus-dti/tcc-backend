import { createClient, RedisClientType } from 'redis';

export class RedisConfig {
  private static instance: RedisConfig;
  private client: RedisClientType;
  private isConnected: boolean = false;

  private constructor() {
    const redisUrl = `redis://:${process.env.REDIS_PASSWORD || 'tcc_redis_2025'}@${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}/${process.env.REDIS_DB || '0'}`;
    
    this.client = createClient({
      url: redisUrl
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      console.log('Redis Client Ready');
    });

    this.client.on('end', () => {
      console.log('Redis Client Disconnected');
      this.isConnected = false;
    });
  }

  public static getInstance(): RedisConfig {
    if (!RedisConfig.instance) {
      RedisConfig.instance = new RedisConfig();
    }
    return RedisConfig.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.client.connect();
        console.log('Redis connection established successfully');
      }
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.isConnected) {
        await this.client.disconnect();
        console.log('Redis connection closed');
      }
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
      throw error;
    }
  }

  public getClient(): RedisClientType {
    if (!this.isConnected || !this.client.isReady) {
      throw new Error('Redis client is not connected or ready');
    }
    return this.client;
  }

  public isClientConnected(): boolean {
    return this.isConnected;
  }

  public async ping(): Promise<string> {
    try {
      return await this.client.ping();
    } catch (error) {
      console.error('Redis ping failed:', error);
      throw error;
    }
  }
}

export default RedisConfig;
