export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
}

export interface SubscriptionDrain {
  name: string;
  monthlyAmount: number;
  description: string;
}

export interface AnalysisResult {
  totalSpent: number;
  categories: CategoryData[];
  subscriptions: SubscriptionDrain[];
  lifestyleDiagnosis: string;
  recommendations: string[];
  biggestLeak: string;
  categorizedTransactions: Transaction[];
}

// Category keywords mapping
const categoryKeywords = {
  'Food Delivery': [
    'grabfood', 'foodpanda', 'grab food', 'food panda', 'mcdonalds', 'mcd', 
    'jollibee', 'kfc', 'pizza', 'burgerking', 'mang inasal', 'delivery',
    'chowking', 'greenwich', 'shakeys', 'yellow cab', 'shopeefood', 'shopee food',
    'vincent', 'angel\'s burger', 'popeyes', 'bonchon'
  ],
  'Transportation': [
    'grab', 'angkas', 'uber', 'taxi', 'transport', 'mrt', 'lrt', 'ride',
    'beep', 'jeep', 'bus', 'parking', 'joyride', 'maxim', 'lalamove',
    'petron', 'shell', 'caltex', 'seaoil', 'fuel', 'gasoline', 'toll',
    'autosweep', 'easytrip', 'p2p', 'trike', 'tricycle'
  ],
  'Subscriptions': [
    'netflix', 'spotify', 'disney', 'youtube premium', 'apple music',
    'subscription', 'prime', 'hbo', 'recurring', 'monthly fee', 'icloud',
    'google storage', 'google one', 'microsoft', 'canva', 'adobe', 'zoom',
    'patreon', 'onlyfans', 'medium', 'crunchyroll', 'grammarly'
  ],
  'Entertainment': [
    'steam', 'game', 'gaming', 'cinema', 'movie', 'concert', 'fun',
    'playstation', 'xbox', 'nintendo', 'genshin', 'mobile legends', 'mlbb',
    'valorant', 'codm', 'entertainment', 'codashop', 'razer', 'seagm',
    'unipin', 'garena', 'riot', 'epic games', 'roblox', 'top up'
  ],
  'Shopping': [
    'lazada', 'shopee', 'zalora', 'amazon', 'shopping', 'online shop',
    'mall', 'sm store', 'uniqlo', 'h&m', 'zara', 'fashion', 'clothes',
    'tiktok shop', 'tiktokshop', 'shein', 'watsons', 'miniso', 'ikea',
    'decathlon', 'nike', 'adidas', 'best buy', 'ebay', 'aliexpress',
    'payment to', 'pmt to', 'purchase', 'shopping', 'store', 'online payment'
  ],
  'Bills & Utilities': [
    'meralco', 'pldt', 'globe', 'smart', 'converge', 'water', 'electric',
    'utility', 'bill payment', 'internet', 'wifi', 'postpaid', 'maynilad',
    'insurance', 'manulife', 'sunlife', 'axa', 'pru life', 'allianz',
    'pag-ibig', 'sss', 'philhealth', 'bir', 'tax', 'visa'
  ],
  'Groceries': [
    'grocery', 'supermarket', 'puregold', 'sm supermarket', 'robinsons',
    'market', 'sari-sari', 'convenience store', '7-eleven', 'ministop',
    'alfamart', 'family mart', 'landers', 's&r', 'snr', 'waltermart',
    'shopwise', 'rustans', 'savemore', 'hi-top', 'metro'
  ],
  'Coffee & Snacks': [
    'starbucks', 'coffee', 'cafe', 'milk tea', 'bubble tea', 'cbtl',
    'dunkin', 'mister donut', 'snack', 'bakery', 'j.co', 'jco',
    'krispy kreme', 'chatime', 'coco', 'gong cha', 'tiger sugar',
    'tim hortons', 'seattle\'s best', 'coffee bean'
  ],
  'Healthcare': [
    'pharmacy', 'mercury drug', 'watsons', 'hospital', 'clinic', 'medical',
    'doctor', 'dental', 'health', 'laboratory', 'diagnostic', 'medicare',
    'generika', 'tpg', 'st. lukes', 'makati med', 'asian hospital'
  ],
  'Top-ups & Transfers': [
    'gcash', 'maya', 'paymaya', 'cash-in', 'cash in', 'transfer', 'bank transfer',
    'send money', 'receive money', 'cash out', 'instapay', 'pesonet', 'wire',
    'remittance', 'palawan', 'western union', 'cebuana', 'qr pay', 'digital wallet',
    'express send', 'pay to', 'g-cash', 'mywallet', 'load', 'cashin'
  ],
  'Education & Work': [
    'tuition', 'school', 'university', 'college', 'course', 'udemy', 'coursera',
    'linkedin', 'seminar', 'training', 'books', 'stationery', 'office',
    'workspace', 'coworking', 'premium', 'notion', 'slack', 'trello'
  ]
};

export function categorizeTransaction(description: string): string {
  // Ultra-clean description for matching
  const cleanDesc = description.toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (!cleanDesc) return 'Others';

  // 1. Pattern-based detection (Highest Priority)
  if (cleanDesc.includes('transfer to') || cleanDesc.includes('send money') || cleanDesc.includes('cash in') || cleanDesc.includes('cash out')) {
    return 'Top-ups & Transfers';
  }
  if (cleanDesc.includes('bill pmt') || cleanDesc.includes('payment to')) {
    // If it's a payment, try to find a sub-category first, otherwise it's Shopping/Utilities
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (cat !== 'Top-ups & Transfers' && keywords.some(k => cleanDesc.includes(k.toLowerCase()))) {
        return cat;
      }
    }
    return 'Shopping';
  }

  // 2. Score-based fuzzy matching
  const scores: Record<string, number> = {};
  const words = cleanDesc.split(' ');

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    scores[category] = 0;
    keywords.forEach(keyword => {
      const k = keyword.toLowerCase();
      // Phrase match (Weighted high)
      if (cleanDesc.includes(k)) {
        scores[category] += 15;
      }
      // Word match (Weighted moderate)
      if (words.some(w => w === k)) {
        scores[category] += 5;
      }
    });
  }

  // Pick the best score
  let bestCategory = 'Others';
  let maxScore = 5; // Minimum threshold
  
  for (const [cat, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat;
    }
  }
  
  return bestCategory;
}

export function analyzeTransactions(transactions: Transaction[]): AnalysisResult {
  // Categorize all transactions
  const categorizedTransactions = transactions.map(t => ({
    ...t,
    category: categorizeTransaction(t.description)
  }));

  // Calculate total spent
  const totalSpent = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Group by category
  const categoryMap = new Map<string, { amount: number; count: number }>();
  
  categorizedTransactions.forEach(t => {
    const existing = categoryMap.get(t.category!) || { amount: 0, count: 0 };
    categoryMap.set(t.category!, {
      amount: existing.amount + Math.abs(t.amount),
      count: existing.count + 1
    });
  });

  // Colors for categories
  const categoryColors: Record<string, string> = {
    'Food Delivery': '#ef4444',
    'Transportation': '#f59e0b',
    'Subscriptions': '#8b5cf6',
    'Entertainment': '#ec4899',
    'Shopping': '#06b6d4',
    'Bills & Utilities': '#10b981',
    'Groceries': '#84cc16',
    'Coffee & Snacks': '#f97316',
    'Healthcare': '#3b82f6',
    'Top-ups & Transfers': '#f43f5e',
    'Education & Work': '#0ea5e9',
    'Others': '#6b7280'
  };

  // Convert to array and calculate percentages
  const categories: CategoryData[] = Array.from(categoryMap.entries())
    .map(([name, data], index) => ({
      id: `${name.toLowerCase().replace(/\s+/g, '-')}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      amount: data.amount,
      percentage: (data.amount / totalSpent) * 100,
      count: data.count,
      color: categoryColors[name] || '#6b7280'
    }))
    .sort((a, b) => b.amount - a.amount);

  // Identify subscription drains
  const subscriptions = identifySubscriptions(categorizedTransactions);

  // Generate lifestyle diagnosis
  const lifestyleDiagnosis = generateDiagnosis(categories, totalSpent);

  // Generate recommendations
  const recommendations = generateRecommendations(categories, subscriptions, totalSpent);

  // Identify biggest leak
  const biggestLeak = identifyBiggestLeak(categories);

  return {
    totalSpent,
    categories,
    subscriptions,
    lifestyleDiagnosis,
    recommendations,
    biggestLeak,
    categorizedTransactions
  };
}

function identifySubscriptions(transactions: Transaction[]): SubscriptionDrain[] {
  const subscriptionTransactions = transactions.filter(t => 
    t.category === 'Subscriptions' || t.category === 'Entertainment'
  );

  // Group similar transactions (recurring)
  const subscriptionMap = new Map<string, number>();
  
  subscriptionTransactions.forEach(t => {
    const key = t.description.toLowerCase().replace(/[0-9]/g, '').trim();
    subscriptionMap.set(key, (subscriptionMap.get(key) || 0) + Math.abs(t.amount));
  });

  return Array.from(subscriptionMap.entries())
    .map(([name, amount]) => ({
      name: name.substring(0, 50),
      monthlyAmount: amount,
      description: 'Recurring subscription'
    }))
    .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
    .slice(0, 5);
}

function generateDiagnosis(categories: CategoryData[], totalSpent: number): string {
  const topCategory = categories[0];
  
  if (!topCategory) {
    return "Your spending pattern is too mysterious to analyze. Either you're a financial ninja or forgot to spend money!";
  }

  const convenienceCategories = ['Food Delivery', 'Transportation', 'Coffee & Snacks'];
  const convenienceSpending = categories
    .filter(c => convenienceCategories.includes(c.name))
    .reduce((sum, c) => sum + c.percentage, 0);

  if (convenienceSpending > 40) {
    return `🚨 You are suffering from the "Convenience Tax." ${convenienceSpending.toFixed(0)}% of your spending is linked to food delivery, ride-sharing, and coffee runs. You're basically funding the gig economy single-handedly!`;
  }

  if (topCategory.name === 'Entertainment' && topCategory.percentage > 25) {
    return `🎮 Living your best "YOLO" life! ${topCategory.percentage.toFixed(0)}% of your money went to entertainment. Remember, you can't respawn in real life when your bank account hits zero.`;
  }

  if (topCategory.name === 'Shopping' && topCategory.percentage > 30) {
    return `🛍️ Certified Shopaholic Alert! ${topCategory.percentage.toFixed(0)}% on shopping. At this rate, Lazada/Shopee should name a warehouse after you.`;
  }

  if (topCategory.name === 'Subscriptions' && topCategory.percentage > 20) {
    return `💸 Subscription Overload! ${topCategory.percentage.toFixed(0)}% of your money is on auto-pilot to subscription services. Your wallet is basically a monthly donation center.`;
  }

  return `Your biggest spending category is ${topCategory.name} at ${topCategory.percentage.toFixed(0)}%. Not bad, but let's see if we can optimize this!`;
}

function generateRecommendations(
  categories: CategoryData[], 
  subscriptions: SubscriptionDrain[], 
  totalSpent: number
): string[] {
  const recommendations: string[] = [];

  // Food delivery recommendation
  const foodDelivery = categories.find(c => c.name === 'Food Delivery');
  if (foodDelivery && foodDelivery.percentage > 20) {
    const savings = foodDelivery.amount * 0.5;
    recommendations.push(
      `Cut GrabFood/FoodPanda by 50%. Cook 3 meals a week instead. Potential savings: ₱${savings.toFixed(0)}/month. That's a whole month of groceries!`
    );
  }

  // Subscription recommendation
  if (subscriptions.length > 2) {
    const totalSubCost = subscriptions.reduce((sum, s) => sum + s.monthlyAmount, 0);
    recommendations.push(
      `You have ${subscriptions.length} subscriptions draining ₱${totalSubCost.toFixed(0)}/month. Cancel the ones you haven't used in 2 weeks. Be honest with yourself!`
    );
  }

  // Coffee & snacks recommendation
  const coffee = categories.find(c => c.name === 'Coffee & Snacks');
  if (coffee && coffee.percentage > 10) {
    const savings = coffee.amount * 0.7;
    recommendations.push(
      `Your coffee addiction is real. ₱${coffee.amount.toFixed(0)} on coffee & snacks? Buy a coffee maker. Savings: ₱${savings.toFixed(0)}/month.`
    );
  }

  // Transportation recommendation
  const transport = categories.find(c => c.name === 'Transportation');
  if (transport && transport.percentage > 15) {
    recommendations.push(
      `₱${transport.amount.toFixed(0)} on rides? Mix in some commute days. Yes, it's inconvenient. No, your budget doesn't care about your comfort.`
    );
  }

  // Shopping recommendation
  const shopping = categories.find(c => c.name === 'Shopping');
  if (shopping && shopping.percentage > 20) {
    const savings = shopping.amount * 0.6;
    recommendations.push(
      `Implement the 48-hour rule: Wait 2 days before buying non-essentials. Potential savings: ₱${savings.toFixed(0)}/month.`
    );
  }

  // General impulse spending recommendation
  const impulseCategories = ['Food Delivery', 'Shopping', 'Coffee & Snacks', 'Entertainment'];
  const impulseTotal = categories
    .filter(c => impulseCategories.includes(c.name))
    .reduce((sum, c) => sum + c.amount, 0);
  
  if (impulseTotal > totalSpent * 0.4) {
    const potentialSavings = impulseTotal * 0.3;
    recommendations.push(
      `If you redirect just 30% of your impulse spending to savings, you'll have an extra ₱${potentialSavings.toFixed(0)} by month's end.`
    );
  }

  // Top-ups & Transfers recommendation
  const topUps = categories.find(c => c.name === 'Top-ups & Transfers');
  if (topUps && topUps.percentage > 25) {
    recommendations.push(
      `A large chunk (${topUps.percentage.toFixed(0)}%) of your money is just 'Transfers' or 'Top-ups'. This usually hides 'Others' spending. Track where that money goes AFTER the transfer!`
    );
  }

  // Flexible fallback recommendations for any other high category
  categories.forEach(cat => {
    const specificCategories = ['Food Delivery', 'Subscriptions', 'Coffee & Snacks', 'Transportation', 'Shopping', 'Top-ups & Transfers'];
    if (!specificCategories.includes(cat.name) && cat.percentage > 15 && cat.name !== 'Others') {
      recommendations.push(
        `You're spending ₱${cat.amount.toFixed(0)} on ${cat.name}. This is ${cat.percentage.toFixed(0)}% of your total. Is this a planned expense or a leak?`
      );
    }
  });

  if (recommendations.length === 0) {
    recommendations.push("You're doing relatively well! Keep tracking your spending and look for small optimizations.");
  }

  return recommendations;
}

function identifyBiggestLeak(categories: CategoryData[]): string {
  const topCategory = categories[0];
  
  if (!topCategory) {
    return "No significant spending leaks detected.";
  }

  return `The system flagged "${topCategory.name}" as your biggest leak. You spent ₱${topCategory.amount.toFixed(0)} (${topCategory.percentage.toFixed(0)}% of total) across ${topCategory.count} transactions.`;
}