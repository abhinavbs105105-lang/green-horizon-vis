import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle2, XCircle, Loader2, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const classOptions = [
  'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

const subjectChapters: Record<string, string[]> = {
  'Mathematics': [
    'Numbers and Operations', 'Algebra', 'Geometry', 'Mensuration', 'Statistics',
    'Trigonometry', 'Probability', 'Arithmetic Progressions', 'Coordinate Geometry',
    'Polynomials', 'Linear Equations', 'Quadratic Equations', 'Circles', 'Triangles'
  ],
  'Science': [
    'Living World', 'Matter and Materials', 'Force and Motion', 'Light and Sound',
    'Electricity and Magnetism', 'Chemical Reactions', 'Life Processes',
    'Heredity and Evolution', 'Natural Resources', 'Our Environment',
    'Acids, Bases and Salts', 'Metals and Non-metals', 'Carbon Compounds'
  ],
  'English': [
    'Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing Skills',
    'Literature', 'Poetry', 'Prose', 'Letter Writing', 'Essay Writing',
    'Tenses', 'Voice', 'Narration', 'Prepositions', 'Articles'
  ],
  'Hindi': [
    'व्याकरण', 'पठन', 'लेखन', 'कविता', 'गद्य', 'पत्र लेखन',
    'निबंध', 'संधि', 'समास', 'उपसर्ग-प्रत्यय', 'मुहावरे', 'अलंकार'
  ],
  'Social Science': [
    'History - Ancient India', 'History - Medieval India', 'History - Modern India',
    'Geography - Physical', 'Geography - India', 'Geography - World',
    'Civics - Constitution', 'Civics - Government', 'Economics - Basics',
    'Economics - Indian Economy', 'Democratic Politics', 'Resources and Development'
  ]
};

const QuizPage = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const { toast } = useToast();

  const toggleChapter = (chapter: string) => {
    setSelectedChapters(prev =>
      prev.includes(chapter)
        ? prev.filter(c => c !== chapter)
        : [...prev, chapter]
    );
  };

  const generateQuiz = async () => {
    if (!selectedClass || !selectedSubject || selectedChapters.length === 0) {
      toast({
        title: 'Please complete selection',
        description: 'Select class, subject, and at least one chapter.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: {
          classLevel: selectedClass,
          subject: selectedSubject,
          chapters: selectedChapters,
        },
      });

      if (error) throw error;

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setQuizStarted(true);
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setShowResults(false);
      } else {
        throw new Error('No questions generated');
      }
    } catch (error) {
      console.error('Quiz generation error:', error);
      toast({
        title: 'Failed to generate quiz',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectAnswer = (questionId: number, answerIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentQuestion(0);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Header */}
        <div className="bg-primary/5 border-b border-primary/10 py-8">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-2"
            >
              <div className="p-3 bg-accent rounded-xl">
                <Brain className="h-8 w-8 text-accent-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">
                VIS Quiz
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground font-medium tracking-wide flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Powered by VIS-AI
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-foreground/80 max-w-2xl mx-auto"
            >
              Test your knowledge with AI-generated quizzes. Select your class, subject, and chapters to begin!
            </motion.p>
          </div>
        </div>

        {/* Selection Form */}
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="shadow-xl border-primary/10">
            <CardHeader>
              <CardTitle className="text-xl text-center">Create Your Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Class Selection */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Select Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Selection */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Select Subject</Label>
                <Select 
                  value={selectedSubject} 
                  onValueChange={(value) => {
                    setSelectedSubject(value);
                    setSelectedChapters([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(subjectChapters).map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chapter Selection */}
              {selectedSubject && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <Label className="text-base font-semibold">
                    Select Chapters ({selectedChapters.length} selected)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg bg-secondary/30">
                    {subjectChapters[selectedSubject].map(chapter => (
                      <div
                        key={chapter}
                        className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded cursor-pointer"
                        onClick={() => toggleChapter(chapter)}
                      >
                        <Checkbox
                          checked={selectedChapters.includes(chapter)}
                          onCheckedChange={() => toggleChapter(chapter)}
                        />
                        <Label className="text-sm cursor-pointer flex-1">{chapter}</Label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Selected Chapters Display */}
              {selectedChapters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedChapters.map(chapter => (
                    <Badge key={chapter} variant="secondary" className="text-xs">
                      {chapter}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={generateQuiz}
                disabled={isLoading || !selectedClass || !selectedSubject || selectedChapters.length === 0}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    Generate 10 MCQs
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz Interface
  const question = questions[currentQuestion];
  const score = calculateScore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline">{selectedClass}</Badge>
            <Badge variant="outline">{selectedSubject}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={resetQuiz}>
            <RefreshCw className="h-4 w-4 mr-1" />
            New Quiz
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            {showResults && <span>Score: {score}/{questions.length}</span>}
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Results Summary */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className={`border-2 ${score >= 7 ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : score >= 5 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' : 'border-red-500 bg-red-50 dark:bg-red-950/20'}`}>
              <CardContent className="py-4 text-center">
                <Trophy className={`h-12 w-12 mx-auto mb-2 ${score >= 7 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-600'}`} />
                <h3 className="text-2xl font-bold">
                  {score >= 7 ? 'Excellent!' : score >= 5 ? 'Good Job!' : 'Keep Practicing!'}
                </h3>
                <p className="text-lg">You scored {score} out of {questions.length}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg leading-relaxed">
                  Q{question.id}. {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswers[question.id] === index;
                  const isCorrect = index === question.correctAnswer;
                  const showCorrectness = showResults;

                  return (
                    <button
                      key={index}
                      onClick={() => selectAnswer(question.id, index)}
                      disabled={showResults}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                        showCorrectness
                          ? isCorrect
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                            : isSelected
                              ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                              : 'border-border'
                          : isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                      }`}
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showCorrectness && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                      {showCorrectness && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}

                {/* Explanation */}
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-secondary/50 rounded-lg"
                  >
                    <p className="text-sm font-medium text-muted-foreground">Explanation:</p>
                    <p className="text-sm mt-1">{question.explanation}</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion < questions.length - 1 ? (
            <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>
              Next
            </Button>
          ) : !showResults ? (
            <Button 
              onClick={submitQuiz}
              disabled={Object.keys(selectedAnswers).length !== questions.length}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={resetQuiz}>
              Take New Quiz
            </Button>
          )}
        </div>

        {/* Question Navigation Dots */}
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {questions.map((_, index) => {
            const isAnswered = selectedAnswers[questions[index].id] !== undefined;
            const isCurrentCorrect = showResults && selectedAnswers[questions[index].id] === questions[index].correctAnswer;
            const isCurrentWrong = showResults && isAnswered && !isCurrentCorrect;

            return (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                  currentQuestion === index
                    ? 'bg-primary text-primary-foreground'
                    : showResults
                      ? isCurrentCorrect
                        ? 'bg-green-500 text-white'
                        : isCurrentWrong
                          ? 'bg-red-500 text-white'
                          : 'bg-secondary'
                      : isAnswered
                        ? 'bg-primary/30 text-primary'
                        : 'bg-secondary'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
