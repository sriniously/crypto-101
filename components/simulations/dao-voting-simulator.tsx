'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Vote,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Coins,
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  status: 'active' | 'passed' | 'failed' | 'pending';
  timeLeft: number;
  quorum: number;
  category: 'treasury' | 'governance' | 'technical' | 'community';
  createdAt: Date;
}

interface Vote {
  proposalId: string;
  voter: string;
  choice: 'for' | 'against';
  power: number;
  timestamp: Date;
}

interface Member {
  address: string;
  tokenBalance: number;
  votingPower: number;
  proposalsCreated: number;
  votesParticipated: number;
}

const initialProposals: Proposal[] = [
  {
    id: '1',
    title: 'Increase Development Budget',
    description:
      'Proposal to allocate additional 100,000 USDC from treasury for Q2 development initiatives including smart contract audits and frontend improvements.',
    proposer: '0x1234...5678',
    votesFor: 150000,
    votesAgainst: 45000,
    totalVotes: 195000,
    status: 'active',
    timeLeft: 48,
    quorum: 100000,
    category: 'treasury',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Community Grants Program',
    description:
      'Establish a community grants program to fund ecosystem projects. Initial budget of 50,000 USDC with monthly distributions.',
    proposer: '0xabcd...efgh',
    votesFor: 85000,
    votesAgainst: 120000,
    totalVotes: 205000,
    status: 'failed',
    timeLeft: 0,
    quorum: 100000,
    category: 'community',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Governance Token Staking',
    description:
      'Implement staking mechanism for governance tokens to earn yield while participating in governance decisions.',
    proposer: '0x9876...5432',
    votesFor: 180000,
    votesAgainst: 20000,
    totalVotes: 200000,
    status: 'passed',
    timeLeft: 0,
    quorum: 100000,
    category: 'technical',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
];

export default function DAOVotingSimulator() {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [activeTab, setActiveTab] = useState('proposals');
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'governance' as const,
  });
  const [userMember] = useState<Member>({
    address: '0x742d35Cc...4DAb7234',
    tokenBalance: 2500,
    votingPower: 2500,
    proposalsCreated: 1,
    votesParticipated: 5,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const castVote = (proposalId: string, choice: 'for' | 'against') => {
    const hasVoted = votes.some(
      vote =>
        vote.proposalId === proposalId && vote.voter === userMember.address
    );

    if (hasVoted) return;

    const newVote: Vote = {
      proposalId,
      voter: userMember.address,
      choice,
      power: userMember.votingPower,
      timestamp: new Date(),
    };

    setVotes(prev => [...prev, newVote]);

    setProposals(prev =>
      prev.map(proposal => {
        if (proposal.id === proposalId) {
          const updatedProposal = {
            ...proposal,
            votesFor:
              choice === 'for'
                ? proposal.votesFor + userMember.votingPower
                : proposal.votesFor,
            votesAgainst:
              choice === 'against'
                ? proposal.votesAgainst + userMember.votingPower
                : proposal.votesAgainst,
            totalVotes: proposal.totalVotes + userMember.votingPower,
          };

          if (
            updatedProposal.timeLeft <= 0 ||
            updatedProposal.totalVotes >= updatedProposal.quorum * 2
          ) {
            updatedProposal.status =
              updatedProposal.votesFor > updatedProposal.votesAgainst
                ? 'passed'
                : 'failed';
          }

          return updatedProposal;
        }
        return proposal;
      })
    );
  };

  const createProposal = () => {
    if (!newProposal.title || !newProposal.description) return;

    const proposal: Proposal = {
      id: Date.now().toString(),
      title: newProposal.title,
      description: newProposal.description,
      proposer: userMember.address,
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      status: 'active',
      timeLeft: 72,
      quorum: 100000,
      category: newProposal.category,
      createdAt: new Date(),
    };

    setProposals(prev => [proposal, ...prev]);
    setNewProposal({ title: '', description: '', category: 'governance' });
    setShowCreateForm(false);
  };

  const getStatusColorClasses = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-main';
      case 'passed':
        return 'bg-main';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'treasury':
        return '💰';
      case 'governance':
        return '🏛️';
      case 'technical':
        return '⚙️';
      case 'community':
        return '👥';
      default:
        return '📋';
    }
  };

  const getVoteForProposal = (proposalId: string) => {
    return votes.find(
      vote =>
        vote.proposalId === proposalId && vote.voter === userMember.address
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-semibold mb-2">DAO Voting Simulator</h3>
        <p className="text-muted-foreground text-lg">
          Hi there! Welcome to your first digital democracy experience! 🗳️
        </p>
        <div className="bg-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-black">
            Think of this like a digital town hall meeting - but instead of
            raising hands, you use governance tokens to vote! Every token you
            hold gives you voting power, just like how shares in a company give
            you a say in decisions. Ready to shape the future?
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-main-foreground font-bold bg-main">
              {userMember.address.slice(2, 4).toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold">Your DAO Membership</h4>
              <p className="text-sm text-muted-foreground">
                {userMember.address}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Voting Power</p>
                <p className="font-semibold">
                  {userMember.votingPower.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Governance Tokens
                </p>
                <p className="font-semibold flex items-center gap-1">
                  <Coins className="h-4 w-4" />
                  {userMember.tokenBalance}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposals">
            <Vote className="h-4 w-4 mr-2" />
            Proposals ({proposals.filter(p => p.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Active Proposals</h4>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Proposal
            </Button>
          </div>

          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="p-6">
                  <h5 className="font-semibold mb-4">Create New Proposal</h5>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Title
                      </label>
                      <Input
                        placeholder="Enter proposal title"
                        value={newProposal.title}
                        onChange={e =>
                          setNewProposal(prev => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Description
                      </label>
                      <Textarea
                        placeholder="Detailed description of your proposal"
                        value={newProposal.description}
                        onChange={e =>
                          setNewProposal(prev => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Category
                      </label>
                      <select
                        value={newProposal.category}
                        onChange={e =>
                          setNewProposal(prev => ({
                            ...prev,
                            category: e.target.value as any,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="governance">Governance</option>
                        <option value="treasury">Treasury</option>
                        <option value="technical">Technical</option>
                        <option value="community">Community</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={createProposal}
                        disabled={
                          !newProposal.title || !newProposal.description
                        }
                      >
                        Create Proposal
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {proposals
              .filter(p => p.status === 'active')
              .map(proposal => {
                const userVote = getVoteForProposal(proposal.id);
                const forPercentage =
                  proposal.totalVotes > 0
                    ? (proposal.votesFor / proposal.totalVotes) * 100
                    : 0;
                const againstPercentage =
                  proposal.totalVotes > 0
                    ? (proposal.votesAgainst / proposal.totalVotes) * 100
                    : 0;
                const quorumReached = proposal.totalVotes >= proposal.quorum;

                return (
                  <Card key={proposal.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">
                            {getCategoryIcon(proposal.category)}
                          </span>
                          <h5 className="text-lg font-semibold">
                            {proposal.title}
                          </h5>
                          <Badge variant="outline" className="capitalize">
                            {proposal.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {proposal.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                          <Clock className="h-4 w-4" />
                          {proposal.timeLeft}h left
                        </div>
                        <p className="text-xs">
                          by {proposal.proposer.slice(0, 10)}...
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-main">
                          For: {proposal.votesFor.toLocaleString()}
                        </span>
                        <span className="text-red-600">
                          Against: {proposal.votesAgainst.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
                        <div
                          className="transition-all duration-300 bg-main"
                          style={{ width: `${forPercentage}%` }}
                        />
                        <div
                          className="transition-all duration-300 bg-red-600"
                          style={{ width: `${againstPercentage}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <div
                          className={cn(
                            'flex items-center gap-1',
                            quorumReached ? 'text-main' : ''
                          )}
                        >
                          {quorumReached ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Quorum{' '}
                          {quorumReached
                            ? 'Reached'
                            : `(${proposal.quorum.toLocaleString()} needed)`}
                        </div>
                        <span>
                          Total votes: {proposal.totalVotes.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {userVote ? (
                      <div className="bg-muted rounded-lg p-3 flex items-center justify-center">
                        <span className="text-sm">
                          You voted{' '}
                          <strong
                            className={cn(
                              userVote.choice === 'for'
                                ? 'text-main'
                                : 'text-red-600'
                            )}
                          >
                            {userVote.choice === 'for' ? 'For' : 'Against'}
                          </strong>{' '}
                          with {userVote.power.toLocaleString()} voting power
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => castVote(proposal.id, 'for')}
                          className="flex-1 bg-main text-main-foreground"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Vote For
                        </Button>
                        <Button
                          onClick={() => castVote(proposal.id, 'against')}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Vote Against
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {proposals
              .filter(p => p.status !== 'active')
              .map(proposal => (
                <Card key={proposal.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {getCategoryIcon(proposal.category)}
                      </span>
                      <div>
                        <h5 className="font-medium">{proposal.title}</h5>
                        <p className="text-sm text-muted-foreground">
                          {proposal.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <div className="text-main">
                          For: {proposal.votesFor.toLocaleString()}
                        </div>
                        <div className="text-red-600">
                          Against: {proposal.votesAgainst.toLocaleString()}
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          'text-white',
                          getStatusColorClasses(proposal.status)
                        )}
                      >
                        {proposal.status === 'passed' ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h5 className="font-semibold mb-4">DAO Statistics</h5>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Proposals:</span>
                  <span className="font-semibold">{proposals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Proposals:</span>
                  <span className="font-semibold">
                    {proposals.filter(p => p.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Passed Proposals:</span>
                  <span className="font-semibold text-main">
                    {proposals.filter(p => p.status === 'passed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Failed Proposals:</span>
                  <span className="font-semibold text-red-600">
                    {proposals.filter(p => p.status === 'failed').length}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span>Success Rate:</span>
                  <span className="font-semibold">
                    {Math.round(
                      (proposals.filter(p => p.status === 'passed').length /
                        proposals.filter(p => p.status !== 'active').length) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h5 className="font-semibold mb-4">Your Participation</h5>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Votes Cast:</span>
                  <span className="font-semibold">{votes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Proposals Created:</span>
                  <span className="font-semibold">
                    {userMember.proposalsCreated}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Voting Power:</span>
                  <span className="font-semibold">
                    {userMember.votingPower.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Participation Rate:</span>
                  <span className="font-semibold">
                    {Math.round((votes.length / proposals.length) * 100)}%
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-gradient-to-r mt-5 from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <h5 className="font-semibold mb-3">🏛️ How DAO Governance Works</h5>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h6 className="font-medium mb-2">Proposal Process:</h6>
                <ul className="space-y-1">
                  <li>• Any token holder can create proposals</li>
                  <li>• Minimum token threshold may be required</li>
                  <li>• Proposals have fixed voting periods</li>
                  <li>• Quorum must be met for validity</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-2">Voting Power:</h6>
                <ul className="space-y-1">
                  <li>• Based on token holdings (usually 1:1)</li>
                  <li>• Some DAOs use quadratic voting</li>
                  <li>• Delegation allows power sharing</li>
                  <li>• Tokens may be locked during voting</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
