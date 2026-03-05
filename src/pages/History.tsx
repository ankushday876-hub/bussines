import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/ui';
import { formatCurrency } from '../lib/utils';
import { Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function HistoryPage() {
  const { entries, clearHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter((entry) =>
    entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">History</h1>
          <p className="text-xs text-gray-500">Recent calculations</p>
        </div>
        {entries.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-1" /> Clear
          </Button>
        )}
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-medium">No entries found</h3>
          <p className="text-gray-500 text-sm mt-1">
            {entries.length === 0 ? "Start calculating to see history here." : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="p-4 hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{entry.productName}</h3>
                  <p className="text-xs text-gray-500">{entry.category} • {new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-lg text-xs font-bold",
                  entry.profit >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                )}>
                  {entry.profit >= 0 ? "PROFIT" : "LOSS"}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Sale</p>
                  <p className="font-medium">{formatCurrency(entry.totalSale)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">GST</p>
                  <p className="font-medium text-indigo-600">{formatCurrency(entry.gstAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Net</p>
                  <p className={cn("font-bold", entry.profit >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {formatCurrency(Math.abs(entry.profit))}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
