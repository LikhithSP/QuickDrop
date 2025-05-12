'use client';
 
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="container fade-in">
      <div className="card max-w-xl mx-auto">
        <div className="text-center py-10">
          <div className="mb-4 text-xl font-semibold text-card-text">Loading...</div>
          <div className="text-secondary">Preparing file upload area</div>
        </div>
      </div>
    </div>
  );
}
