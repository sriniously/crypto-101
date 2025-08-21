'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowUpDown,
  Droplets,
  TrendingUp,
  Wallet,
  Info,
  RefreshCw,
} from 'lucide-react';
import { TokenETH, TokenUSDC, TokenDAI, TokenUNI } from '@web3icons/react';

interface Token {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  icon: React.ComponentType<{
    size?: number;
    variant?: string;
    className?: string;
  }>;
}

interface Pool {
  id: string;
  token0: string;
  token1: string;
  reserve0: number;
  reserve1: number;
  totalLiquidity: number;
  fee: number;
  apy: number;
}

export default function DeFiExplorer() {
  const [selectedTab, setSelectedTab] = useState('swap');
  const [swapAmount, setSwapAmount] = useState('1.0');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [liquidityAmount, setLiquidityAmount] = useState('100');
  const [lendAmount, setLendAmount] = useState('1000');

  const [wallet, setWallet] = useState<Token[]>([
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 10.5,
      price: 2000,
      icon: TokenETH as any,
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 5000,
      price: 1,
      icon: TokenUSDC as any,
    },
    {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      balance: 2000,
      price: 1,
      icon: TokenDAI,
    },
    { symbol: 'UNI', name: 'Uniswap', balance: 100, price: 8, icon: TokenUNI },
  ]);

  const [pools] = useState<Pool[]>([
    {
      id: 'eth-usdc',
      token0: 'ETH',
      token1: 'USDC',
      reserve0: 1000,
      reserve1: 2000000,
      totalLiquidity: 1500000,
      fee: 0.3,
      apy: 12.5,
    },
    {
      id: 'dai-usdc',
      token0: 'DAI',
      token1: 'USDC',
      reserve0: 1000000,
      reserve1: 1000000,
      totalLiquidity: 2000000,
      fee: 0.05,
      apy: 8.2,
    },
  ]);

  const getPrice = (from: string, to: string, amount: number) => {
    if (from === 'ETH' && to === 'USDC') return amount * 2000;
    if (from === 'USDC' && to === 'ETH') return amount / 2000;
    if (from === 'DAI' && to === 'USDC') return amount;
    if (from === 'USDC' && to === 'DAI') return amount;
    return amount;
  };

  const executeSwap = () => {
    const amount = parseFloat(swapAmount);
    const outputAmount = getPrice(fromToken, toToken, amount);

    setWallet(prev =>
      prev.map(token => {
        if (token.symbol === fromToken) {
          return { ...token, balance: token.balance - amount };
        }
        if (token.symbol === toToken) {
          return { ...token, balance: token.balance + outputAmount * 0.997 };
        }
        return token;
      })
    );

    setSwapAmount('');
  };

  const provideLiquidity = () => {
    const amount = parseFloat(liquidityAmount);
    setWallet(prev =>
      prev.map(token => {
        if (token.symbol === 'USDC') {
          return { ...token, balance: token.balance - amount };
        }
        return token;
      })
    );
  };

  const lendTokens = () => {
    const amount = parseFloat(lendAmount);
    setWallet(prev =>
      prev.map(token => {
        if (token.symbol === 'USDC') {
          return { ...token, balance: token.balance - amount };
        }
        return token;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">DeFi Protocol Explorer</h3>
        <p className="text-muted-foreground">
          Experience decentralized finance: swap, provide liquidity, and lend
        </p>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Your Wallet
          </h4>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wallet.map(token => (
            <div key={token.symbol} className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <token.icon size={24} variant="branded" />
                <span className="font-medium">{token.symbol}</span>
              </div>
              <p className="text-sm text-muted-foreground">{token.name}</p>
              <p className="font-semibold">{token.balance.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                ${(token.balance * token.price).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="swap">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Swap
          </TabsTrigger>
          <TabsTrigger value="liquidity">
            <Droplets className="h-4 w-4 mr-2" />
            Liquidity
          </TabsTrigger>
          <TabsTrigger value="lending">
            <TrendingUp className="h-4 w-4 mr-2" />
            Lending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="swap">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">From</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={swapAmount}
                    onChange={e => setSwapAmount(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={fromToken}
                    onChange={e => setFromToken(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    {wallet.map(token => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Balance:{' '}
                  {wallet.find(t => t.symbol === fromToken)?.balance.toFixed(2)}
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const temp = fromToken;
                    setFromToken(toToken);
                    setToToken(temp);
                  }}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  To (estimated)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={
                      swapAmount
                        ? getPrice(
                            fromToken,
                            toToken,
                            parseFloat(swapAmount)
                          ).toFixed(2)
                        : ''
                    }
                    disabled
                    className="flex-1"
                  />
                  <select
                    value={toToken}
                    onChange={e => setToToken(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    {wallet.map(token => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Balance:{' '}
                  {wallet.find(t => t.symbol === toToken)?.balance.toFixed(2)}
                </p>
              </div>

              <div className="rounded-lg p-3 bg-blue-50">
                <div className="flex justify-between text-sm">
                  <span>Price impact:</span>
                  <span className="text-green-600">0.01%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Trading fee:</span>
                  <span>0.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Route:</span>
                  <span>
                    {fromToken} → {toToken}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={executeSwap}
                disabled={!swapAmount || parseFloat(swapAmount) <= 0}
              >
                Swap Tokens
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="liquidity">
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-4">Liquidity Pools</h4>
              <div className="space-y-3">
                {pools.map(pool => (
                  <div key={pool.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-medium">
                          {pool.token0}/{pool.token1}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Fee: {pool.fee}% • TVL: $
                          {pool.totalLiquidity.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="secondary">{pool.apy}% APY</Badge>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Amount in USDC"
                        value={liquidityAmount}
                        onChange={e => setLiquidityAmount(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={provideLiquidity}
                        disabled={!liquidityAmount}
                      >
                        Add Liquidity
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-green-50">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 mt-0.5 text-green-600" />
                <div className="text-sm">
                  <h5 className="font-medium mb-1">
                    How Liquidity Providing Works
                  </h5>
                  <ul className="space-y-1">
                    <li>• Deposit equal value of two tokens into a pool</li>
                    <li>
                      • Earn fees from swaps (typically 0.3% per transaction)
                    </li>
                    <li>• Risk: Impermanent loss if token prices diverge</li>
                    <li>
                      • Rewards: Additional token incentives on top of fees
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lending">
          <div className="space-y-4">
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Lending Markets</h4>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium">Supply Assets</h5>
                  <div className="space-y-3">
                    {wallet.map(token => (
                      <div key={token.symbol} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <token.icon size={20} variant="branded" />
                            <span className="font-medium">{token.symbol}</span>
                          </div>
                          <Badge variant="outline">5.2% APY</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Balance: {token.balance.toFixed(2)} {token.symbol}
                        </p>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={token.symbol === 'USDC' ? lendAmount : ''}
                            onChange={e => setLendAmount(e.target.value)}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={lendTokens}>
                            Supply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium">Borrow Assets</h5>
                  <div className="space-y-3">
                    {wallet.map(token => (
                      <div
                        key={token.symbol}
                        className="border rounded-lg p-3 opacity-60"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <token.icon size={20} variant="branded" />
                            <span className="font-medium">{token.symbol}</span>
                          </div>
                          <Badge variant="destructive">8.1% APR</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Need collateral to borrow
                        </p>
                        <Button size="sm" disabled className="w-full">
                          Supply Collateral First
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-yellow-50">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 mt-0.5 text-orange-600" />
                <div className="text-sm">
                  <h5 className="font-medium mb-1">How Lending Works</h5>
                  <ul className="space-y-1">
                    <li>• Supply: Earn interest on your deposited assets</li>
                    <li>
                      • Borrow: Take loans against your collateral (150%
                      collateral ratio)
                    </li>
                    <li>
                      • Liquidation: If collateral value drops too much,
                      positions get liquidated
                    </li>
                    <li>• Interest rates adjust based on supply and demand</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="p-4">
        <h4 className="font-semibold mb-4">DeFi Protocol Stats</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">$2.4B</p>
            <p className="text-sm text-muted-foreground">Total Value Locked</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">150K</p>
            <p className="text-sm text-muted-foreground">Daily Transactions</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">8.5%</p>
            <p className="text-sm text-muted-foreground">Average APY</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">50+</p>
            <p className="text-sm text-muted-foreground">Supported Tokens</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
