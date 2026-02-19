"use client";

import Lottie from "lottie-react";
import customerReview from "@/assets/customer-review.json";
import creativeTeam from "@/assets/creative-team.json";
import deliveryLocation from "@/assets/delivery-location.json";
import firstPlaceBadge from "@/assets/first-place-badge.json";
import secondPlaceBadge from "@/assets/second-place-badge.json";
import thirdPlaceBadge from "@/assets/third-place-badge.json";

export interface LottieAnimationProps {
  animationType:
    | "customerReview"
    | "creativeTeam"
    | "deliveryLocation"
    | "firstPlaceBadge"
    | "secondPlaceBadge"
    | "thirdPlaceBadge";
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
        : animationType === "deliveryLocation"
          ? deliveryLocation
          : animationType === "firstPlaceBadge"
            ? firstPlaceBadge
            : animationType === "secondPlaceBadge"
              ? secondPlaceBadge
              : thirdPlaceBadge;

  return <Lottie animationData={animationData} loop={loop} />;
};

export default LottieAnimation;
