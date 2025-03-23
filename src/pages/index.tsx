import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState, useEffect, FC, ReactNode } from "react";
import { LiveKitRoom, RoomAudioRenderer, StartAudio } from "@livekit/components-react";
import Playground from "@/components/playground/Playground";
import { useConnection } from "@/hooks/useConnection";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import OpenSourceSection from "@/components/landing/OpenSourceSection";
import MobileAppsSection from "@/components/landing/MobileAppsSection";
import CTASection from "@/components/landing/CTASection";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import { PayBlock } from "@/components/Pay";

// Theme colors with mental health friendly palette
const themeColors = ["indigo", "purple", "blue", "teal", "green", "amber", "rose", "pink"];

// Auth status enum
enum AuthStatus {
  UNAUTHENTICATED,
  SIGNING_IN,
  VERIFYING,
  PAYMENT,
  AUTHENTICATED
}

// User profile interface
interface UserProfile {
  name: string;
  goal: string;
  biomarkersEnabled?: boolean;
  isPremium?: boolean;
  isVerified?: boolean;
  worldcoinId?: string;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  inputType?: string;
  inputPlaceholder?: string;
  options?: string[];
}

// Onboarding steps
const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to EchoMate",
    description: "Your voice-enabled mental health companion available 24/7 to support your wellbeing journey.",
    buttonText: "Get Started",
  },
  {
    id: "name",
    title: "What's your name?",
    description: "I'd like to get to know you better to provide personalized support.",
    inputType: "text",
    inputPlaceholder: "Your name",
    buttonText: "Continue",
  },
  {
    id: "goal",
    title: "What brings you here today?",
    description: "I offer evidence-based techniques to support various mental health needs.",
    options: [
      "Managing stress",
      "Improving sleep",
      "Reducing anxiety",
      "Building confidence",
      "Depression support",
      "Mindfulness practice", 
      "Something else",
    ],
    buttonText: "Continue",
  },
  {
    id: "complete",
    title: "Thanks for sharing",
    description: "I'm here to provide personalized support using evidence-based approaches including CBT, DBT, and meditation techniques.",
    buttonText: "Start Conversation",
  },
];

interface ConnectionWrapperProps {
  userProfile: UserProfile;
  onClose: () => void;
}

const ConnectionWrapper: FC<ConnectionWrapperProps> = ({ userProfile, onClose }) => {
  const { wsUrl, token, connect, disconnect } = useConnection();
  const [showPlayground, setShowPlayground] = useState(false);

  const handleConnect = async (shouldConnect: boolean) => {
    if (shouldConnect) {
      await connect("env", userProfile);
    } else {
      await disconnect();
    }
  };

  return (
    <>
      <AnimatePresence>
        {showPlayground && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-transparent w-full max-w-5xl h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
            >
              <LiveKitRoom
                serverUrl={wsUrl}
                token={token}
                connect={true}
                className="w-full h-full"
              >
                <Playground
                  themeColors={themeColors}
                  onConnect={handleConnect}
                  onClose={() => {
                    setShowPlayground(false);
                    handleConnect(false);
                    onClose();
                  }}
                  userProfile={userProfile}
                />
                <RoomAudioRenderer />
                <StartAudio label="Click to enable audio playback" />
              </LiveKitRoom>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setShowPlayground(true);
          handleConnect(true);
        }}
      >
        Talk to EchoMate
      </motion.button>
    </>
  );
};

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

// Onboarding component
const Onboarding: FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    goal: "",
    biomarkersEnabled: false,
  });
  const [selectedOption, setSelectedOption] = useState("");

  const handleNext = () => {
    if (currentStep === 1) {
      setUserProfile({ ...userProfile, name: userProfile.name || "Friend" });
    }
    
    if (currentStep === 2) {
      setUserProfile({ ...userProfile, goal: selectedOption || "Managing stress" });
    }
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userProfile);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm">
      <div className="bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-800/90 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="flex flex-col"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <Logo size={40} variant="light" />
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-3 text-center">
              {onboardingSteps[currentStep].title}
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-white/70 text-center mb-6">
              {onboardingSteps[currentStep].description}
            </motion.p>
            
            {onboardingSteps[currentStep].inputType === "text" && (
              <motion.div variants={itemVariants} className="mb-6">
                <input
                  type="text"
                  placeholder={onboardingSteps[currentStep].inputPlaceholder}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                />
              </motion.div>
            )}
            
            {onboardingSteps[currentStep].options && (
              <motion.div variants={itemVariants} className="mb-6 grid grid-cols-2 gap-3">
                {onboardingSteps[currentStep].options.map((option) => (
                  <button
                    key={option}
                    className={`p-3 rounded-xl border text-white transition-all ${
                      selectedOption === option
                        ? "bg-indigo-600 border-indigo-500"
                        : "bg-white/10 border-white/20 hover:bg-white/20"
                    }`}
                    onClick={() => setSelectedOption(option)}
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
            
            {currentStep === 3 && (
              <motion.div variants={itemVariants} className="mb-6">
                <label className="flex items-center space-x-3 text-white/80 hover:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    checked={userProfile.biomarkersEnabled}
                    onChange={() => setUserProfile({ 
                      ...userProfile, 
                      biomarkersEnabled: !userProfile.biomarkersEnabled 
                    })}
                  />
                  <span>Enable biomarker analysis for personalized insights</span>
                </label>
              </motion.div>
            )}
            
            <motion.button
              variants={itemVariants}
              className="py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              onClick={handleNext}
            >
              {onboardingSteps[currentStep].buttonText}
            </motion.button>
            
            {currentStep > 0 && (
              <motion.button
                variants={itemVariants}
                className="mt-3 py-2 text-white/60 hover:text-white text-sm"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Main component
export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.UNAUTHENTICATED);
  const [showAuthFlow, setShowAuthFlow] = useState(false);

  // Check if user profile exists in local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem('echomate_user_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        // If the user is already verified and premium, set to authenticated
        if (profile.isVerified && profile.isPremium) {
          setAuthStatus(AuthStatus.AUTHENTICATED);
        }
      } catch (e) {
        console.error("Failed to parse saved profile", e);
      }
    }
    
    // Add scroll listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Listen for the custom event from the Hero section
    const handleShowPlayground = (event: CustomEvent) => {
      if (event.detail?.userProfile) {
        // Show the playground modal from the header component
        const headerButton = document.querySelector('.header-playground-button') as HTMLButtonElement;
        if (headerButton) {
          headerButton.click();
        }
      }
    };
    
    window.addEventListener('showPlayground', handleShowPlayground as EventListener);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('showPlayground', handleShowPlayground as EventListener);
    };
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
    // Save to local storage
    localStorage.setItem('echomate_user_profile', JSON.stringify(profile));
  };

  const handleStartConversation = () => {
    if (!userProfile) {
      // User needs to complete onboarding first
      setShowOnboarding(true);
      return;
    }
    
    // Check if user needs to authenticate
    if (authStatus !== AuthStatus.AUTHENTICATED) {
      setShowAuthFlow(true);
      return;
    }
    
    // User is authenticated, proceed to playground
  };

  const handleAuthFlowComplete = (success: boolean) => {
    if (success && userProfile) {
      // Update user profile with authentication info
      const updatedProfile = {
        ...userProfile,
        isVerified: true,
        isPremium: true
      };
      setUserProfile(updatedProfile);
      localStorage.setItem('echomate_user_profile', JSON.stringify(updatedProfile));
      setAuthStatus(AuthStatus.AUTHENTICATED);
    }
    setShowAuthFlow(false);
  };

  const clearUserProfile = () => {
    localStorage.removeItem('echomate_user_profile');
    setUserProfile(null);
    setAuthStatus(AuthStatus.UNAUTHENTICATED);
  };

  // Auth flow component
  const renderAuthFlow = () => {
    if (!showAuthFlow) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm">
        <div className="bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-800/90 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col"
            >
              <div className="flex justify-center mb-6">
                <Logo size={40} variant="light" />
              </div>
              
              {authStatus === AuthStatus.UNAUTHENTICATED && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-3 text-center">
                    Sign in to EchoMate
                  </h2>
                  <p className="text-white/70 text-center mb-6">
                    Authenticate using your Worldcoin ID to access premium features
                  </p>
                  <div className="flex justify-center mb-6">
                    <SignIn />
                  </div>
                  <button
                    className="py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                    onClick={() => setAuthStatus(AuthStatus.VERIFYING)}
                  >
                    Continue
                  </button>
                </>
              )}
              
              {authStatus === AuthStatus.VERIFYING && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-3 text-center">
                    Verify Your Identity
                  </h2>
                  <p className="text-white/70 text-center mb-6">
                    Verify with Worldcoin to ensure privacy and security
                  </p>
                  <div className="flex justify-center mb-6">
                    <VerifyBlock />
                  </div>
                  <button
                    className="py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 mt-4"
                    onClick={() => setAuthStatus(AuthStatus.PAYMENT)}
                  >
                    Continue to Payment
                  </button>
                </>
              )}
              
              {authStatus === AuthStatus.PAYMENT && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-3 text-center">
                    Access Premium Features
                  </h2>
                  <p className="text-white/70 text-center mb-6">
                    Complete payment to access advanced biomarker analysis and personalized insights
                  </p>
                  <div className="flex justify-center mb-6">
                    <PayBlock />
                  </div>
                  <button
                    className="py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 mt-4"
                    onClick={() => {
                      setAuthStatus(AuthStatus.AUTHENTICATED);
                      handleAuthFlowComplete(true);
                    }}
                  >
                    Complete Setup
                  </button>
                </>
              )}
              
              <button
                className="mt-3 py-2 text-white/60 hover:text-white text-sm"
                onClick={() => setShowAuthFlow(false)}
              >
                Cancel
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800">
      {/* Fixed header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${hasScrolled ? 'bg-indigo-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Logo size={32} variant="light" />
            <h1 className="text-xl font-bold text-white ml-2">EchoMate</h1>
            <div className="ml-3 px-2 py-0.5 bg-indigo-600/30 text-indigo-200 text-xs font-medium rounded-full border border-indigo-500/30">
              BETA
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {userProfile ? (
              <div className="flex items-center">
                <div className="mr-4">
                  {authStatus === AuthStatus.AUTHENTICATED ? (
                    <ConnectionWrapper 
                      userProfile={userProfile} 
                      onClose={() => {}} 
                    />
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 header-playground-button"
                      onClick={handleStartConversation}
                    >
                      Unlock Premium Features
                    </motion.button>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white/70 hover:text-white text-sm"
                  onClick={clearUserProfile}
                >
                  Clear Data
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
                onClick={() => setShowOnboarding(true)}
              >
                Get Started
              </motion.button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main>
        {/* Hero Section */}
        <HeroSection onGetStarted={() => setShowOnboarding(true)} />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Open Source Section */}
        <OpenSourceSection />
        
        {/* Mobile Apps Section */}
        <MobileAppsSection />
        
        {/* CTA Section */}
        <CTASection onGetStarted={() => setShowOnboarding(true)} />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>
      
      {/* Auth Flow Modal */}
      {renderAuthFlow()}
    </div>
  );
}