import { useState } from 'react'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: '',
  dangerouslyAllowBrowser: true,
})

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const resp = await openai.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [...messages, userMessage],
        max_tokens: 50,
      });

      const aiMessage = {
        role: 'assistant',
        content: resp.choices[0].messages.content,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setInput("");
      setOutput(resp.choice[0].messages.content);
    } catch (err) {
      if (err.status === 429) {
        alert("Anda telah melebihi kuota. Silakan cek billing di https://platform.openai.com/account/billing");
      } else {
        console.error("Error lainnya:", err);
      }
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 h-screen flex flex-col dark:bg-gray-800 dark:text-gray">
      <div className="flex-1 overflow-y-scroll">
        <div className="flex justify-start mt-2 ml-2">
          <div className="bg-gray-300 rounded-lg px-4 py-2 text-black max-w-sm">
            Hi, How can i help you?
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll p-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-sm ${msg.role === 'user'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-black'
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        {
          output ? (
            <div className="flex justify-start mt-2 ml-2">
              <div className="bg-gray-300 rounded-lg px-4 py-2 text-black max-w-sm">
                {output}
              </div>
            </div>
          ) : null
        }
      </div>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center'>
          <input type="text"
            className='w-full border rounded-lg py-2 px-4 dark:bg-gray-700 dark:text-gray-200'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type a message'
          />
          <button
            type='submit'
            className='bg-green-500 hover:bg-green-600 rounded-lg px-4 py-2 text-white ml-2'
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default App
