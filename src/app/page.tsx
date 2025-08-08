import SymptomChecker from '@/app/components/symptomchecker';

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl text-gray-600 font-bold mb-6">Welcome to healthONIT</h1>
      <SymptomChecker />
    </main>
  );
}
