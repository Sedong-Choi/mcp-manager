-- Seed data for development and testing

-- 기본 모델 설정 데이터
INSERT OR IGNORE INTO model_configs (id, model_name, api_port, status)
VALUES 
  ('fd74f132-4812-4b0e-8acd-5c0dc0175a38', 'gemma-2b', 11434, 'stopped'),
  ('a6e44056-6b8a-4847-b9a0-487e5cbb6d7b', 'llama2-7b', 11434, 'stopped'),
  ('c90ba112-95e6-4832-8169-55b9c701c246', 'mistral-7b', 11434, 'stopped');

-- 기본 MCP 서버 설정 데이터
INSERT OR IGNORE INTO mcp_servers (id, name, type, port, data_path, status)
VALUES 
  ('b8d7f23c-9fc0-4f67-b91e-01c9d3b077a8', 'Local MCP Server', 'Standard', 8080, '/data/mcp-server', 'stopped');
