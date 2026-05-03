import { useState } from 'react';
import { Bot, Send } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const AIAnalyst = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Compliance Analyst</h1>
        <p className="text-dark-400">Get AI-powered insights and compliance assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 bg-dark-700 rounded-lg p-3">
                  <p className="text-white">
                    Hello! I'm your AI Compliance Analyst. I can help you with:
                  </p>
                  <ul className="mt-2 space-y-1 text-dark-300 text-sm">
                    <li>• Explaining flagged transactions</li>
                    <li>• Generating compliance reports</li>
                    <li>• Analyzing risk patterns</li>
                    <li>• Recommending remediation actions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-dark-700 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about compliance, transactions, or regulations..."
                  className="flex-1 input"
                />
                <Button variant="primary">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                'Explain latest alert',
                'Generate SAR report',
                'Compliance summary',
                'Risk analysis'
              ].map((action) => (
                <button
                  key={action}
                  className="w-full text-left px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-white text-sm transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyst;

// Made with Bob
