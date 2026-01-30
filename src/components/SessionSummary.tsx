'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, BarChart, Sparkles, Target, ThumbsUp, TrendingUp } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface SessionSummaryProps {
    summary: any;
    onClose: () => void;
}

const ratingConfig = {
    EXCELLENT: { text: 'Excellent', className: 'bg-green-500/80 text-white' },
    GOOD: { text: 'Good', className: 'bg-sky-500/80 text-white' },
    FAIR: { text: 'Fair', className: 'bg-yellow-500/80 text-white' },
    NEEDS_WORK: { text: 'Needs Work', className: 'bg-orange-500/80 text-white' },
    NO_DATA: { text: 'No Data', className: 'bg-slate-500/80 text-white' },
};

const SummaryListItem = ({ icon: Icon, title, items }: { icon: React.ElementType, title: string, items: string[] }) => (
    <div>
        <div className="flex items-center gap-2 mb-2">
            <Icon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg text-slate-200">{title}</h3>
        </div>
        <ul className="space-y-1.5 pl-8 list-disc list-outside text-slate-300">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);


export function SessionSummary({ summary, onClose }: SessionSummaryProps) {
    const { form_score, ai_summary, top_corrections } = summary;
    const rating = form_score?.rating || 'NO_DATA';
    const config = ratingConfig[rating as keyof typeof ratingConfig];

    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-slate-950/80 animate-fade-in p-4">
            <Card className="max-w-3xl w-full bg-card/80 backdrop-blur-md border-primary/30 shadow-cyan-glow">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <Award className="h-10 w-10 text-primary" />
                            <div>
                                <CardTitle className="text-3xl">Session Summary</CardTitle>
                                <CardDescription>Here's a breakdown of your performance.</CardDescription>
                            </div>
                        </div>
                        {rating !== 'NO_DATA' && (
                             <Badge className={cn("text-md border-0", config.className)}>{config.text}</Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-80 pr-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="bg-slate-900/50 p-3 rounded-lg">
                                    <p className="text-sm text-slate-400">Duration</p>
                                    <p className="text-2xl font-bold">{summary.session_duration_formatted}</p>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-lg">
                                    <p className="text-sm text-slate-400">Frames Analyzed</p>
                                    <p className="text-2xl font-bold">{summary.total_frames_analyzed}</p>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-lg">
                                    <p className="text-sm text-slate-400">Good Form</p>
                                    <p className="text-2xl font-bold">{form_score.green_percentage}%</p>
                                </div>
                            </div>
                            
                            {ai_summary ? (
                                <div className="space-y-6 text-left">
                                    <Separator />
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <BarChart className="h-5 w-5 text-primary" />
                                            <h3 className="font-semibold text-lg text-slate-200">Overall Assessment</h3>
                                        </div>
                                        <p className="text-slate-300 pl-8">{ai_summary.overall_assessment}</p>
                                    </div>
                                    
                                    {ai_summary.strengths?.length > 0 && <SummaryListItem icon={ThumbsUp} title="Strengths" items={ai_summary.strengths} />}
                                    
                                    {ai_summary.areas_for_improvement?.length > 0 && <SummaryListItem icon={Target} title="Areas For Improvement" items={ai_summary.areas_for_improvement} />}

                                    {ai_summary.recommendations?.length > 0 && <SummaryListItem icon={TrendingUp} title="Recommendations" items={ai_summary.recommendations} />}
                                    
                                    <div className="pt-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles className="h-5 w-5 text-yellow-400" />
                                            <h3 className="font-semibold text-lg text-yellow-400">Final Word</h3>
                                        </div>
                                        <p className="text-slate-300 pl-8 italic">"{ai_summary.encouragement}"</p>
                                     </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-400">AI summary not available.</p>
                                    {top_corrections?.length > 0 && (
                                        <div className="mt-4 text-left">
                                             <h3 className="font-semibold text-lg text-slate-200 mb-2 text-center">Top Corrections Given</h3>
                                             <ul className="space-y-1.5 pl-8 list-disc list-outside text-slate-300 max-w-md mx-auto">
                                                {top_corrections.map((item: string, index: number) => <li key={index}>{item}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={onClose}
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                    >
                        Start New Session
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
