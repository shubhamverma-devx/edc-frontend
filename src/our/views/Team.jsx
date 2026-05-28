import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TeamCard from '../components/TeamCard';
import Footer from '../components/Footer';
import teamData from '../data/teamData';

// ============================================================
// TEAM PAGE — EDC JSSUN
// ============================================================
// Yeh page saare team members ko dikhata hai, department-wise grouped.
// Filter bar se user specific team filter kar sakta hai.
//
// Structure (top to bottom):
//   1. Hero section (heading + stats)
//   2. Filter chips bar
//   3. Faculty Coordinators section
//   4. Department-wise sections (Core, Technical, Outreach, etc.)
//   5. Footer
//
// Har department section me:
//   - Section header (number + title + count)
//   - "Team Heads" sub-section (2nd year members with Head/Co-Head roles)
//   - "Associate Members" sub-section (1st year members)
// ============================================================
const Team = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('All');

  // ──────────────────────────────────────────────────────
  // Agar URL me ?filter=Technical wagaira hai to woh apply karo
  // (existing functionality preserve ki hai)
  // ──────────────────────────────────────────────────────
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get('filter');
    if (filter) setActiveFilter(filter);
  }, [location.search]);

  const facultyCoordinators = [
    {
      name: 'Dr. Nishi Sharma',
      role: 'Faculty Coordinator',
      image: 'https://res.cloudinary.com/dh8cqlngr/image/upload/ar_4:5,c_fill,g_face/v1760033447/1747474363758_srqubg.jpg',
      instagram: '',
      linkedin: 'https://www.linkedin.com/in/dr-nishi-sharma-8aab36159/',
    },
    {
      name: 'Dr. Ashima Shrivastava',
      role: 'Faculty Coordinator',
      image: 'https://res.cloudinary.com/dh8cqlngr/image/upload/ar_4:5,c_fill,g_face/v1760033446/1655353630059_aovzf3.jpg',
      instagram: '',
      linkedin: 'https://www.linkedin.com/in/dr-ashima-srivastava-215295135/',
    },
  ];

  const departments = [
    { label: 'Core Team', value: 'Core Team' },
    { label: 'Technical Team', value: 'Technical Team' },
    { label: 'Outreach Team', value: 'Outreach Team' },
    { label: 'Design Team', value: 'Design Team' },
    { label: 'Content & Docs', value: 'Content and Documentation Team' },
    { label: 'Liaisoning Team', value: 'Liaisoning Team' },
    { label: 'Marketing Team', value: 'Marketing Team' },
    { label: 'Events & Training', value: 'Events and Training Team' },
    { label: 'Media & Networking', value: 'Media and Networking Team' },
  ];

  const filters = [
    { label: 'All', value: 'All' },
    { label: 'Faculty', value: 'Faculty Coordinators' },
    ...departments,
  ];

  const isLead = member => member.role.toLowerCase().includes('head');

  // ──────────────────────────────────────────────────────
  // Filter logic — active filter ke according members dikhao
  // useMemo se re-compute na ho har render pe
  // ──────────────────────────────────────────────────────
  const filteredTeam = useMemo(() => {
    if (activeFilter === 'All' || activeFilter === 'Faculty Coordinators') {
      return teamData;
    }
    return teamData.filter(
      (m) => m.department.trim().toLowerCase() === activeFilter.trim().toLowerCase()
    );
  }, [activeFilter]);

  // Faculty section sirf 'All' ya 'Faculty' pe show hota hai
  const showFaculty = activeFilter === 'All' || activeFilter === 'Faculty Coordinators';

  // ══════════════════════════════════════════════════════
  // DEPARTMENT SECTION COMPONENT
  // ══════════════════════════════════════════════════════
  // Reusable component for har department section
  // (header + heads sub-section + members sub-section)
  // ══════════════════════════════════════════════════════
  const DepartmentSection = ({ deptValue, deptLabel, sectionNumber }) => {
    // Sirf is department ke members nikalo
    const deptMembers = filteredTeam.filter((m) => m.department === deptValue);
    if (deptMembers.length === 0) return null;

    // Heads (year 2) aur members (year 1) alag karo
    const heads = deptMembers.filter((m) => m.year === 2);
    const members = deptMembers.filter((m) => m.year === 1);

    return (
      <section className="py-14 md:py-20 border-b border-white/10">
        {/* ─────── Section Header ─────── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14 px-4 md:px-6">
          <div className="flex-1">
            {/* Small section number (e.g. "SECTION 02") with cyan line */}
            <div className="flex items-center gap-2 text-[11px] text-white/45 font-mono font-semibold tracking-widest mb-3">
              <span className="inline-block w-6 h-px bg-[#05B1DE]" />
              SECTION {String(sectionNumber).padStart(2, '0')}
            </div>
            {/* Big department title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.05]">
              {deptLabel}
            </h2>
          </div>
          {/* Right side: member count card */}
          <div className="self-start md:self-auto bg-[#141414] border border-white/10 rounded-xl px-6 py-4 text-center relative overflow-hidden min-w-[110px]">
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-40"
              style={{ background: 'linear-gradient(90deg, transparent, #05B1DE, transparent)' }}
            />
            <div className="text-3xl font-extrabold text-[#05B1DE] leading-none">
              {String(deptMembers.length).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-white/45 uppercase tracking-widest font-semibold mt-2">
              Members
            </div>
          </div>
        </div>

        {/* ─────── HEADS SUB-SECTION (2nd year) ─────── */}
        {heads.length > 0 && (
          <div className="mb-12">
            {/* Sub-section label */}
            <div className="flex items-center gap-3 mb-6 px-4 md:px-6">
              <span className="text-xs sm:text-sm text-white/70 uppercase tracking-widest font-bold">
                Team Heads
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider font-mono bg-purple-500/15 text-purple-300 border border-purple-400/25">
                2ND YEAR
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            {/* Cards grid — HEADS me bigger cards
                FIXED columns: mobile=2, tablet=3, desktop=3
                Cards apne grid cell ko fully fill karte hain (no max-width)
                Future me aur heads add hone pe naturally arrange ho jayenge */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-7 px-3 sm:px-4 md:px-6">
              {heads.map((m, i) => (
                <TeamCard
                  key={`${deptValue}-head-${i}`}
                  name={m.name}
                  role={m.role}
                  image={m.image}
                  linkedin={m.linkedin}
                  github={m.github}
                  instagram={m.instagram}
                  quote={m.quote}
                  year={m.year}
                  branch={m.branch}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─────── MEMBERS SUB-SECTION (1st year) ─────── */}
        {members.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6 px-4 md:px-6">
              <span className="text-xs sm:text-sm text-white/70 uppercase tracking-widest font-bold">
                Associate Members
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider font-mono bg-green-500/15 text-green-300 border border-green-400/25">
                1ST YEAR
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            {/* Cards grid — MEMBERS
                FIXED columns: mobile=2, tablet=3, desktop=4
                Cards fully fill their grid cell (no max-width)
                Future me aur members add hone pe naturally arrange ho jayenge */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-7 px-3 sm:px-4 md:px-6">
              {members.map((m, i) => (
                <TeamCard
                  key={`${deptValue}-member-${i}`}
                  name={m.name}
                  role={m.role}
                  image={m.image}
                  linkedin={m.linkedin}
                  github={m.github}
                  instagram={m.instagram}
                  quote={m.quote}
                  year={m.year}
                  branch={m.branch}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    );
  };

  // ══════════════════════════════════════════════════════
  // FACULTY CARD COMPONENT
  // ══════════════════════════════════════════════════════
  // Yeh card different from regular TeamCard:
  //   - Horizontal layout (photo left, info right)
  //   - Purple gradient theme
  //   - No flip
  // ══════════════════════════════════════════════════════
  const FacultyCard = ({ name, role, image, linkedin }) => (
    <div className="relative overflow-hidden rounded-2xl border border-purple-400/20 p-6 sm:p-7 md:p-8 flex items-center gap-5 sm:gap-6 transition-all hover:border-purple-400/40 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, rgba(181,133,240,0.05) 0%, rgba(5,177,222,0.03) 100%)',
      }}
    >
      {/* Ambient purple glow in corner */}
      <div
        className="absolute -top-1/2 -right-1/4 w-72 h-72 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(181,133,240,0.08) 0%, transparent 60%)',
        }}
      />
      {/* Photo with purple ring + badge */}
      <div className="relative flex-shrink-0">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-purple-400/60 p-[3px] bg-black"
        />
        <div className="absolute -bottom-1 -right-1 bg-purple-400 text-black text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-full border-2 border-black">
          FACULTY
        </div>
      </div>
      {/* Info */}
      <div className="flex-1 relative z-10 min-w-0">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">{name}</h3>
        <div className="text-[11px] sm:text-xs text-purple-300 font-bold uppercase tracking-widest font-mono mt-1.5 mb-2.5">
          {role}
        </div>
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-white/65 hover:text-[#05B1DE] transition-colors"
          >
            View Profile →
          </a>
        )}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════════════════
  return (
    <div className="bg-white dark:bg-black min-h-screen pt-24 sm:pt-28 md:pt-32">

      {/* ════════ HERO SECTION ════════ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pt-12 sm:pb-16 text-center">
        {/* Ambient cyan glow behind hero */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] -z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(5,177,222,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Eyebrow tag */}
        <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#05B1DE]/10 border border-[#05B1DE]/20 text-[11px] sm:text-xs text-[#05B1DE] font-semibold uppercase tracking-widest mb-5 sm:mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[#05B1DE] shadow-[0_0_8px_#05B1DE]" />
          The People Behind EDC
        </div>

        {/* Main heading */}
        <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-5 sm:mb-7">
          Meet the team building
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #05B1DE 0%, #B585F0 100%)',
            }}
          >
            JSSUN's startup culture
          </span>
        </h1>

        {/* Sub-text */}
        <p className="relative z-10 text-base sm:text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed">
          Faculty mentors, executive members, and associates working together across nine specialized teams.
        </p>

        {/* Stats grid — 4 stats in a connected card */}
        <div className="relative z-10 mt-10 sm:mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-0 max-w-4xl mx-auto border border-white/10 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(180deg, rgba(20,20,20,0.4), rgba(10,10,10,0.6))' }}
        >
          {/* Each stat — border-r on non-last, border-b on top row for mobile 2-col */}
          <div className="text-center py-5 sm:py-6 md:py-7 px-2 sm:px-4 border-r border-b md:border-b-0 border-white/10">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">09</div>
            <div className="text-[10px] sm:text-[11px] text-white/45 uppercase tracking-widest font-semibold mt-2 sm:mt-3">Departments</div>
          </div>
          <div className="text-center py-5 sm:py-6 md:py-7 px-2 sm:px-4 md:border-r border-b md:border-b-0 border-white/10">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
              {teamData.length}<span className="text-[#05B1DE] font-semibold">+</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-white/45 uppercase tracking-widest font-semibold mt-2 sm:mt-3">Members</div>
          </div>
          <div className="text-center py-5 sm:py-6 md:py-7 px-2 sm:px-4 border-r border-white/10">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">02</div>
            <div className="text-[10px] sm:text-[11px] text-white/45 uppercase tracking-widest font-semibold mt-2 sm:mt-3">Faculty</div>
          </div>
          <div className="text-center py-5 sm:py-6 md:py-7 px-2 sm:px-4">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
              08<span className="text-[#05B1DE] font-semibold">+</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-white/45 uppercase tracking-widest font-semibold mt-2 sm:mt-3">Events</div>
          </div>
        </div>
      </section>

      {/* ════════ FILTER CHIPS BAR ════════ */}
      {/* Sticky — scroll karne pe top pe rahega.
          top value navbar ke height ke according hai */}
      <div className="sticky top-0 md:top-20 z-30 bg-black/85 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3.5 flex items-center gap-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* "Jump to" label */}
          <span className="text-[10px] text-white/45 font-bold uppercase tracking-widest whitespace-nowrap pr-3 border-r border-white/10 mr-1 hidden sm:inline-block">
            Jump to
          </span>
          {/* Filter chips */}
          {filters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                activeFilter === value
                  ? 'bg-[#05B1DE] border-[#05B1DE] text-black shadow-[0_0_20px_rgba(5,177,222,0.3)]'
                  : 'bg-transparent border-white/15 text-white/70 hover:border-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ════════ DEPARTMENTS CONTAINER ════════ */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">

        {/* Faculty Section (sirf All ya Faculty filter pe) */}
        {showFaculty && (
          <section className="py-14 md:py-20 border-b border-white/10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14 px-4 md:px-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[11px] text-white/45 font-mono font-semibold tracking-widest mb-3">
                  <span className="inline-block w-6 h-px bg-[#05B1DE]" />
                  SECTION 01
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.05]">
                  Faculty Coordinators
                </h2>
                <p className="text-sm sm:text-base text-white/65 mt-3 max-w-md leading-relaxed">
                  Mentorship and academic guidance from JSS University faculty.
                </p>
              </div>
              <div className="self-start md:self-auto bg-[#141414] border border-white/10 rounded-xl px-6 py-4 text-center relative overflow-hidden min-w-[110px]">
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-40"
                  style={{ background: 'linear-gradient(90deg, transparent, #05B1DE, transparent)' }}
                />
                <div className="text-3xl font-extrabold text-[#05B1DE] leading-none">02</div>
                <div className="text-[10px] text-white/45 uppercase tracking-widest font-semibold mt-2">Mentors</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-7 px-3 sm:px-4 md:px-6">
              {facultyCoordinators.map((f, i) => (
                <FacultyCard key={i} {...f} />
              ))}
            </div>
          </section>
        )}

        {/* Department sections — yeh dynamically render hote hain
            sectionNumber 2 se start (1 faculty hai) */}
        {activeFilter !== 'Faculty Coordinators' &&
          departments.map((d, i) => (
            <DepartmentSection
              key={d.value}
              deptValue={d.value}
              deptLabel={d.label === 'Content & Docs' ? 'Content & Documentation' : d.label}
              sectionNumber={i + 2}
            />
          ))}
      </div>

      <Footer />
    </div>
  );
};

export default Team;