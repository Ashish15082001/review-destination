import LottieAnimation from "../lottie-animation/lottie-animation";

export interface FeatureCardProps {
  animationType: "customerReview" | "creativeTeam" | "deliveryLocation";
  title: string;
  description: string;
}

const bgMap: Record<FeatureCardProps["animationType"], string> = {
  customerReview: "bg-blue-50",
  deliveryLocation: "bg-purple-50",
  creativeTeam: "bg-emerald-50",
};

const FeatureCard = ({
  animationType,
  title,
  description,
}: FeatureCardProps) => {
  return (
    <div className="backdrop-blur-xl bg-white/80 border border-white/30 rounded-3xl p-8 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
      <div
        className={`mb-6 rounded-2xl ${bgMap[animationType]} aspect-[4/3] flex items-center justify-center overflow-hidden`}
      >
        <LottieAnimation animationType={animationType} />
      </div>
      <h3 className="text-2xl font-bold text-neutral-800 mb-4">{title}</h3>
      <p className="text-neutral-500 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
