"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw, Dumbbell, Trophy, TrendingUp, Clock, CheckCircle2, Target, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Exercise = {
  id: string;
  name: string;
  reps: string;
  sets: number;
  rest: number;
  difficulty: "iniciante" | "intermediário" | "avançado";
  muscleGroup: string;
};

type Workout = {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: "iniciante" | "intermediário" | "avançado";
  exercises: Exercise[];
};

const workouts: Workout[] = [
  {
    id: "1",
    name: "Treino Iniciante",
    description: "Perfeito para começar sua jornada na calistenia",
    duration: "20-25 min",
    difficulty: "iniciante",
    exercises: [
      { id: "1", name: "Flexões de Joelho", reps: "8-12", sets: 3, rest: 60, difficulty: "iniciante", muscleGroup: "Peito" },
      { id: "2", name: "Agachamento", reps: "15-20", sets: 3, rest: 60, difficulty: "iniciante", muscleGroup: "Pernas" },
      { id: "3", name: "Prancha", reps: "20-30s", sets: 3, rest: 45, difficulty: "iniciante", muscleGroup: "Core" },
      { id: "4", name: "Polichinelo", reps: "20", sets: 3, rest: 45, difficulty: "iniciante", muscleGroup: "Cardio" },
    ],
  },
  {
    id: "2",
    name: "Treino Intermediário",
    description: "Evolua suas habilidades com exercícios mais desafiadores",
    duration: "30-35 min",
    difficulty: "intermediário",
    exercises: [
      { id: "5", name: "Flexões Normais", reps: "12-15", sets: 4, rest: 60, difficulty: "intermediário", muscleGroup: "Peito" },
      { id: "6", name: "Barra Fixa (Pegada Supinada)", reps: "6-10", sets: 4, rest: 90, difficulty: "intermediário", muscleGroup: "Costas" },
      { id: "7", name: "Agachamento Pistol Assistido", reps: "8-10", sets: 3, rest: 75, difficulty: "intermediário", muscleGroup: "Pernas" },
      { id: "8", name: "Prancha Lateral", reps: "30-45s", sets: 3, rest: 60, difficulty: "intermediário", muscleGroup: "Core" },
      { id: "9", name: "Burpees", reps: "10-12", sets: 3, rest: 60, difficulty: "intermediário", muscleGroup: "Full Body" },
    ],
  },
  {
    id: "3",
    name: "Treino Avançado",
    description: "Desafie seus limites com exercícios de alta intensidade",
    duration: "40-45 min",
    difficulty: "avançado",
    exercises: [
      { id: "10", name: "Flexão Diamante", reps: "15-20", sets: 4, rest: 60, difficulty: "avançado", muscleGroup: "Tríceps" },
      { id: "11", name: "Muscle Up", reps: "5-8", sets: 4, rest: 120, difficulty: "avançado", muscleGroup: "Full Body" },
      { id: "12", name: "Pistol Squat", reps: "10-12", sets: 4, rest: 90, difficulty: "avançado", muscleGroup: "Pernas" },
      { id: "13", name: "L-Sit", reps: "20-30s", sets: 4, rest: 90, difficulty: "avançado", muscleGroup: "Core" },
      { id: "14", name: "Handstand Push-up", reps: "8-12", sets: 4, rest: 120, difficulty: "avançado", muscleGroup: "Ombros" },
    ],
  },
];

export default function CalisteniaApp() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
  const [workoutsCompleted, setWorkoutsCompleted] = useState(12);
  const [currentStreak, setCurrentStreak] = useState(5);

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setCurrentExerciseIndex(0);
    setIsResting(false);
    setTimeLeft(0);
    setIsTimerRunning(false);
    setCompletedSets({});
  };

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeSet = (exerciseId: string) => {
    const newCompleted = { ...completedSets };
    newCompleted[exerciseId] = (newCompleted[exerciseId] || 0) + 1;
    setCompletedSets(newCompleted);
  };

  const startRest = (restTime: number) => {
    setIsResting(true);
    startTimer(restTime);
  };

  const nextExercise = () => {
    if (selectedWorkout && currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setIsResting(false);
      setTimeLeft(0);
      setIsTimerRunning(false);
    }
  };

  const finishWorkout = () => {
    setWorkoutsCompleted(workoutsCompleted + 1);
    setCurrentStreak(currentStreak + 1);
    setSelectedWorkout(null);
    setCurrentExerciseIndex(0);
    setCompletedSets({});
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "iniciante":
        return "bg-green-500";
      case "intermediário":
        return "bg-yellow-500";
      case "avançado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (selectedWorkout) {
    const currentExercise = selectedWorkout.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex + 1) / selectedWorkout.exercises.length) * 100;
    const currentSets = completedSets[currentExercise.id] || 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedWorkout(null)}
              className="text-white hover:bg-white/10 mb-4"
            >
              ← Voltar
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{selectedWorkout.name}</h1>
            <Progress value={progress} className="h-2 bg-white/20" />
            <p className="text-white/70 mt-2">
              Exercício {currentExerciseIndex + 1} de {selectedWorkout.exercises.length}
            </p>
          </div>

          {/* Current Exercise Card */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className={`${getDifficultyColor(currentExercise.difficulty)} text-white`}>
                  {currentExercise.muscleGroup}
                </Badge>
                <span className="text-white/70 text-sm">
                  {currentSets}/{currentExercise.sets} séries
                </span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-white">{currentExercise.name}</CardTitle>
              <CardDescription className="text-white/70 text-lg">
                {currentExercise.reps} repetições • {currentExercise.rest}s descanso
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Timer Display */}
              {isResting && (
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-white mb-2">{timeLeft}s</div>
                  <p className="text-white/70">Descansando...</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {currentSets < currentExercise.sets && !isResting && (
                  <Button
                    size="lg"
                    onClick={() => {
                      completeSet(currentExercise.id);
                      if (currentSets + 1 < currentExercise.sets) {
                        startRest(currentExercise.rest);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg h-14"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Série Completa
                  </Button>
                )}

                {currentSets >= currentExercise.sets && (
                  <>
                    {currentExerciseIndex < selectedWorkout.exercises.length - 1 ? (
                      <Button
                        size="lg"
                        onClick={nextExercise}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-lg h-14"
                      >
                        Próximo Exercício →
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        onClick={finishWorkout}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-lg h-14"
                      >
                        <Trophy className="mr-2 h-5 w-5" />
                        Finalizar Treino
                      </Button>
                    )}
                  </>
                )}

                {isResting && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setIsResting(false);
                      setTimeLeft(0);
                      setIsTimerRunning(false);
                    }}
                    className="w-full border-white/30 text-white hover:bg-white/10"
                  >
                    Pular Descanso
                  </Button>
                )}
              </div>

              {/* Sets Progress */}
              <div className="flex gap-2 mt-6">
                {Array.from({ length: currentExercise.sets }).map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-2 rounded-full ${
                      index < currentSets ? "bg-green-500" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exercise List */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Lista de Exercícios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedWorkout.exercises.map((exercise, index) => {
                const sets = completedSets[exercise.id] || 0;
                const isCompleted = sets >= exercise.sets;
                const isCurrent = index === currentExerciseIndex;

                return (
                  <div
                    key={exercise.id}
                    className={`p-3 rounded-lg ${
                      isCurrent
                        ? "bg-white/20 border-2 border-white/40"
                        : isCompleted
                        ? "bg-green-500/20"
                        : "bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                        <div>
                          <p className="text-white font-medium">{exercise.name}</p>
                          <p className="text-white/60 text-sm">
                            {exercise.reps} • {exercise.sets} séries
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-white border-white/30">
                        {sets}/{exercise.sets}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell className="h-10 w-10 text-white" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Calistenia Pro</h1>
          </div>
          <p className="text-white/70 text-lg">Seu treino de peso corporal, onde e quando quiser</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Treinos Completos</p>
                  <p className="text-3xl font-bold text-white">{workoutsCompleted}</p>
                </div>
                <Trophy className="h-10 w-10 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Sequência Atual</p>
                  <p className="text-3xl font-bold text-white">{currentStreak} dias</p>
                </div>
                <Flame className="h-10 w-10 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Progresso Semanal</p>
                  <p className="text-3xl font-bold text-white">85%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workouts Section */}
        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-lg border border-white/20 mb-6">
            <TabsTrigger value="todos" className="data-[state=active]:bg-white/20 text-white">
              Todos
            </TabsTrigger>
            <TabsTrigger value="iniciante" className="data-[state=active]:bg-white/20 text-white">
              Iniciante
            </TabsTrigger>
            <TabsTrigger value="intermediário" className="data-[state=active]:bg-white/20 text-white">
              Intermediário
            </TabsTrigger>
            <TabsTrigger value="avançado" className="data-[state=active]:bg-white/20 text-white">
              Avançado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-4">
            {workouts.map((workout) => (
              <Card
                key={workout.id}
                className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                onClick={() => startWorkout(workout)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-white text-xl">{workout.name}</CardTitle>
                        <Badge className={`${getDifficultyColor(workout.difficulty)} text-white`}>
                          {workout.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="text-white/70">{workout.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-white/70 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{workout.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span>{workout.exercises.length} exercícios</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                    <Play className="mr-2 h-4 w-4" />
                    Começar Treino
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {["iniciante", "intermediário", "avançado"].map((level) => (
            <TabsContent key={level} value={level} className="space-y-4">
              {workouts
                .filter((w) => w.difficulty === level)
                .map((workout) => (
                  <Card
                    key={workout.id}
                    className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                    onClick={() => startWorkout(workout)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-white text-xl">{workout.name}</CardTitle>
                            <Badge className={`${getDifficultyColor(workout.difficulty)} text-white`}>
                              {workout.difficulty}
                            </Badge>
                          </div>
                          <CardDescription className="text-white/70">{workout.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6 text-white/70 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{workout.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span>{workout.exercises.length} exercícios</span>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                        <Play className="mr-2 h-4 w-4" />
                        Começar Treino
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
