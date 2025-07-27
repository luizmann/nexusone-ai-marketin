import OpenAI from 'openai';

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

// NexBrain Assistant ID
export const NEXBRAIN_ASSISTANT_ID = 'asst_0jsx8eD6P3W9XGsSRRNU2Pfd';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  threadId?: string;
}

export interface AssistantResponse {
  message: string;
  threadId: string;
  runId: string;
  status: 'completed' | 'failed' | 'in_progress';
}

class OpenAIChatService {
  private threads: Map<string, string> = new Map();

  async createThread(): Promise<string> {
    try {
      const thread = await openai.beta.threads.create();
      return thread.id;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new Error('Failed to create conversation thread');
    }
  }

  async sendMessage(
    userPrompt: string, 
    threadId?: string,
    userId?: string
  ): Promise<AssistantResponse> {
    try {
      // Get or create thread
      let currentThreadId = threadId;
      if (!currentThreadId) {
        if (userId && this.threads.has(userId)) {
          currentThreadId = this.threads.get(userId)!;
        } else {
          currentThreadId = await this.createThread();
          if (userId) {
            this.threads.set(userId, currentThreadId);
          }
        }
      }

      // Add user message to thread
      await openai.beta.threads.messages.create(currentThreadId, {
        role: "user",
        content: userPrompt,
      });

      // Create and run assistant
      const run = await openai.beta.threads.runs.create(currentThreadId, {
        assistant_id: NEXBRAIN_ASSISTANT_ID,
        additional_instructions: `
          You are NexBrain, the AI assistant for NexusOne Platform. 
          Help users with:
          - Marketing automation strategies
          - Content generation ideas
          - Campaign optimization
          - Dropshipping business advice
          - AI-powered business solutions
          
          Always be helpful, professional, and focused on driving business results.
          Provide actionable insights and specific recommendations.
        `
      });

      // Wait for completion
      const response = await this.waitForCompletion(currentThreadId, run.id);
      
      return {
        message: response,
        threadId: currentThreadId,
        runId: run.id,
        status: 'completed'
      };

    } catch (error) {
      console.error('Error sending message to assistant:', error);
      throw new Error('Failed to get assistant response');
    }
  }

  private async waitForCompletion(threadId: string, runId: string): Promise<string> {
    let status = "queued";
    let attempts = 0;
    const maxAttempts = 60; // 1 minute timeout

    while (status !== "completed" && attempts < maxAttempts) {
      const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
      status = runStatus.status;
      
      if (status === "failed") {
        throw new Error('Assistant run failed');
      }
      
      if (status === "requires_action") {
        // Handle function calls if needed
        break;
      }
      
      if (status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      }
    }

    if (attempts >= maxAttempts) {
      throw new Error('Assistant response timeout');
    }

    // Get the latest message
    const messages = await openai.beta.threads.messages.list(threadId, {
      order: 'desc',
      limit: 1
    });

    if (messages.data.length === 0) {
      throw new Error('No response from assistant');
    }

    const lastMessage = messages.data[0];
    if (lastMessage.content[0].type === 'text') {
      return lastMessage.content[0].text.value;
    }

    throw new Error('Invalid response format');
  }

  async getThreadHistory(threadId: string): Promise<ChatMessage[]> {
    try {
      const messages = await openai.beta.threads.messages.list(threadId, {
        order: 'asc'
      });

      return messages.data.map((msg, index) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content[0].type === 'text' ? msg.content[0].text.value : '',
        timestamp: new Date(msg.created_at * 1000),
        threadId: threadId
      }));
    } catch (error) {
      console.error('Error getting thread history:', error);
      return [];
    }
  }

  async generateContent(prompt: string, type: 'marketing' | 'sales' | 'social' = 'marketing'): Promise<string> {
    try {
      const systemPrompts = {
        marketing: `Generate high-converting marketing content that drives action. 
                   Focus on benefits, emotional triggers, and clear CTAs.`,
        sales: `Create persuasive sales copy that overcomes objections and drives conversions. 
               Use proven sales psychology and urgency techniques.`,
        social: `Write engaging social media content that builds brand awareness and engagement. 
                Use trending formats and platform-specific best practices.`
      };

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompts[type]
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    }
  }

  async analyzeImage(imageUrl: string, query: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: query },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        max_tokens: 500
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }
}

export const openaiChatService = new OpenAIChatService();
export default openai;