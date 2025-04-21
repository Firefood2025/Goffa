
import React from 'react';
import { Utensils } from 'lucide-react';

const AiLoadingAnimation: React.FC<{ message?: string }> = ({ message = "Let the AI chef cook up ideas..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative mb-4">
      <Utensils
        size={72}
        className="animate-spin text-kitchen-green"
        style={{ animationDuration: '1.2s' }}
      />
    </div>
    <span className="text-xl font-semibold text-kitchen-green">{message}</span>
  </div>
);

export default AiLoadingAnimation;
