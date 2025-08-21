'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Upload,
  Palette,
  Zap,
  Sparkles,
  Eye,
  Share,
  Download,
} from 'lucide-react';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface NFT {
  id: string;
  tokenId: number;
  metadata: NFTMetadata;
  owner: string;
  mintedAt: Date;
  contract: string;
}

const defaultAttributes = [
  { trait_type: 'Background', value: 'Blue' },
  { trait_type: 'Style', value: 'Abstract' },
  { trait_type: 'Rarity', value: 'Common' },
];

const sampleImages = [
  '🎨',
  '🖼️',
  '🌟',
  '💎',
  '🎭',
  '🎪',
  '🌈',
  '🦄',
  '🎯',
  '🎨',
  '🎪',
  '🎭',
  '🌟',
  '💫',
  '✨',
  '🔮',
];

export default function NFTMintingStudio() {
  const [currentStep, setCurrentStep] = useState(0);
  const [nftData, setNftData] = useState<Partial<NFTMetadata>>({
    name: '',
    description: '',
    image: '',
    attributes: [...defaultAttributes],
  });
  const [mintedNFTs, setMintedNFTs] = useState<NFT[]>([]);
  const [isMinting, setIsMinting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const steps = [
    { id: 0, title: 'Design', icon: Palette },
    { id: 1, title: 'Metadata', icon: Zap },
    { id: 2, title: 'Preview', icon: Eye },
    { id: 3, title: 'Mint', icon: Sparkles },
  ];

  const addAttribute = () => {
    setNftData(prev => ({
      ...prev,
      attributes: [...(prev.attributes || []), { trait_type: '', value: '' }],
    }));
  };

  const updateAttribute = (
    index: number,
    field: 'trait_type' | 'value',
    value: string
  ) => {
    setNftData(prev => ({
      ...prev,
      attributes:
        prev.attributes?.map((attr, i) =>
          i === index ? { ...attr, [field]: value } : attr
        ) || [],
    }));
  };

  const removeAttribute = (index: number) => {
    setNftData(prev => ({
      ...prev,
      attributes: prev.attributes?.filter((_, i) => i !== index) || [],
    }));
  };

  const selectSampleImage = (emoji: string) => {
    setNftData(prev => ({ ...prev, image: emoji }));
  };

  const mintNFT = async () => {
    setIsMinting(true);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const newNFT: NFT = {
      id: Date.now().toString(),
      tokenId: mintedNFTs.length + 1,
      metadata: nftData as NFTMetadata,
      owner: '0x742d35Cc6bF00532e7fa5b5b4DAb7234',
      mintedAt: new Date(),
      contract: '0x1234567890123456789012345678901234567890',
    };

    setMintedNFTs(prev => [...prev, newNFT]);
    setIsMinting(false);
    setCurrentStep(4);
  };

  const resetForm = () => {
    setNftData({
      name: '',
      description: '',
      image: '',
      attributes: [...defaultAttributes],
    });
    setCurrentStep(0);
    setPreviewMode(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">NFT Minting Studio</h3>
        <p className="text-muted-foreground">
          Create, customize, and mint your own unique NFTs
        </p>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="design"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6">
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Design Your NFT
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        NFT Name
                      </label>
                      <Input
                        placeholder="My Awesome NFT"
                        value={nftData.name || ''}
                        onChange={e =>
                          setNftData(prev => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Description
                      </label>
                      <Textarea
                        placeholder="Describe your unique creation..."
                        value={nftData.description || ''}
                        onChange={e =>
                          setNftData(prev => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Choose Image
                      </label>
                      <div className="grid grid-cols-8 gap-2 mb-4">
                        {sampleImages.map((emoji, index) => (
                          <Button
                            key={index}
                            variant={
                              nftData.image === emoji ? 'default' : 'outline'
                            }
                            onClick={() => selectSampleImage(emoji)}
                            className="aspect-square text-2xl p-2"
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Custom Image (Simulated)
                      </Button>
                    </div>

                    <Button
                      onClick={() => setCurrentStep(1)}
                      disabled={!nftData.name || !nftData.image}
                      className="w-full"
                    >
                      Next: Add Metadata
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="metadata"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6">
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    NFT Attributes
                  </h4>

                  <div className="space-y-4">
                    {nftData.attributes?.map((attr, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Trait type (e.g., Color)"
                          value={attr.trait_type}
                          onChange={e =>
                            updateAttribute(index, 'trait_type', e.target.value)
                          }
                        />
                        <Input
                          placeholder="Value (e.g., Blue)"
                          value={attr.value}
                          onChange={e =>
                            updateAttribute(index, 'value', e.target.value)
                          }
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeAttribute(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}

                    <Button variant="outline" onClick={addAttribute}>
                      Add Attribute
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(0)}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                      >
                        Next: Preview
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6">
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Preview Your NFT
                  </h4>

                  <div className="bg-muted rounded-lg p-6 text-center mb-4">
                    <div className="text-6xl mb-4">{nftData.image}</div>
                    <h5 className="text-lg font-semibold">{nftData.name}</h5>
                    <p className="text-muted-foreground text-sm">
                      {nftData.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <h6 className="font-medium">Attributes:</h6>
                    <div className="grid grid-cols-2 gap-2">
                      {nftData.attributes
                        ?.filter(attr => attr.trait_type && attr.value)
                        .map((attr, index) => (
                          <div
                            key={index}
                            className="bg-muted rounded p-2 text-sm"
                          >
                            <div className="font-medium">{attr.trait_type}</div>
                            <div className="text-muted-foreground">
                              {attr.value}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1"
                    >
                      Ready to Mint!
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="mint"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6">
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Mint Your NFT
                  </h4>

                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-4">
                    <h5 className="font-medium mb-2">Minting Details</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Network:</span>
                        <span>Ethereum (Simulated)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contract:</span>
                        <span className="font-mono">ERC-721</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gas Fee:</span>
                        <span>~$15 (Simulated)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <span>IPFS</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button
                      onClick={mintNFT}
                      disabled={isMinting}
                      className="flex-1"
                    >
                      {isMinting ? 'Minting...' : 'Mint NFT'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    NFT Minted Successfully! 🎉
                  </h4>
                  <p className="text-muted-foreground mb-6">
                    Your NFT has been created and stored on the blockchain
                  </p>

                  <div className="flex gap-2 justify-center">
                    <Button onClick={resetForm}>Create Another</Button>
                    <Button variant="outline">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h5 className="font-semibold mb-3">Live Preview</h5>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">{nftData.image || '🎨'}</div>
              <h6 className="font-medium">{nftData.name || 'Untitled NFT'}</h6>
              <p className="text-xs text-muted-foreground mt-1">
                {nftData.description || 'No description'}
              </p>
            </div>
            {nftData.attributes && nftData.attributes.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-muted-foreground mb-2">
                  Attributes
                </div>
                <div className="space-y-1">
                  {nftData.attributes
                    .filter(attr => attr.trait_type && attr.value)
                    .slice(0, 3)
                    .map((attr, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{attr.trait_type}:</span>
                        <span className="font-medium">{attr.value}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </Card>

          {mintedNFTs.length > 0 && (
            <Card className="p-4">
              <h5 className="font-semibold mb-3">
                Your Collection ({mintedNFTs.length})
              </h5>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mintedNFTs.map(nft => (
                  <div key={nft.id} className="border rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{nft.metadata.image}</div>
                      <div className="flex-1 min-w-0">
                        <h6 className="text-sm font-medium truncate">
                          {nft.metadata.name}
                        </h6>
                        <p className="text-xs text-muted-foreground">
                          #{nft.tokenId}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Owned
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-4 bg-yellow-100 border-4 border-black">
            <h5 className="font-semibold mb-2">📚 Did You Know?</h5>
            <div className="text-sm space-y-2">
              <p>• NFT stands for Non-Fungible Token</p>
              <p>• Each NFT has a unique token ID on the blockchain</p>
              <p>• Metadata is usually stored on IPFS for permanence</p>
              <p>• Smart contracts define the rules for your NFTs</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
