// Netlify Function: AI Job Assistant powered by Claude API
// Set ANTHROPIC_API_KEY in your Netlify environment variables

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'Chat service is not configured. Please contact us at jobs@triangleworkforce.com.' })
    };
  }

  try {
    const { message, history, jobs, candidateInfo } = JSON.parse(event.body);

    // Build the job listings context
    const jobListings = (jobs || []).map(j =>
      `- ${j.title} at ${j.business} (${j.location}, ${j.type}, ${j.pay}): ${j.description}`
    ).join('\n');

    const systemPrompt = `You are the Triangle Workforce job assistant for Chapel Hill and Carrboro, North Carolina. You help job seekers find positions at local restaurants and businesses.

CURRENT OPEN POSITIONS:
${jobListings || 'No positions currently loaded.'}

YOUR ROLE:
- Answer questions about available jobs, pay, requirements, locations
- Help match visitors to the right position based on their skills and preferences
- When someone is interested in a position, collect their info: name, email, phone, which position(s) they want
- If they want to apply, encourage them to attach their resume and share it with you
- Be warm, friendly, and knowledgeable about the Chapel Hill/Carrboro area
- Keep responses concise (2-4 sentences usually)
- If asked about jobs you don't have listed, let them know what IS available and offer to keep their info on file

CANDIDATE INFO COLLECTED SO FAR:
${JSON.stringify(candidateInfo || {})}

IMPORTANT:
- Only discuss jobs that are in the current listings above
- Direct any questions outside of job searching to jobs@triangleworkforce.com
- When you've collected enough candidate info (name + email + position interest), confirm you'll forward it to the Triangle Workforce team
- Be conversational and helpful, not robotic`;

    // Build messages array from conversation history
    const messages = (history || []).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // If history doesn't include the current message, add it
    if (messages.length === 0 || messages[messages.length - 1].content !== message) {
      messages.push({ role: 'user', content: message });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Claude API error:', response.status, errText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content[0].text;

    // Detect if the bot is asking for resume / collecting candidate info
    const collectResume = /resume|cv|attach|upload/i.test(reply);

    // Try to extract candidate info from the conversation
    const extractedInfo = {};
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) extractedInfo.email = emailMatch[0];
    const phoneMatch = message.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) extractedInfo.phone = phoneMatch[0];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        reply,
        collectResume,
        candidateInfo: Object.keys(extractedInfo).length > 0 ? extractedInfo : null
      })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        reply: "I'm having a moment — sorry about that! You can always reach us directly at jobs@triangleworkforce.com. We'd love to help you find the right position."
      })
    };
  }
};
