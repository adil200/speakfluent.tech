import React from 'react';
import { useSessionStore, type PracticeMode } from '../store/useSessionStore';
import { useAudioStore } from '../store/useAudioStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  MessageSquare,
  Sparkles,
  Presentation,
  BookOpen,
  Mic,
  Database,
  ShieldCheck,
  Cpu,
  ArrowRight
} from 'lucide-react';

interface ModeDetails {
  id: PracticeMode;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  rule: string;
  badge: 'optimal' | 'warning' | 'critical' | 'neutral' | 'ink';
  icon: React.ReactNode;
}

const MODES: ModeDetails[] = [
  {
    id: 'interview',
    title: 'Mock Interview',
    subtitle: 'Behavioral & Technical STAR Drills',
    description:
      'Multi-turn conversational evaluation assessing Situation, Task, Action, and Result structure with dynamic probing questions.',
    duration: '2–3 min / answer',
    rule: 'Rule BR-09: STAR Scoring',
    badge: 'optimal',
    icon: <MessageSquare className="w-5 h-5 text-[#1E3A2F]" />,
  },
  {
    id: 'impromptu',
    title: 'Impromptu Quick-Fire',
    subtitle: 'Under-Pressure Fluency',
    description:
      '10-second preparation countdown followed by extemporaneous speaking. Trains low hesitation latency and eliminates freeze-ups.',
    duration: '60–120 seconds',
    rule: 'Rule BR-01: Zero Disfluency',
    badge: 'warning',
    icon: <Sparkles className="w-5 h-5 text-[#78350F]" />,
  },
  {
    id: 'presentation',
    title: 'Presentation & Pitch',
    subtitle: 'Pacing Endurance & Transitions',
    description:
      'Continuous monologue analysis graphing WPM drift across beginning, middle, and conclusion alongside transition discourse markers.',
    duration: '3–10 minutes',
    rule: 'Rule BR-04: Pacing Band',
    badge: 'neutral',
    icon: <Presentation className="w-5 h-5 text-[#57534E]" />,
  },
  {
    id: 'vocab',
    title: 'Vocabulary Retention',
    subtitle: 'Active Word Adoption Drills',
    description:
      'Prompts specifically engineered to test your ACTIVE_LEARNING words. Validates natural syntactic collocations toward MASTERED status.',
    duration: '60–90 seconds',
    rule: 'Rule BR-03: Mastery State',
    badge: 'ink',
    icon: <BookOpen className="w-5 h-5 text-[#1C1917]" />,
  },
];

export const Studio: React.FC = () => {
  const { currentMode, setMode } = useSessionStore();
  const { state: audioState } = useAudioStore();

  const selectedMode = MODES.find((m) => m.id === currentMode) || MODES[0];

  return (
    <div className="flex flex-col gap-10">
      {/* Studio Header */}
      <div className="flex flex-col gap-2 max-w-2xl">
        <div className="flex items-center gap-2">
          <Badge variant="ink" size="sm">
            Phase 0 Foundation
          </Badge>
          <span className="text-xs text-[#8C827A]">•</span>
          <span className="text-xs text-[#8C827A] font-medium">Acoustic Studio Shell</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] tracking-tight">
          Select your speaking <em className="italic font-light text-[#44403C]">discipline</em>.
        </h1>
        <p className="text-sm text-[#57534E] leading-relaxed">
          Choose a practice mode to train specific articulation habits. Each mode runs dedicated business rules,
          cognitive load thresholds, and multi-agent critiques.
        </p>
      </div>

      {/* 4 Practice Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODES.map((mode) => {
          const isSelected = currentMode === mode.id;
          return (
            <Card
              key={mode.id}
              onClick={() => setMode(mode.id)}
              hoverLift
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#1C1917] ring-1 ring-[#1C1917]/20 bg-[#FAF8F5]/80'
                  : 'hover:border-[#D1C9BE]'
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E3DA]">
                    {mode.icon}
                  </div>
                  <Badge variant={mode.badge} size="sm">
                    {mode.duration}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-lg">{mode.title}</CardTitle>
                <div className="text-xs font-medium text-[#8C827A]">{mode.subtitle}</div>
              </CardHeader>
              <CardContent className="pt-2">
                <CardDescription className="text-xs line-clamp-2">
                  {mode.description}
                </CardDescription>
                <div className="mt-4 pt-3 border-t border-[#E8E3DA]/60 flex items-center justify-between text-[11px] text-[#8C827A]">
                  <span className="font-mono">{mode.rule}</span>
                  <span className={`font-medium ${isSelected ? 'text-[#1C1917]' : 'text-[#8C827A]'}`}>
                    {isSelected ? 'Active Mode' : 'Select'} →
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Studio Cockpit Preview */}
      <Card className="bg-[#FAF8F5] border-[#E8E3DA]">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#8C827A] font-semibold">
                Active Discipline
              </div>
              <CardTitle className="text-2xl mt-1">{selectedMode.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={selectedMode.badge}>{selectedMode.duration}</Badge>
              <Badge variant="neutral">Target WPM: 125–155</Badge>
            </div>
          </div>
          <CardDescription className="mt-2 text-sm max-w-2xl">
            {selectedMode.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Audio Studio Standby Box */}
          <div className="border border-dashed border-[#D1C9BE] rounded-xl p-8 bg-white/70 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E8E3DA] flex items-center justify-center text-[#1C1917]">
              <Mic className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-1 max-w-md">
              <div className="flex items-center justify-center gap-2">
                <h4 className="font-serif text-lg text-[#1C1917]">
                  Acoustic Studio Ready (Phase 3 Preparation)
                </h4>
                <Badge variant="neutral" size="sm">
                  {audioState}
                </Badge>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                The recording canvas, Web Audio analyzer, and live waveform visualizer will initialize here in
                Phase 3. Client audio blobs are persisted into IndexedDB (<code className="font-mono text-[11px]">speakfluent_local_vault</code>).
              </p>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <Button size="md" variant="primary" className="gap-2">
                <Mic className="w-4 h-4" />
                <span>Begin Studio Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              <Button size="md" variant="outline">
                Practice Guidelines
              </Button>
            </div>
          </div>

          {/* Infrastructure Health & Diagnostics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#E8E3DA]/80 text-xs">
            <div className="flex items-center gap-2 text-[#57534E]">
              <Database className="w-4 h-4 text-[#1E3A2F]" />
              <div>
                <div className="font-medium text-[#1C1917]">IndexedDB Vault</div>
                <div className="text-[10px] text-[#8C827A]">Active & Connected</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#57534E]">
              <Cpu className="w-4 h-4 text-[#1E3A2F]" />
              <div>
                <div className="font-medium text-[#1C1917]">Deepgram Nova-3</div>
                <div className="text-[10px] text-[#8C827A]">Verbatim Disfluencies</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#57534E]">
              <ShieldCheck className="w-4 h-4 text-[#1E3A2F]" />
              <div>
                <div className="font-medium text-[#1C1917]">BRE Rules Engine</div>
                <div className="text-[10px] text-[#8C827A]">Rules BR-01 – BR-09</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#57534E]">
              <Sparkles className="w-4 h-4 text-[#1E3A2F]" />
              <div>
                <div className="font-medium text-[#1C1917]">LangGraph Multi-Agent</div>
                <div className="text-[10px] text-[#8C827A]">A2A Deliberation</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
