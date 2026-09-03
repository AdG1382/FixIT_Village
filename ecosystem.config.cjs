module.exports = {
  apps: [
    {
      name: 'fixit-village',
      script: './server/index.js',
      cwd: './',
      instances: 1, // FixIT is in-memory stateful Socket.IO; 1 instance per room engine
      autorestart: true,
      watch: false,
      max_memory_restart: '300M', // Lightweight footprint protects server RAM
      env: {
        NODE_ENV: 'production',
        PORT: 3001 // Change this to any free internal port (e.g. 4050, 5050)
      }
    }
  ]
};
