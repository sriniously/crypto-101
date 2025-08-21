'use client';

import { MDXProvider } from '@mdx-js/react';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Lightbulb,
  AlertTriangle,
  Info,
  BookOpen,
  Code2,
  Play,
} from 'lucide-react';
import { TokenBTC, TokenETH, WalletMetamask } from '@web3icons/react';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { Quiz as QuizComponent } from '@/components/quiz/quiz';
import {
  CryptoConceptBox,
  KeyTakeaway,
  ThinkAboutIt,
  RealWorldExample,
  CommonMistake,
  ProTip,
  Glossary,
  Discussion,
  FlowDiagram,
  Comparison,
  Timeline,
} from '@/components/course';

const simulationComponentMap: Record<string, () => any> = {
  Web2VsWeb3: () => import('@/components/simulations/web2-vs-web3'),
  BitcoinTransactionBuilder: () =>
    import('@/components/simulations/bitcoin-transaction-builder'),
  DeFiExplorer: () => import('@/components/simulations/defi-explorer'),
  NFTMintingStudio: () => import('@/components/simulations/nft-minting-studio'),
  DAOVotingSimulator: () =>
    import('@/components/simulations/dao-voting-simulator'),

  DoubleSpendSimulator: () =>
    import('@/components/simulations/double-spend-simulator'),
};

const loadSimulationComponent = (componentName: string) => {
  const importFn = simulationComponentMap[componentName];

  if (importFn) {
    return dynamic(
      () =>
        importFn().catch(() => ({
          default: () => (
            <div className="text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg">
              <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Simulation Coming Soon!
              </h3>
              <p className="text-muted-foreground">
                The &quot;{componentName}&quot; simulation is currently being
                built.
              </p>
            </div>
          ),
        })),
      { ssr: false }
    );
  }

  return dynamic(
    () =>
      Promise.resolve({
        default: () => (
          <div className="text-center p-8 border-2 border-dashed border-red-200 rounded-lg">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Simulation Not Found</h3>
            <p className="text-muted-foreground">
              Could not find simulation &quot;{componentName}&quot;.
            </p>
          </div>
        ),
      }),
    { ssr: false }
  );
};

const components = {
  h1: ({ children, ...props }: any) => (
    <motion.h1
      className="text-4xl font-bold tracking-tight mb-8 text-primary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.h1>
  ),
  h2: ({ children, ...props }: any) => (
    <motion.h2
      className="text-3xl font-semibold tracking-tight mb-6 text-foreground border-b pb-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.h2>
  ),
  h3: ({ children, ...props }: any) => (
    <motion.h3
      className="text-2xl font-semibold tracking-tight mb-4 text-foreground"
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.h3>
  ),

  p: ({ children, ...props }: any) => (
    <motion.p
      className="text-muted-foreground leading-relaxed mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.p>
  ),

  ul: ({ children, ...props }: any) => (
    <ul
      className="space-y-2 mb-4 pl-6 list-disc text-muted-foreground"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol
      className="space-y-2 mb-4 pl-6 list-decimal text-muted-foreground"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),

  code: ({ children, className, ...props }: any) => {
    const isInline = !className;

    if (isInline) {
      return (
        <code
          className="bg-muted px-2 py-1 rounded text-sm font-mono text-primary"
          {...props}
        >
          {children}
        </code>
      );
    }

    let language = className ? className.replace(/language-/, '') : 'text';

    const languageMap: Record<string, string> = {
      solidity: 'javascript',
      sol: 'javascript',
      js: 'javascript',
      ts: 'typescript',
      tsx: 'tsx',
      jsx: 'jsx',
      json: 'json',
      bash: 'bash',
      shell: 'bash',
      yml: 'yaml',
      yaml: 'yaml',
    };

    language = languageMap[language] || language;

    return (
      <div className="mb-4">
        <SyntaxHighlighter
          language={language}
          style={oneLight}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            background: 'var(--color-secondary-background)',
            border: '2px solid var(--color-border)',
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  },

  blockquote: ({ children }: any) => (
    <Alert className="mb-4 border-l-4 border-primary">
      <Info className="h-4 w-4" />
      <AlertDescription className="italic">{children}</AlertDescription>
    </Alert>
  ),

  hr: () => <Separator className="my-8" />,

  a: ({ children, href, ...props }: any) => (
    <a
      href={href}
      className="text-primary hover:text-primary/80 underline underline-offset-4"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  KeyConcept: ({ title, children }: { title: string; children: ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card className="mt-6 mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'backOut' }}
            >
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
                {title}
              </CardTitle>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-blue-700 dark:text-blue-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {children}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  ),

  Warning: ({ children }: { children: ReactNode }) => (
    <motion.div
      className="mt-6 mb-4"
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, x: 5, transition: { duration: 0.2 } }}
    >
      <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <motion.svg
          className="h-4 w-4 text-yellow-600 dark:text-yellow-400"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'backOut' }}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </motion.svg>
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {children}
          </motion.div>
        </AlertDescription>
      </Alert>
    </motion.div>
  ),

  CodeExample: ({
    title,
    language = 'javascript',
    children,
  }: {
    title: string;
    language?: string;
    children: ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      <Card className="mt-6 mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'backOut' }}
            >
              <Code2 className="h-5 w-5 text-primary" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <CardTitle className="text-lg">{title}</CardTitle>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <SyntaxHighlighter
              language={language}
              style={oneLight}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: 'var(--color-secondary-background)',
                border: '2px solid var(--color-border)',
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  ),

  Simulation: ({
    component,
    title,
    description,
  }: {
    component: string;
    title: string;
    description?: string;
  }) => {
    const SimulationComponent = loadSimulationComponent(component);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.2 } }}
      >
        <Card className="mt-6 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'backOut' }}
              >
                <Play className="h-5 w-5 text-primary" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <CardTitle>{title}</CardTitle>
              </motion.div>
            </div>
            {description && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <CardDescription>{description}</CardDescription>
              </motion.div>
            )}
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <SimulationComponent />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  },

  TabbedContent: ({ children, defaultValue = 'concept', ...props }: any) => (
    <Tabs defaultValue={defaultValue} className="mt-6 mb-6" {...props}>
      {children}
    </Tabs>
  ),

  TabsList: TabsList,
  TabsTrigger: TabsTrigger,
  TabsContent: TabsContent,

  Quiz: ({
    id,
    title = 'Knowledge Check',
    description,
    questions,
    passingScore = 70,
    maxAttempts = 3,
    showHints = true,
    onComplete,
  }: {
    id: string;
    title?: string;
    description?: string;
    questions: any[];
    passingScore?: number;
    maxAttempts?: number;
    showHints?: boolean;
    onComplete?: (score: number, passed: boolean) => void;
  }) => (
    <div className="mt-6 mb-6">
      <QuizComponent
        id={id}
        title={title}
        description={description}
        questions={questions}
        passingScore={passingScore}
        maxAttempts={maxAttempts}
        showHints={showHints}
        onComplete={onComplete}
      />
    </div>
  ),

  CryptoConceptBox: (props: any) => (
    <motion.div
      className="mt-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <CryptoConceptBox {...props} />
    </motion.div>
  ),
  KeyTakeaway: (props: any) => (
    <motion.div
      className="mt-6 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <KeyTakeaway {...props} />
    </motion.div>
  ),
  ThinkAboutIt: (props: any) => (
    <motion.div
      className="mt-6 mb-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <ThinkAboutIt {...props} />
    </motion.div>
  ),
  RealWorldExample: (props: any) => (
    <motion.div
      className="mt-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <RealWorldExample {...props} />
    </motion.div>
  ),
  CommonMistake: (props: any) => (
    <motion.div
      className="mt-6 mb-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <CommonMistake {...props} />
    </motion.div>
  ),
  ProTip: (props: any) => (
    <motion.div
      className="mt-6 mb-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'backOut' }}
    >
      <ProTip {...props} />
    </motion.div>
  ),
  Glossary: (props: any) => (
    <motion.div
      className="mt-6 mb-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Glossary {...props} />
    </motion.div>
  ),
  Discussion: (props: any) => (
    <motion.div
      className="mt-6 mb-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Discussion {...props} />
    </motion.div>
  ),
  FlowDiagram: (props: any) => (
    <motion.div
      className="mt-6 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <FlowDiagram {...props} />
    </motion.div>
  ),
  Comparison: (props: any) => (
    <motion.div
      className="mt-6 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Comparison {...props} />
    </motion.div>
  ),
  Timeline: (props: any) => (
    <motion.div
      className="mt-6 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Timeline {...props} />
    </motion.div>
  ),

  Web3Icon: ({
    type,
    className = 'w-6 h-6',
    size = 24,
    variant = 'branded',
  }: {
    type: string;
    className?: string;
    size?: number;
    variant?: 'branded' | 'mono';
  }) => {
    const iconMap: Record<string, any> = {
      bitcoin: TokenBTC,
      ethereum: TokenETH,
      metamask: WalletMetamask,
    };

    const Icon = iconMap[type];
    if (!Icon) return null;

    return <Icon size={size} variant={variant} className={className} />;
  },

  CompanyLogo: ({
    company,
    className = 'w-6 h-6',
  }: {
    company: string;
    className?: string;
  }) => {
    return (
      <Image
        src={`https://img.logo.dev/${company}?token=pk_TYrtpZJoRvW0IkSW7uYRqQ&retina=true`}
        alt={`${company} logo`}
        width={24}
        height={24}
        className={className}
      />
    );
  },
};

interface MDXContentProviderProps {
  children: ReactNode;
  additionalComponents?: Record<string, any>;
}

export function MDXContentProvider({
  children,
  additionalComponents = {},
}: MDXContentProviderProps) {
  const allComponents = {
    ...components,
    ...additionalComponents,
  };

  return <MDXProvider components={allComponents}>{children}</MDXProvider>;
}
