import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Brain, CheckCircle2, XCircle, Loader2, RefreshCw, Trophy, Sparkles, Zap, Target, Flame } from 'lucide-react';
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

const difficultyLevels = [
  { value: 'easy', label: 'Easy', icon: Zap, color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500' },
  { value: 'medium', label: 'Medium', icon: Target, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500' },
  { value: 'hard', label: 'Hard', icon: Flame, color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500' },
];

// NCERT-based chapters organized by class and subject
const getChaptersForClass = (classLevel: string, subject: string): string[] => {
  const classNum = classLevel.replace('Class ', '');
  
  // Nursery, LKG, UKG chapters
  if (['Nursery', 'LKG', 'UKG'].includes(classLevel)) {
    const earlyChapters: Record<string, string[]> = {
      'Mathematics': ['Numbers 1-10', 'Shapes', 'Colors', 'Counting', 'Big and Small', 'More and Less', 'Patterns'],
      'English': ['Alphabet', 'Phonics', 'Simple Words', 'Rhymes', 'Picture Reading', 'Action Words'],
      'Hindi': ['स्वर', 'व्यंजन', 'मात्राएं', 'सरल शब्द', 'चित्र पठन', 'बालगीत'],
      'EVS': ['My Family', 'My Body', 'Animals', 'Plants', 'Food', 'Festivals', 'Transport'],
    };
    return earlyChapters[subject] || [];
  }

  // Class 1-5 NCERT chapters
  if (['1', '2', '3', '4', '5'].includes(classNum)) {
    const primaryChapters: Record<string, Record<string, string[]>> = {
      'Mathematics': {
        '1': ['Shapes and Space', 'Numbers from One to Nine', 'Addition', 'Subtraction', 'Numbers from Ten to Twenty', 'Time', 'Measurement', 'Numbers from Twenty-one to Fifty', 'Data Handling', 'Patterns', 'Numbers', 'Money', 'How Many'],
        '2': ['What is Long, What is Round?', 'Counting in Groups', 'How Much Can You Carry?', 'Counting in Tens', 'Patterns', 'Footprints', 'Jugs and Mugs', 'Tens and Ones', 'My Funday', 'Add our Points', 'Lines and Lines', 'Give and Take', 'The Longest Step', 'Birds Come, Birds Go', 'How Many Ponytails?'],
        '3': ['Where to Look From', 'Fun with Numbers', 'Give and Take', 'Long and Short', 'Shapes and Designs', 'Fun with Give and Take', 'Time Goes On', 'Who is Heavier?', 'How Many Times?', 'Play with Patterns', 'Jugs and Mugs', 'Can We Share?', 'Smart Charts!', 'Rupees and Paise'],
        '4': ['Building with Bricks', 'Long and Short', 'A Trip to Bhopal', 'Tick-Tick-Tick', 'The Way The World Looks', 'The Junk Seller', 'Jugs and Mugs', 'Carts and Wheels', 'Halves and Quarters', 'Play with Patterns', 'Tables and Shares', 'How Heavy? How Light?', 'Fields and Fences', 'Smart Charts!'],
        '5': ['The Fish Tale', 'Shapes and Angles', 'How Many Squares?', 'Parts and Wholes', 'Does it Look the Same?', 'Be My Multiple, I\'ll be Your Factor', 'Can You See the Pattern?', 'Mapping Your Way', 'Boxes and Sketches', 'Tenths and Hundredths', 'Area and its Boundary', 'Smart Charts', 'Ways to Multiply and Divide', 'How Big? How Heavy?'],
      },
      'English': {
        '1': ['A Happy Child', 'Three Little Pigs', 'After a Bath', 'The Bubble, the Straw and the Shoe', 'One Little Kitten', 'Lalu and Peelu', 'Once I Saw a Little Bird', 'Mittu and the Yellow Mango', 'Merry-Go-Round', 'Circle', 'If I Were an Apple', 'Our Tree'],
        '2': ['First Day at School', 'Haldi\'s Adventure', 'I am Lucky!', 'I Want', 'Make it Shorter', 'The Mumbai Musicians', 'On My Blackboard', 'The Grasshopper and the Ant', 'Funny Bunny', 'I am the Music Man', 'The Seasons', 'Rain'],
        '3': ['Good Morning', 'The Magic Garden', 'Bird Talk', 'Nina and the Baby Sparrows', 'The Yellow Butterfly', 'Little by Little', 'Puppy and I', 'Sea Song', 'A Little Fish Story', 'The Balloon Man', 'What\'s in the Mailbox?'],
        '4': ['Wake Up!', 'Neha\'s Alarm Clock', 'Noses', 'The Little Fir Tree', 'Run!', 'Nasruddin\'s Aim', 'Why?', 'Alice in Wonderland', 'Don\'t Be Afraid of the Dark', 'Helen Keller', 'The Donkey', 'I Had a Little Pony', 'The Milkman\'s Cow', 'The Scholar\'s Mother Tongue', 'A Watering Rhyme', 'The Giving Tree', 'A Trek to Doori', 'Going to Buy a Book', 'Pinocchio'],
        '5': ['Wonderful Waste!', 'Flying Together', 'My Shadow', 'Robinson Crusoe', 'Crying', 'My Elder Brother', 'The Lazy Frog', 'Rip Van Winkle', 'Class Discussion', 'The Talkative Barber', 'Topsy-Turvy Land', 'Gulliver\'s Travels', 'Nobody\'s Friend', 'The Little Bully', 'Around the World', 'Sing a Song of People', 'Malu Bhalu', 'Who Will be Ningthou?'],
      },
      'Hindi': {
        '1': ['झूला', 'आम की कहानी', 'आम की टोकरी', 'पत्ते ही पत्ते', 'पकौड़ी', 'छुक-छुक गाड़ी', 'रसोईघर', 'चूहो! म्याऊँ सो रही है', 'बंदर और गिलहरी', 'पगड़ी', 'मेला', 'गेंद-बल्ला', 'बंदर गया खेत में भाग', 'एक बुढ़िया', 'मैं भी', 'लालू और पीलू', 'चकई के चकदुम', 'छोटी का कमाल', 'चार चने'],
        '2': ['ऊँट चला', 'भालू ने खेली फ़ुटबॉल', 'म्याऊँ, म्याऊँ!!', 'अधिक बलवान कौन?', 'दोस्त की मदद', 'बहुत हुआ', 'मेरी किताब', 'तितली और कली', 'बुलबुल', 'मीठी सारंगी', 'टेसू राजा बीच बाज़ार', 'बस के नीचे बाघ', 'सूरज जल्दी आना जी', 'नटखट चूहा', 'एक्की-दोक्की'],
        '3': ['कक्कू', 'शेखीबाज़ मक्खी', 'चाँद वाली अम्मा', 'मन करता है', 'बहादुर बित्तो', 'हमसे सब कहते', 'टिपटिपवा', 'बंदर बाँट', 'कब आऊँ', 'क्योंजीमल और कैसे कैसलिया', 'जब मुझे साँप ने काटा', 'जब तेरह थे', 'मिर्च का मज़ा', 'सबसे अच्छा पेड़', 'सबसे अच्छा पेड़'],
        '4': ['मन के भोले-भाले बादल', 'जैसा सवाल वैसा जवाब', 'किरमिच की गेंद', 'पापा जब बच्चे थे', 'दोस्त की पोशाक', 'नाव बनाओ नाव बनाओ', 'दान का हिसाब', 'उँगलियाँ और गाँठे', 'स्वतंत्रता की ओर', 'थप्प रोटी थप्प दाल', 'पढ़क्कू की सूझ', 'सुनीता की पहिया कुर्सी', 'हुदहुद', 'मुफ़्त ही मुफ़्त'],
        '5': ['राख की रस्सी', 'फ़सलों के त्योहार', 'खिलौनेवाला', 'नन्हा फ़नकार', 'जहाँ चाह वहाँ राह', 'चिट्ठी का सफ़र', 'डाकिए की कहानी', 'वे दिन भी क्या दिन थे!', 'एक माँ की बेबसी', 'बिशन की दिलेरी', 'अमर कोष के रचयिता', 'हम भी सीखें', 'स्वामी की दादी', 'बाघ आया उस रात', 'गुरुदेव ने रबींद्र नाथ', 'तालिका दो', 'छोटू का रोना', 'यह सबसे कठिन समय नहीं', 'बाँस का सपना'],
      },
      'EVS': {
        '3': ['Poonam\'s Day Out', 'The Plant Fairy', 'Water O\' Water', 'Our First School', 'Chhotu\'s House', 'Foods We Eat', 'Saying Without Speaking', 'Flying High', 'It\'s Raining', 'What is Cooking', 'From Here to There', 'Work We Do', 'Sharing Our Feelings', 'The Story of Food', 'Making Pots', 'Games We Play', 'Here Comes a Letter', 'A House Like This', 'Our Friends - Animals', 'Drop by Drop', 'Families can be Different', 'Left-Right', 'A Beautiful Cloth'],
        '4': ['Going to School', 'Ear to Ear', 'A Day with Nandu', 'The Story of Amrita', 'Anita and the Honeybees', 'Omana\'s Journey', 'From the Window', 'Reaching Grandmother\'s House', 'Changing Families', 'Hu Tu Tu, Hu Tu Tu', 'The Valley of Flowers', 'Changing Times', 'A River\'s Tale', 'Basva\'s Farm', 'From Market to Home', 'A Busy Month', 'Nandita in Mumbai', 'Too Much Water, Too Little Water', 'Abdul in the Garden', 'Eating Together', 'Food and Fun', 'The World in My Home', 'Pochampad Li', 'Home and Abroad'],
        '5': ['Super Senses', 'A Snake Charmer\'s Story', 'From Tasting to Digesting', 'Mangoes Round the Year', 'Seeds and Seeds', 'Every Drop Counts', 'Experiments with Water', 'A Treat for Mosquitoes', 'Up You Go!', 'Walls Tell Stories', 'Sunita in Space', 'What if it Finishes...?', 'A Shelter so High!', 'When the Earth Shook!', 'Blow Hot, Blow Cold', 'Who will do this Work?', 'Across the Wall', 'No Place for Us?', 'A Seed tells a Farmer\'s Story', 'Whose Forests?', 'Like Father, Like Daughter', 'On the Move Again'],
      },
    };
    return primaryChapters[subject]?.[classNum] || [];
  }

  // Class 6-10 NCERT chapters
  const secondaryChapters: Record<string, Record<string, string[]>> = {
    'Mathematics': {
      '6': ['Knowing Our Numbers', 'Whole Numbers', 'Playing with Numbers', 'Basic Geometrical Ideas', 'Understanding Elementary Shapes', 'Integers', 'Fractions', 'Decimals', 'Data Handling', 'Mensuration', 'Algebra', 'Ratio and Proportion', 'Symmetry', 'Practical Geometry'],
      '7': ['Integers', 'Fractions and Decimals', 'Data Handling', 'Simple Equations', 'Lines and Angles', 'The Triangle and its Properties', 'Congruence of Triangles', 'Comparing Quantities', 'Rational Numbers', 'Practical Geometry', 'Perimeter and Area', 'Algebraic Expressions', 'Exponents and Powers', 'Symmetry', 'Visualising Solid Shapes'],
      '8': ['Rational Numbers', 'Linear Equations in One Variable', 'Understanding Quadrilaterals', 'Practical Geometry', 'Data Handling', 'Squares and Square Roots', 'Cubes and Cube Roots', 'Comparing Quantities', 'Algebraic Expressions and Identities', 'Visualising Solid Shapes', 'Mensuration', 'Exponents and Powers', 'Direct and Inverse Proportions', 'Factorisation', 'Introduction to Graphs', 'Playing with Numbers'],
      '9': ['Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations in Two Variables', 'Introduction to Euclid\'s Geometry', 'Lines and Angles', 'Triangles', 'Quadrilaterals', 'Areas of Parallelograms and Triangles', 'Circles', 'Constructions', 'Heron\'s Formula', 'Surface Areas and Volumes', 'Statistics', 'Probability'],
      '10': ['Real Numbers', 'Polynomials', 'Pair of Linear Equations in Two Variables', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Introduction to Trigonometry', 'Some Applications of Trigonometry', 'Circles', 'Constructions', 'Areas Related to Circles', 'Surface Areas and Volumes', 'Statistics', 'Probability'],
    },
    'Science': {
      '6': ['Food: Where Does It Come From?', 'Components of Food', 'Fibre to Fabric', 'Sorting Materials into Groups', 'Separation of Substances', 'Changes Around Us', 'Getting to Know Plants', 'Body Movements', 'The Living Organisms and Their Surroundings', 'Motion and Measurement of Distances', 'Light, Shadows and Reflections', 'Electricity and Circuits', 'Fun with Magnets', 'Water', 'Air Around Us', 'Garbage In, Garbage Out'],
      '7': ['Nutrition in Plants', 'Nutrition in Animals', 'Fibre to Fabric', 'Heat', 'Acids, Bases and Salts', 'Physical and Chemical Changes', 'Weather, Climate and Adaptations', 'Winds, Storms and Cyclones', 'Soil', 'Respiration in Organisms', 'Transportation in Animals and Plants', 'Reproduction in Plants', 'Motion and Time', 'Electric Current and Its Effects', 'Light', 'Water: A Precious Resource', 'Forests: Our Lifeline', 'Wastewater Story'],
      '8': ['Crop Production and Management', 'Microorganisms: Friend and Foe', 'Synthetic Fibres and Plastics', 'Materials: Metals and Non-Metals', 'Coal and Petroleum', 'Combustion and Flame', 'Conservation of Plants and Animals', 'Cell — Structure and Functions', 'Reproduction in Animals', 'Reaching the Age of Adolescence', 'Force and Pressure', 'Friction', 'Sound', 'Chemical Effects of Electric Current', 'Some Natural Phenomena', 'Light', 'Stars and The Solar System', 'Pollution of Air and Water'],
      '9': ['Matter in Our Surroundings', 'Is Matter Around Us Pure', 'Atoms and Molecules', 'Structure of the Atom', 'The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms', 'Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy', 'Sound', 'Why Do We Fall Ill', 'Natural Resources', 'Improvement in Food Resources'],
      '10': ['Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals', 'Carbon and its Compounds', 'Periodic Classification of Elements', 'Life Processes', 'Control and Coordination', 'How do Organisms Reproduce', 'Heredity and Evolution', 'Light – Reflection and Refraction', 'Human Eye and Colourful World', 'Electricity', 'Magnetic Effects of Electric Current', 'Sources of Energy', 'Our Environment', 'Management of Natural Resources'],
    },
    'English': {
      '6': ['Who Did Patrick\'s Homework?', 'How the Dog Found Himself a New Master!', 'Taro\'s Reward', 'An Indian - American Woman in Space: Kalpana Chawla', 'A Different Kind of School', 'Who I Am', 'Fair Play', 'A Game of Chance', 'Desert Animals', 'The Banyan Tree', 'A House, A Home', 'The Kite', 'The Quarrel', 'Beauty', 'Where Do All the Teachers Go?', 'The Wonderful Words'],
      '7': ['Three Questions', 'A Gift of Chappals', 'Gopal and the Hilsa Fish', 'The Ashes That Made Trees Bloom', 'Quality', 'Expert Detectives', 'The Invention of Vita-Wonk', 'Fire: Friend and Foe', 'A Bicycle in Good Repair', 'The Story of Cricket', 'The Squirrel', 'The Rebel', 'The Shed', 'Chivvy', 'Trees', 'Mystery of the Talking Fan', 'Dad and the Cat and the Tree', 'Meadow Surprises', 'Garden Snake'],
      '8': ['The Best Christmas Present in the World', 'The Tsunami', 'Glimpses of the Past', 'Bepin Choudhury\'s Lapse of Memory', 'The Summit Within', 'This is Jody\'s Fawn', 'A Visit to Cambridge', 'A Short Monsoon Diary', 'The Great Stone Face', 'The Ant and the Cricket', 'Geography Lesson', 'Macavity: The Mystery Cat', 'The Last Bargain', 'The School Boy', 'The Duck and the Kangaroo', 'When I Set Out for Lyonnesse', 'On the Grasshopper and Cricket', 'The Comet'],
      '9': ['The Fun They Had', 'The Sound of Music', 'The Little Girl', 'A Truly Beautiful Mind', 'The Snake and the Mirror', 'My Childhood', 'Packing', 'Reach for the Top', 'The Bond of Love', 'Kathmandu', 'If I Were You', 'The Road Not Taken', 'Wind', 'Rain on the Roof', 'The Lake Isle of Innisfree', 'A Legend of the Northland', 'No Men Are Foreign', 'The Duck and the Kangaroo', 'On Killing a Tree', 'The Snake Trying', 'A Slumber Did My Spirit Seal'],
      '10': ['A Letter to God', 'Nelson Mandela: Long Walk to Freedom', 'Two Stories about Flying', 'From the Diary of Anne Frank', 'The Hundred Dresses', 'Glimpses of India', 'Mijbil the Otter', 'Madam Rides the Bus', 'The Sermon at Benares', 'The Proposal', 'Dust of Snow', 'Fire and Ice', 'A Tiger in the Zoo', 'How to Tell Wild Animals', 'The Ball Poem', 'Amanda!', 'The Trees', 'Fog', 'The Tale of Custard the Dragon', 'For Anne Gregory'],
    },
    'Hindi': {
      '6': ['वह चिड़िया जो', 'बचपन', 'नादान दोस्त', 'चाँद से थोड़ी सी गप्पें', 'अक्षरों का महत्व', 'पार नज़र के', 'साथी हाथ बढ़ाना', 'ऐसे-ऐसे', 'टिकट अलबम', 'झाँसी की रानी', 'जो देखकर भी नहीं देखते', 'संसार पुस्तक है', 'मैं सबसे छोटी होऊं', 'लोकगीत', 'नौकर', 'वन के मार्ग में', 'साँस-साँस में बाँस'],
      '7': ['हम पंछी उन्मुक्त गगन के', 'दादी माँ', 'हिमालय की बेटियाँ', 'कठपुतली', 'मिठाईवाला', 'रक्त और हमारा शरीर', 'पापा खो गए', 'शाम-एक-किसान', 'चिड़िया की बच्ची', 'अपूर्व अनुभव', 'रहीम के दोहे', 'कंचा', 'एक तिनका', 'खानपान की बदलती तस्वीर', 'नीलकंठ', 'भोर और बरखा', 'वीर कुँवर सिंह', 'संघर्ष के कारण मैं तुनकमिज़ाज हो गया : धनराज', 'आश्रम का अनुमानित व्यय'],
      '8': ['ध्वनि', 'लाख की चूड़ियाँ', 'बस की यात्रा', 'दीवानों की हस्ती', 'चिट्ठियों की अनूठी दुनिया', 'भगवान के डाकिए', 'क्या निराश हुआ जाए', 'यह सबसे कठिन समय नहीं', 'कबीर की साखियाँ', 'कामचोर', 'जब सिनेमा ने बोलना सीखा', 'सुदामा चरित', 'जहाँ पहिया है', 'अकबरी लोटा', 'सूर के पद', 'पानी की कहानी', 'बाज और साँप', 'टोपी'],
      '9': ['दो बैलों की कथा', 'ल्हासा की ओर', 'उपभोक्तावाद की संस्कृति', 'साँवले सपनों की याद', 'नाना साहब की पुत्री देवी मैना को भस्म कर दिया गया', 'प्रेमचंद के फटे जूते', 'मेरे बचपन के दिन', 'एक कुत्ता और एक मैना', 'साखियाँ एवं सबद', 'वाख', 'सवैये', 'कैदी और कोकिला', 'ग्राम श्री', 'चंद्र गहना से लौटती बेर', 'मेघ आए', 'यमराज की दिशा', 'बच्चे काम पर जा रहे हैं'],
      '10': ['सूरदास के पद', 'राम-लक्ष्मण-परशुराम संवाद', 'आत्मत्राण', 'उत्साह', 'अट नहीं रही है', 'यह दंतुरित मुसकान', 'फसल', 'छाया मत छूना', 'कन्यादान', 'संगतकार', 'नेताजी का चश्मा', 'बालगोबिन भगत', 'लखनवी अंदाज़', 'मानवीय करुणा की दिव्य चमक', 'एक कहानी यह भी', 'स्त्री-शिक्षा के विरोधी कुतर्कों का खंडन', 'नौबतखाने में इबादत', 'संस्कृति'],
    },
    'Social Science': {
      '6': ['What, Where, How and When?', 'From Hunting-Gathering to Growing Food', 'In the Earliest Cities', 'What Books and Burials Tell Us', 'Kingdoms, Kings and an Early Republic', 'New Questions and Ideas', 'Ashoka, The Emperor Who Gave Up War', 'Vital Villages, Thriving Towns', 'Traders, Kings and Pilgrims', 'New Empires and Kingdoms', 'Buildings, Paintings and Books', 'The Earth in the Solar System', 'Globe: Latitudes and Longitudes', 'Motions of the Earth', 'Maps', 'Major Domains of the Earth', 'Our Country – India', 'India: Climate, Vegetation and Wildlife', 'Understanding Diversity', 'Diversity and Discrimination', 'What is Government?', 'Key Elements of a Democratic Government', 'Panchayati Raj', 'Rural Livelihoods', 'Urban Livelihoods'],
      '7': ['Tracing Changes Through a Thousand Years', 'New Kings and Kingdoms', 'The Delhi Sultans', 'The Mughal Empire', 'Rulers and Buildings', 'Towns, Traders and Craftspersons', 'Tribes, Nomads and Settled Communities', 'Devotional Paths to the Divine', 'The Making of Regional Cultures', 'Eighteenth-Century Political Formations', 'Environment', 'Inside Our Earth', 'Our Changing Earth', 'Air', 'Water', 'Natural Vegetation and Wild Life', 'Human Environment – Settlement, Transport and Communication', 'Human Environment Interactions – The Tropical and the Subtropical Region', 'Life in the Deserts', 'On Equality', 'Role of the Government in Health', 'How the State Government Works', 'Growing up as Boys and Girls', 'Women Change the World', 'Understanding Media', 'Markets Around Us', 'A Shirt in the Market'],
      '8': ['How, When and Where', 'From Trade to Territory', 'Ruling the Countryside', 'Tribals, Dikus and the Vision of a Golden Age', 'When People Rebel', 'Weavers, Iron Smelters and Factory Owners', 'Civilising the "Native", Educating the Nation', 'Women, Caste and Reform', 'The Making of the National Movement: 1870s–1947', 'India After Independence', 'Resources', 'Land, Soil, Water, Natural Vegetation and Wildlife Resources', 'Mineral and Power Resources', 'Agriculture', 'Industries', 'Human Resources', 'The Indian Constitution', 'Understanding Secularism', 'Why do we need a Parliament?', 'Understanding Laws', 'Judiciary', 'Understanding Marginalisation', 'Confronting Marginalisation', 'Public Facilities', 'Law and Social Justice'],
      '9': ['The French Revolution', 'Socialism in Europe and the Russian Revolution', 'Nazism and the Rise of Hitler', 'Forest Society and Colonialism', 'Pastoralists in the Modern World', 'India – Size and Location', 'Physical Features of India', 'Drainage', 'Climate', 'Natural Vegetation and Wild Life', 'Population', 'What is Democracy? Why Democracy?', 'Constitutional Design', 'Electoral Politics', 'Working of Institutions', 'Democratic Rights', 'The Story of Village Palampur', 'People as Resource', 'Poverty as a Challenge', 'Food Security in India'],
      '10': ['The Rise of Nationalism in Europe', 'Nationalism in India', 'The Making of a Global World', 'The Age of Industrialisation', 'Print Culture and the Modern World', 'Resources and Development', 'Forest and Wildlife Resources', 'Water Resources', 'Agriculture', 'Minerals and Energy Resources', 'Manufacturing Industries', 'Lifelines of National Economy', 'Power Sharing', 'Federalism', 'Democracy and Diversity', 'Gender, Religion and Caste', 'Popular Struggles and Movements', 'Political Parties', 'Outcomes of Democracy', 'Challenges to Democracy', 'Development', 'Sectors of the Indian Economy', 'Money and Credit', 'Globalisation and the Indian Economy', 'Consumer Rights'],
    },
  };

  return secondaryChapters[subject]?.[classNum] || [];
};

const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'EVS'];

const QuizPage = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const { toast } = useToast();

  const availableChapters = selectedClass && selectedSubject ? getChaptersForClass(selectedClass, selectedSubject) : [];
  const availableSubjects = selectedClass ? 
    (['Nursery', 'LKG', 'UKG'].includes(selectedClass) ? ['Mathematics', 'English', 'Hindi', 'EVS'] : subjects.filter(s => s !== 'EVS')) 
    : subjects;

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
          difficulty: selectedDifficulty,
          questionCount: questionCount,
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
              Test your knowledge with AI-generated quizzes based on NCERT curriculum. Select your class, subject, chapters, difficulty, and number of questions!
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
                <Select value={selectedClass} onValueChange={(value) => {
                  setSelectedClass(value);
                  setSelectedSubject('');
                  setSelectedChapters([]);
                }}>
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
                  disabled={!selectedClass}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chapter Selection */}
              {selectedSubject && availableChapters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <Label className="text-base font-semibold">
                    Select Chapters ({selectedChapters.length} selected)
                  </Label>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg bg-secondary/30">
                    {availableChapters.map((chapter, index) => (
                      <div
                        key={chapter}
                        className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded cursor-pointer"
                        onClick={() => toggleChapter(chapter)}
                      >
                        <Checkbox
                          checked={selectedChapters.includes(chapter)}
                          onCheckedChange={() => toggleChapter(chapter)}
                        />
                        <Label className="text-sm cursor-pointer flex-1">
                          <span className="text-muted-foreground mr-2">{index + 1}.</span>
                          {chapter}
                        </Label>
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

              {/* Difficulty Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Select Difficulty</Label>
                <div className="grid grid-cols-3 gap-3">
                  {difficultyLevels.map((level) => {
                    const Icon = level.icon;
                    const isSelected = selectedDifficulty === level.value;
                    return (
                      <button
                        key={level.value}
                        onClick={() => setSelectedDifficulty(level.value)}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                          isSelected 
                            ? `${level.borderColor} ${level.bgColor}` 
                            : 'border-border hover:border-primary/30 hover:bg-secondary/30'
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${isSelected ? level.color : 'text-muted-foreground'}`} />
                        <span className={`font-medium text-sm ${isSelected ? level.color : 'text-foreground'}`}>
                          {level.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Count Selector */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Number of Questions: <span className="text-primary font-bold">{questionCount}</span>
                </Label>
                <div className="px-2">
                  <Slider
                    value={[questionCount]}
                    onValueChange={(value) => setQuestionCount(value[0])}
                    min={5}
                    max={25}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                    <span>20</span>
                    <span>25</span>
                  </div>
                </div>
              </div>

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
                    Generate {questionCount} MCQs
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
  const scoreThresholdHigh = Math.ceil(questions.length * 0.7);
  const scoreThresholdMid = Math.ceil(questions.length * 0.5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{selectedClass}</Badge>
            <Badge variant="outline">{selectedSubject}</Badge>
            <Badge variant="outline" className={
              selectedDifficulty === 'easy' ? 'border-green-500 text-green-600' :
              selectedDifficulty === 'hard' ? 'border-red-500 text-red-600' :
              'border-yellow-500 text-yellow-600'
            }>
              {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
            </Badge>
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
            <Card className={`border-2 ${score >= scoreThresholdHigh ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : score >= scoreThresholdMid ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' : 'border-red-500 bg-red-50 dark:bg-red-950/20'}`}>
              <CardContent className="py-4 text-center">
                <Trophy className={`h-12 w-12 mx-auto mb-2 ${score >= scoreThresholdHigh ? 'text-green-600' : score >= scoreThresholdMid ? 'text-yellow-600' : 'text-red-600'}`} />
                <h3 className="text-2xl font-bold">
                  {score >= scoreThresholdHigh ? 'Excellent!' : score >= scoreThresholdMid ? 'Good Job!' : 'Keep Practicing!'}
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
