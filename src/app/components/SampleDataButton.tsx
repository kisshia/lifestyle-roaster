import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

interface SampleDataButtonProps {
  onLoadSample: () => void;
}

export function SampleDataButton({ onLoadSample }: SampleDataButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onLoadSample}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg border-0"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Try Sample Data
      </Button>
    </motion.div>
  );
}

export function generateSampleData(): string {
  const sampleTransactions = [
    '2026-03-01,GRABFOOD MANILA PH,-450.50',
    '2026-03-02,SPOTIFY SUBSCRIPTION,-149.00',
    '2026-03-03,SM SUPERMARKET,-1250.00',
    '2026-03-04,STARBUCKS COFFEE,-185.00',
    '2026-03-05,GRAB TRANSPORT,-120.00',
    '2026-03-06,NETFLIX MONTHLY,-459.00',
    '2026-03-07,SHOPEE ONLINE SHOPPING,-890.00',
    '2026-03-08,FOODPANDA DELIVERY,-380.00',
    '2026-03-09,MERALCO BILL PAYMENT,-2500.00',
    '2026-03-10,STEAM GAMES PURCHASE,-599.00',
    '2026-03-11,GRAB TRANSPORT,-95.00',
    '2026-03-12,JOLLIBEE FASTFOOD,-215.00',
    '2026-03-13,LAZADA SHOPPING,-1450.00',
    '2026-03-14,STARBUCKS COFFEE,-175.00',
    '2026-03-15,GRABFOOD MANILA PH,-520.00',
    '2026-03-16,PLDT INTERNET BILL,-1699.00',
    '2026-03-17,7-ELEVEN STORE,-145.00',
    '2026-03-18,YOUTUBE PREMIUM,-159.00',
    '2026-03-19,GRAB TRANSPORT,-110.00',
    '2026-03-20,MCDONALDS DELIVERY,-345.00',
    '2026-03-21,UNIQLO CLOTHING,-1890.00',
    '2026-03-22,MILK TEA BUBBLE,-120.00',
    '2026-03-23,GRABFOOD MANILA PH,-405.00',
    '2026-03-24,ROBINSONS SUPERMARKET,-980.00',
    '2026-03-25,STEAM GAMES PURCHASE,-450.00',
    '2026-03-26,GRAB TRANSPORT,-130.00',
    '2026-03-27,STARBUCKS COFFEE,-190.00',
    '2026-03-28,SHOPEE ONLINE SHOPPING,-670.00',
    '2026-03-29,PIZZA HUT DELIVERY,-550.00',
    '2026-03-30,GRAB TRANSPORT,-85.00',
    '2026-03-31,FOODPANDA DELIVERY,-425.00',
    '2026-03-15,MOBILE LEGENDS DIAMONDS,-299.00',
    '2026-03-18,GENSHIN IMPACT GEMS,-699.00',
    '2026-03-22,VALORANT SKINS,-450.00',
    '2026-03-10,DUNKIN DONUTS,-150.00',
    '2026-03-12,COFFEE BEAN TEA LEAF,-220.00',
    '2026-03-25,MERCURY DRUG PHARMACY,-385.00',
    '2026-03-05,GLOBE POSTPAID BILL,-999.00',
    '2026-03-08,ANGKAS TRANSPORT,-75.00',
    '2026-03-14,MINISTOP STORE,-95.00',
    '2026-03-20,ZARA FASHION,-2150.00',
    '2026-03-23,H&M CLOTHING,-1340.00',
    '2026-03-27,CINEMA MOVIE TICKETS,-450.00',
    '2026-03-11,PUREGOLD GROCERIES,-1120.00',
    '2026-03-17,WATSONS PHARMACY,-280.00'
  ];

  return 'Date,Description,Amount\n' + sampleTransactions.join('\n');
}