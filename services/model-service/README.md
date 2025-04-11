# Model Service

Model Service is a microservice component of the MCP Manager Pro platform that provides an interface for interacting with Ollama models.

## Features

- Health check endpoint for monitoring service status
- Ollama API connectivity checking
- Model information retrieval (coming soon)
- Model list management (coming soon)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Ollama server running and accessible

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=4001
OLLAMA_API_URL=http://localhost:11434
OLLAMA_API_TIMEOUT=10000
OLLAMA_API_RETRY_COUNT=3
OLLAMA_API_RETRY_DELAY=1000
```

### Installation

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

### Docker

Development:
```bash
docker build -t mcp-model-service:dev -f Dockerfile.dev .
docker run -p 4001:4001 mcp-model-service:dev
```

Production:
```bash
docker build -t mcp-model-service:latest .
docker run -p 4001:4001 mcp-model-service:latest
```

## API Endpoints

### Health Check

- `GET /health`: Check if the service is running
- `GET /health/ollama`: Check if the Ollama API is accessible

## Testing

Run the test suite:

```bash
pnpm test
```

### Integration Tests

For integration tests to pass, you need to:

1. Have the model service running on port 4001
2. Have Ollama server accessible

Run integration tests separately:

```bash
pnpm test tests/integration
```

Or use the test script:

```bash
./test-ollama-api.sh
```

## License

Copyright © 2023 MCP. All rights reserved.
