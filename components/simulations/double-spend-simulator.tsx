'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'rejected';
}

interface Node {
  id: string;
  name: string;
  balance: number;
  hasSeenTx1: boolean;
  hasSeenTx2: boolean;
  choice: 'tx1' | 'tx2' | null;
}

export default function DoubleSpendSimulator() {
  const [step, setStep] = useState(0);
  const [aliceBalance, setAliceBalance] = useState(10);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      name: 'Node A',
      balance: 0,
      hasSeenTx1: false,
      hasSeenTx2: false,
      choice: null,
    },
    {
      id: '2',
      name: 'Node B',
      balance: 0,
      hasSeenTx1: false,
      hasSeenTx2: false,
      choice: null,
    },
    {
      id: '3',
      name: 'Node C',
      balance: 0,
      hasSeenTx1: false,
      hasSeenTx2: false,
      choice: null,
    },
    {
      id: '4',
      name: 'Node D',
      balance: 0,
      hasSeenTx1: false,
      hasSeenTx2: false,
      choice: null,
    },
    {
      id: '5',
      name: 'Node E',
      balance: 0,
      hasSeenTx1: false,
      hasSeenTx2: false,
      choice: null,
    },
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const steps = [
    'Create Double-Spend Transaction',
    'Broadcast to Network',
    'Network Consensus',
    'Result',
  ];

  const createDoubleSpend = () => {
    const tx1: Transaction = {
      id: 'tx1',
      from: 'Alice',
      to: 'Bob',
      amount: 10,
      timestamp: new Date(),
      status: 'pending',
    };

    const tx2: Transaction = {
      id: 'tx2',
      from: 'Alice',
      to: 'Charlie',
      amount: 10,
      timestamp: new Date(Date.now() + 100),
      status: 'pending',
    };

    setTransactions([tx1, tx2]);
    setStep(1);
  };

  const broadcastToNetwork = async () => {
    setIsSimulating(true);

    for (let i = 0; i < nodes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));

      setNodes(prev =>
        prev.map((node, index) => {
          if (index === i) {
            const firstTx = Math.random() > 0.5 ? 'tx1' : 'tx2';
            return {
              ...node,
              hasSeenTx1: firstTx === 'tx1',
              hasSeenTx2: firstTx === 'tx2',
            };
          }
          return node;
        })
      );
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    setNodes(prev =>
      prev.map(node => ({
        ...node,
        hasSeenTx1: true,
        hasSeenTx2: true,
      }))
    );

    setIsSimulating(false);
    setStep(2);
  };

  const runConsensus = async () => {
    setIsSimulating(true);

    const updatedNodes = nodes.map(node => ({
      ...node,
      choice: Math.random() > 0.3 ? 'tx1' : ('tx2' as 'tx1' | 'tx2'),
    }));

    setNodes(updatedNodes);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const tx1Votes = updatedNodes.filter(node => node.choice === 'tx1').length;
    const tx2Votes = updatedNodes.filter(node => node.choice === 'tx2').length;

    const winningTx = tx1Votes > tx2Votes ? 'tx1' : 'tx2';

    setTransactions(prev =>
      prev.map(tx => ({
        ...tx,
        status: tx.id === winningTx ? 'confirmed' : 'rejected',
      }))
    );

    setIsSimulating(false);
    setStep(3);
  };

  const reset = () => {
    setStep(0);
    setTransactions([]);
    setNodes(
      nodes.map(node => ({
        ...node,
        hasSeenTx1: false,
        hasSeenTx2: false,
        choice: null,
      }))
    );
    setAliceBalance(10);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">
          Double-Spend Attack Simulator
        </h3>
        <p className="text-muted-foreground">
          Try to double-spend digital money and see why blockchain prevents it
        </p>
      </div>

      <Card className="p-4">
        <div className="flex justify-between items-center">
          {steps.map((stepTitle, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step > index
                    ? 'bg-green-600 text-white'
                    : step === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > index ? <CheckCircle className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={`ml-2 text-sm ${
                  step >= index ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {stepTitle}
              </span>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 mx-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <h3 className="font-semibold mt-2">Alice</h3>
            <div className="flex items-center gap-1 mt-1">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{aliceBalance} coins</span>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                B
              </div>
              <h4 className="font-medium mt-1">Bob</h4>
              <p className="text-sm text-muted-foreground">Coffee Shop</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                C
              </div>
              <h4 className="font-medium mt-1">Charlie</h4>
              <p className="text-sm text-muted-foreground">Book Store</p>
            </div>
          </div>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">
                The Double-Spend Attempt
              </h4>
              <div className="border border-red-200 rounded-lg p-4 mb-6 bg-red-50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-red-700 dark:text-red-300">
                      Attack Scenario
                    </h5>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Alice wants to buy coffee from Bob AND a book from
                      Charlie, but she only has 10 coins. She attempts to spend
                      the same 10 coins twice!
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">
                    Transaction 1 → Bob&apos;s Coffee Shop
                  </h5>
                  <div className="flex justify-between items-center">
                    <span>Alice pays Bob 10 coins for coffee</span>
                    <Badge variant="outline">10 coins</Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">
                    Transaction 2 → Charlie&apos;s Book Store
                  </h5>
                  <div className="flex justify-between items-center">
                    <span>Alice pays Charlie 10 coins for book</span>
                    <Badge variant="outline">10 coins</Badge>
                  </div>
                </div>
              </div>

              <Button onClick={createDoubleSpend} className="w-full mt-6">
                Create Double-Spend Transactions
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">
                Broadcasting to Network
              </h4>

              <div className="space-y-4 mb-6">
                {transactions.map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-medium">
                          Transaction {tx.id.toUpperCase()}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {tx.from} → {tx.to}: {tx.amount} coins
                        </p>
                      </div>
                      <Badge className="bg-yellow-500 text-white">
                        {tx.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={broadcastToNetwork}
                disabled={isSimulating}
                className="w-full"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  'Broadcast to Network Nodes'
                )}
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Network Consensus</h4>

              <div className="grid grid-cols-5 gap-4 mb-6">
                {nodes.map(node => (
                  <motion.div
                    key={node.id}
                    className="text-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: parseInt(node.id) * 0.1 }}
                  >
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                          node.choice === 'tx1'
                            ? 'bg-green-500'
                            : node.choice === 'tx2'
                              ? 'bg-red-500'
                              : 'bg-gray-500'
                        }`}
                      >
                        <Users className="h-6 w-6" />
                      </div>
                      {node.hasSeenTx1 && node.hasSeenTx2 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Clock className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium mt-1">{node.name}</p>
                    {node.choice && (
                      <Badge
                        variant={
                          node.choice === 'tx1' ? 'default' : 'secondary'
                        }
                        className="text-xs mt-1"
                      >
                        {node.choice.toUpperCase()}
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <h5 className="font-semibold">How Consensus Works</h5>
                </div>
                <p className="text-sm text-muted-foreground">
                  Each network node validates transactions and votes on which
                  one is valid. The majority decision becomes the truth!
                </p>
              </div>

              <Button
                onClick={runConsensus}
                disabled={isSimulating}
                className="w-full"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Consensus...
                  </>
                ) : (
                  'Start Consensus Process'
                )}
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Consensus Result</h4>

              <div className="space-y-4 mb-6">
                {transactions.map(tx => (
                  <div
                    key={tx.id}
                    className={`border rounded-lg p-4 ${
                      tx.status === 'confirmed'
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                        : 'border-red-500 bg-red-50 dark:bg-red-950/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-medium">
                          Transaction {tx.id.toUpperCase()}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {tx.from} → {tx.to}: {tx.amount} coins
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {tx.status === 'confirmed' ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <Badge className="bg-green-500 text-white">
                              Confirmed
                            </Badge>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-red-500" />
                            <Badge variant="destructive">Rejected</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-green-700 dark:text-green-300">
                      Double-Spend Prevented! 🛡️
                    </h5>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      The network consensus prevented Alice from spending the
                      same money twice. Only one transaction was confirmed - the
                      double-spend attack failed!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    {
                      nodes.filter(
                        n =>
                          n.choice ===
                          transactions.find(t => t.status === 'confirmed')?.id
                      ).length
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nodes voted for winner
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-500">
                    {
                      nodes.filter(
                        n =>
                          n.choice ===
                          transactions.find(t => t.status === 'rejected')?.id
                      ).length
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nodes voted against
                  </p>
                </div>
              </div>

              <Button onClick={reset} className="w-full">
                Try Again
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <h5 className="font-semibold mb-2">🧠 Why This Matters</h5>
        <div className="text-sm space-y-2">
          <p>
            • <strong>Digital Scarcity:</strong> Blockchain prevents copying
            digital money
          </p>
          <p>
            • <strong>Consensus:</strong> Network majority decides what&apos;s
            valid
          </p>
          <p>
            • <strong>Immutability:</strong> Once confirmed, transactions
            can&apos;t be reversed
          </p>
          <p>
            • <strong>Trustless:</strong> No central authority needed to prevent
            fraud
          </p>
        </div>
      </Card>
    </div>
  );
}
