import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session.js';
import Message from '../models/Message.js';
import { runResearchPipeline } from '../services/pipeline/orchestrator.js';

// ──────────────────────────────────────────────────────────────────────
// userId is derived from the JWT attached by protect middleware.
// This scopes ALL MongoDB queries to the authenticated user so sessions,
// messages and history are never shared across accounts.
// ──────────────────────────────────────────────────────────────────────

export const createSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, disease, location, additionalContext } = req.body;
    const sessionId = uuidv4();

    const session = await Session.create({
      sessionId,
      userId,
      patientContext: { name, disease, location, additionalContext },
    });

    res.status(201).json({ success: true, sessionId, session });
  } catch (err) {
    console.error('[ChatController] createSession error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, message } = req.body;

    // Verify the session belongs to this user
    const session = await Session.findOne({ sessionId, userId });
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    // Get conversation history (last 10 messages)
    const history = await Message.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(10)
      .lean();

    // Save user message
    await Message.create({ sessionId, role: 'user', content: message });

    // Run research pipeline
    const result = await runResearchPipeline(session.patientContext, message, history);

    // Save assistant message with full research data
    const assistantMsg = await Message.create({
      sessionId,
      role: 'assistant',
      content: result.response,
      query: message,
      expandedQuery: result.expandedQuery,
      publications: result.publications,
      clinicalTrials: result.clinicalTrials,
    });

    // Update session timestamp
    await Session.findOneAndUpdate({ sessionId, userId }, { updatedAt: new Date() });

    res.json({
      success: true,
      message: assistantMsg,
      expandedQuery: result.expandedQuery,
      keywords: result.keywords,
      intent: result.intent,
    });
  } catch (err) {
    console.error('[ChatController] sendMessage error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    // Verify session ownership before returning history
    const session = await Session.findOne({ sessionId, userId });
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    const messages = await Message.find({ sessionId })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const listSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    // Only return sessions that belong to this user
    const sessions = await Session.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
