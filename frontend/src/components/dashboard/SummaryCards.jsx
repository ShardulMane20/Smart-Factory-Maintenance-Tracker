import { motion } from 'framer-motion';
import { Settings, AlertTriangle, Clock, AlertCircle } from 'lucide-react';

const SummaryCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Machines',
      value: stats?.total || 0,
      icon: Settings,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      bgGradient: 'from-blue-500/20 to-blue-500/5',
    },
    {
      title: 'Due Soon',
      value: stats?.dueSoon || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400',
      bgGradient: 'from-yellow-500/20 to-yellow-500/5',
    },
    {
      title: 'Overdue',
      value: stats?.overdue || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-400',
      bgGradient: 'from-red-500/20 to-red-500/5',
    },
    {
      title: 'At Risk',
      value: stats?.atRisk || 0,
      icon: AlertCircle,
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      bgGradient: 'from-orange-500/20 to-orange-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br ${card.bgGradient} border border-dark-700 rounded-lg p-6 relative overflow-hidden`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{card.title}</p>
              <h3 className="text-4xl font-bold text-white">{card.value}</h3>
            </div>
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="text-white" size={24} />
            </div>
          </div>
          
          {/* Decorative gradient */}
          <div className={`absolute -bottom-2 -right-2 w-24 h-24 ${card.color} opacity-10 rounded-full blur-2xl`}></div>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;