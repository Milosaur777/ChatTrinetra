/**
 * LLM Service
 * Integration with OpenRouter, Ollama, and local models
 */

const axios = require('axios');

// Model routing logic
const modelConfig = {
  // OpenAI models
  'gpt4o': 'openai/gpt-4o',
  'gpt4-turbo': 'openai/gpt-4-turbo',
  'gpt35': 'openai/gpt-3.5-turbo',
  // OpenRouter models
  'haiku': 'openrouter/anthropic/claude-haiku-4.5',
  'gemini': 'openrouter/google/gemini-flash-1.5',
  'opus': 'openrouter/anthropic/claude-opus-4',
  'sonnet': 'openrouter/anthropic/claude-sonnet-4.5',
  'deepseek': 'openrouter/deepseek/deepseek-r1-distill-qwen-32b',
  // Local
  'ollama': 'http://localhost:11434/api/chat'
};

/**
 * Route request to appropriate model based on complexity
 */
function selectModel(userModel = null, complexity = 'simple') {
  if (userModel) return userModel;

  // Auto-routing based on complexity
  switch (complexity) {
    case 'simple':
      return modelConfig.haiku;
    case 'coding':
      return modelConfig.kimi;
    case 'frontend':
      return modelConfig.gemini;
    case 'hard':
      return modelConfig.sonnet;
    default:
      return modelConfig.haiku;
  }
}

/**
 * Send message to LLM
 */
async function chat({ system_prompt, message, file_context, message_history, model }) {
  try {
    const selectedModel = selectModel(model);

    // Build context - file context only, system prompt goes separately
    let context = '';
    if (file_context) {
      context += `Document Context:\n${file_context}\n\n`;
    }

    // Add message history - only take user/assistant content, strip any tool calls
    const messages = [];
    
    if (message_history && message_history.length > 0) {
      message_history.forEach(msg => {
        // Only include regular user/assistant messages
        if (msg.role === 'user' || msg.role === 'assistant') {
          // If content is string, use as-is; if object, stringify it
          const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
          messages.push({
            role: msg.role,
            content: content
          });
        }
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: context + message
    });

    // Call OpenAI
    if (selectedModel.includes('openai/')) {
      return await callOpenAI(selectedModel, messages, system_prompt);
    }
    // Call OpenRouter
    else if (selectedModel.includes('openrouter')) {
      return await callOpenRouter(selectedModel, messages, system_prompt);
    }
    // Call Ollama
    else if (selectedModel === 'ollama' || selectedModel.includes('localhost:11434')) {
      return await callOllama(messages, system_prompt);
    }
  } catch (error) {
    console.error('LLM Service error:', error);
    throw error;
  }
}

/**
 * Call OpenRouter API
 */
async function callOpenRouter(model, messages, system_prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model.replace('openrouter/', ''),
        messages: system_prompt ? [
          { role: 'system', content: system_prompt },
          ...messages
        ] : messages,
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://captainclaw.ai',
          'X-Title': 'CaptainClaw'
        }
      }
    );

    return {
      content: response.data.choices[0].message.content,
      model: model,
      tokens: response.data.usage?.total_tokens || 0
    };
  } catch (error) {
    console.error('OpenRouter API error:', error.response?.data || error.message);
    throw new Error(`OpenRouter error: ${error.message}`);
  }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(model, messages, system_prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  try {
    const modelName = model.replace('openai/', '');
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: modelName,
        messages: system_prompt ? [
          { role: 'system', content: system_prompt },
          ...messages
        ] : messages,
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      content: response.data.choices[0].message.content,
      model: model,
      tokens: response.data.usage?.total_tokens || 0
    };
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error('OpenAI API error:', errorMsg);
    
    // Handle specific OpenAI errors
    if (error.response?.status === 429) {
      throw new Error('OpenAI rate limit exceeded. Please wait a moment and try again.');
    } else if (error.response?.status === 401) {
      throw new Error('OpenAI API key is invalid. Please check your configuration.');
    }
    
    throw new Error(`OpenAI error: ${errorMsg}`);
  }
}

/**
 * Call Ollama (local LLM)
 */
async function callOllama(messages, system_prompt = '') {
  try {
    // Add system prompt to first message if provided
    const messagesWithSystem = system_prompt 
      ? [{ role: 'system', content: system_prompt }, ...messages]
      : messages;

    const ollamaModel = process.env.OLLAMA_MODEL || 'mistral:latest';
    
    const response = await axios.post(
      'http://localhost:11434/api/chat',
      {
        model: ollamaModel,
        messages: messagesWithSystem,
        stream: false
      }
    );

    return {
      content: response.data.message.content,
      model: `ollama/${ollamaModel}`,
      tokens: 0 // Ollama doesn't track tokens
    };
  } catch (error) {
    console.error('Ollama error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Ollama is not running. Make sure OLLAMA is started on port 11434.');
    } else if (error.message.includes('404')) {
      throw new Error('Ollama model not found. Make sure mistral:latest is loaded.');
    }
    throw new Error(`Ollama error: ${error.message}`);
  }
}

module.exports = {
  chat,
  selectModel,
  callOpenAI,
  callOpenRouter,
  callOllama
};
