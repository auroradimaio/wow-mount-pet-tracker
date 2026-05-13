// src/app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-6">
      <div className="container mx-auto px-4 text-center">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} WoW Tracker.
        </div>
      </div>
    </footer>
  );
}
