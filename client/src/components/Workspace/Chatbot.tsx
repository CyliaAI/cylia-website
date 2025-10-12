import { useGlobalContext } from "@/context/GlobalContext"
import { Mic, Plus, Send, Paperclip, Image, FileText } from "lucide-react"
import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react"
import axios from "axios"

type MessageType = 'user' | 'bot'

interface Message {
  id: number
  type: MessageType
  content: string
  timestamp: Date
}

const Chatbot: React.FC = () => {
  const { name } = useGlobalContext()
  const [dropdown, setDropdown] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const fetchBotResponse = async (userMessage: string) => {
    const message = axios.post(`${import.meta.env.VITE_BACKEND_URL}/chatbot/chat`, { model:"gemini-2.5-flash", text: userMessage })
    .then(res => {
      return res.data.result
    })
    .catch(err => {
      console.error(err);
    })

    return message
  }

  const handleSubmit = async (e?: FormEvent<HTMLFormElement | HTMLDivElement>) => {
    e?.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsTyping(true)

    const botReply = await fetchBotResponse(currentInput)

    const botMessage: Message = {
      id: Date.now(),
      type: 'bot',
      content: botReply,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleAttachment = (type: 'file' | 'image' | 'document') => {
    setDropdown(false)
    const fileTypes: Record<string, string> = {
      file: 'any file',
      image: 'an image',
      document: 'a document'
    }

    const botMessage: Message = {
      id: Date.now(),
      type: 'bot',
      content: `File upload feature coming soon! You'll be able to upload ${fileTypes[type] || 'files'} here.`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, botMessage])
  }

  const handleVoiceInput = () => {
    const botMessage: Message = {
      id: Date.now(),
      type: 'bot',
      content: 'Voice input feature is currently in development. Stay tuned!',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, botMessage])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="rounded-b-3xl relative">
          {dropdown && (
            <div className="absolute bottom-full mb-1 bg-[#1a2332] border border-[#718FD6]/30 rounded-2xl shadow-[0px_0px_20px_#2B3340] overflow-hidden">
              <button
                onClick={() => handleAttachment('file')}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all w-full text-left"
              >
                <Paperclip className="text-[#65728F]" size={18} />
                <span className="text-sm text-gray-300">Attach File</span>
              </button>
              <button
                onClick={() => handleAttachment('image')}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all w-full text-left"
              >
                <Image className="text-[#65728F]" size={18} />
                <span className="text-sm text-gray-300">Upload Image</span>
              </button>
              <button
                onClick={() => handleAttachment('document')}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all w-full text-left"
              >
                <FileText className="text-[#65728F]" size={18} />
                <span className="text-sm text-gray-300">Upload Document</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-2xl border bg-[#161D2D] border-[#718FD6] shadow-[0px_20px_20px_#2B3340]">
            <button
              onClick={() => setDropdown(!dropdown)}
              className="p-[16px] hover:bg-white/5 transition-all rounded-l-2xl group relative cursor-pointer"
            >
              <Plus className={`text-[#65728F] group-hover:text-white transition-all ${dropdown ? "rotate-45" : ""}`} />
            </button>
            
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Create an email to summarize the PDF to my boss..."
              className="flex-1 bg-transparent focus:outline-none text-gray-200 placeholder:text-[#65728F] py-3 px-2"
            />
            
            <button
              onClick={handleVoiceInput}
              className="p-[16px] hover:bg-white/5 transition-all group cursor-pointer"
            >
              <Mic className="text-[#65728F] group-hover:text-white transition-colors" />
            </button>
            
            <button
              onClick={(e) => handleSubmit(e)}
              disabled={!inputValue.trim()}
              className="p-3 m-2 bg-gradient-to-r cursor-pointer from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all rounded-xl duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg"
            >
              <Send className="text-white" size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-4 pt-6 scrollbar-thumb-emerald-500 scrollbar-thin scrollbar-track-transparent scrollbar-rounded">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`rounded-full flex items-center text-white justify-center flex-shrink-0 ${
                message.type === 'bot' 
                  ? '' 
                  : 'bg-gradient-to-br w-8 h-8 from-green-500 to-emerald-600'
              }`}>
                {message.type === 'bot' ? <></> : <p>{name ? name[0] : "N"}</p>}
              </div>
              
              <div className={`max-w-[70%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl ${
                  message.type === 'bot'
                    ? 'bg-[#161D2D] border border-[#718FD6]/30 text-gray-200'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                </div>
                <span className="text-xs text-[#65728F] px-2">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="border border-[#718FD6]/30 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#65728F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#65728F] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#65728F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}

export default Chatbot
