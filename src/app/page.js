import Link from "next/link";
import { 
  CheckCircle2, 
  Smartphone, 
  Database, 
  BarChart3, 
  MessageSquare, 
  Wallet, 
  Users, 
  HeartHandshake,
  ChevronRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/umutulo_small_logo_120.png" alt="Umutulo Logo" className="w-10 h-10 rounded-full" />
          <span className="text-2xl font-black text-[#001F3F] tracking-tight">Umutulo</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a href="#features" className="hover:text-[#001F3F] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#001F3F] transition-colors">How it Works</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-bold text-[#001F3F] hover:opacity-70 transition-opacity">
            Member Login
          </Link>
          <Link href="/register-member" className="px-5 py-2.5 text-sm font-bold bg-[#001F3F] text-white rounded-full hover:shadow-xl hover:shadow-[#001F3F]/20 transition-all active:scale-95">
            Join Now
          </Link>
        </div>
      </nav>

      <main className="pt-24 whitespace-normal">
        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent -z-10" />
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#B8860B] text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
              Empowering Faith communities
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-[#001F3F] leading-[1.1] mb-8 tracking-tight">
              Umutulo — Church Contribution <span className="text-[#B8860B]">Management System</span>
            </h1>
            
            <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              Umutulo is a comprehensive SaaS solution for modern churches. Track tithe, offerings, pledges, and partnerships in one simple platform with absolute security and ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-[#001F3F] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-[#001F3F]/30 transition-all active:scale-95 group">
                Register Church Account
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/register-member" className="w-full sm:w-auto px-8 py-4 bg-[#FFD700] text-[#001F3F] rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-[#FFD700]/30 transition-all active:scale-95">
                Join as Member
              </Link>
            </div>
            
            <div className="mt-10">
              <Link href="/login" className="text-slate-500 font-bold hover:text-[#001F3F] transition-colors text-sm underline decoration-[#FFD700]/40 underline-offset-8">
                Already have an account? Log in here
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-24 bg-[#001F3F]/[0.02]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[#001F3F] mb-4">Centralize Your Ministry Financials</h2>
              <p className="text-slate-500 font-medium">Everything you need to manage your church’s financial health.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Wallet className="w-7 h-7" />}
                title="Tithe Tracking"
                description="Securely record and monitor monthly tithes for every member with automated history logs."
              />
              <FeatureCard 
                icon={<HeartHandshake className="w-7 h-7" />}
                title="Offering Tracking"
                description="Manage general offerings and special collections effortlessly in real-time."
              />
              <FeatureCard 
                icon={<BarChart3 className="w-7 h-7" />}
                title="Partnership & Pledges"
                description="Track long-term pledges and partnership commitments with visual progress reports."
              />
              <FeatureCard 
                icon={<Users className="w-7 h-7" />}
                title="Member History"
                description="Allow members to securely log in and view their personal giving history at any time."
              />
              <FeatureCard 
                icon={<Database className="w-7 h-7" />}
                title="Dashboard & Reports"
                description="Powerful analytics for admins to see monthly trends and financial summaries instantly."
              />
              <FeatureCard 
                icon={<MessageSquare className="w-7 h-7" />}
                title="SMS Reminders"
                description="Keep your community engaged with automated thank-you messages and monthly reminders."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-6 py-24 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <h2 className="text-3xl md:text-5xl font-black text-[#001F3F] mb-6">Simple 3-Step Integration</h2>
                
                <div className="space-y-12">
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-[#001F3F] text-[#FFD700] rounded-2xl flex items-center justify-center font-black shrink-0 shadow-lg shadow-[#001F3F]/20">1</div>
                    <div>
                      <h4 className="text-xl font-bold text-[#001F3F] mb-2">Create a Church Account</h4>
                      <p className="text-slate-500 leading-relaxed">Register your church in minutes and get a unique Church ID to securely segregate your data.</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-[#FFD700] text-[#001F3F] rounded-2xl flex items-center justify-center font-black shrink-0 shadow-lg shadow-[#FFD700]/20">2</div>
                    <div>
                      <h4 className="text-xl font-bold text-[#001F3F] mb-2">Add Members</h4>
                      <p className="text-slate-500 leading-relaxed">Import your database or add members manually. Optionally provide them with login access for transparency.</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-[#001F3F] text-[#FFD700] rounded-2xl flex items-center justify-center font-black shrink-0 shadow-lg shadow-[#001F3F]/20">3</div>
                    <div>
                      <h4 className="text-xl font-bold text-[#001F3F] mb-2">Record & Monitor</h4>
                      <p className="text-slate-500 leading-relaxed">Start recording contributions. View instant dashboards and send automated SMS reminders to your congregation.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="w-full aspect-square bg-[#001F3F] rounded-[3rem] p-12 flex flex-col justify-center gap-8 relative overflow-hidden shadow-2xl">
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#FFD700]/10 rounded-full blur-3xl" />
                  <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                  
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-fade-in">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center text-[#001F3F]">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1 h-3 bg-white/20 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-3/4 h-3 bg-white/10 rounded-full" />
                      <div className="w-1/2 h-3 bg-white/10 rounded-full" />
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 ml-12 animate-fade-in-delayed">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center text-white">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div className="flex-1 h-3 bg-white/20 rounded-full" />
                    </div>
                    <div className="w-full h-8 bg-white text-[#001F3F] font-black text-center pt-1 rounded-xl shadow-lg">
                      +K12,500.00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing CTA Section */}
        <section className="px-6 py-24 mb-16">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#001F3F] to-[#003366] rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8">
              <div className="w-32 h-32 bg-[#FFD700]/10 rounded-full blur-2xl" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Ready to Transform Your Church?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Churches can subscribe monthly or yearly to use Umutulo. Empower your ministry with the best financial tracking tools available.
            </p>
            
            <Link href="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-[#FFD700] text-[#001F3F] rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-[#FFD700]/30 transition-all hover:scale-105 active:scale-95 group">
              Get Started for Free
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <img src="/umutulo_small_logo_120.png" alt="Umutulo Logo" className="w-8 h-8 rounded-full" />
              <span className="text-2xl font-bold tracking-tight">Umutulo</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              The premier church contribution management platform designed for Zambian churches and faith organizations.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-[#FFD700] uppercase tracking-widest text-xs mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Member Dashboard</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Admin Portal</Link></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#FFD700] uppercase tracking-widest text-xs mb-6">Contact</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400 font-mono">
              <li>support@umutulo.co.zm</li>
              <li>+260 971 000 000</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 flex flex-col md:row items-center justify-between gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
          <div>&copy; {new Date().getFullYear()} Umutulo App. Build with Faith.</div>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group hover:-translate-y-1">
      <div className="w-14 h-14 bg-slate-50 text-[#001F3F] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#FFD700] group-hover:text-[#001F3F] transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-black text-[#001F3F] mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
    </div>
  );
}
