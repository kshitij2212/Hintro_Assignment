export const checkServerHealth = async () => {
  return false;
};

const generateRandomDate = (daysAgoStart, daysAgoEnd) => {
  const start = new Date();
  start.setDate(start.getDate() - daysAgoEnd);
  const end = new Date();
  end.setDate(end.getDate() - daysAgoStart);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const getLocalMockData = (endpoint, userId = 'u1', params = {}) => {
  if (userId === 'u1') {
    switch (endpoint) {
      case 'profile':
        return {
          id: 'u1',
          email: 'shivam@hintro.ai',
          firstName: 'Shivam',
          lastName: 'Dixit',
          login_method: 'google',
          status: 'active',
          is_hintro_admin: false,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-06-20T14:30:00Z'
        };
      case 'dashboard':
        return {
          user: {
            id: 'u1',
            email: 'shivam@hintro.ai',
            firstName: 'Shivam',
            lastName: 'Dixit',
            login_method: 'google',
            status: 'active',
            is_hintro_admin: false,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-06-20T14:30:00Z'
          },
          subscription: null,
          usage: {
            kb_files: { used: 0, limit: 100, percentage: 0 },
            vocab_terms: 0,
            notes: 0
          }
        };
      case 'stats':
        return {
          totalSessions: 0,
          averageDuration: 0,
          totalAIInteractions: 0,
          lastSession: []
        };
      case 'sessions':
        return {
          callSessions: [],
          pagination: {
            page: 1,
            limit: params.limit || 10,
            totalCount: 0,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
      default:
        return null;
    }
  } else {
    const totalSessions = Math.floor(Math.random() * 200) + 1;
    const averageDuration = Math.floor(Math.random() * 8000) + 1;
    const totalAIInteractions = Math.floor(Math.random() * 70) + 1;

    switch (endpoint) {
      case 'profile':
        return {
          id: 'u2',
          email: 'kshitij.saxena@hintro.ai',
          firstName: 'Kshitij',
          lastName: 'Saxena',
          login_method: 'google',
          status: 'active',
          is_hintro_admin: true,
          createdAt: '2023-11-10T08:15:30Z',
          updatedAt: new Date().toISOString()
        };

      case 'dashboard':
        return {
          user: {
            id: 'u2',
            email: 'kshitij.saxena@hintro.ai',
            firstName: 'Kshitij',
            lastName: 'Saxena',
            login_method: 'google',
            status: 'active',
            is_hintro_admin: true,
            createdAt: '2023-11-10T08:15:30Z',
            updatedAt: new Date().toISOString()
          },
          subscription: {
            plan: 'professional',
            billing_cycle: 'monthly',
            status: 'active'
          },
          usage: {
            kb_files: { used: 181, limit: 1000, percentage: 18 },
            vocab_terms: 104,
            notes: 24
          }
        };

      case 'stats':
        return {
          totalSessions,
          averageDuration,
          totalAIInteractions,
          lastSession: [
            generateRandomDate(1, 3),
            generateRandomDate(4, 10),
            generateRandomDate(11, 20)
          ]
        };

      case 'sessions': {
        const limit = params.limit || 10;
        const clients = ['Acme Corp', 'TechStart', 'BigCorp', 'StartupXYZ', 'Enterprise Inc', 'InnovateLLC', 'Apex Systems', 'SkyNet Global'];
        const descriptions = ['Product demo', 'Onboarding session', 'Business review', 'Feature brainstorm', 'Design Call', 'Partnership sync', 'Sales Call'];
        const languages = [['en'], ['en', 'es'], ['fr', 'en'], ['de']];

        const callSessions = Array.from({ length: limit }).map((_, i) => {
          const startSeconds = Math.floor(Math.random() * 100000);
          const durationSeconds = Math.floor(Math.random() * 3300) + 300;
          const startedAt = generateRandomDate(i * 2 + 1, i * 2 + 3);
          const endedAt = new Date(new Date(startedAt).getTime() + durationSeconds * 1000).toISOString();

          return {
            _id: `cs_u2_${i}_${startSeconds}`,
            user_id: 'u2',
            status: 'ended',
            client: clients[Math.floor(Math.random() * clients.length)],
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            started_at: startedAt,
            ended_at: endedAt,
            total_duration_seconds: durationSeconds,
            language: languages[Math.floor(Math.random() * languages.length)],
            auto_gen_ai_response: Math.random() > 0.3,
            save_transcript: true,
            transcript: null,
            transcript_final: Math.random() > 0.1,
            ai_interactions: Math.floor(Math.random() * 10) + 1,
            call_framework_id: null,
            participants: [
              { name: 'Alex Jones', isUser: true },
              { name: 'Client Participant', isUser: false }
            ],
            ended_reason: Math.random() > 0.1 ? 'user_ended' : 'timeout',
            createdAt: startedAt,
            updatedAt: endedAt
          };
        });

        return {
          callSessions,
          pagination: {
            page: 1,
            limit,
            totalCount: 154,
            totalPages: Math.ceil(154 / limit),
            hasNextPage: true,
            hasPrevPage: false
          }
        };
      }

      default:
        return null;
    }
  }
};

export const getProfile = async (userId) => {
  return getLocalMockData('profile', userId);
};

export const getDashboardData = async (userId) => {
  return getLocalMockData('dashboard', userId);
};

export const getCallSessionStats = async (userId) => {
  return getLocalMockData('stats', userId);
};

export const getCallHistory = async (userId, limit = 10) => {
  return getLocalMockData('sessions', userId, { limit });
};
