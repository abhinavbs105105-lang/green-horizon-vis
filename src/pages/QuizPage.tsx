import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Brain, BookOpen, CheckCircle, XCircle, Trophy, RotateCcw, Clock, Timer, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const classChapters: Record<string, Record<string, string[]>> = {
  "Nursery": {
    "English": ["Alphabet Recognition", "Phonics Basics", "Simple Words", "Rhymes and Songs"],
    "Mathematics": ["Numbers 1-10", "Shapes", "Colors", "Patterns"],
    "EVS": ["My Family", "My Body", "Animals", "Plants Around Us"]
  },
  "LKG": {
    "English": ["Vowels and Consonants", "Three Letter Words", "Picture Reading", "Rhymes"],
    "Mathematics": ["Numbers 1-20", "Basic Shapes", "Bigger and Smaller", "More and Less"],
    "EVS": ["My School", "Healthy Food", "Seasons", "Transport"]
  },
  "UKG": {
    "English": ["Sight Words", "Simple Sentences", "Story Time", "Blends"],
    "Mathematics": ["Numbers 1-50", "Addition Introduction", "Subtraction Introduction", "Measurement"],
    "EVS": ["Community Helpers", "Festivals", "Good Habits", "Water and Air"]
  },
  "Class 1": {
    "English": ["The Alphabet", "Word Building", "Picture Reading", "Poems and Rhymes"],
    "Mathematics": ["Numbers up to 100", "Addition", "Subtraction", "Shapes and Patterns"],
    "EVS": ["My Family and Friends", "Plants", "Animals", "Food We Eat"]
  },
  "Class 2": {
    "English": ["Reading Comprehension", "Grammar Basics", "Creative Writing", "Vocabulary"],
    "Mathematics": ["Numbers up to 1000", "Addition and Subtraction", "Multiplication Introduction", "Money"],
    "EVS": ["My Body", "Plants and Animals", "Water", "Air and Weather"]
  },
  "Class 3": {
    "English": ["Nouns and Pronouns", "Verbs", "Reading Skills", "Paragraph Writing"],
    "Mathematics": ["Four Operations", "Fractions", "Measurement", "Data Handling"],
    "EVS": ["Food", "Shelter", "Water", "Travel and Communication"]
  },
  "Class 4": {
    "English": ["Parts of Speech", "Tenses", "Essay Writing", "Comprehension"],
    "Mathematics": ["Large Numbers", "Factors and Multiples", "Fractions and Decimals", "Geometry"],
    "EVS": ["Growing Plants", "Animals and Their Habitats", "Earth and Universe", "States of India"]
  },
  "Class 5": {
    "English": ["Grammar Advanced", "Letter Writing", "Story Writing", "Poetry"],
    "Mathematics": ["Operations on Large Numbers", "LCM and HCF", "Percentages", "Area and Perimeter"],
    "EVS": ["Super Senses", "From Tasting to Digesting", "Experiments with Water", "Mapping Our Way"]
  },
  "Class 6": {
    "English": ["Who Did Patrick's Homework", "How the Dog Found a New Master", "Taro's Reward", "The Banyan Tree"],
    "Mathematics": ["Knowing Our Numbers", "Whole Numbers", "Playing with Numbers", "Basic Geometrical Ideas", "Understanding Elementary Shapes", "Integers", "Fractions", "Decimals", "Data Handling", "Mensuration", "Algebra", "Ratio and Proportion"],
    "Science": ["Food: Where Does It Come From", "Components of Food", "Fibre to Fabric", "Sorting Materials", "Separation of Substances", "Changes Around Us", "Getting to Know Plants", "Body Movements", "Living Organisms", "Motion and Measurement", "Light, Shadows and Reflections", "Electricity and Circuits", "Fun with Magnets", "Water", "Air Around Us", "Garbage In, Garbage Out"],
    "Social Science": ["What, Where, How and When", "On the Trail of the Earliest People", "From Gathering to Growing Food", "In the Earliest Cities", "What Books and Burials Tell Us", "Kingdoms, Kings and Early Republic", "Ashoka, The Emperor Who Gave Up War", "Vital Villages, Thriving Towns"]
  },
  "Class 7": {
    "English": ["Three Questions", "A Gift of Chappals", "Gopal and the Hilsa Fish", "The Ashes That Made Trees Bloom", "Quality", "Expert Detectives", "The Invention of Vita-Wonk", "Fire: Friend and Foe", "A Bicycle in Good Repair", "The Story of Cricket"],
    "Mathematics": ["Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and its Properties", "Congruence of Triangles", "Comparing Quantities", "Rational Numbers", "Practical Geometry", "Perimeter and Area", "Algebraic Expressions", "Exponents and Powers", "Symmetry", "Visualising Solid Shapes"],
    "Science": ["Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat", "Acids, Bases and Salts", "Physical and Chemical Changes", "Weather, Climate and Adaptations", "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms", "Transportation in Animals and Plants", "Reproduction in Plants", "Motion and Time", "Electric Current", "Light", "Water: A Precious Resource", "Forests: Our Lifeline", "Wastewater Story"],
    "Social Science": ["Tracing Changes Through a Thousand Years", "New Kings and Kingdoms", "The Delhi Sultans", "The Mughal Empire", "Rulers and Buildings", "Towns, Traders and Craftspersons", "Tribes, Nomads and Settled Communities", "Devotional Paths to the Divine"]
  },
  "Class 8": {
    "English": ["The Best Christmas Present", "The Tsunami", "Glimpses of the Past", "Bepin Choudhury's Lapse of Memory", "The Summit Within", "This is Jody's Fawn", "A Visit to Cambridge", "A Short Monsoon Diary", "The Great Stone Face I", "The Great Stone Face II"],
    "Mathematics": ["Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Practical Geometry", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions and Identities", "Visualising Solid Shapes", "Mensuration", "Exponents and Powers", "Direct and Inverse Proportions", "Factorisation", "Introduction to Graphs", "Playing with Numbers"],
    "Science": ["Crop Production and Management", "Microorganisms: Friend and Foe", "Synthetic Fibres and Plastics", "Materials: Metals and Non-Metals", "Coal and Petroleum", "Combustion and Flame", "Conservation of Plants and Animals", "Cell - Structure and Functions", "Reproduction in Animals", "Reaching the Age of Adolescence", "Force and Pressure", "Friction", "Sound", "Chemical Effects of Electric Current", "Some Natural Phenomena", "Light", "Stars and The Solar System", "Pollution of Air and Water"],
    "Social Science": ["How, When and Where", "From Trade to Territory", "Ruling the Countryside", "Tribals, Dikus and the Vision of a Golden Age", "When People Rebel", "Colonialism and the City", "Weavers, Iron Smelters and Factory Owners", "Civilising the Native, Educating the Nation"]
  },
  "Class 9": {
    "English": ["The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind", "The Snake and the Mirror", "My Childhood", "Packing", "Reach for the Top", "The Bond of Love", "Kathmandu", "If I Were You"],
    "Mathematics": ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Areas of Parallelograms and Triangles", "Circles", "Constructions", "Heron's Formula", "Surface Areas and Volumes", "Statistics", "Probability"],
    "Science": ["Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound", "Why Do We Fall Ill", "Natural Resources", "Improvement in Food Resources"],
    "Social Science": ["The French Revolution", "Socialism in Europe and the Russian Revolution", "Nazism and the Rise of Hitler", "Forest Society and Colonialism", "Pastoralists in the Modern World", "India - Size and Location", "Physical Features of India", "Drainage", "Climate", "Natural Vegetation and Wild Life"]
  },
  "Class 10": {
    "English": ["A Letter to God", "Nelson Mandela: Long Walk to Freedom", "Two Stories about Flying", "From the Diary of Anne Frank", "The Hundred Dresses I", "The Hundred Dresses II", "Glimpses of India", "Mijbil the Otter", "Madam Rides the Bus", "The Sermon at Benares", "The Proposal"],
    "Mathematics": ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"],
    "Science": ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Periodic Classification of Elements", "Life Processes", "Control and Coordination", "How do Organisms Reproduce", "Heredity and Evolution", "Light - Reflection and Refraction", "Human Eye and Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Sources of Energy", "Our Environment", "Management of Natural Resources"],
    "Social Science": ["The Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "The Age of Industrialisation", "Print Culture and the Modern World", "Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Agriculture", "Minerals and Energy Resources"]
  }
};

const difficultyDescriptions = {
  easy: "Basic questions to test fundamental understanding",
  medium: "Moderate difficulty with application-based questions",
  hard: "Challenging questions requiring deep understanding"
};

const timerPresets = [
  { label: "30 sec/question", value: 30 },
  { label: "1 min/question", value: 60 },
  { label: "2 min/question", value: 120 },
  { label: "3 min/question", value: 180 }
];

const QuizPage = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("medium");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timedMode, setTimedMode] = useState<boolean>(false);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const { toast } = useToast();

  const subjects = selectedClass ? Object.keys(classChapters[selectedClass] || {}) : [];
  const chapters = selectedClass && selectedSubject ? classChapters[selectedClass]?.[selectedSubject] || [] : [];

  // Timer effect
  useState(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  });

  const handleTimeUp = () => {
    setTimerActive(false);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      if (timedMode) {
        setTimeRemaining(timePerQuestion);
        setTimerActive(true);
      }
    } else {
      finishQuiz(newAnswers);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = async () => {
    if (!selectedClass || !selectedSubject || !selectedChapter) {
      toast({
        title: "Selection Required",
        description: "Please select class, subject, and chapter to start the quiz.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: {
          class: selectedClass,
          subject: selectedSubject,
          chapter: selectedChapter,
          difficulty: selectedDifficulty,
          questionCount: questionCount
        },
      });

      if (error) throw error;

      if (data?.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setQuizStarted(true);
        setCurrentQuestion(0);
        setScore(0);
        setAnswers([]);
        setSelectedAnswer(null);
        setShowResult(false);
        if (timedMode) {
          setTimeRemaining(timePerQuestion);
          setTimerActive(true);
        }
      } else {
        throw new Error("No questions generated");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      if (timedMode) {
        setTimeRemaining(timePerQuestion);
        setTimerActive(true);
      }
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (finalAnswers: (number | null)[]) => {
    setTimerActive(false);
    let totalScore = 0;
    finalAnswers.forEach((answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        totalScore++;
      }
    });
    setScore(totalScore);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimerActive(false);
    setTimeRemaining(0);
  };

  const getTimerColor = () => {
    if (timeRemaining <= 10) return "text-red-500";
    if (timeRemaining <= 30) return "text-yellow-500";
    return "text-primary";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <Brain className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">NCERT Quiz</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Test your knowledge with AI-generated quizzes based on NCERT curriculum
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatePresence mode="wait">
            {!quizStarted ? (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ScrollReveal>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Select Your Quiz
                      </CardTitle>
                      <CardDescription>
                        Choose your class, subject, chapter, difficulty, and number of questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Class Selection */}
                      <div className="space-y-2">
                        <Label>Select Class</Label>
                        <Select value={selectedClass} onValueChange={(value) => {
                          setSelectedClass(value);
                          setSelectedSubject("");
                          setSelectedChapter("");
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose your class" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(classChapters).map((cls) => (
                              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Subject Selection */}
                      {selectedClass && (
                        <div className="space-y-2">
                          <Label>Select Subject</Label>
                          <Select value={selectedSubject} onValueChange={(value) => {
                            setSelectedSubject(value);
                            setSelectedChapter("");
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose your subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Chapter Selection */}
                      {selectedSubject && (
                        <div className="space-y-2">
                          <Label>Select Chapter</Label>
                          <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose your chapter" />
                            </SelectTrigger>
                            <SelectContent>
                              {chapters.map((chapter) => (
                                <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Difficulty Selection */}
                      <div className="space-y-3">
                        <Label>Difficulty Level</Label>
                        <RadioGroup
                          value={selectedDifficulty}
                          onValueChange={setSelectedDifficulty}
                          className="grid grid-cols-3 gap-4"
                        >
                          {["easy", "medium", "hard"].map((level) => (
                            <div key={level}>
                              <RadioGroupItem
                                value={level}
                                id={level}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={level}
                                className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer transition-all
                                  ${selectedDifficulty === level 
                                    ? 'border-primary bg-primary/10' 
                                    : 'border-muted hover:border-primary/50'}`}
                              >
                                <span className="capitalize font-semibold">{level}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <p className="text-sm text-muted-foreground">
                          {difficultyDescriptions[selectedDifficulty as keyof typeof difficultyDescriptions]}
                        </p>
                      </div>

                      {/* Question Count */}
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label>Number of Questions</Label>
                          <span className="text-sm font-medium">{questionCount} questions</span>
                        </div>
                        <Slider
                          value={[questionCount]}
                          onValueChange={(value) => setQuestionCount(value[0])}
                          min={5}
                          max={25}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>5</span>
                          <span>10</span>
                          <span>15</span>
                          <span>20</span>
                          <span>25</span>
                        </div>
                      </div>

                      {/* Timer Settings */}
                      <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Timer className="w-5 h-5 text-primary" />
                            <Label htmlFor="timed-mode">Timed Quiz Mode</Label>
                          </div>
                          <Switch
                            id="timed-mode"
                            checked={timedMode}
                            onCheckedChange={setTimedMode}
                          />
                        </div>
                        
                        {timedMode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2"
                          >
                            <Label>Time per Question</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {timerPresets.map((preset) => (
                                <Button
                                  key={preset.value}
                                  variant={timePerQuestion === preset.value ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setTimePerQuestion(preset.value)}
                                >
                                  {preset.label}
                                </Button>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Total time: {formatTime(timePerQuestion * questionCount)}
                            </p>
                          </motion.div>
                        )}
                      </div>

                      <Button
                        onClick={startQuiz}
                        disabled={isLoading || !selectedChapter}
                        className="w-full"
                        size="lg"
                      >
                        {isLoading ? "Generating Quiz..." : "Start Quiz"}
                      </Button>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </motion.div>
            ) : showResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                    <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                    <CardDescription className="text-xl">
                      You scored {score} out of {questions.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary mb-2">
                        {Math.round((score / questions.length) * 100)}%
                      </div>
                      <Progress value={(score / questions.length) * 100} className="h-4" />
                    </div>

                    {/* Review Answers */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {questions.map((q, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            answers[index] === q.correctAnswer
                              ? "bg-green-50 border-green-200 dark:bg-green-900/20"
                              : "bg-red-50 border-red-200 dark:bg-red-900/20"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {answers[index] === q.correctAnswer ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            )}
                            <div>
                              <p className="font-medium">{q.question}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Correct: {q.options[q.correctAnswer]}
                              </p>
                              {answers[index] !== q.correctAnswer && answers[index] !== null && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  Your answer: {q.options[answers[index]!]}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                {q.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button onClick={resetQuiz} className="w-full" size="lg">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Take Another Quiz
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
                      {timedMode && (
                        <motion.div
                          className={`flex items-center gap-2 font-mono text-lg ${getTimerColor()}`}
                          animate={timeRemaining <= 10 ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ repeat: timeRemaining <= 10 ? Infinity : 0, duration: 1 }}
                        >
                          {timeRemaining <= 10 && <AlertTriangle className="w-5 h-5" />}
                          <Clock className="w-5 h-5" />
                          <span>{formatTime(timeRemaining)}</span>
                        </motion.div>
                      )}
                    </div>
                    <Progress value={((currentQuestion + 1) / questions.length) * 100} />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg font-medium">
                      {questions[currentQuestion]?.question}
                    </p>

                    <RadioGroup
                      value={selectedAnswer?.toString()}
                      onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                    >
                      {questions[currentQuestion]?.options.map((option, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted cursor-pointer"
                        >
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </motion.div>
                      ))}
                    </RadioGroup>

                    <Button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswer === null}
                      className="w-full"
                      size="lg"
                    >
                      {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default QuizPage;
