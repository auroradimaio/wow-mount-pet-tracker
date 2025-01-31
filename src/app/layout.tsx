import "./styles/globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Searchbar from "./components/Searchbar";
import CharacterInfo from "./components/CharacterInfo";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>WoW Mount and Pet Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <Searchbar />
        <CharacterInfo />
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
