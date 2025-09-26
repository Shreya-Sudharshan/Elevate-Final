import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useModuleStore } from '../../stores/moduleStore';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  isFullscreen?: boolean;
}

export const ChatBot: React.FC<ChatBotProps> = ({ isFullscreen = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI Career Coach powered by OpenAI. I can help you with:\n\n📋 **Task Management** - Check your learning checklist and mark items complete\n🎯 **Career Guidance** - Get personalized career development advice\n📚 **Learning Paths** - Discover what to learn next based on your role\n🏢 **Company Policies** - Answer questions about company guidelines\n\nTry asking me: \"What's on my checklist?\" or \"What should I learn next?\"",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore(state => state.user);

  const modules = useModuleStore(state => state.modules);

  const recommendFromModules = () => {
    const role = user?.role;
    const relevant = modules.filter(m => role==='Business Analyst' ? m.id.startsWith('ba-') : m.id.startsWith('ds-'));
    const incomplete = relevant.filter(m => (m.progress ?? 0) < 100).slice(0,3);
    if(!role) return "No role set.";
    if(incomplete.length===0) return `All modules complete for ${role}!`;
    return `Next steps for ${role}:
${incomplete.map(m => `• ${m.title} (${m.category})`).join('\n')}`;
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Test server connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch("http://localhost:3001/health");
        setIsConnected(response.ok);
      } catch (error) {
        console.error("Server connection failed:", error);
        setIsConnected(false);
      }
    };

    testConnection();
  }, []);

  const callChatAPI = async (userMessage: string): Promise<string> => {
    if (!user?.id) {
      return "⚠️ I can't find your user ID. Please log in again to use the chat features.";
    }

    if (!isConnected) {
      return "I'm having trouble connecting to the server. Please check that the backend is running on port 3001.";
    }

    try {
      const conversationHistory = messages
        .filter(msg => msg.type !== 'system')
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: typeof msg.content === 'string' ? msg.content : String(msg.content)
        }));

      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          messages: [
            ...conversationHistory,
            { role: "user", content: userMessage }
          ],
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Chat API response:", data);

      // Ensure we return a string
      let responseText = "";
      if (data.response) {
        responseText = typeof data.response === 'string' ? data.response : JSON.stringify(data.response, null, 2);
      } else if (data.message) {
        responseText = typeof data.message === 'string' ? data.message : JSON.stringify(data.message, null, 2);
      } else {
        responseText = "I received a response but couldn't format it properly. Please try again.";
      }

      return responseText;

    } catch (err) {
      console.error("Chat API error:", err);
      setIsConnected(false);
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        return "🔌 I can't reach the server. Please make sure the backend is running on http://localhost:3001";
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return `💥 Technical issue: ${errorMessage}. Please try again or contact support.`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await callChatAPI(currentInput);
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsConnected(true); // Reset connection status on successful response
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "🚫 I apologize, but I'm experiencing technical difficulties. Please try again or contact support if the problem continues.",
        timestamp: new Date()
      };
      setMessages(prev => [
        ...prev,
        errorResponse,
        { id: (Date.now() + 2).toString(), type: 'bot', content: recommendFromModules(), timestamp: new Date() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const retryConnection = async () => {
    try {
      const response = await fetch("http://localhost:3001/health");
      setIsConnected(response.ok);
      if (response.ok) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'system',
          content: '✅ Connection restored! You can now continue chatting.',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error("Retry connection failed:", error);
      setIsConnected(false);
    }
  };

  const quickActions = [
    "What's on my checklist today?",
    "What should I learn next?",
    "How can I improve my skills?",
    "Tell me about company policies",
    "Show my learning progress"
  ];

  const formatMessage = (content: any) => {
    // Ensure content is a string and handle edge cases
    if (content === null || content === undefined) {
      return 'No content available';
    }
    
    // Convert to string if it's not already
    const stringContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    
    try {
      // Simple formatting for better readability
      return stringContent
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/\n/g, '<br />'); // Line breaks
    } catch (error) {
      console.error('Error formatting message:', error, 'Content:', content);
      return String(stringContent); // Fallback to plain string
    }
  };

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'max-h-screen' : 'max-h-[calc(100vh-80px)]'}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-[#D6D9E0] bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0B2447]">AI Career Coach</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            {!isConnected && (
              <button
                onClick={retryConnection}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Retry connection"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        {user && (
          <p className="text-sm text-gray-600 mt-1">
            Welcome, {user.firstName}! Level {user.level} • {user.currentXp} XP
          </p>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.type === 'user' 
                ? 'bg-[#0A6ED1]' 
                : message.type === 'system'
                ? 'bg-yellow-100'
                : 'bg-[#E8EAF6]'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className={`w-4 h-4 ${message.type === 'system' ? 'text-yellow-600' : 'text-[#0A6ED1]'}`} />
              )}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-[#0A6ED1] text-white'
                  : message.type === 'system'
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  : 'bg-[#F5F7FA] text-[#0B2447]'
              }`}
            >
              <div 
                className="text-sm leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: formatMessage(message.content) 
                }}
              />
              <p className={`text-xs mt-1 ${
                message.type === 'user' 
                  ? 'text-blue-100' 
                  : message.type === 'system'
                  ? 'text-yellow-600'
                  : 'text-[#4A5568]'
              }`}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#E8EAF6] rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#0A6ED1]" />
            </div>
            <div className="bg-[#F5F7FA] p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#4A5568] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#4A5568] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#4A5568] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="flex-shrink-0 p-4 border-t border-[#D6D9E0] bg-white">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your tasks, career advice, or company policies..."
            className="flex-1 px-3 py-2 border border-[#D6D9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent resize-none placeholder:text-sm placeholder:text-gray-500"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
            disabled={!isConnected}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping || !isConnected}
            className="bg-[#0A6ED1] hover:bg-[#0859ab] text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => handleSuggestionClick(action)}
              disabled={!isConnected}
              className="px-3 py-1 bg-[#E8EAF6] text-[#0A6ED1] rounded-full text-xs hover:bg-[#0A6ED1] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {action}
            </button>
          ))}
        </div>
        
        {/* Connection Status Message */}
        {!isConnected && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600">
              ⚠️ Not connected to server. Make sure the backend is running on http://localhost:3001
            </p>
          </div>
        )}
      </div>
    </div>
  );
};