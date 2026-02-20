import { getReviewData } from "@/lib/mongodb";

export const generateMetadata = async ({
  params,
}: PageProps<"/review/[id]">) => {
  const { id } = await params;
  const reviewData = await getReviewData(id);

  if (!reviewData) {
    return {
      title: "Review Not Found",
      description: `No review found for destination with ID ${id}. Please check the ID and try again.`,
    };
  }

  return {
    title: `Review ${reviewData.destinationName}`,
    description: `Read the detailed review for destination with ID ${id}. Discover insights, tips, and experiences shared by our travelers.`,
  };
};

export default function ReviewLayout({
  children,
  modal,
}: LayoutProps<"/review/[id]">) {
  console.log("[id]/layout.tsx");

  return (
    <div className="review-layout">
      {children}
      {modal}
    </div>
  );
}
