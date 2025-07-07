import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function QuizScreen({ route, navigation }) {
  const { topic } = route.params || {};
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Sample quiz questions - in a real app, these would come from Firebase
  const questions = [
    {
      question: "What is the primary purpose of a budget?",
      options: [
        "To spend all your money",
        "To track income and expenses",
        "To avoid saving money",
        "To increase debt"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following is a good investment strategy?",
      options: [
        "Putting all money in one stock",
        "Diversifying your portfolio",
        "Investing only in cryptocurrency",
        "Avoiding all investments"
      ],
      correctAnswer: 1
    },
    {
      question: "What is compound interest?",
      options: [
        "Interest only on the principal amount",
        "Interest on both principal and accumulated interest",
        "A type of loan",
        "A banking fee"
      ],
      correctAnswer: 1
    }
  ];

  const handleAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  const handleFinish = () => {
    Alert.alert(
      'Quiz Complete',
      `You scored ${score} out of ${questions.length}!`,
      [
        { text: 'Retake Quiz', onPress: handleRetake },
        { text: 'Finish', onPress: () => navigation.goBack() }
      ]
    );
  };

  if (showResults) {
    return (
      <View style={styles.container}>
        <View style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Quiz Results</Text>
          <Text style={styles.scoreText}>
            You scored {score} out of {questions.length}
          </Text>
          <Text style={styles.percentageText}>
            {Math.round((score / questions.length) * 100)}%
          </Text>
          
          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
              <Text style={styles.retakeButtonText}>Retake Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
              <Text style={styles.finishButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (!topic) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Topic not found</Text>
      </View>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.topicName}>{topic.name} Quiz</Text>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQ.question}</Text>
        
        <View style={styles.optionsContainer}>
          {currentQ.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(index)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progress, 
            { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
          ]} 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  topicName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  questionCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    margin: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 16,
    color: '#222',
    lineHeight: 22,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#FFD600',
  },
  resultsCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD600',
    marginBottom: 30,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 15,
  },
  retakeButton: {
    backgroundColor: '#666',
    borderRadius: 8,
    padding: 15,
    minWidth: 100,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: '#FFD600',
    borderRadius: 8,
    padding: 15,
    minWidth: 100,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});
