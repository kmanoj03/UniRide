import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Shield,
  Users,
  Wallet,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Car className="w-12 h-12 text-indigo-600" />
              <span className="text-2xl font-bold text-slate-900">UniRide</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Home
              </a>
              {/* <a
                href="#"
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Features
              </a> */}
              <a
                href="#"
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Contact
              </a>
              <button
                onClick={handleSignIn}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Testimonials
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Contact
                </a>
                <button
                  onClick={handleSignIn}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full"
                >
                  Sign In
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content (with padding-top to account for fixed header) */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80')] opacity-[0.02] bg-repeat"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80 backdrop-blur-3xl"></div>

          <div className="container mx-auto px-6 relative">
            <div className="max-w-3xl mx-auto">
              <span className="text-indigo-600 font-medium mb-6 block bg-indigo-50 px-4 py-1 rounded-full w-fit">
                Student Travel Platform
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Campus commute, <br />
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  simplified.
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl">
                Connect with fellow students for shared rides. Save money, make
                friends, and travel sustainably.
              </p>
              <button className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30">
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white/80 backdrop-blur-lg">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "Student-Exclusive",
                  description: "Verified college emails only",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Easy Matching",
                  description: "Find rides in your area",
                },
                {
                  icon: <Wallet className="w-6 h-6" />,
                  title: "Split Costs",
                  description: "Automated fare sharing",
                },
                {
                  icon: <Car className="w-6 h-6" />,
                  title: "Safe Travel",
                  description: "Verified student network",
                },
              ].map((feature, index) => (
                <div key={index} className="space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200 transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-indigo-50/50 to-white/50 backdrop-blur-lg">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-10 shadow-xl shadow-indigo-100">
                <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                  What Students Say
                </h2>
                <blockquote className="text-xl text-slate-600 italic mb-8 text-center">
                  "UniRide made my campus commute so much easier. I save money
                  and time while helping reduce carbon emissions."
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
                    alt="Sarah Chen"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100"
                  />
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Sarah Chen</p>
                    <p className="text-slate-600">Stanford University</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="py-24 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-lg">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Ready to Join?
              </h2>
              <p className="text-xl text-slate-600 mb-10">
                Start sharing rides with your campus community today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30">
                  Get Started
                </button>
                <button className="bg-white/80 backdrop-blur-sm text-slate-900 px-8 py-4 rounded-lg text-lg font-medium hover:bg-white transition-all shadow-lg shadow-slate-200/50 hover:shadow-slate-300/50">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Car className="w-6 h-6 text-indigo-400" />
                <span className="text-xl font-bold">UniRide</span>
              </div>
              <p className="text-slate-400">
                Making campus commute easier, safer, and more sustainable.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Safety
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-slate-400">
                  <MapPin className="w-5 h-5" />
                  <span>123 University Ave, CA 94301</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-400">
                  <Phone className="w-5 h-5" />
                  <span>(555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-400">
                  <Mail className="w-5 h-5" />
                  <span>support@uniride.com</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-slate-400 mb-4">
                Stay updated with our latest features and news.
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-indigo-500 text-white"
                />
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} UniRide. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
