'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  Coins,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionInput {
  id: string;
  previousTxHash: string;
  amount: number;
  address: string;
}

interface TransactionOutput {
  id: string;
  address: string;
  amount: number;
}

interface Transaction {
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  fee: number;
  status: 'building' | 'broadcasting' | 'pending' | 'confirmed';
}

export default function BitcoinTransactionBuilder() {
  const [transaction, setTransaction] = useState<Transaction>({
    inputs: [
      {
        id: '1',
        previousTxHash: '1a2b3c4d...5e6f7890',
        amount: 1.5,
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      },
    ],
    outputs: [
      {
        id: '1',
        address: '1BvBMSEY....4GFg7xJaNVN2',
        amount: 1.0,
      },
    ],
    fee: 0.0001,
    status: 'building',
  });

  const totalInputs = transaction.inputs.reduce(
    (sum, input) => sum + input.amount,
    0
  );
  const totalOutputs = transaction.outputs.reduce(
    (sum, output) => sum + output.amount,
    0
  );
  const changeAmount = totalInputs - totalOutputs - transaction.fee;
  const isValid = changeAmount >= 0 && totalOutputs > 0;

  const addInput = () => {
    const newInput: TransactionInput = {
      id: Date.now().toString(),
      previousTxHash: Math.random().toString(36).substring(2, 15) + '...',
      amount: 0.5,
      address: '1' + Math.random().toString(36).substring(2, 15),
    };
    setTransaction(prev => ({
      ...prev,
      inputs: [...prev.inputs, newInput],
    }));
  };

  const addOutput = () => {
    const newOutput: TransactionOutput = {
      id: Date.now().toString(),
      address: '1' + Math.random().toString(36).substring(2, 15),
      amount: 0.1,
    };
    setTransaction(prev => ({
      ...prev,
      outputs: [...prev.outputs, newOutput],
    }));
  };

  const removeInput = (id: string) => {
    if (transaction.inputs.length > 1) {
      setTransaction(prev => ({
        ...prev,
        inputs: prev.inputs.filter(input => input.id !== id),
      }));
    }
  };

  const removeOutput = (id: string) => {
    if (transaction.outputs.length > 1) {
      setTransaction(prev => ({
        ...prev,
        outputs: prev.outputs.filter(output => output.id !== id),
      }));
    }
  };

  const updateInputAmount = (id: string, amount: number) => {
    setTransaction(prev => ({
      ...prev,
      inputs: prev.inputs.map(input =>
        input.id === id ? { ...input, amount } : input
      ),
    }));
  };

  const updateOutputAmount = (id: string, amount: number) => {
    setTransaction(prev => ({
      ...prev,
      outputs: prev.outputs.map(output =>
        output.id === id ? { ...output, amount } : output
      ),
    }));
  };

  const broadcastTransaction = async () => {
    if (!isValid) return;

    setTransaction(prev => ({ ...prev, status: 'broadcasting' }));
    await new Promise(resolve => setTimeout(resolve, 1000));

    setTransaction(prev => ({ ...prev, status: 'pending' }));
    await new Promise(resolve => setTimeout(resolve, 3000));

    setTransaction(prev => ({ ...prev, status: 'confirmed' }));
  };

  const resetTransaction = () => {
    setTransaction({
      inputs: [
        {
          id: '1',
          previousTxHash: '1a2b3c4d...5e6f7890',
          amount: 1.5,
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        },
      ],
      outputs: [
        {
          id: '1',
          address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
          amount: 1.0,
        },
      ],
      fee: 0.0001,
      status: 'building',
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">
          Bitcoin Transaction Builder
        </h3>
        <p className="text-muted-foreground">
          Build your own Bitcoin transaction and see how inputs, outputs, and
          fees work
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Coins className="h-5 w-5 text-main" />
              Inputs
            </h4>
            <Button size="sm" onClick={addInput}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {transaction.inputs.map(input => (
              <motion.div
                key={input.id}
                layout
                className="p-3 bg-muted rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Previous TX
                  </span>
                  {transaction.inputs.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeInput(input.id)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-xs font-mono">{input.previousTxHash}</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.00000001"
                    value={input.amount}
                    onChange={e =>
                      updateInputAmount(
                        input.id,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="h-8"
                  />
                  <span className="text-sm">BTC</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-2 bg-green-50 dark:bg-green-950/20 rounded text-center">
            <p className="font-semibold">Total: {totalInputs.toFixed(8)} BTC</p>
          </div>
        </Card>

        <div className="flex items-center justify-center">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-primary text-primary-foreground rounded-full p-4"
          >
            <ArrowRight className="h-8 w-8" />
          </motion.div>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Coins className="h-5 w-5 text-main" />
              Outputs
            </h4>
            <Button size="sm" onClick={addOutput}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {transaction.outputs.map(output => (
              <motion.div
                key={output.id}
                layout
                className="p-3 bg-muted rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    To Address
                  </span>
                  {transaction.outputs.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeOutput(output.id)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-xs font-mono">{output.address}</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.00000001"
                    value={output.amount}
                    onChange={e =>
                      updateOutputAmount(
                        output.id,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="h-8"
                  />
                  <span className="text-sm">BTC</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-2 bg-red-50 dark:bg-red-950/20 rounded text-center">
            <p className="font-semibold">
              Total: {totalOutputs.toFixed(8)} BTC
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h4 className="font-semibold mb-4">Transaction Summary</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Inputs:</span>
              <span className="font-mono">{totalInputs.toFixed(8)} BTC</span>
            </div>
            <div className="flex justify-between">
              <span>Total Outputs:</span>
              <span className="font-mono">{totalOutputs.toFixed(8)} BTC</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction Fee:</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.00000001"
                  value={transaction.fee}
                  onChange={e =>
                    setTransaction(prev => ({
                      ...prev,
                      fee: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="h-6 w-24 text-xs"
                />
                <span className="text-sm">BTC</span>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span>Change Amount:</span>
                <span
                  className={cn(
                    'font-mono',
                    changeAmount >= 0 ? 'text-main' : 'text-red-600'
                  )}
                >
                  {changeAmount.toFixed(8)} BTC
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {isValid ? (
                <CheckCircle className="h-5 w-5 text-main" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={cn(isValid ? 'text-main' : 'text-red-600')}>
                {isValid ? 'Transaction Valid' : 'Invalid Transaction'}
              </span>
            </div>

            <div className="space-y-2">
              <Badge
                variant={
                  transaction.status === 'building'
                    ? 'outline'
                    : transaction.status === 'broadcasting'
                      ? 'secondary'
                      : transaction.status === 'pending'
                        ? 'default'
                        : 'default'
                }
              >
                {transaction.status === 'building' && 'Building'}
                {transaction.status === 'broadcasting' && 'Broadcasting...'}
                {transaction.status === 'pending' && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Pending (3 confirmations)
                  </div>
                )}
                {transaction.status === 'confirmed' && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Confirmed!
                  </div>
                )}
              </Badge>

              <div className="flex gap-2">
                {transaction.status === 'building' && (
                  <Button
                    onClick={broadcastTransaction}
                    disabled={!isValid}
                    className="w-full"
                  >
                    Broadcast Transaction
                  </Button>
                )}
                {transaction.status === 'confirmed' && (
                  <Button onClick={resetTransaction} className="w-full">
                    Build New Transaction
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20">
        <h4 className="font-semibold mb-3">💡 Key Concepts</h4>
        <ul className="space-y-2 text-sm">
          <li>
            • <strong>Inputs:</strong> Reference previous transactions where you
            received Bitcoin
          </li>
          <li>
            • <strong>Outputs:</strong> Specify where Bitcoin is being sent and
            how much
          </li>
          <li>
            • <strong>Transaction Fees:</strong> Paid to miners to include your
            transaction in a block
          </li>
          <li>
            • <strong>Change:</strong> Any leftover Bitcoin returns to you
            (inputs - outputs - fees)
          </li>
          <li>
            • <strong>UTXO Model:</strong> Bitcoin uses &quot;unspent
            transaction outputs&quot; rather than account balances
          </li>
        </ul>
      </Card>
    </div>
  );
}
