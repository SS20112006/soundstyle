'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore, Gender, SizeSystem, UserMeasurements } from '@/stores/appStore';

const TOP_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const BOTTOM_SIZES_EU = ['36', '38', '40', '42', '44', '46', '48', '50', '52'];
const BOTTOM_SIZES_US_MALE = ['28', '30', '32', '34', '36', '38', '40'];
const BOTTOM_SIZES_US_FEMALE = ['0', '2', '4', '6', '8', '10', '12', '14', '16'];

// Shoe size conversion tables
const SHOE_SIZE_EU_TO_US_MALE: Record<number, number> = {
  39: 6.5, 40: 7, 41: 7.5, 42: 8, 43: 9, 44: 10, 45: 11, 46: 12, 47: 13, 48: 14
};
const SHOE_SIZE_EU_TO_US_FEMALE: Record<number, number> = {
  35: 5, 36: 5.5, 37: 6.5, 38: 7.5, 39: 8.5, 40: 9, 41: 9.5, 42: 10.5, 43: 11
};
const SHOE_SIZE_EU_TO_UK_MALE: Record<number, number> = {
  39: 5.5, 40: 6, 41: 7, 42: 7.5, 43: 8.5, 44: 9.5, 45: 10.5, 46: 11.5, 47: 12.5, 48: 13.5
};
const SHOE_SIZE_EU_TO_UK_FEMALE: Record<number, number> = {
  35: 2.5, 36: 3.5, 37: 4.5, 38: 5, 39: 6, 40: 6.5, 41: 7, 42: 8, 43: 9
};

export default function SetupPage() {
  const router = useRouter();
  const { measurements, setMeasurements, user } = useAppStore();
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<Gender | null>(null);
  const [topSize, setTopSize] = useState('M');
  const [bottomSize, setBottomSize] = useState('32');
  const [shoeSizeEU, setShoeSizeEU] = useState(42);
  const [sizeSystem, setSizeSystem] = useState<SizeSystem>('EU');

  // Redirect if already has measurements
  useEffect(() => {
    if (measurements) {
      router.push('/dashboard');
    }
  }, [measurements, router]);

  const getBottomSizes = () => {
    if (sizeSystem === 'EU') return BOTTOM_SIZES_EU;
    if (gender === 'female') return BOTTOM_SIZES_US_FEMALE;
    return BOTTOM_SIZES_US_MALE;
  };

  const getShoeSizes = () => {
    if (gender === 'male') {
      return Object.keys(SHOE_SIZE_EU_TO_US_MALE).map(Number).sort((a, b) => a - b);
    }
    return Object.keys(SHOE_SIZE_EU_TO_US_FEMALE).map(Number).sort((a, b) => a - b);
  };

  const convertShoeSize = (euSize: number): { us: number; uk: number } => {
    if (gender === 'male') {
      return {
        us: SHOE_SIZE_EU_TO_US_MALE[euSize] || euSize - 33,
        uk: SHOE_SIZE_EU_TO_UK_MALE[euSize] || euSize - 34
      };
    }
    return {
      us: SHOE_SIZE_EU_TO_US_FEMALE[euSize] || euSize - 31,
      uk: SHOE_SIZE_EU_TO_UK_FEMALE[euSize] || euSize - 33
    };
  };

  const handleSave = () => {
    if (!gender) return;

    const shoeSizes = convertShoeSize(shoeSizeEU);
    const measurementsData: UserMeasurements = {
      gender,
      tops: {
        size: topSize,
      },
      bottoms: {
        size: bottomSize,
      },
      shoes: {
        sizeEU: shoeSizeEU,
        sizeUS: shoeSizes.us,
        sizeUK: shoeSizes.uk,
      },
      sizeSystem,
    };

    setMeasurements(measurementsData);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c4a882] to-[#8b6f5c] flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">SoundStyle</span>
          </a>
          
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    s <= step ? 'bg-[#c4a882]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-white/50 ml-2">Step {step}/3</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Gender */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Qual é o teu género?</h1>
                <p className="text-white/50">Isto ajuda-nos a recomendar roupas adequadas</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'male', label: 'Homem', icon: '👔' },
                  { value: 'female', label: 'Mulher', icon: '👗' },
                  { value: 'other', label: 'Outro', icon: '✨' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGender(option.value as Gender)}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      gender === option.value
                        ? 'border-[#c4a882] bg-[#c4a882]/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    <span className="text-4xl block mb-3">{option.icon}</span>
                    <span className="text-lg font-medium">{option.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => gender && setStep(2)}
                  disabled={!gender}
                  className="px-8 py-3 bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] rounded-full font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Tops & Bottoms */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Os teus tamanhos</h1>
                <p className="text-white/50">Seleciona os tamanhos que usas normalmente</p>
              </div>

              {/* Size System Toggle */}
              <div className="flex items-center justify-center gap-2 p-1 bg-white/[0.06] rounded-xl w-fit mx-auto">
                {(['EU', 'US', 'UK'] as SizeSystem[]).map((sys) => (
                  <button
                    key={sys}
                    onClick={() => setSizeSystem(sys)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      sizeSystem === sys
                        ? 'bg-white/[0.12] text-white'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    {sys}
                  </button>
                ))}
              </div>

              {/* Tops */}
              <div className="space-y-3">
                <label className="text-sm text-white/50 block">👕 Tops (T-shirts, Sweaters, etc.)</label>
                <div className="flex flex-wrap gap-2">
                  {TOP_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setTopSize(size)}
                      className={`px-5 py-3 rounded-xl border-2 transition-all min-w-[60px] ${
                        topSize === size
                          ? 'border-[#c4a882] bg-[#c4a882]/10 text-white'
                          : 'border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottoms */}
              <div className="space-y-3">
                <label className="text-sm text-white/50 block">👖 Bottoms (Jeans, Calças, etc.)</label>
                <div className="flex flex-wrap gap-2">
                  {getBottomSizes().map((size) => (
                    <button
                      key={size}
                      onClick={() => setBottomSize(size)}
                      className={`px-5 py-3 rounded-xl border-2 transition-all min-w-[60px] ${
                        bottomSize === size
                          ? 'border-[#c4a882] bg-[#c4a882]/10 text-white'
                          : 'border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-full text-white/50 hover:text-white transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Shoes */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Número de sapatos</h1>
                <p className="text-white/50">Seleciona o teu número europeu</p>
              </div>

              {/* Size System Display */}
              <div className="flex items-center justify-center gap-4 text-sm text-white/50">
                <span>EU: {shoeSizeEU}</span>
                <span>US: {convertShoeSize(shoeSizeEU).us}</span>
                <span>UK: {convertShoeSize(shoeSizeEU).uk}</span>
              </div>

              {/* Shoe Size Grid */}
              <div className="flex flex-wrap gap-2 justify-center">
                {getShoeSizes().map((size) => (
                  <button
                    key={size}
                    onClick={() => setShoeSizeEU(size)}
                    className={`px-5 py-3 rounded-xl border-2 transition-all min-w-[60px] ${
                      shoeSizeEU === size
                        ? 'border-[#c4a882] bg-[#c4a882]/10 text-white'
                        : 'border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.06]">
                <h3 className="text-lg font-semibold mb-4">Resumo do teu perfil</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/50">Género:</span>
                    <span className="ml-2 font-medium">
                      {gender === 'male' ? 'Homem' : gender === 'female' ? 'Mulher' : 'Outro'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50">Tops:</span>
                    <span className="ml-2 font-medium">{topSize}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Bottoms:</span>
                    <span className="ml-2 font-medium">{bottomSize}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Sapatos:</span>
                    <span className="ml-2 font-medium">
                      EU {shoeSizeEU} / US {convertShoeSize(shoeSizeEU).us}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full text-white/50 hover:text-white transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Guardar e Continuar
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
