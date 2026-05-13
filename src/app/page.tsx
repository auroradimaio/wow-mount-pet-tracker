"use client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Database,
  PawPrint,
  Search,
  Shield,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-8">
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#c79c6e]/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl mb-6">
            <span className="bg-gradient-to-r from-[#c79c6e] via-amber-300 to-[#c79c6e] bg-clip-text text-transparent animate-gradient">
              WoW Collection
            </span>
            <br />
            <span className="text-wow-gold">Tracker</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            Track mounts and pets for any World of Warcraft character. No login
            required, real-time data.
          </p>
        </div>
        <div className="justify-center absolute bottom-10 flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white/50 cursor-pointer"
            onClick={() =>
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <ChevronDown />
          </motion.div>
          <span className="text-white/50 animate-glow">Scroll to explore</span>
        </div>
      </section>
      <motion.div
        id="features"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <section className="relative min-h-[40vh] grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-12">
          <Link href="/character">
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-wow-gold/20 hover:border-wow-gold/50 hover:shadow-glow-gold transition-all duration-300 cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
                className="inline-flex p-4 bg-gradient-to-br from-wow-gold/20 to-wow-gold/5 rounded-full border border-wow-gold/30 mb-6"
              >
                <Search className="w-10 h-10 text-wow-gold" />
              </motion.div>

              <h3 className="text-2xl text-wow-gold mb-4 group-hover:text-wow-gold-light transition-colors">
                Character Lookup
              </h3>

              <p className="text-gray-300 leading-relaxed mb-6">
                Search any character by name and realm to see how many mounts
                and pets they have collected.
              </p>

              <div className="flex items-center text-wow-gold/70 group-hover:text-wow-gold transition-colors">
                <span className="text-sm font-semibold">Explore</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </motion.div>
          </Link>

          <Link href={"/mounts"}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-wow-gold/20 hover:border-wow-gold/50 hover:shadow-glow-gold transition-all duration-300 cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
                className="inline-flex p-4 bg-gradient-to-br from-wow-gold/20 to-wow-gold/5 rounded-full border border-wow-gold/30 mb-6"
              >
                <Trophy className="w-10 h-10 text-wow-gold" />
              </motion.div>
              <h3 className="text-2xl  text-wow-gold mb-4 group-hover:text-wow-gold-light transition-colors">
                Mounts Lookup
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Lookup any mount by name to see how to collect it.
              </p>
              <div className="flex items-center text-wow-gold/70 group-hover:text-wow-gold transition-colors">
                <span className="text-sm font-semibold">Explore</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </motion.div>
          </Link>

          <Link href={"/pets"}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-wow-gold/20 hover:border-wow-gold/50 hover:shadow-glow-gold transition-all duration-300 cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
                className="inline-flex p-4 bg-gradient-to-br from-wow-gold/20 to-wow-gold/5 rounded-full border border-wow-gold/30 mb-6"
              >
                <PawPrint className="w-10 h-10 text-wow-gold" />
              </motion.div>
              <h3 className="text-2xl  text-wow-gold mb-4 group-hover:text-wow-gold-light transition-colors">
                Pets Lookup
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Lookup any pet by name to see how to collect it.
              </p>
              <div className="flex items-center text-wow-gold/70 group-hover:text-wow-gold transition-colors">
                <span className="text-sm font-semibold">Explore</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </motion.div>
          </Link>
        </section>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="inline-flex p-4 bg-wow-gold/10 rounded-full mb-6"
            >
              <Zap className="w-12 h-12 text-wow-gold" />
            </motion.div>

            <h2 className="text-4xl  text-wow-gold mb-6">How Does It Work?</h2>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-wow-gold/20">
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                This website uses Blizzard's official World of Warcraft API to
                fetch live character data.{" "}
                <span className="text-wow-gold font-semibold">
                  No login required
                </span>{" "}
                and{" "}
                <span className="text-wow-gold font-semibold">
                  no data is stored
                </span>
                .
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-3">
                  <Shield className="w-8 h-8 text-green-400" />
                  <span className="text-gray-300 font-semibold">
                    Privacy First
                  </span>
                  <span className="text-gray-400 text-sm">
                    No data collection
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <span className="text-gray-300 font-semibold">
                    Real-Time Data
                  </span>
                  <span className="text-gray-400 text-sm">
                    Always up to date
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Database className="w-8 h-8 text-blue-400" />
                  <span className="text-gray-300 font-semibold">
                    Official API
                  </span>
                  <span className="text-gray-400 text-sm">
                    Powered by Blizzard
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
