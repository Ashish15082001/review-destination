import LottieAnimation from "./lottie-animation";

export interface WhyReviewDestinationCardProps {
  animationType: "customerReview" | "creativeTeam" | "deliveryLocation";
  title: string;
  description: string;
}

const WhyReviewDestinationCard = ({
  animationType,
  title,
  description,
}: WhyReviewDestinationCardProps) => {
  console.log(animationType);
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
      <div className="w-full h-60 rounded-xl flex items-center justify-center mb-10">
        <LottieAnimation animationType={animationType} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default WhyReviewDestinationCard;
