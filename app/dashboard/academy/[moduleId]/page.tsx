'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Loader2 } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import { createClient } from '@/utils/supabase/client';
import { ACADEMY_CONTENT, Lesson, Question } from '@/lib/academy-content';

export default function ModulePage() {
    const params = useParams();
    const router = useRouter();
    const moduleId = params.moduleId as string;
    const module = ACADEMY_CONTENT[moduleId];

    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    if (!module) {
        return (
            <div className="flex h-screen bg-black text-white items-center justify-center">
                <p>Módulo no encontrado.</p>
            </div>
        );
    }

    const lessons = module.lessons;
    const currentLesson = lessons[currentLessonIndex];
    const isLastLesson = currentLessonIndex === lessons.length - 1;

    const handleNextLesson = () => {
        if (isLastLesson) {
            setShowQuiz(true);
        } else {
            setCurrentLessonIndex(prev => prev + 1);
        }
    };

    const handlePrevLesson = () => {
        if (showQuiz) {
            setShowQuiz(false);
        } else if (currentLessonIndex > 0) {
            setCurrentLessonIndex(prev => prev - 1);
        }
    };

    const handleAnswerSelect = (questionId: string, answerIndex: number) => {
        if (quizSubmitted) return;
        setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    };

    const handleSubmitQuiz = async () => {
        setLoading(true);
        let correct = 0;
        module.quiz.forEach(q => {
            if (quizAnswers[q.id] === q.correctAnswer) {
                correct++;
            }
        });

        const score = Math.round((correct / module.quiz.length) * 100);
        setQuizScore(score);
        setQuizSubmitted(true);

        // If passed, update DB
        if (score >= module.passingScore) {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase
                        .from('academy_progress')
                        .upsert({
                            user_id: user.id,
                            module_id: moduleId,
                            status: 'completed',
                            quiz_score: score,
                            last_accessed_at: new Date().toISOString()
                        }, { onConflict: 'user_id,module_id' });
                }
            } catch (e) {
                console.error('Error saving progress:', e);
            }
        }
        setLoading(false);
    };

    const handleReturnToAcademy = () => {
        router.push('/dashboard/academy');
    };

    return (
        <div className="flex h-screen bg-black text-white font-sans">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
                {/* Header */}
                <header className="px-8 py-6 border-b border-white/5 flex items-center gap-4 bg-gradient-to-b from-purple-900/10 to-transparent">
                    <button onClick={handleReturnToAcademy} className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-white">{module.title}</h1>
                        <p className="text-xs text-zinc-500">
                            {showQuiz ? 'Quiz Final' : `Lección ${currentLessonIndex + 1} de ${lessons.length}`}
                        </p>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto">
                        {!showQuiz ? (
                            /* Lesson View */
                            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">{currentLesson.title}</h2>
                                <div
                                    className="prose prose-invert prose-purple max-w-none text-zinc-300"
                                    dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                                />
                            </div>
                        ) : (
                            /* Quiz View */
                            <div className="space-y-6">
                                <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6 text-center">
                                    <HelpCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-white mb-2">Quiz Final: {module.title}</h2>
                                    <p className="text-zinc-400 text-sm">Debes obtener {module.passingScore}% para aprobar.</p>
                                </div>

                                {quizSubmitted ? (
                                    <div className={`p-8 rounded-2xl text-center ${quizScore >= module.passingScore ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
                                        <CheckCircle2 className={`w-16 h-16 mx-auto mb-4 ${quizScore >= module.passingScore ? 'text-green-500' : 'text-red-500'}`} />
                                        <h3 className="text-3xl font-bold text-white mb-2">{quizScore}%</h3>
                                        <p className={`text-lg ${quizScore >= module.passingScore ? 'text-green-400' : 'text-red-400'}`}>
                                            {quizScore >= module.passingScore ? '¡Aprobado! Módulo completado.' : 'No aprobaste. Revisa el material.'}
                                        </p>
                                        <button
                                            onClick={handleReturnToAcademy}
                                            className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-colors"
                                        >
                                            Volver a la Academia
                                        </button>
                                    </div>
                                ) : (
                                    module.quiz.map((q, idx) => (
                                        <div key={q.id} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                                            <p className="text-white font-bold mb-4">{idx + 1}. {q.text}</p>
                                            <div className="space-y-2">
                                                {q.options.map((opt, optIdx) => (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => handleAnswerSelect(q.id, optIdx)}
                                                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${quizAnswers[q.id] === optIdx
                                                                ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                                                                : 'border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white'
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}

                                {!quizSubmitted && (
                                    <button
                                        onClick={handleSubmitQuiz}
                                        disabled={Object.keys(quizAnswers).length < module.quiz.length || loading}
                                        className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                        Enviar Respuestas
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Navigation */}
                {!quizSubmitted && (
                    <footer className="px-8 py-4 border-t border-white/5 flex justify-between items-center bg-black/50">
                        <button
                            onClick={handlePrevLesson}
                            disabled={currentLessonIndex === 0 && !showQuiz}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft className="w-4 h-4" /> Anterior
                        </button>
                        <div className="flex gap-1.5">
                            {lessons.map((_, idx) => (
                                <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentLessonIndex && !showQuiz ? 'bg-purple-500' : idx < currentLessonIndex ? 'bg-green-500' : 'bg-zinc-700'}`} />
                            ))}
                            <div className={`w-2 h-2 rounded-full ${showQuiz ? 'bg-purple-500' : 'bg-zinc-700'}`} />
                        </div>
                        {!showQuiz && (
                            <button
                                onClick={handleNextLesson}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors"
                            >
                                {isLastLesson ? 'Ir al Quiz' : 'Siguiente'} <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                        {showQuiz && <div />}
                    </footer>
                )}
            </main>
        </div>
    );
}
