import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  Target, 
  Zap, 
  Shield, 
  BarChart3, 
  Lightbulb,
  CheckCircle2,
  Flame,
  Upload,
  PieChart,
  AlertTriangle,
  Star,
  Users,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export function HomePage() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/3 -right-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              x: [-100, 100, -100],
              y: [-50, 50, -50],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border-2 border-purple-200">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-700">The #1 Financial Reality Check Tool</span>
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Where Did Your Money Go?
              <br />
              <span className="text-4xl md:text-5xl">We Will Tell You (Brutally)</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Upload your bank statement or e-wallet transactions and get{' '}
              <span className="text-pink-600">brutally honest</span> financial advice. We will tell you
              where your money <span className="text-purple-600">actually goes</span>{' '}
              <span className="text-orange-600">(spoiler: it is GrabFood) 🍔</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate('/analyzer')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl border-0 flex items-center gap-2"
                >
                  Start Your Financial Roast 🔥
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-2xl border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                  onClick={() => scrollToSection('how-it-works')}
                >
                  See How It Works
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-8 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm">100% Private & Secure</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm">10,000+ Users</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">4.9/5 Rating</span>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="pt-12"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <button
                onClick={() => scrollToSection('features')}
                className="text-purple-600 hover:text-purple-700 transition-colors"
              >
                <ChevronDown className="w-8 h-8 mx-auto" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              Why You Need This (You Really Do)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop wondering where your money went. We will show you exactly how you are spending and how to fix it.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Smart Categorization',
                description: 'Automatically categorizes your transactions into meaningful groups like Food Delivery, Subscriptions, Shopping, and more.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <AlertTriangle className="w-8 h-8" />,
                title: 'Money Leak Detection',
                description: 'Instantly spot where your money is draining. Identifies convenience tax, forgotten subscriptions, and impulse purchases.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: 'Actionable Recommendations',
                description: 'Get specific, realistic suggestions with potential savings calculations. Real fixes, not vague financial advice.',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="flex"
              >
                <div className="relative group flex-1">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity`} />
                  <Card className="relative h-full border-0 shadow-xl rounded-3xl bg-white p-8 hover:shadow-2xl transition-shadow">
                    <CardContent className="p-0 space-y-4">
                      <div className={`inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-2xl text-white shadow-lg`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              How It Works (It is Easy)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to financial clarity. No complex setup, no learning curve.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-12">
            {[
              {
                step: '01',
                icon: <Upload className="w-12 h-12" />,
                title: 'Upload Your Transactions',
                description: 'Export your transaction history from GCash, Maya, or your bank as a CSV or TXT file. Drag and drop it into our analyzer.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02',
                icon: <Sparkles className="w-12 h-12" />,
                title: 'AI Analyzes Your Spending',
                description: 'Our algorithm reads through your transactions, categorizes them intelligently, and identifies patterns in your spending behavior.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '03',
                icon: <Target className="w-12 h-12" />,
                title: 'Get Your Personalized Report',
                description: 'Receive a detailed breakdown with charts, leak detection, subscription analysis, and specific recommendations to save money.',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-3xl blur-xl opacity-20`} />
                  <Card className="relative border-0 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-8 md:p-12">
                      <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className={`flex-shrink-0 p-6 bg-gradient-to-r ${step.color} rounded-2xl text-white shadow-xl`}>
                          {step.icon}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-4">
                            <span className={`text-6xl bg-clip-text text-transparent bg-gradient-to-r ${step.color}`}>
                              {step.step}
                            </span>
                            <h3 className="text-3xl text-gray-900">{step.title}</h3>
                          </div>
                          <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => navigate('/analyzer')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-7 text-xl rounded-2xl shadow-2xl border-0"
              >
                Try It Now - It is Free! 🚀
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              Real People, Real Savings
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how others discovered where their money was going (and fixed it).
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Maria Santos',
                role: 'College Student',
                avatar: '👩‍🎓',
                quote: 'I had no idea I was spending ₱8,000/month on food delivery! Cut it down by 60% after seeing the breakdown. Saved enough for a new laptop!',
                savings: '₱4,800/mo'
              },
              {
                name: 'Juan Dela Cruz',
                role: 'Young Professional',
                avatar: '👨‍💼',
                quote: 'Found 5 subscriptions I completely forgot about. Canceled them immediately. This tool literally paid for itself in one day.',
                savings: '₱2,500/mo'
              },
              {
                name: 'Sarah Lim',
                role: 'Freelancer',
                avatar: '👩‍💻',
                quote: 'The roasting actually motivated me to fix my spending. Now I track everything. My savings account is finally growing!',
                savings: '₱6,200/mo'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="flex"
              >
                <div className="relative group flex-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-300 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                  <Card className="relative h-full border-0 shadow-xl rounded-3xl bg-white hover:shadow-2xl transition-shadow flex flex-col">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-5xl">{testimonial.avatar}</div>
                        <div>
                          <h4 className="text-xl">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed italic flex-1 mb-6">&quot;{testimonial.quote}&quot;</p>
                      <div className="pt-6 border-t border-gray-100 mt-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-green-700 font-medium">Saved {testimonial.savings}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48 opacity-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48 opacity-10" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl">
              Ready to Face Financial Reality?
            </h2>
            <p className="text-xl md:text-2xl text-purple-100">
              Upload your transactions and discover where your money is really going.
              <br />
              It takes 2 minutes. The insights last forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate('/analyzer')}
                  className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-7 text-xl rounded-2xl shadow-2xl"
                >
                  Get Your Financial Report 🔥
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </motion.div>
            </div>
            <p className="text-sm text-purple-100 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              100% free. No signup required. Processed locally on your machine.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
