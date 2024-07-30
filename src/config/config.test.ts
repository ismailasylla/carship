import dotenv from 'dotenv';
import config from '../config/service';

dotenv.config();

describe('Configuration', () => {
  beforeEach(() => {
    process.env.MONGO_URI = 'mongodb://localhost/testdb';
    process.env.JWT_SECRET = 'testsecret';
    process.env.PORT = '3000';
  });

  afterEach(() => {
    delete process.env.MONGO_URI;
    delete process.env.JWT_SECRET;
    delete process.env.PORT;
  });

  it('should load MONGO_URI from environment variables', () => {
    expect(config.MONGO_URI).toBe('mongodb://localhost/testdb');
  });

  it('should load JWT_SECRET from environment variables', () => {
    expect(config.JWT_SECRET).toBe('testsecret');
  });

  it('should load PORT from environment variables', () => {
    expect(config.PORT).toBe('3000');
  });

  it('should use default PORT value if environment variable is not set', () => {
    delete process.env.PORT;
    const newConfig = require('./config.service').default;
    expect(newConfig.PORT).toBe('5001');
  });
});
