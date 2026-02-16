export default async function CommentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("[id]/comments", id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Comments for Review {id}
      </h1>
      <p className="text-gray-700">
        This is where the comments for the review will be displayed.
      </p>
    </div>
  );
}
