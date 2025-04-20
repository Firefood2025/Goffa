
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChefHat, ShoppingCart, Utensils, List } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface OnboardingStepsProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
}

const OnboardingSteps: React.FC<OnboardingStepsProps> = ({
  currentStep,
  setCurrentStep,
  completeOnboarding
}) => {
  const steps = [
    {
      title: "Welcome to Recipe Ideas",
      description: "Discover new recipes based on ingredients you already have in your pantry or create your own custom recipes.",
      icon: <ChefHat size={48} className="text-kitchen-green" />,
    },
    {
      title: "Choose Your Kitchen Style",
      description: "Select your preferred cuisine style or create a custom one to personalize your recipe suggestions.",
      icon: <Utensils size={48} className="text-kitchen-green" />,
    },
    {
      title: "Scan Your Pantry",
      description: "We'll look at what you already have in your pantry to suggest recipes that match your available ingredients.",
      icon: <List size={48} className="text-kitchen-green" />,
    },
    {
      title: "Add Missing Ingredients",
      description: "Found a recipe you like but missing some ingredients? Easily add them to your shopping list.",
      icon: <ShoppingCart size={48} className="text-kitchen-green" />,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <div className="flex-1 px-4 py-8 flex flex-col justify-center max-w-md mx-auto">
      <div className="mb-8">
        <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
      </div>
      
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex justify-center mb-6">
          {steps[currentStep].icon}
        </div>
        <h2 className="text-2xl font-bold mb-4 text-kitchen-dark">
          {steps[currentStep].title}
        </h2>
        <p className="text-gray-600">
          {steps[currentStep].description}
        </p>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button 
          onClick={handleNext}
          className="bg-kitchen-green hover:bg-kitchen-green/90"
        >
          {currentStep === steps.length - 1 ? "Get Started" : "Next"}
        </Button>
        
        {currentStep > 0 && (
          <Button 
            variant="outline"
            onClick={handlePrevious}
            className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
          >
            Back
          </Button>
        )}
        
        <Button 
          variant="ghost"
          onClick={handleSkip}
          className="text-gray-500"
        >
          Skip Onboarding
        </Button>
      </div>
    </div>
  );
};

export default OnboardingSteps;
