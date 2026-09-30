const SKILLS = ['javascript','typescript','react','node','express','mongodb','sql','python','java','html','css','redux','git','docker','aws','next','tailwind','rest','graphql','c++','figma','testing','jest','linux','django','flask','php','angular','vue'];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const parseResume = (text = '') => {
  const t = text.toLowerCase();
  return { skills: SKILLS.filter((s) => new RegExp(`(^|[^a-z])${esc(s)}([^a-z]|$)`).test(t)),
    email: text.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0], phone: text.match(/\+?\d[\d\s-]{8,13}\d/)?.[0] };
};
// % of the job's required skills the candidate has
export const matchScore = (candSkills = [], jobSkills = []) => {
  const c = new Set(candSkills.map((s) => s.toLowerCase())); const j = jobSkills.map((s) => s.toLowerCase());
  return j.length ? Math.round((j.filter((s) => c.has(s)).length / j.length) * 100) : 0;
};
