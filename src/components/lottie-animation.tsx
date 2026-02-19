"use client";

import Lottie from "lottie-react";
import customerReview from "@/assets/customer-review.json";
import creativeTeam from "@/assets/creative-team.json";
import deliveryLocation from "@/assets/delivery-location.json";

export interface LottieAnimationProps {
  animationType: "customerReview" | "creativeTeam" | "deliveryLocation";
  loop?: boolean;
}

const LottieAnimation = ({
  animationType,
  loop = true,
}: LottieAnimationProps) => {
  const animationData =
    animationType === "creativeTeam"
      ? creativeTeam
      : animationType === "customerReview"
        ? customerReview
        : deliveryLocation;

  return <Lottie animationData={animationData} loop={loop} />;
};

export default LottieAnimation;
