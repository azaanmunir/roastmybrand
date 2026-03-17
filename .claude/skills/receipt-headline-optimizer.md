# Skill: Receipt Headline Optimizer

## Purpose
The headline on the receipt card is the single most
important piece of copy on the entire site.
It is the thing people screenshot and share.
It must be so specific and so brutal that the brand
owner either laughs or winces — ideally both.

## What Makes a Great Receipt Headline

### Formula
[Specific observation] + [Unexpected consequence or truth]

### Rules
1. Must reference something SPECIFIC to this brand
   Bad: "Your brand needs work"
   Good: "Your logo is working harder than your strategy"

2. Must be under 12 words
   The card is small. Every word must earn its place.

3. Must have a point of view
   Not a description — a verdict.
   Bad: "The typography is inconsistent"
   Good: "Three fonts walked into a logo. None of them agreed."

4. Punchy rhythm — reads like a headline, not a sentence
   Use em dashes, colons, or line breaks for punch

5. Never use: "overall", "however", "it seems",
   "while there are positives", "in conclusion"
   These are agency words. We are not an agency.

6. Never start with "Your" — overused, weak opener
   Start with the observation, not the subject.

## Headline Archetypes

### The Verdict
States what the brand actually is vs what it thinks it is.
"Built for trust. Designed for doubt."
"Looks premium. Feels Fiverr."
"The strategy is solid. The brand is a costume."

### The Surgical Strike
Identifies one specific fatal flaw with precision.
"That gradient is doing a lot of heavy lifting for a
brand with nothing to say."
"Script font. Stock photo. Zero reason to remember you."
"The logo works at 500px. It dies at 32px.
Where most people will see it."

### The Industry Mirror
Shows them they look exactly like their competitors.
"Congratulations. You've achieved generic."
"Identical to the last 40 brands in your category."
"Your competitors called. They want their palette back."

### The Honest Math
Frames the problem as a logical consequence.
"Forgettable brand + crowded market = invisible."
"Inconsistent identity × every touchpoint = zero trust."

### The Backhanded Compliment
One genuine positive that makes the roast hit harder.
"The product is genuinely good. Nobody will know
because the brand tells them not to take it seriously."

## Optimization Process
When generating a headline, produce 3 versions:
1. Most brutal (for high-confidence roasts, score 1-4)
2. Most specific (references the exact brand element)
3. Most shareable (the one they'll post on LinkedIn)

Then select the best one based on:
- Score: lower scores get more brutal headlines
- Industry: B2B gets surgical, D2C gets punchy
- What's most specific to THIS brand

## Examples by Score Range

Score 1-3 (Brand Disaster):
"This isn't a brand. It's a placeholder that forgot
to become real."
"The brief said 'make it look professional.'
It succeeded at nothing else."
"Designed by committee. Approved by nobody
with taste."

Score 4-5 (Needs Surgery):
"Close enough to work. Far enough from great
to be forgettable."
"The bones are there. The brand is still in scrubs."
"Competent execution of the wrong idea."

Score 6-7 (Salvageable):
"Strong foundation. Weak finish.
Fix the last 20% before it costs you clients."
"The brand knows what it wants to be.
It just hasn't committed yet."

Score 8-9 (Actually Decent):
"Rare: a brand that actually has a point of view.
Tighten the system and it's dangerous."
"This works. Which means there's no excuse
for the one thing that doesn't."

## Integration with Route
In src/app/api/roast/route.ts the headline field
in the JSON response should use this skill's logic.

Update the system prompt to instruct the roast engine:
"For the headline field, apply the Receipt Headline
Optimizer rules. Produce the most shareable, specific,
brutal one-liner possible. Under 12 words.
No generic observations. Reference something specific
to this brand."
