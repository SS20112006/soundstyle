'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore, Gender, UserMeasurements, SizeSystem } from '@/stores/appStore';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOP_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const BOTTOM_SIZES_EU = ['36', '38', '40', '42', '44', '46', '48', '50'];
const BOTTOM_SIZES_US = ['28', '30', '32', '34', '36', '38', '40'];
const SHOE_SIZES_EU = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
const SHOE_SIZES_US_M = [6, 7, 8, 9, 10, 11, 12, 13];
const SHOE_SIZES_US_W = [5, 6, 7, 8, 9, 10, 11, 12];

// EU to US shoe size conversion
function euToUsM(eu: number): number { return Math.round(eu - 33); }
function euToUsW(eu: number): number { return Math.round(eu - 31); }
function euToUk(eu: number): number { return Math.round(eu - 33.5); }

export default function ProfileSetupModal({ isOpen, onClose }: ProfileSetupModalProps) {
  const { setMeasurements, measurements } = useAppStore();
  
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<Gender>(measurements?.gender || 'male');
  const [topSize, setTopSize] = useState(measurements?.tops.size || 'M');
  const [bottomSize, setBottomSize] = useState(measurements?.bottoms.size || '32');
  const [shoeSizeEU, setShoeSizeEU] = useState(measurements?.shoes.sizeEU || 42);
  const [sizeSystem, setSizeSystem] = useState<SizeSystem>(measurements?.sizeSystem || 'EU');

  const steps = [
    { title: 'Who are you shopping for?', subtitle: 'This helps us recommend the right clothing' },
    { title: 'Top size', subtitle: 'T-shirts, hoodies, jackets' },
    { title: 'Bottom size', subtitle: 'Jeans, trousers, shorts' },
    { title: 'Shoe size', subtitle: 'Sneakers, boots, shoes' },
  ];

  const handleSave = () => {
    const isFemale = gender === 'female';
    const sizeUS = isFemale ? euToUsW(shoeSizeEU) : euToUsM(shoeSizeEU);
    const sizeUK = euToUk(shoeSizeEU);

    const data: UserMeasurements = {
      gender,
      tops: { size: topSize },
      bottoms: { size: bottomSize },
      shoes: { sizeEU: shoeSizeEU, sizeUS, sizeUK },
      sizeSystem,
    };

    setMeasurements(data);
    onClose();
  };

  const handleSkip = () => {
    // Set gender only, skip sizes
    const data: UserMeasurements = {
      gender,
      tops: { size: 'M' },
      bottoms: { size: '32' },
      shoes: { sizeEU: 42, sizeUS: gender === 'female' ? euToUsW(42) : euToUsM(42), sizeUK: euToUk(42) },
      sizeSystem: 'EU',
    };
    setMeasurements(data);
    onClose();
  };

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else handleSave();
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-[#111] rounded-3xl border border-white/[0.08] overflow-hidden"
        >
          {/* Progress bar */}
          <div className="h-1 bg-white/[0.06]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#c4a882] to-[#8b6f5c]"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">{steps[step].title}</h2>
              <p className="text-white/40 text-sm mt-1">{steps[step].subtitle}</p>
            </div>

            {/* Step 0: Gender */}
            {step === 0 && (
              <div className="space-y-3">
                {([
                  { value: 'male' as Gender, label: 'Men', icon: '👔' },
                  { value: 'female' as Gender, label: 'Women', icon: '👗' },
                  { value: 'other' as Gender, label: 'Unisex / All', icon: '✨' },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGender(option.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                      gender === option.value
                        ? 'bg-[#c4a882]/10 border-[#c4a882]/40 text-white'
                        : 'bg-white/[0.03] border-white/[0.06] text-white/60 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-lg font-medium">{option.label}</span>
                    {gender === option.value && (
                      <svg className="w-5 h-5 ml-auto text-[#c4a882]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Step 1: Top Size */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {TOP_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setTopSize(size)}
                      className={`py-4 rounded-2xl text-lg font-semibold border transition-all duration-200 ${
                        topSize === size
                          ? 'bg-[#c4a882]/15 border-[#c4a882]/40 text-white'
                          : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-white/30 text-xs text-center">
                  Select your usual top size
                </p>
              </div>
            )}

            {/* Step 2: Bottom Size */}
            {step === 2 && (
              <div className="space-y-4">
                {/* Size system toggle */}
                <div className="flex items-center gap-2 mb-4">
                  {(['EU', 'US'] as SizeSystem[]).map((sys) => (
                    <button
                      key={sys}
                      onClick={() => setSizeSystem(sys)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        sizeSystem === sys
                          ? 'bg-[#c4a882]/20 text-[#c4a882]'
                          : 'bg-white/[0.06] text-white/40 hover:text-white/60'
                      }`}
                    >
                      {sys}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {(sizeSystem === 'EU' ? BOTTOM_SIZES_EU : BOTTOM_SIZES_US).map((size) => (
                    <button
                      key={size}
                      onClick={() => setBottomSize(size)}
                      className={`py-4 rounded-2xl text-lg font-semibold border transition-all duration-200 ${
                        bottomSize === size
                          ? 'bg-[#c4a882]/15 border-[#c4a882]/40 text-white'
                          : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-white/30 text-xs text-center">
                  {sizeSystem === 'EU' ? 'EU waist size' : 'US waist size'}
                </p>
              </div>
            )}

            {/* Step 3: Shoe Size */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  {(['EU', 'US'] as SizeSystem[]).map((sys) => (
                    <button
                      key={sys}
                      onClick={() => setSizeSystem(sys)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        sizeSystem === sys
                          ? 'bg-[#c4a882]/20 text-[#c4a882]'
                          : 'bg-white/[0.06] text-white/40 hover:text-white/60'
                      }`}
                    >
                      {sys}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                  {(sizeSystem === 'EU'
                    ? SHOE_SIZES_EU
                    : gender === 'female'
                    ? SHOE_SIZES_US_W
                    : SHOE_SIZES_US_M
                  ).map((size) => (
                    <button
                      key={size}
                      onClick={() => setShoeSizeEU(
                        sizeSystem === 'EU'
                          ? size
                          : gender === 'female'
                          ? size + 31
                          : size + 33
                      )}
                      className={`py-4 rounded-2xl text-lg font-semibold border transition-all duration-200 ${
                        (sizeSystem === 'EU' ? shoeSizeEU : gender === 'female' ? shoeSizeEU - 31 : shoeSizeEU - 33) === size
                          ? 'bg-[#c4a882]/15 border-[#c4a882]/40 text-white'
                          : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-white/30 text-xs text-center">
                  {sizeSystem === 'EU' ? 'EU shoe size' : 'US shoe size'}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-8">
              {step > 0 ? (
                <button
                  onClick={prevStep}
                  className="px-5 py-3 rounded-xl bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.1] transition-all font-medium"
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={handleSkip}
                  className="px-5 py-3 rounded-xl bg-white/[0.06] text-white/40 hover:text-white/60 transition-all text-sm"
                >
                  Skip for now
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={nextStep}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#c4a882]/15"
              >
                {step === steps.length - 1 ? 'Save Profile' : 'Continue'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
