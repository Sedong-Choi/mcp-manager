export interface Conversation {
  id: string;
  title: string;
  model_name: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string | Date;
}

export interface ModelConfig {
  id: string;
  model_name: string;
  api_port: number;
  status: 'running' | 'stopped';
  last_used: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface McpServer {
  id: string;
  name: string;
  type: string;
  port: number;
  data_path: string;
  status: 'running' | 'stopped';
  created_at: string | Date;
  updated_at: string | Date;
}
