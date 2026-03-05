import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Input, Card } from '../components/ui';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator as CalcIcon } from 'lucide-react';

export default function CalculatorPage() {
  const { addEntry, isPremium, entries } = useApp();
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    gstPercentage: '',
  });

  const [result, setResult] = useState<{
    totalSale: number;
    totalCost: number;
    gstAmount: number;
    profit: number;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Premium check for unlimited entries (simulated limit of 5 for free)
    if (!isPremium && entries.length >= 5) {
      alert('Free limit reached (5 entries). Upgrade to Premium for unlimited entries!');
      return;
    }

    const costPrice = parseFloat(formData.costPrice);
    const sellingPrice = parseFloat(formData.sellingPrice);
    const quantity = parseFloat(formData.quantity);
    const gstPercentage = parseFloat(formData.gstPercentage);

    if (isNaN(costPrice) || isNaN(sellingPrice) || isNaN(quantity) || isNaN(gstPercentage)) {
      alert('Please enter valid numbers');
      return;
    }

    // Calculations based on requirements
    const totalSale = sellingPrice * quantity;
    const totalCost = costPrice * quantity;
    const gstAmount = totalSale * (gstPercentage / 100);
    const profit = totalSale - totalCost - gstAmount;

    const newResult = {
      totalSale,
      totalCost,
      gstAmount,
      profit,
    };

    setResult(newResult);

    addEntry({
      productName: formData.productName,
      category: formData.category,
      costPrice,
      sellingPrice,
      quantity,
      gstPercentage,
      ...newResult,
    });
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      category: '',
      costPrice: '',
      sellingPrice: '',
      quantity: '',
      gstPercentage: '',
    });
    setResult(null);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <CalcIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Business Calculator</h1>
          <p className="text-xs text-gray-500">Calculate Profit, Loss & GST</p>
        </div>
      </header>

      <Card className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            name="productName"
            placeholder="e.g. Wireless Mouse"
            value={formData.productName}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Category"
            name="category"
            placeholder="e.g. Electronics"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cost Price (Per Unit)"
              name="costPrice"
              type="number"
              placeholder="0.00"
              value={formData.costPrice}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
            <Input
              label="Selling Price (Per Unit)"
              name="sellingPrice"
              type="number"
              placeholder="0.00"
              value={formData.sellingPrice}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity Sold"
              name="quantity"
              type="number"
              placeholder="1"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="1"
            />
            <Input
              label="GST Percentage (%)"
              name="gstPercentage"
              type="number"
              placeholder="18"
              value={formData.gstPercentage}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
            />
          </div>

          <Button type="submit" fullWidth size="lg" className="mt-2">
            Calculate & Save
          </Button>
        </form>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-5 border-indigo-100 bg-indigo-50/50">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-gray-900">Calculation Result</h2>
                <Button variant="ghost" size="sm" onClick={resetForm} className="text-xs h-8">
                  New Calculation
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Total Sale</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(result.totalSale)}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Total Cost</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(result.totalCost)}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">GST Amount</p>
                  <p className="text-lg font-bold text-indigo-600">{formatCurrency(result.gstAmount)}</p>
                </div>
                <div className={cn(
                  "p-3 rounded-xl border shadow-sm",
                  result.profit >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                )}>
                  <p className={cn("text-xs mb-1", result.profit >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {result.profit >= 0 ? "Net Profit" : "Net Loss"}
                  </p>
                  <p className={cn("text-lg font-bold", result.profit >= 0 ? "text-emerald-700" : "text-red-700")}>
                    {formatCurrency(Math.abs(result.profit))}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{formData.productName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{formData.quantity}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
