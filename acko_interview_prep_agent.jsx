import { useState, useRef, useEffect } from "react";

const CRITERIA = {
  PD2: {
    experience: "2–4 years",
    hardFilters: ["Less than 2 years of product design experience","Portfolio absent or inaccessible — LinkedIn URL is not a portfolio"],
    whatGoodLooksLike: ["Craft quality and range — polished UI plus flows, edge cases, states, error handling. Not just hero screens.","Product ownership — worked on real product problems, shows understanding of the why behind decisions.","Research and iteration habit — has done user research or usability testing, shows evidence of learning and iterating.","Consumer vs B2B background — consumer product experience is a positive soft signal. B2B is not penalised but informs team fit.","Growth or conversion design experience — onboarding flows, A/B testing, funnel optimisation, activation or retention mechanics.","India market familiarity — has designed for Indian users, understands vernacular, trust signals, payment flows.","Growth trajectory — work has clearly improved over time; not stagnant.","AI proof-of-work — shipped output using Claude Code, Cursor, Lovable etc. is meaningfully different from listing AI tools.","ACKO product surface overlap — motor insurance, health insurance, KYC/verification, payment flows, vehicle configurators, insurance onboarding."],
    redFlags: ["Only hero screens — no flows, edge cases, or states shown","No process or rationale visible in portfolio","Missing case study from a listed employer","No growth or funnel thinking visible anywhere","Pure agency background with no product ownership","Multiple short tenures under 6 months without explanation","Unexplained timeline gaps of 6+ months","Pure graphic/brand designer without product thinking","Significantly overqualified — 6+ years of experience, SPD-level ownership signals, or senior titles (Lead, Head of Design) applying for a PD2 role. Flag this upfront — it raises questions about motivation, expectations, and whether the candidate will stay once they find a more senior opportunity."],
    screeningCall: { duration: "30 minutes", purpose: "Check for major red flags only. Not a portfolio review or design evaluation.", structure: ["Intro (3 min)","Career and motivation (10 min)","One work probe (12 min)","Candidate questions (5 min)"], keyQuestions: ["Tell me about what you're working on right now and why you're looking to move.","What kind of work are you looking to do next that you're not doing today?","[Project] — what was the actual problem you were solving, and how did you know that was the right problem?","What changed as a result of shipping it?","What was the hardest call you had to make on that project?","What would you do differently if you started it today?"], hardStops: ["Can't speak to their own work without slides","Evasive or contradictory about their actual role","Timeline gap flagged in resume that doesn't hold up"], doNotFlag: ["Nervousness or stilted communication","Domain gaps — not knowing insurance","Short or direct answers","Imperfect answers — checking red flags not design thinking depth"], postCall: "Three lines: (1) Red flags found / None, (2) One thing that stood out, (3) Move forward / Hold / Pass" },
    portfolioRound: { duration: "60 minutes", interviewer: "Product Designer 2", purpose: "Primary craft and thinking evaluation. Thinking quality first, craft second, self-awareness third.", evaluating: ["Thinking quality","Craft quality","Self-awareness"], structure: ["Setup (3 min)","Portfolio walk with deliberate interruption (20–25 min)","Deep dive on ONE project (20–25 min)","Craft check (5 min)","Candidate questions (7 min)"], flowBreaking: ["Interrupt mid-screen before they explain it — ask about a specific element on screen","Jump them to a different part — skip to outcome, go back to first version","Ask about what is not on screen — error states, rejected versions, edge cases","Go off-deck — close the portfolio, explain the project without showing anything"], deepDive: ["What was the problem, and how did you figure out it was the right problem to solve?","How did you know users were dropping off there? What data or research told you that?","What was the hardest decision you made, and what made it hard?","What did you try that didn't work? What did you learn?","What happened after you shipped it? Did the metrics move the way you expected?","What parts were entirely yours, and where did you rely on others?","If you were doing this again today, what would you do differently?"], mustHave: ["Can reconstruct the project from memory without slides","Can name a specific design decision and explain the reasoning","Understands what metric or outcome the work was trying to move","Acknowledges what they didn't know and what they learned"], redFlags: ["Evasive when you go off-script from their prepared narrative","Can't explain why a specific visual or interaction decision was made","Claims full ownership that on probing turns out to be heavily directed by others","All projects described as successful with no nuance"], postCall: "Craft (above/at/below bar) · Thinking (strong/adequate/weak) · Ownership (clear/partial/unclear) · Biggest strength · Biggest concern · Recommendation" },
    whiteboarding: { duration: "60 minutes", format: "Collaborative — interviewer and candidate work through the problem together, not candidate solo.", purpose: "Evaluate how the candidate thinks in real time and collaborates under ambiguity. The output (sketch, flow) matters less than the quality of reasoning getting there.", evaluating: ["Problem framing — do they ask clarifying questions before picking up the pen?","Systems thinking — do they think in flows and states, not just individual screens?","Collaboration — do they build on input or defend a fixed direction?","Adaptability — how do they respond to mid-exercise constraints?","For PD2: structured thinking, clear framing, handles basic constraints. For SPD1: strategic framing, navigates ambiguity, surfaces trade-offs and downstream consequences."], problems: [
      "1. The waiting problem\nContext: Waiting is one of the most universally frustrating human experiences — but most products treat it as an afterthought. Brief to share with candidate: 'We're going to design the experience of waiting. Pick a context together — it could be waiting for a food delivery, a doctor's appointment, a customer support response, or anything else that comes to mind. The goal isn't to eliminate the wait — it's to make the waiting feel less like waiting.' What to look for: Do they start by understanding the emotional state of the user, not just the interface? Do they ask who the user is and how long the wait typically is? Do they think about different failure states (wait longer than expected, no updates, wrong updates)?",
      "2. The empty room\nContext: Every new product starts empty — no followers, no content, no history. Most products handle this badly. Brief to share with candidate: 'A brand new social or community app has just launched. A user signs up for the first time and sees nothing — no content, no connections, no activity. Design the first-time experience so they don't feel like they've arrived somewhere abandoned, and actually come back.' What to look for: Do they ask what kind of community it is and who the target user is? Do they think about the emotional arc of the experience, not just the onboarding screens? Do they consider how to balance showing value with asking for setup effort?",
      "3. The overwhelmed inbox\nContext: Notification overload is a real pattern — people avoid apps because opening them feels like work. Brief to share with candidate: 'Someone opens a productivity or communication app they haven't used in a while. There are 200 unread items. Design how they navigate it without feeling defeated before they even start.' What to look for: Do they think about the user's mental model and what they're actually trying to accomplish? Do they consider triage, prioritisation, and progressive disclosure rather than just better visual design? Do they think about what happens if the user ignores everything and what the system should do?",
      "4. The trust gap\nContext: Trust is the hardest thing to design — it can't be declared, only demonstrated. Brief to share with candidate: 'A user has heard mixed things about a service — maybe from a friend, maybe online. They're curious but sceptical. Design how you build enough trust for them to complete their first transaction, without lying to them or overloading them with social proof badges.' What to look for: Do they distinguish between different types of trust (safety, reliability, fairness)? Do they think about what specifically makes this category of product feel risky? Do they consider what happens after the transaction — how trust is maintained, not just established?",
      "5. The worst moment\nContext: Error states are where most products fail their users. Designing for failure is harder than designing for success. Brief to share with candidate: 'Design how an app handles its single worst failure — pick one together: payment failed, data was lost, the service is down, or an order was cancelled at the last moment. The user is already frustrated. What does the experience do?' What to look for: Do they think about the emotional state of the user first, before thinking about UI? Do they consider what the app can and can't do in that moment (what information it has, what actions are available)? Do they think about recovery paths — not just the error message, but what happens next?",
      "6. The handoff\nContext: Many real-world tasks involve more than one person — but most apps are designed for individual users. Brief to share with candidate: 'Two people need to complete something together — pick a scenario: a joint booking, a shared purchase, a document that needs approval from both parties. Design the experience of handing it off between them, including what happens when they're not in the same place at the same time.' What to look for: Do they map out the full sequence of states the task can be in? Do they think about what each person needs to know and when? Do they consider failure states — what if the second person doesn't respond, or disagrees?"
    ], constraints: ["You have 10 minutes left — what do you cut and what do you protect, and why?","The primary user is on a 2G connection — what changes?","The PM just told you this needs to ship in 2 weeks with no engineering changes — what's the smallest version that still solves the core problem?","The user is 60+ years old and not comfortable with technology — how does that change your approach?"], fallback: "If none of the suggested problems feel right or generate energy in the room, ask the candidate: 'What's an app you've been using a lot lately? Is there something about it you'd fix or improve — a flow, a feature, a moment that frustrates you?' Then run the exercise on their answer. This surfaces genuine design opinion and makes the candidate more comfortable.", postCall: "Problem framing quality (strong/adequate/weak) · Systems thinking (present/absent) · Adaptability to constraints (handled well/struggled) · Collaboration quality (builds on input/defends fixed direction) · Biggest signal · Recommendation" },
  },
  SPD: {
    experience: "5–8 years",
    hardFilters: ["Less than 5 years of product design experience","Portfolio absent or inaccessible — LinkedIn URL is not a portfolio","No evidence of design direction ownership — only execution of defined briefs with no problem definition, strategic framing, or influencing others"],
    whatGoodLooksLike: ["Problem definition ownership — shapes what the team works on not just how. Evidence of identifying the right problem, reframing a brief, or pushing back on the wrong direction.","Craft with conviction — high-quality design with a clear point of view. Can defend specific choices as right not just polished.","Research leadership — has led research programmes, synthesised findings into strategy, presented evidence-based direction to stakeholders.","Cross-functional influence — has brought PMs, engineers, or business stakeholders to a direction they didn't initially agree with. Evidence of real disagreement navigated.","Strategic awareness — connects design decisions to business outcomes beyond their immediate product surface.","Growth or conversion design experience — directly relevant for Growth team; positive signal for all others.","India market depth — has designed for Indian users, understands local nuances.","Team influence — mentored junior designers, established processes, raised team quality.","AI proof-of-work — shipped output using AI tools is meaningfully different from listing tools.","ACKO product surface overlap — motor insurance, health insurance, KYC/verification, payment flows, vehicle configurators, renewal journeys."],
    redFlags: ["Senior title PD2 depth — all work is execution-oriented with no problem definition or upstream influence","No pushback signal anywhere — all work described as smooth and aligned. At SPD level this is a meaningful flag.","Exclusively execution-oriented language — designed, built, delivered with no identified, reframed, changed direction because","No influence on others across 5+ years — no mentoring, process-building, or design culture contribution","Multiple short tenures at senior level without explanation","Unexplained timeline gaps of 6+ months","Significantly overqualified — 10+ years of experience, Design Lead or Head of Design titles, or clear people-management history applying for an IC SPD role. Flag this upfront — it raises questions about motivation and whether the candidate is stepping back by choice or circumstance."],
    screeningCall: { duration: "30 minutes", purpose: "Check for red flags AND confirm genuine SPD depth not PD2 depth with a senior title.", structure: ["Intro (3 min)","Career and motivation (10 min)","SPD depth check work probe (12 min)","Candidate questions (5 min)"], keyQuestions: ["Where do you think you have had the most influence — not just on the work, but on the direction of the product or team?","[Project] — who decided that was the right problem to work on, and what was your role in that decision?","Was there a moment where you disagreed with the direction? What happened?","What would have happened to this project if you hadn't been on it?","Did you change what the team was going to build, or did you execute what was already defined?","What's a decision you made that the PM or engineering lead initially pushed back on?"], hardStops: ["Seniority inflation clear — senior title on PD2-depth work, no evidence of problem ownership","Can't identify a single moment of disagreement or pushback across their career","Consistently attributes direction to the team or the PM when probed","Timeline gap that doesn't hold up under explanation"], doNotFlag: ["Nervousness or considered pace","Domain gaps — not knowing insurance","Modest company names","Collaborative framing — flag only when it obscures all individual contribution"], postCall: "Three lines: (1) SPD depth confirmed / Seniority inflation suspected / Unclear, (2) One thing that stood out, (3) Move forward / Hold / Pass" },
    portfolioRound: { duration: "60 minutes", interviewer: "Principal or Staff Designer", purpose: "Does this candidate shape design direction or execute it well? Craft alone is not sufficient for STRONG SHORTLIST at SPD.", evaluating: ["Problem ownership — did they define what to solve or just how","Influence and judgment — did they shape decisions around them","Craft with conviction — do they have a point of view they can defend"], structure: ["Setup (3 min)","Portfolio walk with deliberate interruption (20 min)","Deep dive on ONE project going upstream of execution (25 min)","Point-of-view check (7 min)","Candidate questions (5 min)"], flowBreaking: ["Interrupt mid-screen before they explain it","Jump them to a different part non-linearly","Ask about what is not on screen — error states, rejected versions, edge cases","Go off-deck — close the portfolio, explain the project without showing anything"], deepDive: ["Tell me how this started. Not the design — the problem. Who identified it and what was your role in defining it?","Was there a version of this brief that you pushed back on or reframed? What was it originally?","What would have been built if you hadn't been on this project?","Who did you have to bring along to make this happen and how did you do it?","Was there a moment where the team disagreed with your design direction? What happened?","What was the business trying to achieve in this period and how did this project connect to that?","In hindsight was this the right problem to solve? Would you have made a different call?","What did you learn from this that changed how you approach problems now?"], pointOfView: ["Show me something in your portfolio you would still do exactly the same way today and tell me why.","Is there anything in your portfolio you would replace if you were rebuilding it today?","What does work you find genuinely impressive look like — not your own, someone else's?"], mustHave: ["Can speak to who defined the problem and what their role in that definition was","Can name a specific moment of disagreement, pushback, or course correction","Connects the work to a business or user outcome beyond the immediate product surface","Has a transferable learning from the project — something that changed how they approach design"], redFlags: ["Every answer positions them as executing a well-defined brief — no upstream ownership","No moment of disagreement across the entire career","Strategic awareness absent — knows what they built but not why the business needed it","Can't articulate what makes their work good beyond it tested well or it shipped"], postCall: "Problem ownership (genuine/partial/execution-only) · Cross-functional influence (demonstrated/claimed/absent) · Craft conviction (has POV/competent no POV/below bar) · Seniority inflation (confirmed SPD/suspected PD2/clear inflation) · Biggest strength · Recommendation" },
    whiteboarding: { duration: "60 minutes", format: "Collaborative — interviewer and candidate work through the problem together, not candidate solo.", purpose: "Evaluate how the candidate thinks in real time and collaborates under ambiguity. The output matters less than the quality of reasoning getting there.", evaluating: ["Problem framing — do they ask clarifying questions before picking up the pen?","Systems thinking — do they think in flows and states, not just individual screens?","Collaboration — do they build on input or defend a fixed direction?","Adaptability — how do they respond to mid-exercise constraints?","Strategic framing — do they surface trade-offs and downstream consequences without prompting? (SPD1 bar)"], problems: [
      "1. The waiting problem\nContext: Waiting is one of the most universally frustrating human experiences — but most products treat it as an afterthought. Brief to share with candidate: 'We're going to design the experience of waiting. Pick a context together — it could be waiting for a food delivery, a doctor's appointment, a customer support response, or anything else that comes to mind. The goal isn't to eliminate the wait — it's to make the waiting feel less like waiting.' What to look for: Do they start by understanding the emotional state of the user, not just the interface? Do they ask who the user is and how long the wait typically is? Do they think about different failure states (wait longer than expected, no updates, wrong updates)?",
      "2. The empty room\nContext: Every new product starts empty — no followers, no content, no history. Most products handle this badly. Brief to share with candidate: 'A brand new social or community app has just launched. A user signs up for the first time and sees nothing — no content, no connections, no activity. Design the first-time experience so they don't feel like they've arrived somewhere abandoned, and actually come back.' What to look for: Do they ask what kind of community it is and who the target user is? Do they think about the emotional arc of the experience, not just the onboarding screens? Do they consider how to balance showing value with asking for setup effort?",
      "3. The overwhelmed inbox\nContext: Notification overload is a real pattern — people avoid apps because opening them feels like work. Brief to share with candidate: 'Someone opens a productivity or communication app they haven't used in a while. There are 200 unread items. Design how they navigate it without feeling defeated before they even start.' What to look for: Do they think about the user's mental model and what they're actually trying to accomplish? Do they consider triage, prioritisation, and progressive disclosure rather than just better visual design? Do they think about what happens if the user ignores everything and what the system should do?",
      "4. The trust gap\nContext: Trust is the hardest thing to design — it can't be declared, only demonstrated. Brief to share with candidate: 'A user has heard mixed things about a service — maybe from a friend, maybe online. They're curious but sceptical. Design how you build enough trust for them to complete their first transaction, without lying to them or overloading them with social proof badges.' What to look for: Do they distinguish between different types of trust (safety, reliability, fairness)? Do they think about what specifically makes this category of product feel risky? Do they consider what happens after the transaction — how trust is maintained, not just established?",
      "5. The worst moment\nContext: Error states are where most products fail their users. Designing for failure is harder than designing for success. Brief to share with candidate: 'Design how an app handles its single worst failure — pick one together: payment failed, data was lost, the service is down, or an order was cancelled at the last moment. The user is already frustrated. What does the experience do?' What to look for: Do they think about the emotional state of the user first, before thinking about UI? Do they consider what the app can and can't do in that moment? Do they think about recovery paths — not just the error message, but what happens next?",
      "6. The handoff\nContext: Many real-world tasks involve more than one person — but most apps are designed for individual users. Brief to share with candidate: 'Two people need to complete something together — pick a scenario: a joint booking, a shared purchase, a document that needs approval from both parties. Design the experience of handing it off between them, including what happens when they're not in the same place at the same time.' What to look for: Do they map out the full sequence of states the task can be in? Do they think about what each person needs to know and when? Do they consider failure states — what if the second person doesn't respond, or disagrees?"
    ], constraints: ["You have 10 minutes left — what do you cut and what do you protect, and why?","The primary user is on a 2G connection — what changes?","The PM just told you this needs to ship in 2 weeks with no engineering changes — what's the smallest version that still solves the core problem?","The user is 60+ years old and not comfortable with technology — how does that change your approach?"], fallback: "If none of the suggested problems feel right or generate energy in the room, ask the candidate: 'What's an app you've been using a lot lately? Is there something about it you'd fix or improve — a flow, a feature, a moment that frustrates you?' Then run the exercise on their answer. This surfaces genuine design opinion and makes the candidate more comfortable.", postCall: "Problem framing quality (strong/adequate/weak) · Systems thinking (present/absent) · Adaptability to constraints (handled well/struggled) · Collaboration quality (builds on input/defends fixed direction) · Biggest signal · Recommendation" },
    experience: "5–8 years",
    hardFilters: ["Less than 5 years of product design experience","Portfolio absent or inaccessible — LinkedIn URL is not a portfolio","No evidence of design direction ownership — only execution of defined briefs with no problem definition, strategic framing, or influencing others"],
    whatGoodLooksLike: ["Problem definition ownership — shapes what the team works on not just how. Evidence of identifying the right problem, reframing a brief, or pushing back on the wrong direction.","Craft with conviction — high-quality design with a clear point of view. Can defend specific choices as right not just polished.","Research leadership — has led research programmes, synthesised findings into strategy, presented evidence-based direction to stakeholders.","Cross-functional influence — has brought PMs, engineers, or business stakeholders to a direction they didn't initially agree with. Evidence of real disagreement navigated.","Strategic awareness — connects design decisions to business outcomes beyond their immediate product surface.","Growth or conversion design experience — directly relevant for Growth team; positive signal for all others.","India market depth — has designed for Indian users, understands local nuances.","Team influence — mentored junior designers, established processes, raised team quality.","AI proof-of-work — shipped output using AI tools is meaningfully different from listing tools.","ACKO product surface overlap — motor insurance, health insurance, KYC/verification, payment flows, vehicle configurators, renewal journeys."],
    redFlags: ["Senior title PD2 depth — all work is execution-oriented with no problem definition or upstream influence","No pushback signal anywhere — all work described as smooth and aligned. At SPD level this is a meaningful flag.","Exclusively execution-oriented language — designed, built, delivered with no identified, reframed, changed direction because","No influence on others across 5+ years — no mentoring, process-building, or design culture contribution","Multiple short tenures at senior level without explanation","Unexplained timeline gaps of 6+ months","Significantly overqualified — 10+ years of experience, Design Lead or Head of Design titles, or clear people-management history applying for an IC SPD role. Flag this upfront — it raises questions about motivation and whether the candidate is stepping back by choice or circumstance."],
    screeningCall: { duration: "30 minutes", purpose: "Check for red flags AND confirm genuine SPD depth not PD2 depth with a senior title.", structure: ["Intro (3 min)","Career and motivation (10 min)","SPD depth check work probe (12 min)","Candidate questions (5 min)"], keyQuestions: ["Where do you think you have had the most influence — not just on the work, but on the direction of the product or team?","[Project] — who decided that was the right problem to work on, and what was your role in that decision?","Was there a moment where you disagreed with the direction? What happened?","What would have happened to this project if you hadn't been on it?","Did you change what the team was going to build, or did you execute what was already defined?","What's a decision you made that the PM or engineering lead initially pushed back on?"], hardStops: ["Seniority inflation clear — senior title on PD2-depth work, no evidence of problem ownership","Can't identify a single moment of disagreement or pushback across their career","Consistently attributes direction to the team or the PM when probed","Timeline gap that doesn't hold up under explanation"], doNotFlag: ["Nervousness or considered pace","Domain gaps — not knowing insurance","Modest company names","Collaborative framing — flag only when it obscures all individual contribution"], postCall: "Three lines: (1) SPD depth confirmed / Seniority inflation suspected / Unclear, (2) One thing that stood out, (3) Move forward / Hold / Pass" },
    portfolioRound: { duration: "60 minutes", interviewer: "Principal or Staff Designer", purpose: "Does this candidate shape design direction or execute it well? Craft alone is not sufficient for STRONG SHORTLIST at SPD.", evaluating: ["Problem ownership — did they define what to solve or just how","Influence and judgment — did they shape decisions around them","Craft with conviction — do they have a point of view they can defend"], structure: ["Setup (3 min)","Portfolio walk with deliberate interruption (20 min)","Deep dive on ONE project going upstream of execution (25 min)","Point-of-view check (7 min)","Candidate questions (5 min)"], flowBreaking: ["Interrupt mid-screen before they explain it","Jump them to a different part non-linearly","Ask about what is not on screen — error states, rejected versions, edge cases","Go off-deck — close the portfolio, explain the project without showing anything"], deepDive: ["Tell me how this started. Not the design — the problem. Who identified it and what was your role in defining it?","Was there a version of this brief that you pushed back on or reframed? What was it originally?","What would have been built if you hadn't been on this project?","Who did you have to bring along to make this happen and how did you do it?","Was there a moment where the team disagreed with your design direction? What happened?","What was the business trying to achieve in this period and how did this project connect to that?","In hindsight was this the right problem to solve? Would you have made a different call?","What did you learn from this that changed how you approach problems now?"], pointOfView: ["Show me something in your portfolio you would still do exactly the same way today and tell me why.","Is there anything in your portfolio you would replace if you were rebuilding it today?","What does work you find genuinely impressive look like — not your own, someone else's?"], mustHave: ["Can speak to who defined the problem and what their role in that definition was","Can name a specific moment of disagreement, pushback, or course correction","Connects the work to a business or user outcome beyond the immediate product surface","Has a transferable learning from the project — something that changed how they approach design"], redFlags: ["Every answer positions them as executing a well-defined brief — no upstream ownership","No moment of disagreement across the entire career","Strategic awareness absent — knows what they built but not why the business needed it","Can't articulate what makes their work good beyond it tested well or it shipped"], postCall: "Problem ownership (genuine/partial/execution-only) · Cross-functional influence (demonstrated/claimed/absent) · Craft conviction (has POV/competent no POV/below bar) · Seniority inflation (confirmed SPD/suspected PD2/clear inflation) · Biggest strength · Recommendation" },
  },
};

const TEAMS = { "Auto": "Motor insurance, vehicle products, claims and verification flows. High-consideration purchase journeys.", "Health & Life": "Health/life/term insurance, behaviour-change design, renewal journeys. Long consideration cycles.", "Growth": "Acquisition, activation, conversion, retention, A/B testing, funnel optimisation. High-velocity experimentation.", "Enterprise": "B2B, partnerships, operational tooling, multi-stakeholder role-based products.", "Labs": "0-to-1 experimental products. Travel insurance, clinic, new verticals. Comfortable with ambiguity." };

const buildSystem = (role, resumeText, screeningEval) => {
  const c = CRITERIA[role];
  return `You are an expert interview preparation assistant for ACKO's design hiring team. You help interviewers prepare for every round of the ${role} hiring process for a specific candidate.

ROLE BEING HIRED: ${role} (${c.experience} experience)

CANDIDATE RESUME:
${resumeText || "No resume provided."}

${screeningEval ? `CANDIDATE SCREENING EVALUATION (from previous assessment):
${screeningEval}` : ""}

HARD FILTERS FOR ${role}:
${c.hardFilters.map(f => "- " + f).join("\n")}

WHAT GOOD LOOKS LIKE:
${c.whatGoodLooksLike.map(s => "- " + s).join("\n")}

RED FLAGS TO WATCH FOR:
${c.redFlags.map(r => "- " + r).join("\n")}

TEAM FIT OPTIONS:
${Object.entries(TEAMS).map(([t, d]) => "- " + t + ": " + d).join("\n")}

SCREENING CALL (${c.screeningCall.duration}):
Purpose: ${c.screeningCall.purpose}
Structure: ${c.screeningCall.structure.join(" > ")}
Key questions: ${c.screeningCall.keyQuestions.join(" | ")}
Hard stops: ${c.screeningCall.hardStops.join(", ")}
Do not flag: ${c.screeningCall.doNotFlag.join(", ")}
Post-call format: ${c.screeningCall.postCall}

PORTFOLIO ROUND (${c.portfolioRound.duration}, run by ${c.portfolioRound.interviewer}):
Purpose: ${c.portfolioRound.purpose}
Evaluating: ${c.portfolioRound.evaluating.join(", ")}
Flow-breaking techniques — never let them present uninterrupted: ${c.portfolioRound.flowBreaking.join(" | ")}
Deep dive questions: ${c.portfolioRound.deepDive.join(" | ")}
Must haves: ${c.portfolioRound.mustHave.join(", ")}
Red flags: ${c.portfolioRound.redFlags.join(", ")}
${role === "SPD" ? "Point-of-view check: " + c.portfolioRound.pointOfView.join(" | ") : ""}
Post-call format: ${c.portfolioRound.postCall}

WHITEBOARDING ROUND (${c.whiteboarding.duration}):
Format: ${c.whiteboarding.format}
Purpose: ${c.whiteboarding.purpose}
Evaluating: ${c.whiteboarding.evaluating.join(" | ")}
Problems to suggest: ${c.whiteboarding.problems.join(" | ")}
Mid-exercise constraints to introduce at 20–30 min mark: ${c.whiteboarding.constraints.join(" | ")}
Universal fallback: ${c.whiteboarding.fallback}
Post-call format: ${c.whiteboarding.postCall}

HOW TO BEHAVE:
- Your FIRST message should be brief: (1) one sentence on who the candidate is from the resume, (2) if the candidate appears significantly overqualified for the role — more experience, seniority, or title than the role requires — call this out explicitly and prominently before anything else, with a one-line note on why it matters, (3) propose team fit — do not ask, state your recommendation with a one-line reason, (4) short line inviting them to pick a round. The interface shows round selection buttons — do not ask "which round?".

- When the interviewer selects Whiteboarding: give a brief description of the format (collaborative, 1hr), then write out all 6 problems as a numbered list with their full context and brief — do NOT use [OPTIONS] for the problems, write them as plain prose so the interviewer can read and choose. Each problem should show: the title, the context (why this problem is interesting), the brief to share with the candidate, and what to look for. After presenting all 6 problems, add the universal fallback suggestion as plain text. Once the interviewer picks a problem (they will tell you which one), give them: the mid-exercise constraints to introduce at 20-30 minutes, and any candidate-specific angles based on their background.

- When the interviewer selects Screening Call or Portfolio Round: start with the full candidate overview below, then prerequisites if any, then round-specific guidance.

- If the interviewer selects "Both" or "All rounds": cover all selected rounds in sequence.

- When the interviewer selects a round (except Whiteboarding), your response must ALWAYS start with a full candidate overview in this exact format before any round-specific guidance:

---
**Tier:** [STRONG SHORTLIST / MAYBE / PASS]
**Recommended fit:** [**Team name**] — [one sentence reasoning]
**Reason for tier:** [one sentence explaining why this tier and not higher or lower]

**Strengths**
1. **[Title]** — [specific strength tied to a concrete observation. 2–4 sentences with reasoning.]
2. **[Title]** — [same]
3. **[Title]** — [same]

**Concerns**
1. **[Title]** — [specific concern tied to a concrete observation. 2–3 sentences explaining why it matters.]
2. **[Title]** — [same]

**Red flags**
[List any hard red flags. If none, say "None that are hard stops."]

**Probe questions**
1. [Specific question for this candidate]
2. [Specific question for this candidate]
3. [Specific question for this candidate]
---

- After the overview, add a "Before this round" section if there are prerequisites, then give round-specific guidance.

- If the interviewer selects "Both", cover BOTH rounds in full sequence: candidate overview first, then prerequisites, then a clearly labelled "Screening Call" section with full guidance, then a clearly labelled "Portfolio Round" section with full guidance. Do not skip or abbreviate either round.

- If a screening evaluation was provided, use it heavily — incorporate its specific findings into the overview rather than regenerating from scratch.
- Never ask about team fit. Propose it.
- When you identify portfolio links, LinkedIn URLs, or any external URLs from the resume or screening eval, include them as plain URLs in your response — the interface will render them as clickable links. For example: "Portfolio: https://example.framer.website" or "LinkedIn: https://linkedin.com/in/candidate". Surface these in your first message so the interviewer can open them before the session.
- For subsequent messages, be conversational and tight — short paragraphs, max 4 bullets.
- Tone: direct, collegial, precise.

PREREQUISITES — CRITICAL:
When preparing for any round, always check first for blockers that need to happen BEFORE the round, not during it. Present these as a distinct "Before this round" section before giving in-round guidance. Format it as:

⚠️ Before this round
- [specific blocker with action required]
- [specific blocker with action required]

Prerequisites to check for:
- Inaccessible case studies (Figma prototype links, password-protected portfolios, missing work from listed employers) — state exactly which employer's work is missing and what to request from the candidate
- Timeline gaps flagged in resume that haven't been explained — name the specific dates and gap duration
- Portfolio links that resolved to LinkedIn or dead ends
- Screening eval concerns flagged as "verify before progressing"
Only include this section if there are actual prerequisites. If everything is clear, skip it entirely.

CONTEXTUAL QUICK REPLIES:
When your message ends with a question that has a small fixed set of good answers, append on the very last line:
[OPTIONS: A | B | C]
Only use for binary or multiple-choice questions. Never for open-ended questions needing elaboration. "Other" is always added by the interface — do not include it. Never put [OPTIONS] anywhere except the last line.

EXPORT / HANDOFF:
When asked to generate a handoff document (the user sends "GENERATE_HANDOFF"), produce a structured summary in exactly this format and nothing else. This document is for the next interviewer who has not spoken to this candidate and needs full context:

---HANDOFF START---
Candidate: [full name]
Role: [PD2/SPD] — [Recommended team]
Tier: [STRONG SHORTLIST / MAYBE / PASS]
Team fit: [one sentence reasoning]

How this evaluation was done:
[2–3 sentences on what was reviewed — resume, which portfolio links were accessible, which weren't, whether a screening evaluation was provided. Name specific employers whose case studies were or weren't visible.]

Strengths:
1. [Title] — [2–3 sentences of reasoning tied to a concrete observation. Explain why it matters for ACKO's context.]
2. [Title] — [same]
3. [Title] — [same]

Concerns:
1. [Title] — [2–3 sentences explaining why this concern matters and what it might indicate.]
2. [Title] — [same]

Before any round:
- [Specific blocker and exactly what to request from the candidate — or "None" if clear]

Probe questions for Screening Call:
1. [Question] — [one sentence on why this question matters for this specific candidate]
2. [Question] — [same]
3. [Question] — [same]

Probe questions for Portfolio Round:
1. [Question] — [one sentence on why this question matters for this specific candidate]
2. [Question] — [same]
3. [Question] — [same]

What to do next:
[One short paragraph on the recommended action — move forward, what to verify first, what the deciding factor is.]
---HANDOFF END---`;
};

const parseOptions = (text) => {
  const match = text.match(/\[OPTIONS:\s*([^\]]+)\]\s*$/);
  if (!match) return { clean: text, options: null };
  const options = match[1].split("|").map(o => o.trim()).filter(Boolean);
  const clean = text.replace(/\n?\[OPTIONS:\s*[^\]]+\]\s*$/, "").trim();
  return { clean, options };
};

const parseHandoff = (text) => {
  const match = text.match(/---HANDOFF START---([\s\S]*?)---HANDOFF END---/);
  if (!match) return null;
  return match[1].trim();
};

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

const fmt = (text) => {
  return text.split("\n").map((line, i, arr) => {
    const tokens = line.split(/(\[([^\]]+)\]\((https?:\/\/[^\)]+)\)|\*\*[^*]+\*\*|https?:\/\/[^\s,)"'<>]+)/g);
    const rendered = [];
    let j = 0;
    while (j < tokens.length) {
      const t = tokens[j];
      if (!t) { j++; continue; }
      if (t.startsWith("**") && t.endsWith("**") && t.length > 4) {
        rendered.push(<strong key={j} style={{ color: "#e0e0e0", fontWeight: 600 }}>{t.slice(2,-2)}</strong>);
      } else if (t.match(/^\[([^\]]+)\]\((https?:\/\/[^\)]+)\)$/)) {
        const m = t.match(/^\[([^\]]+)\]\((https?:\/\/[^\)]+)\)$/);
        rendered.push(<a key={j} href={m[2]} style={{ color: "#a8a4f0", textDecoration: "underline", textDecorationColor: "rgba(168,164,240,0.4)", cursor: "pointer" }}>{m[1]}</a>);
      } else if (t.match(/^https?:\/\/[^\s,)"'<>]+/)) {
        const url = t.replace(/[.,;:!?]+$/, "");
        const display = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
        rendered.push(<a key={j} href={url} style={{ color: "#a8a4f0", textDecoration: "underline", textDecorationColor: "rgba(168,164,240,0.4)", cursor: "pointer" }}>{display}</a>);
      } else {
        rendered.push(<span key={j}>{t}</span>);
      }
      j++;
    }
    return (
      <span key={i}>
        {rendered}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
};

const ACKOLogo = ({ height = 20 }) => (
  <svg height={height} viewBox="0 0 120 29" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <path d="M36.3625 9.90737V18.229C36.3625 18.8687 36.0719 19.4203 35.4815 19.8024C28.1062 24.577 22.5227 26.5822 20.5684 27.1406C17.8751 27.9114 16.4472 27.8301 16.2138 27.8142C11.2938 27.4638 3.00781 20.7722 3.00781 20.7722C3.00781 20.7722 9.76981 22.4044 25.3922 15.0572C28.3213 13.6804 31.5913 12.193 35.3923 10.4522C35.3923 10.4522 36.2229 10.0972 36.3625 9.90958V9.90737Z" fill="#5427C1"/>
    <path d="M35.9735 9.62482C36.017 9.58865 36.0719 9.54112 36.0971 9.50947C36.1314 9.46652 36.1611 9.4236 36.1794 9.3716C36.2298 9.23144 36.2138 9.05738 36.1337 8.92852C35.9895 8.69341 35.7469 8.53737 35.4815 8.36555C28.1062 3.59099 22.5227 1.58577 20.5684 1.02738C17.8751 0.256491 16.4472 0.33788 16.2138 0.353705C11.2938 0.704111 3.00781 7.39582 3.00781 7.39582C3.00781 7.39582 9.76982 5.76356 25.3922 13.1108C25.8957 13.3482 26.4083 13.5878 26.9323 13.8297L35.4678 9.91867C35.4678 9.91867 35.898 9.6836 35.9735 9.62482Z" fill="#986DFA"/>
    <path d="M10.9276 14.0761C10.9368 12.3014 11.161 10.5245 11.5752 8.76798L11.6301 8.54864C8.55459 7.83426 6.28458 7.68289 4.92303 7.68289C3.79946 7.68289 3.2022 7.78454 2.99854 7.8275C2.6324 7.90662 2.37384 8.19603 2.18849 8.43792C1.0878 9.88024 0.458496 11.9352 0.458496 14.0761C0.458496 16.2169 1.0878 18.2741 2.18849 19.7142C2.37384 19.9561 2.6324 20.2432 2.99854 20.3246C3.2022 20.3676 3.79946 20.4692 4.92303 20.4692C6.28458 20.4692 8.55231 20.3178 11.6301 19.6035L11.5752 19.3841C11.161 17.6276 10.9368 15.8507 10.9276 14.0761Z" fill="#B99AFA"/>
    <path d="M49.5996 4.66087H54.7436L62.9426 23.845H57.2196L55.8169 20.4432H48.3891L47.0138 23.845H41.4006L49.5996 4.66087ZM54.2769 16.3353L52.1304 10.919L49.9566 16.3353H54.2769Z" fill="#8B7FD4"/>
    <path d="M61.6748 14.3752V14.3209C61.6748 8.76894 65.9951 4.41645 71.8257 4.41645C75.7592 4.41645 78.2901 6.04839 79.9971 8.3887L75.9812 11.4646C74.8805 10.1043 73.6151 9.23293 71.7707 9.23293C69.0751 9.23293 67.1759 11.4917 67.1759 14.2666V14.3209C67.1759 17.1773 69.0751 19.409 71.7707 19.409C73.7799 19.409 74.9629 18.4832 76.1185 17.0958L80.1345 19.925C78.3176 22.4011 75.8691 24.2253 71.606 24.2253C66.1027 24.2253 61.6748 20.0608 61.6748 14.3752Z" fill="#8B7FD4"/>
    <path d="M81.8096 4.79671H87.1459V12.526L93.7773 4.79671H100.104L92.814 12.9878L100.352 23.845H93.9421L89.1001 16.7698L87.1459 18.92V23.845H81.8096V4.79671Z" fill="#8B7FD4"/>
    <path d="M98.7703 14.3752V14.3209C98.7703 8.85042 103.228 4.41645 109.171 4.41645C115.113 4.41645 119.516 8.79831 119.516 14.2666V14.3209C119.516 19.7915 115.058 24.2253 109.116 24.2253C103.173 24.2253 98.7703 19.8435 98.7703 14.3752ZM114.067 14.3752V14.3209C114.067 11.5732 112.058 9.17856 109.116 9.17856C106.173 9.17856 104.246 11.5189 104.246 14.2666V14.3209C104.246 17.0687 106.255 19.4632 109.171 19.4632C112.086 19.4632 114.067 17.1229 114.067 14.3752Z" fill="#8B7FD4"/>
  </svg>
);

const PROCESS_STEPS = [
  { title: "Recruiter screening", duration: null, done: null, shaded: true, elim: false, debrief: false },
  { title: "Exploratory round", duration: "30 mins", done: "Design leads", shaded: false, elim: true, debrief: false },
  { title: "Portfolio review", duration: "1 hr", done: "Design lead + SPD1", shaded: false, elim: true, debrief: false },
  { title: "Whiteboarding exercise", duration: "1 hr", done: "Design leads", shaded: false, elim: true, debrief: false },
  { title: "Stakeholder interview", duration: "30 mins", done: "Product manager", shaded: false, elim: false, debrief: false },
  { title: "Culture Fit round", duration: "30 mins", done: "HR", shaded: false, elim: false, debrief: false },
  { title: "Hiring manager discussion", duration: "30 mins", done: null, shaded: false, elim: false, debrief: true },
];

const GUIDE_STAGES = [
  { title: "Recruiter Screening", who: "Recruiter", duration: null, lookFor: [
    "Experience threshold — PD2: minimum 2 years of product design. SPD1: minimum 5 years. Pure graphic/visual design or internship-only backgrounds don't qualify unless the work clearly demonstrates product design ownership.",
    "Portfolio exists and is accessible — a LinkedIn profile URL is not a portfolio. Figma prototype links (figma.com/proto) cannot be reviewed externally — flag and ask for a web portfolio or PDF. Medium profiles with 3+ case studies are valid. Image-based PDFs (designed in Figma or Canva) cannot be read — ask for text-based PDF.",
    "Consumer product experience — has the candidate worked on consumer-facing products (apps, fintech, health tech, marketplaces)? B2B or enterprise-only backgrounds are not a hard reject but should be flagged — they inform team fit.",
    "Overqualification signals — for PD2, flag candidates with 6+ years, SPD-level titles (Lead, Head of Design), or people-management history. For SPD1, flag 10+ years or Head of Design titles. Overqualification raises motivation and retention questions that should be surfaced early.",
    "Timeline gaps — scan the resume for gaps of 6+ months between roles or between education and first role. Note the specific dates and flag for the design round to probe.",
    "India market familiarity — has the candidate designed for Indian users? Meaningful soft signal, especially for candidates with 3+ years. Not a hard filter.",
    "Notice period — confirm it is compatible with the role before progressing."
  ], notThis: "Do not evaluate design quality, portfolio depth, domain fit, or craft at this stage. The recruiter screening is eligibility and logistics only — design evaluation begins at the Exploratory round.", stop: "Less than minimum experience · Portfolio absent or inaccessible after recovery attempts · Significant hard disqualifier (e.g. pure graphic design with no product work)" },
  { title: "Exploratory Round", who: "Design leads", duration: "30 mins", lookFor: ["Can the candidate speak to their own work without slides?", "Do they have a coherent reason for moving and a direction for what they want next?", "Do timeline gaps from the resume hold up when probed?", "For SPD1: any signal that they shaped what was built — not just executed it"], notThis: "Not a portfolio review. Not a design depth evaluation. Red flag check only.", stop: "Cannot speak to own work without slides · Timeline gap doesn't hold up · No coherent motivation · SPD1 shows zero upstream ownership" },
  { title: "Portfolio Review", who: "Design lead + SPD1", duration: "1 hr", lookFor: ["Thinking quality — do they understand the problem behind the work?", "Craft quality — is the visual and interaction design at bar for this level?", "Self-awareness — do they know what worked, what didn't, and why?", "For SPD1: problem definition ownership, cross-functional influence, strategic awareness, craft with conviction"], notThis: "Do not let them present uninterrupted. Break their flow deliberately — interrupt mid-screen, jump them to different parts, ask about what is not on screen, go off-deck.", stop: "Cannot explain why decisions were made · Craft below bar · All work described as successful with no learning · SPD1: no upstream ownership anywhere" },
  { title: "Whiteboarding Exercise", who: "Design leads", duration: "1 hr", lookFor: ["Do they ask clarifying questions before picking up the pen — or jump straight to solutions?","Do they think in flows and systems, not just individual screens?","Do they build on input or defend a fixed direction when you introduce an idea?","How do they respond to mid-exercise constraints introduced at the 20-30 min mark?","For PD2: structured thinking and clear framing. For SPD1: strategic framing, surfaces trade-offs and downstream consequences without prompting."], notThis: "Not an illustration test. The output (sketch, flow) matters less than the quality of reasoning getting there. Do not penalise imperfect visual execution.", stop: "Jumps to solutions without any problem framing or clarifying questions · Cannot adapt when given a new constraint · SPD1: approach indistinguishable from PD2" },
  { title: "Stakeholder Interview", who: "Product manager", duration: "30 mins", lookFor: ["Can they explain design decisions in product terms — user needs, business outcomes, trade-offs?", "Have they navigated disagreement with a PM constructively?", "Do they take responsibility for outcomes, or attribute everything externally?", "Are they comfortable with fast iteration and shipping before everything is perfect?"], notThis: "Not a design re-evaluation. PM is assessing collaboration, communication, and product partnership — not portfolio quality.", stop: "Cannot connect design to business outcomes · Frames all friction as the stakeholder's fault" },
  { title: "Culture Fit Round", who: "HR", duration: "30 mins", lookFor: ["Why ACKO specifically — is there a genuine answer?", "How do they handle ambiguity and changing priorities?", "How do they give and receive feedback?", "Compensation expectations and start date are realistic"], notThis: "HR does not re-evaluate design. Values and practical fit only.", stop: null },
  { title: "Debrief + Hiring Manager Discussion", who: "All interviewers → Hiring Manager", duration: "30 mins", lookFor: ["Each interviewer shares one strongest signal and a hire / no-hire recommendation", "HM synthesises — does not simply count votes", "Unresolved concerns from early stages are surfaced and addressed", "For conditional hires: name the specific condition and who verifies it"], notThis: "Not a re-interview. The decision is made from existing evidence.", stop: "Significant concern from one stage unaddressed in later stages · Inconsistent self-presentation across stages · Unanimous hesitation with no hard stop" },
];

const isPrerequisiteBlock = (text) => text.startsWith("⚠️ Before this round") || text.startsWith("⚠️ Before");

export default function App() {
  const [page, setPage] = useState("main");
  const [role, setRole] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [screeningEval, setScreeningEval] = useState("");
  const [showEvalInput, setShowEvalInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [pdfB64, setPdfB64] = useState(null);
  const [quickOptions, setQuickOptions] = useState(null);
  const [otherMode, setOtherMode] = useState(false);
  const [otherInput, setOtherInput] = useState("");
  const [handoff, setHandoff] = useState(null);
  const [copied, setCopied] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [coveredRounds, setCoveredRounds] = useState(new Set());
  const [nextRound, setNextRound] = useState(null);

  const fileRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const otherRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);
  useEffect(() => { if (otherMode && otherRef.current) otherRef.current.focus(); }, [otherMode]);

  const readAsB64 = (file) => new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result.split(",")[1]); r.readAsDataURL(file); });
  const readAsText = (file) => new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsText(file); });

  const handleFile = async (file) => {
    if (!file) return;
    setResumeFile(file);
    if (file.type === "application/pdf") { const b64 = await readAsB64(file); setPdfB64(b64); }
    else { const text = await readAsText(file); setResumeText(text); }
  };

  const callAPI = async (msgs, sys, b64 = null) => {
    const apiMsgs = msgs.map((m, idx) => {
      if (idx === 0 && m.role === "user" && b64) return { role: "user", content: [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } }, { type: "text", text: m.content }] };
      return { role: m.role, content: m.content };
    });
    const body = { model: "claude-sonnet-4-6", max_tokens: 1200, system: sys, messages: apiMsgs };
    if (b64) body.betas = ["pdfs-2024-09-25"];
    const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    return data.content?.find(b => b.type === "text")?.text || "Something went wrong.";
  };

  const handleReply = (raw) => {
    const handoffContent = parseHandoff(raw);
    if (handoffContent) { setHandoff(handoffContent); return null; }
    const { clean, options } = parseOptions(raw);
    setQuickOptions(options);
    setOtherMode(false);
    setOtherInput("");
    return clean;
  };

  const startChat = async () => {
    setStarted(true);
    setLoading(true);
    const sys = buildSystem(role, pdfB64 ? null : resumeText, screeningEval);
    setSystemPrompt(sys);
    const firstMsg = pdfB64
      ? "I've uploaded the candidate's resume as a PDF. Please read it and help me prepare."
      : "I've provided the candidate's resume. Please read it and help me prepare.";
    const init = [{ role: "user", content: firstMsg, hidden: true }];
    try {
      const raw = await callAPI(init, sys, pdfB64);
      const clean = handleReply(raw);
      const msgs = [...init];
      if (clean) msgs.push({ role: "assistant", content: clean });
      setMessages(msgs);
      if (!parseOptions(raw).options && !parseHandoff(raw)) {
        setQuickOptions(["Screening Call", "Portfolio Round", "Whiteboarding"]);
      }
    } catch { setMessages([{ role: "assistant", content: "Connection error. Please try again." }]); }
    setLoading(false);
  };

  const sendMsg = async (text, hidden = false) => {
    setQuickOptions(null); setOtherMode(false); setOtherInput(""); setInput("");
    setNextRound(null);

    // Track which rounds have been covered
    const allRounds = ["Screening Call", "Portfolio Round", "Whiteboarding"];
    let newCovered = new Set(coveredRounds);
    if (allRounds.includes(text)) {
      newCovered.add(text);
      setCoveredRounds(newCovered);
    }

    const newMsgs = [...messages, { role: "user", content: text, hidden }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const raw = await callAPI(newMsgs, systemPrompt, pdfB64);
      const clean = handleReply(raw);
      if (clean) setMessages([...newMsgs, { role: "assistant", content: clean }]);
      else setMessages(newMsgs);

      // Suggest next round in fixed progression: Screening → Portfolio → Whiteboarding
      if (allRounds.includes(text)) {
        const progression = { "Screening Call": "Portfolio Round", "Portfolio Round": "Whiteboarding", "Whiteboarding": null };
        const next = progression[text];
        setNextRound(next ? [next] : null);
      }
    } catch { setMessages([...newMsgs, { role: "assistant", content: "Something went wrong. Please try again." }]); }
    setLoading(false);
  };

  const generateExport = async () => {
    setExportLoading(true);
    const newMsgs = [...messages, { role: "user", content: "GENERATE_HANDOFF", hidden: true }];
    setMessages(newMsgs);
    try {
      const raw = await callAPI(newMsgs, systemPrompt, pdfB64);
      const handoffContent = parseHandoff(raw);
      if (handoffContent) setHandoff(handoffContent);
      else setMessages([...newMsgs, { role: "assistant", content: raw }]);
    } catch { setMessages([...newMsgs, { role: "assistant", content: "Could not generate export. Please try again." }]); }
    setExportLoading(false);
  };

  const copyHandoff = () => {
    navigator.clipboard.writeText(handoff).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const reset = () => {
    setRole(null); setResumeText(""); setResumeFile(null); setPasteMode(false);
    setScreeningEval(""); setShowEvalInput(false); setDragOver(false);
    setStarted(false); setMessages([]); setInput(""); setSystemPrompt("");
    setPdfB64(null); setQuickOptions(null); setOtherMode(false); setOtherInput("");
    setHandoff(null); setCopied(false); setExportLoading(false);
    setCoveredRounds(new Set()); setNextRound(null);
  };

  const canStart = role && (resumeFile || resumeText.trim());

  const renderMessage = (content) => {
    const parts = content.split(/(⚠️ Before this round[\s\S]*?)(?=\n\n|\n[A-Z]|$)/);
    if (parts.length === 1) return <div style={{ fontSize: 14, lineHeight: 1.65 }}>{fmt(content)}</div>;
    return parts.map((part, i) => {
      if (part.startsWith("⚠️ Before this round") || part.startsWith("⚠️ Before")) {
        return <div key={i} style={{ background: "rgba(255,180,0,0.06)", border: "1px solid rgba(255,180,0,0.2)", borderRadius: 8, padding: "10px 14px", margin: "8px 0", fontSize: 13, lineHeight: 1.65, color: "#c8c8c8" }}>{fmt(part)}</div>;
      }
      return part.trim() ? <div key={i} style={{ fontSize: 14, lineHeight: 1.65 }}>{fmt(part)}</div> : null;
    });
  };

  const GuideStage = ({ stage }) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ border: "1px solid #1a1a1a", borderRadius: 10, overflow: "hidden", marginBottom: 4 }}>
        <button onClick={() => setOpen(!open)} style={{ width: "100%", background: open ? "#111" : "transparent", border: "none", padding: "12px 16px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#d0d0d0" }}>{stage.title}</span>
            <span style={{ fontSize: 11, color: "#444" }}>{stage.who}</span>
            {stage.duration && <span style={{ fontSize: 11, color: "#333", background: "#161616", border: "1px solid #222", borderRadius: 4, padding: "1px 6px" }}>{stage.duration}</span>}
          </div>
          <span style={{ color: "#444", fontSize: 14, transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none", display: "block" }}>⌄</span>
        </button>
        {open && (
          <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1a1a1a" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#6c63f5", letterSpacing: "0.06em", textTransform: "uppercase", margin: "12px 0 6px" }}>What to look for</p>
            <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
              {stage.lookFor.map((item, j) => (
                <li key={j} style={{ fontSize: 13, color: "#999", lineHeight: 1.55 }}>{item}</li>
              ))}
            </ul>
            {stage.notThis && (
              <>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase", margin: "12px 0 6px" }}>Not this round's job</p>
                <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.55 }}>{stage.notThis}</p>
              </>
            )}
            {stage.stop && (
              <>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#ec4899", letterSpacing: "0.06em", textTransform: "uppercase", margin: "12px 0 6px" }}>Stop if</p>
                <p style={{ fontSize: 13, color: "#888", margin: 0, lineHeight: 1.55, borderLeft: "2px solid rgba(236,72,153,0.3)", paddingLeft: 10 }}>{stage.stop}</p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  if (page === "guide") return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif", background: "#0a0a0a", minHeight: "100vh", color: "#c8c8c8" }}>
      <div style={{ borderBottom: "1px solid #141414", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0a0a0a", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ACKOLogo height={16} />
          <span style={{ color: "#282828" }}>·</span>
          <span style={{ fontSize: 13, color: "#888" }}>Hiring guide</span>
        </div>
        <button onClick={() => setPage("main")} style={{ background: "none", border: "1px solid #1e1e1e", borderRadius: 6, color: "#555", fontSize: 12, padding: "4px 10px", cursor: "pointer" }}>← Back</button>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 8 }}><ACKOLogo height={20} /></div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f0f0f0", margin: "8px 0 4px", letterSpacing: "-0.02em" }}>Hiring guide</h1>
        <p style={{ fontSize: 14, color: "#555", margin: "0 0 40px" }}>Stage-by-stage process, who runs each round, and what to look for.</p>

        <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
          {/* Flowchart */}
          <div style={{ flexShrink: 0, width: 240 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 14px" }}>Process</p>
            {PROCESS_STEPS.map((step, i) => (
              <div key={i}>
                {step.debrief && (
                  <div style={{ display: "flex", alignItems: "center", paddingLeft: 10, margin: "0 0 0 0" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 8, flexShrink: 0 }}>
                      <div style={{ width: 1, height: 12, background: "#222" }} />
                    </div>
                    <div style={{ background: "rgba(108,99,245,0.12)", border: "1px solid rgba(108,99,245,0.25)", borderRadius: 4, padding: "2px 8px", fontSize: 10, color: "#a8a4f0", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Debrief</div>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: step.shaded ? "#555" : "#2a2a2a", border: `1px solid ${step.shaded ? "#888" : "#444"}`, flexShrink: 0 }} />
                    {i < PROCESS_STEPS.length - 1 && <div style={{ width: 1, flex: 1, minHeight: step.elim ? 32 : 16, background: "#1e1e1e" }} />}
                  </div>
                  <div style={{ background: step.shaded ? "#181818" : "#0f0f0f", border: `1px solid ${step.shaded ? "#2a2a2a" : "#1a1a1a"}`, borderRadius: 8, padding: "8px 12px", flex: 1, marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: step.shaded ? "#aaa" : "#ccc" }}>{step.title}</div>
                    {step.duration && <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{step.duration}</div>}
                    {step.done && <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>↳ {step.done}</div>}
                  </div>
                </div>
                {step.elim && (
                  <div style={{ paddingLeft: 18, marginTop: -8, marginBottom: 4 }}>
                    <div style={{ background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.2)", borderRadius: 4, padding: "2px 8px", fontSize: 10, color: "#ec4899", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", display: "inline-block" }}>Elimination check</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Guidelines */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 14px" }}>Stage guidelines — click to expand</p>
            {GUIDE_STAGES.map((stage, i) => (
              <GuideStage key={i} stage={stage} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!started) return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif", background: "#0a0a0a", minHeight: "100vh", padding: "28px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <ACKOLogo height={18} />
          <button onClick={() => setPage("guide")} style={{ background: "none", border: "1px solid #222", borderRadius: 6, color: "#888", fontSize: 12, padding: "4px 12px", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.color = "#ccc"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#888"; }}>
            Hiring guide
          </button>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f0f0f0", margin: "10px 0 4px", letterSpacing: "-0.02em" }}>Design Hiring</h1>
        <p style={{ fontSize: 14, color: "#555", margin: "0 0 28px", lineHeight: 1.6 }}>Tailored guidance for every round — screening call, portfolio review, and what to watch for.</p>

        <p style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 10px" }}>Role</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[["PD2","Product Designer 2","2–4 yrs"],["SPD","Senior Product Designer","5–8 yrs"]].map(([id, label, exp]) => (
            <button key={id} onClick={() => setRole(id)} style={{ flex: 1, background: role === id ? "#0e0e1a" : "#111", border: `1px solid ${role === id ? "#6c63f5" : "#1e1e1e"}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
              onMouseEnter={e => { if (role !== id) e.currentTarget.style.borderColor = "#333"; }}
              onMouseLeave={e => { if (role !== id) e.currentTarget.style.borderColor = "#1e1e1e"; }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: role === id ? "#a8a4f0" : "#ccc", marginBottom: 2 }}>{id}</div>
              <div style={{ fontSize: 12, color: "#444", lineHeight: 1.4 }}>{label}</div>
              <div style={{ fontSize: 11, color: role === id ? "#6c63f5" : "#333", marginTop: 2 }}>{exp}</div>
            </button>
          ))}
        </div>

        <p style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 10px" }}>Candidate resume</p>
        {!pasteMode ? (
          <>
            <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
              style={{ border: `1.5px dashed ${dragOver ? "#6c63f5" : resumeFile ? "#2d5a2d" : "#222"}`, borderRadius: 12, padding: "20px", textAlign: "center", cursor: "pointer", background: resumeFile ? "rgba(45,90,45,0.06)" : dragOver ? "rgba(108,99,245,0.04)" : "transparent", transition: "all 0.15s", marginBottom: 8 }}>
              {resumeFile
                ? <div><p style={{ color: "#4caf50", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>✓ {resumeFile.name}</p><p style={{ color: "#444", fontSize: 12, margin: 0 }}>Click to replace</p></div>
                : <div><div style={{ color: "#333", marginBottom: 6, display: "flex", justifyContent: "center" }}><UploadIcon /></div><p style={{ color: "#444", fontSize: 13, margin: 0 }}>Drop PDF here or <span style={{ color: "#6c63f5" }}>browse</span></p></div>}
              <input ref={fileRef} type="file" accept=".pdf,.txt,.md" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>
            <button onClick={() => setPasteMode(true)} style={{ background: "none", border: "none", color: "#444", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20 }}>Or paste resume text →</button>
          </>
        ) : (
          <>
            <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste resume text here..." rows={6}
              style={{ width: "100%", background: "#111", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", color: "#ccc", fontSize: 13, lineHeight: 1.6, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 8 }} />
            <button onClick={() => { setPasteMode(false); setResumeText(""); setPdfB64(null); setResumeFile(null); }} style={{ background: "none", border: "none", color: "#444", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20 }}>← Upload PDF instead</button>
          </>
        )}

        <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 20, marginBottom: 20 }}>
          <button onClick={() => setShowEvalInput(!showEvalInput)}
            style={{ background: "none", border: "none", color: showEvalInput ? "#888" : "#444", fontSize: 13, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>{showEvalInput ? "−" : "+"}</span>
            Add screening evaluation <span style={{ color: "#333", fontSize: 12 }}>(optional — for candidate-specific probe questions)</span>
          </button>
          {showEvalInput && (
            <textarea value={screeningEval} onChange={e => setScreeningEval(e.target.value)}
              placeholder="Paste the Claude screening evaluation output here..." rows={6}
              style={{ width: "100%", background: "#111", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", color: "#ccc", fontSize: 13, lineHeight: 1.6, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginTop: 12 }} />
          )}
        </div>

        <button onClick={startChat} disabled={!canStart}
          style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: canStart ? "pointer" : "not-allowed", background: canStart ? "#6c63f5" : "#151515", color: canStart ? "#fff" : "#333", transition: "all 0.15s" }}>
          {!role ? "Select a role to continue" : !resumeFile && !resumeText.trim() ? "Upload a resume to continue" : `Start ${role} prep →`}
        </button>
        {role && !resumeFile && !resumeText.trim() && <p style={{ color: "#333", fontSize: 12, textAlign: "center", marginTop: 8 }}>A resume is needed to generate candidate-specific guidance.</p>}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif", background: "#0a0a0a", display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
      {/* Handoff overlay */}
      {handoff && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#0f0f0f", border: "1px solid #222", borderRadius: 14, width: "100%", maxWidth: 560, maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#f0f0f0", fontSize: 14, fontWeight: 600, margin: 0 }}>Handoff document</p>
                <p style={{ color: "#555", fontSize: 12, margin: "2px 0 0" }}>Copy and share with the next interviewer</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={copyHandoff}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: copied ? "#1a2e1a" : "#111", border: `1px solid ${copied ? "#2d5a2d" : "#222"}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: copied ? "#4caf50" : "#888", fontSize: 12, transition: "all 0.15s" }}>
                  <CopyIcon />{copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={() => setHandoff(null)}
                  style={{ background: "none", border: "1px solid #222", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#555", fontSize: 12 }}>
                  Close
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
              <pre style={{ color: "#c8c8c8", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{handoff}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div style={{ borderBottom: "1px solid #141414", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ACKOLogo height={16} />
          <span style={{ color: "#282828" }}>·</span>
          <span style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>Design Hiring</span>
          <span style={{ background: "#111", border: "1px solid #1e1e3a", borderRadius: 4, padding: "2px 8px", color: "#6c63f5", fontSize: 11, fontWeight: 700 }}>{role}</span>
          {(resumeFile || resumeText) && <span style={{ background: "#111", border: "1px solid #1e3a1e", borderRadius: 4, padding: "2px 8px", color: "#4caf50", fontSize: 11 }}>Resume loaded</span>}
          {screeningEval && <span style={{ background: "#111", border: "1px solid #3a2e1e", borderRadius: 4, padding: "2px 8px", color: "#f0a040", fontSize: 11 }}>Eval loaded</span>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={generateExport} disabled={exportLoading}
            style={{ background: "none", border: "1px solid #222", borderRadius: 6, color: exportLoading ? "#333" : "#888", fontSize: 12, padding: "4px 12px", cursor: exportLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            {exportLoading ? "Generating…" : "↗ Export handoff"}
          </button>
          <button onClick={reset} style={{ background: "#1a1a2e", border: "1px solid #6c63f5", borderRadius: 6, color: "#a8a4f0", fontSize: 12, fontWeight: 600, padding: "4px 12px", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#6c63f5"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#1a1a2e"; e.currentTarget.style.color = "#a8a4f0"; }}>
            New session
          </button>
          <button onClick={() => setPage("guide")} style={{ background: "none", border: "1px solid #222", borderRadius: 6, color: "#888", fontSize: 12, padding: "4px 12px", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.color = "#ccc"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#888"; }}>
            Hiring guide
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.filter(m => !m.hidden).map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: msg.role === "assistant" ? "#0e0e1a" : "#0e1a0e", border: `1px solid ${msg.role === "assistant" ? "#1e1e3a" : "#1e3a1e"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: msg.role === "assistant" ? "#6c63f5" : "#4caf50" }}>
                {msg.role === "assistant" ? "A" : "Y"}
              </div>
              <div style={{ maxWidth: "88%", background: msg.role === "assistant" ? "#0f0f0f" : "#0e0e1a", border: `1px solid ${msg.role === "assistant" ? "#181818" : "#1e1e3a"}`, borderRadius: msg.role === "assistant" ? "3px 12px 12px 12px" : "12px 3px 12px 12px", padding: "10px 14px", color: msg.role === "assistant" ? "#c8c8c8" : "#a8a4f0" }}>
                {renderMessage(msg.content)}
              </div>
            </div>
          ))}

          {quickOptions && !loading && (
            <div style={{ paddingLeft: 34, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {quickOptions.map(opt => (
                  <button key={opt} onClick={() => sendMsg(opt)}
                    style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#888", fontSize: 13, transition: "all 0.15s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#6c63f5"; e.currentTarget.style.color = "#a8a4f0"; e.currentTarget.style.background = "#0e0e1a"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.color = "#888"; e.currentTarget.style.background = "#111"; }}>
                    {opt}
                  </button>
                ))}
                {!otherMode && (
                  <button onClick={() => setOtherMode(true)}
                    style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "#555", fontSize: 13, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#888"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.color = "#555"; }}>
                    Other
                  </button>
                )}
              </div>
              {otherMode && (
                <div style={{ display: "flex", gap: 6, alignItems: "center", maxWidth: 380 }}>
                  <input ref={otherRef} value={otherInput} onChange={e => setOtherInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && otherInput.trim()) sendMsg(otherInput.trim()); if (e.key === "Escape") { setOtherMode(false); setOtherInput(""); } }}
                    placeholder="Type your response..."
                    style={{ flex: 1, background: "#111", border: "1px solid #6c63f5", borderRadius: 8, padding: "7px 12px", color: "#ccc", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                  <button onClick={() => { if (otherInput.trim()) sendMsg(otherInput.trim()); }} disabled={!otherInput.trim()}
                    style={{ padding: "7px 12px", background: otherInput.trim() ? "#6c63f5" : "#111", border: "none", borderRadius: 8, color: otherInput.trim() ? "#fff" : "#333", fontSize: 13, cursor: otherInput.trim() ? "pointer" : "not-allowed", fontWeight: 600, transition: "all 0.15s" }}>
                    Send
                  </button>
                  <button onClick={() => { setOtherMode(false); setOtherInput(""); }}
                    style={{ background: "none", border: "none", color: "#444", fontSize: 18, cursor: "pointer", padding: "2px", lineHeight: 1 }}>×</button>
                </div>
              )}
            </div>
          )}

          {nextRound && nextRound.length > 0 && !loading && !quickOptions && (
            <div style={{ paddingLeft: 34 }}>
              <p style={{ color: "#444", fontSize: 12, margin: "0 0 6px" }}>Next in the process</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {nextRound.map(r => (
                  <button key={r} onClick={() => sendMsg(r)}
                    style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "10px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#6c63f5"; e.currentTarget.style.background = "#0e0e1a"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.background = "#111"; }}>
                    <div style={{ color: "#d0d0d0", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{r} →</div>
                    <div style={{ color: "#444", fontSize: 11 }}>
                      {r === "Portfolio Round" ? "60 min · Craft and thinking" : r === "Screening Call" ? "30 min · Red flag check" : "60 min · Collaborative exercise"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#0e0e1a", border: "1px solid #1e1e3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#6c63f5" }}>A</div>
              <div style={{ background: "#0f0f0f", border: "1px solid #181818", borderRadius: "3px 12px 12px 12px", padding: "12px 14px", display: "flex", gap: 4, alignItems: "center" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#6c63f5", animation: "dot 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s`, opacity: 0.4 }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ borderTop: "1px solid #141414", padding: "12px 20px", flexShrink: 0 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (input.trim()) sendMsg(input.trim()); } }}
            placeholder="Ask about any round, or describe what you saw in the portfolio…" rows={1}
            style={{ flex: 1, background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "9px 12px", color: "#ccc", fontSize: 14, lineHeight: 1.5, resize: "none", outline: "none", fontFamily: "inherit", overflow: "hidden" }} />
          <button onClick={() => { if (input.trim()) sendMsg(input.trim()); }} disabled={!input.trim() || loading}
            style={{ width: 36, height: 36, background: input.trim() && !loading ? "#6c63f5" : "#111", border: "none", borderRadius: 10, cursor: input.trim() && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", color: input.trim() && !loading ? "#fff" : "#2a2a2a", transition: "all 0.15s", flexShrink: 0 }}>
            <SendIcon />
          </button>
        </div>
        <p style={{ color: "#1e1e1e", fontSize: 11, textAlign: "center", marginTop: 6 }}>Enter to send · Shift+Enter for new line</p>
      </div>

      <style>{`@keyframes dot{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}*{box-sizing:border-box}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:3px}textarea::placeholder,input::placeholder{color:#2a2a2a}`}</style>
    </div>
  );
}
