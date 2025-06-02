import PreEnrollmentForm from "@/components/pre-enrolment-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Gladstone Pre-Enrollment Helper
          </h1>
          <p className="text-gray-600">
            Complete this form to begin the enrollment process for your child
          </p>
        </div>
        <PreEnrollmentForm />
      </div>
    </main>
  );
}
