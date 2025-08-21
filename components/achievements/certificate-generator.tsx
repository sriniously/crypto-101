import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import {
  Download,
  Share2,
  Award,
  Calendar,
  User,
  CheckCircle,
  Trophy,
  Star,
  Sparkles,
} from 'lucide-react';

interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: Date;
  grade: number;
  credentialId: string;
  moduleScores: { [key: string]: number };
  skills: string[];
  totalHours: number;
}

interface CertificateGeneratorProps {
  certificateData: CertificateData;
  onDownload?: () => void;
  onShare?: () => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  certificateData,
  onDownload,
  onShare,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const generateCertificateImage = async () => {
    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, 760, 560);

      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, 720, 520);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Certificate of Completion', 400, 120);

      ctx.font = '18px Arial';
      ctx.fillText('This certifies that', 400, 180);

      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#f1c40f';
      ctx.fillText(certificateData.studentName, 400, 240);

      ctx.font = '18px Arial';
      ctx.fillStyle = '#fff';
      ctx.fillText('has successfully completed', 400, 280);

      ctx.font = 'bold 28px Arial';
      ctx.fillText(certificateData.courseName, 400, 320);

      ctx.font = '16px Arial';
      ctx.fillText(`with a grade of ${certificateData.grade}%`, 400, 370);

      ctx.font = '14px Arial';
      ctx.fillText(
        `Completed on ${certificateData.completionDate.toLocaleDateString()}`,
        400,
        420
      );

      ctx.font = '12px Arial';
      ctx.fillText(`Credential ID: ${certificateData.credentialId}`, 400, 520);
    }

    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${certificateData.courseName.replace(/\s+/g, '_')}_Certificate.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });

    setIsGenerating(false);
    onDownload?.();
  };

  const shareCertificate = () => {
    const shareText = `I just completed ${certificateData.courseName} with a ${certificateData.grade}% grade! 🎉 #Web3Education #Blockchain`;

    if (navigator.share) {
      navigator.share({
        title: 'My Web3 Certificate',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      alert('Share text copied to clipboard!');
    }

    onShare?.();
  };

  const getGradeLevel = (grade: number) => {
    if (grade >= 90)
      return {
        level: 'Honors',
        color: 'text-yellow-500',
        icon: <Trophy className="h-5 w-5" />,
      };
    if (grade >= 80)
      return {
        level: 'Excellence',
        color: 'text-blue-500',
        icon: <Award className="h-5 w-5" />,
      };
    if (grade >= 70)
      return {
        level: 'Proficiency',
        color: 'text-green-500',
        icon: <CheckCircle className="h-5 w-5" />,
      };
    return {
      level: 'Completion',
      color: 'text-purple-500',
      icon: <Star className="h-5 w-5" />,
    };
  };

  const gradeInfo = getGradeLevel(certificateData.grade);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 text-white">
          <div
            ref={certificateRef}
            className="relative p-8 border-4 border-yellow-400 m-4 rounded-lg bg-gradient-to-br from-blue-700 to-purple-700"
          >
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-yellow-400"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-yellow-400"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-yellow-400"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-yellow-400"></div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-8 w-8 text-yellow-400" />
                <h1 className="text-4xl font-bold">
                  Certificate of Completion
                </h1>
                <Sparkles className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="w-24 h-1 bg-yellow-400 mx-auto rounded"></div>
            </div>

            <div className="text-center space-y-6">
              <p className="text-lg opacity-90">This certifies that</p>

              <div className="py-4">
                <h2 className="text-5xl font-bold text-yellow-400 mb-2">
                  {certificateData.studentName}
                </h2>
                <div className="w-32 h-1 bg-yellow-400 mx-auto rounded"></div>
              </div>

              <div className="space-y-2">
                <p className="text-lg opacity-90">has successfully completed</p>
                <h3 className="text-3xl font-bold">
                  {certificateData.courseName}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-4">
                  {gradeInfo.icon}
                  <span className={`text-2xl font-bold ${gradeInfo.color}`}>
                    {certificateData.grade}% - {gradeInfo.level}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm opacity-75 mb-3">Skills Mastered:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {certificateData.skills.slice(0, 6).map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-yellow-400/20 text-yellow-200 border-yellow-400/50"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-end text-sm opacity-75 pt-8">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Completed:{' '}
                      {certificateData.completionDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Study Time: {certificateData.totalHours}h</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs">
                    ID: {certificateData.credentialId}
                  </p>
                  <p className="text-xs">Crypto 101 Academy</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="flex gap-4">
        <Button
          onClick={generateCertificateImage}
          disabled={isGenerating}
          className="flex-1"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </>
          )}
        </Button>

        <Button onClick={shareCertificate} variant="outline" className="flex-1">
          <Share2 className="h-4 w-4 mr-2" />
          Share Achievement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Student Name</p>
              <p className="font-semibold">{certificateData.studentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Course</p>
              <p className="font-semibold">{certificateData.courseName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Final Grade</p>
              <div className="flex items-center gap-2">
                {gradeInfo.icon}
                <span className="font-semibold">{certificateData.grade}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Date</p>
              <p className="font-semibold">
                {certificateData.completionDate.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Module Scores</p>
            <div className="space-y-2">
              {Object.entries(certificateData.moduleScores).map(
                ([module, score]) => (
                  <div
                    key={module}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">{module}</span>
                    <Badge variant={score >= 80 ? 'default' : 'secondary'}>
                      {score}%
                    </Badge>
                  </div>
                )
              )}
            </div>
          </div>

          <Alert>
            <Award className="h-4 w-4" />
            <AlertDescription>
              This certificate is verifiable using the credential ID:{' '}
              {certificateData.credentialId}. In a production system, this would
              be backed by blockchain verification.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateGenerator;
