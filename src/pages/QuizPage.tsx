import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, CheckCircle, XCircle, Trophy, RotateCcw, Clock, Timer, AlertTriangle, Plus, X } from "lucide-react";
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
    "Mathematics": ["Numbers 1-10", "Shapes", "Colors", "Patterns", "Sorting"],
    "EVS": ["My Family", "My Body", "Animals", "Plants Around Us", "My Home"]
  },
  "LKG": {
    "Mathematics": ["Numbers 1-20", "Basic Shapes", "Bigger and Smaller", "More and Less", "Counting Objects"],
    "EVS": ["My School", "Healthy Food", "Seasons", "Transport", "Good Habits"]
  },
  "UKG": {
    "Mathematics": ["Numbers 1-50", "Addition Introduction", "Subtraction Introduction", "Measurement", "Time", "Money"],
    "EVS": ["Community Helpers", "Festivals", "Good Habits", "Water and Air", "Plants and Animals"]
  },
  "Class 1": {
    "Mathematics": ["Numbers up to 100", "Addition", "Subtraction", "Shapes and Patterns", "Measurement", "Time"],
    "EVS": ["My Family and Friends", "Plants", "Animals", "Food We Eat", "Shelter", "Water"]
  },
  "Class 2": {
    "Mathematics": ["Numbers up to 1000", "Addition and Subtraction", "Multiplication Introduction", "Money", "Measurement", "Data Handling"],
    "EVS": ["My Body", "Plants and Animals", "Water", "Air and Weather", "Food", "Our Helpers"]
  },
  "Class 3": {
    "Mathematics": ["Four Operations", "Fractions", "Measurement", "Data Handling", "Patterns", "Money"],
    "EVS": ["Poonam's Day Out", "The Plant Fairy", "Water O Water", "Our First School", "Chhotu's House", "Foods We Eat", "Saying Without Speaking", "Flying High", "It's Raining", "What is Cooking", "From Here to There", "Work We Do", "Sharing Our Feelings", "The Story of Food", "Making Pots", "Games We Play", "Here Comes a Letter", "A House Like This", "Our Friends - Animals", "Drop by Drop", "Families Can Be Different", "Left-Right", "A Beautiful Cloth", "Web of Life"]
  },
  "Class 4": {
    "Mathematics": ["Building with Bricks", "Long and Short", "A Trip to Bhopal", "Tick Tick Tick", "The Way The World Looks", "The Junk Seller", "Jugs and Mugs", "Carts and Wheels", "Halves and Quarters", "Play with Patterns", "Tables and Shares", "How Heavy How Light", "Fields and Fences", "Smart Charts"],
    "EVS": ["Going to School", "Ear to Ear", "A Day with Nandu", "The Story of Amrita", "Anita and the Honeybees", "Omana's Journey", "From the Window", "Reaching Grandmother's House", "Changing Families", "Hu Tu Tu Hu Tu Tu", "The Valley of Flowers", "Changing Times", "A River's Tale", "Basva's Farm", "From Market to Home", "A Busy Month", "Nandita in Mumbai", "Too Much Water Too Little Water", "Abdul in the Garden", "Eating Together", "Food and Fun", "The World in My Home", "Pochampalli", "Home and Abroad"]
  },
  "Class 5": {
    "Mathematics": ["The Fish Tale", "Shapes and Angles", "How Many Squares", "Parts and Wholes", "Does it Look the Same", "Be My Multiple I'll Be Your Factor", "Can You See the Pattern", "Mapping Your Way", "Boxes and Sketches", "Tenths and Hundredths", "Area and Its Boundary", "Smart Charts", "Ways to Multiply and Divide", "How Big How Heavy"],
    "EVS": ["Super Senses", "A Snake Charmer's Story", "From Tasting to Digesting", "Mangoes Round the Year", "Seeds and Seeds", "Every Drop Counts", "Experiments with Water", "A Treat for Mosquitoes", "Up You Go", "Walls Tell Stories", "Sunita in Space", "What if it Finishes", "A Shelter So High", "When the Earth Shook", "Blow Hot Blow Cold", "Who Will Do This Work", "Across the Wall", "No Place for Us", "A Seed Tells a Farmer's Story", "Whose Forests", "Like Father Like Daughter", "On the Move Again"]
  },
  "Class 6": {
    "Mathematics": ["Knowing Our Numbers", "Whole Numbers", "Playing with Numbers", "Basic Geometrical Ideas", "Understanding Elementary Shapes", "Integers", "Fractions", "Decimals", "Data Handling", "Mensuration", "Algebra", "Ratio and Proportion", "Symmetry", "Practical Geometry"],
    "Science": ["Food: Where Does It Come From", "Components of Food", "Fibre to Fabric", "Sorting Materials into Groups", "Separation of Substances", "Changes Around Us", "Getting to Know Plants", "Body Movements", "The Living Organisms and Their Surroundings", "Motion and Measurement of Distances", "Light, Shadows and Reflections", "Electricity and Circuits", "Fun with Magnets", "Water", "Air Around Us", "Garbage In, Garbage Out"],
    "Social Science - History": ["What, Where, How and When", "From Hunting-Gathering to Growing Food", "In the Earliest Cities", "What Books and Burials Tell Us", "Kingdoms, Kings and an Early Republic", "New Questions and Ideas", "Ashoka, The Emperor Who Gave Up War", "Vital Villages, Thriving Towns", "Traders, Kings and Pilgrims", "New Empires and Kingdoms", "Buildings, Paintings and Books"],
    "Social Science - Geography": ["The Earth in the Solar System", "Globe: Latitudes and Longitudes", "Motions of the Earth", "Maps", "Major Domains of the Earth", "Major Landforms of the Earth", "Our Country - India", "India: Climate, Vegetation and Wildlife"],
    "Social Science - Civics": ["Understanding Diversity", "Diversity and Discrimination", "What is Government", "Key Elements of a Democratic Government", "Panchayati Raj", "Rural Administration", "Urban Administration", "Rural Livelihoods", "Urban Livelihoods"]
  },
  "Class 7": {
    "Mathematics": ["Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and its Properties", "Congruence of Triangles", "Comparing Quantities", "Rational Numbers", "Practical Geometry", "Perimeter and Area", "Algebraic Expressions", "Exponents and Powers", "Symmetry", "Visualising Solid Shapes"],
    "Science": ["Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat", "Acids, Bases and Salts", "Physical and Chemical Changes", "Weather, Climate and Adaptations of Animals to Climate", "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms", "Transportation in Animals and Plants", "Reproduction in Plants", "Motion and Time", "Electric Current and its Effects", "Light", "Water: A Precious Resource", "Forests: Our Lifeline", "Wastewater Story"],
    "Social Science - History": ["Tracing Changes Through a Thousand Years", "New Kings and Kingdoms", "The Delhi Sultans", "The Mughal Empire", "Rulers and Buildings", "Towns, Traders and Craftspersons", "Tribes, Nomads and Settled Communities", "Devotional Paths to the Divine", "The Making of Regional Cultures", "Eighteenth-Century Political Formations"],
    "Social Science - Geography": ["Environment", "Inside Our Earth", "Our Changing Earth", "Air", "Water", "Natural Vegetation and Wildlife", "Human Environment - Settlement, Transport and Communication", "Human Environment Interactions - The Tropical and the Subtropical Region", "Life in the Temperate Grasslands", "Life in the Deserts"],
    "Social Science - Civics": ["On Equality", "Role of the Government in Health", "How the State Government Works", "Growing Up as Boys and Girls", "Women Change the World", "Understanding Media", "Understanding Advertising", "Markets Around Us", "A Shirt in the Market"]
  },
  "Class 8": {
    "Mathematics": ["Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Practical Geometry", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions and Identities", "Visualising Solid Shapes", "Mensuration", "Exponents and Powers", "Direct and Inverse Proportions", "Factorisation", "Introduction to Graphs", "Playing with Numbers"],
    "Science": ["Crop Production and Management", "Microorganisms: Friend and Foe", "Synthetic Fibres and Plastics", "Materials: Metals and Non-Metals", "Coal and Petroleum", "Combustion and Flame", "Conservation of Plants and Animals", "Cell - Structure and Functions", "Reproduction in Animals", "Reaching the Age of Adolescence", "Force and Pressure", "Friction", "Sound", "Chemical Effects of Electric Current", "Some Natural Phenomena", "Light", "Stars and The Solar System", "Pollution of Air and Water"],
    "Social Science - History": ["How, When and Where", "From Trade to Territory", "Ruling the Countryside", "Tribals, Dikus and the Vision of a Golden Age", "When People Rebel 1857 and After", "Civilising the Native, Educating the Nation", "Women, Caste and Reform", "The Making of the National Movement 1870s-1947", "India After Independence"],
    "Social Science - Geography": ["Resources", "Land, Soil, Water, Natural Vegetation and Wildlife Resources", "Mineral and Power Resources", "Agriculture", "Industries", "Human Resources"],
    "Social Science - Civics": ["The Indian Constitution", "Understanding Secularism", "Why Do We Need a Parliament", "Understanding Laws", "Judiciary", "Understanding Our Criminal Justice System", "Understanding Marginalisation", "Confronting Marginalisation", "Public Facilities", "Law and Social Justice"]
  },
  "Class 9": {
    "Mathematics": ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Areas of Parallelograms and Triangles", "Circles", "Constructions", "Heron's Formula", "Surface Areas and Volumes", "Statistics", "Probability"],
    "Science": ["Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound", "Why Do We Fall Ill", "Natural Resources", "Improvement in Food Resources"],
    "Social Science - History": ["The French Revolution", "Socialism in Europe and the Russian Revolution", "Nazism and the Rise of Hitler", "Forest Society and Colonialism", "Pastoralists in the Modern World"],
    "Social Science - Geography": ["India - Size and Location", "Physical Features of India", "Drainage", "Climate", "Natural Vegetation and Wild Life", "Population"],
    "Social Science - Civics": ["What is Democracy? Why Democracy?", "Constitutional Design", "Electoral Politics", "Working of Institutions", "Democratic Rights"],
    "Social Science - Economics": ["The Story of Village Palampur", "People as Resource", "Poverty as a Challenge", "Food Security in India"]
  },
  "Class 10": {
    "Mathematics": ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"],
    "Science": ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Periodic Classification of Elements", "Life Processes", "Control and Coordination", "How do Organisms Reproduce", "Heredity and Evolution", "Light - Reflection and Refraction", "Human Eye and Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Sources of Energy", "Our Environment", "Sustainable Management of Natural Resources"],
    "Social Science - History": ["The Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "The Age of Industrialisation", "Print Culture and the Modern World"],
    "Social Science - Geography": ["Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Agriculture", "Minerals and Energy Resources", "Manufacturing Industries", "Lifelines of National Economy"],
    "Social Science - Civics": ["Power Sharing", "Federalism", "Democracy and Diversity", "Gender, Religion and Caste", "Popular Struggles and Movements", "Political Parties", "Outcomes of Democracy", "Challenges to Democracy"],
    "Social Science - Economics": ["Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation and the Indian Economy", "Consumer Rights"]
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
  const [useCustomChapters, setUseCustomChapters] = useState<boolean>(false);
  const [customChapters, setCustomChapters] = useState<string[]>([]);
  const [customChapterInput, setCustomChapterInput] = useState<string>("");
  const customInputRef = useRef<HTMLInputElement>(null);
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
  useEffect(() => {
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
  }, [timerActive, timeRemaining]);

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
    const hasChapters = useCustomChapters ? customChapters.length > 0 : !!selectedChapter;
    if (!selectedClass || !selectedSubject || !hasChapters) {
      toast({
        title: "Selection Required",
        description: useCustomChapters
          ? "Please select class, subject, and add at least one custom chapter."
          : "Please select class, subject, and chapter to start the quiz.",
        variant: "destructive",
      });
      return;
    }

    const chaptersToSend = useCustomChapters ? customChapters : [selectedChapter];

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: {
          classLevel: selectedClass,
          subject: selectedSubject,
          chapters: chaptersToSend,
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
    setCustomChapters([]);
    setCustomChapterInput("");
    setUseCustomChapters(false);
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
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Chapters</Label>
                            <div className="flex items-center gap-2">
                              <Label htmlFor="custom-toggle" className="text-sm text-muted-foreground cursor-pointer">Custom</Label>
                              <Switch
                                id="custom-toggle"
                                checked={useCustomChapters}
                                onCheckedChange={(checked) => {
                                  setUseCustomChapters(checked);
                                  setSelectedChapter("");
                                  setCustomChapters([]);
                                  setCustomChapterInput("");
                                }}
                              />
                            </div>
                          </div>

                          {!useCustomChapters ? (
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
                          ) : (
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input
                                  ref={customInputRef}
                                  placeholder="Type a chapter/topic name and press Enter"
                                  value={customChapterInput}
                                  onChange={(e) => setCustomChapterInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && customChapterInput.trim()) {
                                      e.preventDefault();
                                      setCustomChapters((prev) => [...prev, customChapterInput.trim()]);
                                      setCustomChapterInput("");
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  disabled={!customChapterInput.trim()}
                                  onClick={() => {
                                    if (customChapterInput.trim()) {
                                      setCustomChapters((prev) => [...prev, customChapterInput.trim()]);
                                      setCustomChapterInput("");
                                      customInputRef.current?.focus();
                                    }
                                  }}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              {customChapters.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {customChapters.map((ch, i) => (
                                    <Badge key={i} variant="secondary" className="gap-1 pr-1">
                                      {ch}
                                      <button
                                        onClick={() => setCustomChapters((prev) => prev.filter((_, idx) => idx !== i))}
                                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Add any chapter or topic name — the AI will generate questions based on your input for {selectedClass} {selectedSubject}.
                              </p>
                            </div>
                          )}
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
                        disabled={isLoading || (useCustomChapters ? customChapters.length === 0 : !selectedChapter)}
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
