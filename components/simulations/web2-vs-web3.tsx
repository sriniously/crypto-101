'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  Globe,
  Shield,
  Users,
  Database,
  Key,
  Server,
  Lock,
  Unlock,
  ArrowRight,
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  web2: {
    description: string;
    icon: any;
    pros: string[];
    cons: string[];
  };
  web3: {
    description: string;
    icon: any;
    pros: string[];
    cons: string[];
  };
}

const services: Service[] = [
  {
    id: 'banking',
    name: 'Banking & Payments',
    web2: {
      description: 'Traditional banks control your money',
      icon: Database,
      pros: ['Customer support', 'Fraud protection', 'Easy to use'],
      cons: ['Can freeze accounts', 'Limited hours', 'High fees', 'No privacy'],
    },
    web3: {
      description: 'You control your own digital wallet',
      icon: Key,
      pros: ['24/7 access', 'Full control', 'Low fees', 'Pseudonymous'],
      cons: ['No support', 'Irreversible', 'Technical knowledge needed'],
    },
  },
  {
    id: 'identity',
    name: 'Digital Identity',
    web2: {
      description: 'Companies own your data',
      icon: Server,
      pros: ['Password recovery', 'Centralized login'],
      cons: ['Data breaches', 'Privacy concerns', 'Platform lock-in'],
    },
    web3: {
      description: 'Self-sovereign identity',
      icon: Shield,
      pros: ['You own your data', 'Portable identity', 'Privacy control'],
      cons: ['Lost keys = lost identity', 'More complex'],
    },
  },
  {
    id: 'social',
    name: 'Social Networks',
    web2: {
      description: 'Platforms control content & connections',
      icon: Globe,
      pros: ['Easy discovery', 'Content moderation'],
      cons: ['Censorship', 'Algorithm manipulation', 'Data mining'],
    },
    web3: {
      description: 'Decentralized social graphs',
      icon: Users,
      pros: ['No censorship', 'Own your content', 'Portable followers'],
      cons: ['Harder discovery', 'No moderation', 'Spam issues'],
    },
  },
];

export default function Web2VsWeb3() {
  const [selectedService, setSelectedService] = useState<Service>(services[0]);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map(service => (
          <Button
            key={service.id}
            variant={selectedService.id === service.id ? 'default' : 'outline'}
            className="h-auto p-4"
            onClick={() => {
              setSelectedService(service);
              setShowComparison(false);
            }}
          >
            <div className="text-left">
              <h4 className="font-semibold">{service.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Compare Web2 vs Web3
              </p>
            </div>
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 h-full border-2 border-red-200 dark:border-red-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Web2 (Traditional)</h3>
              <Badge variant="destructive">Centralized</Badge>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <selectedService.web2.icon className="h-12 w-12 text-red-500" />
              <Lock className="h-8 w-8 text-red-400" />
            </div>

            <p className="text-muted-foreground mb-4">
              {selectedService.web2.description}
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">
                  Pros:
                </h4>
                <ul className="space-y-1">
                  {selectedService.web2.pros.map((pro, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
                  Cons:
                </h4>
                <ul className="space-y-1">
                  {selectedService.web2.cons.map((con, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✗</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 h-full border-2 border-green-200 dark:border-green-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Web3 (Decentralized)</h3>
              <Badge variant="default" className="bg-green-500">
                Decentralized
              </Badge>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <selectedService.web3.icon className="h-12 w-12 text-green-500" />
              <Unlock className="h-8 w-8 text-green-400" />
            </div>

            <p className="text-muted-foreground mb-4">
              {selectedService.web3.description}
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">
                  Pros:
                </h4>
                <ul className="space-y-1">
                  {selectedService.web3.pros.map((pro, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
                  Cons:
                </h4>
                <ul className="space-y-1">
                  {selectedService.web3.cons.map((con, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✗</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <Card className="p-6 bg-gradient-to-r from-yellow-100 to-yellow-100">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-main" />
          Try it yourself
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button below to see a simulated comparison of how each
          system works:
        </p>
        <Button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full sm:w-auto"
        >
          {showComparison ? 'Hide' : 'Show'} Live Comparison
        </Button>

        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-background rounded-lg"
          >
            <p className="text-sm">
              <strong>Web2:</strong> Your request → Company servers → Their
              database → Response
            </p>
            <p className="text-sm mt-2">
              <strong>Web3:</strong> Your request → Your wallet signature →
              Blockchain network → Decentralized response
            </p>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
