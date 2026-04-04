import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunks for quiz operations
export const startQuiz = createAsyncThunk(
  'quiz/start',
  async (quizData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Ensure user_id is set - could be 'id', 'user_id', or 'uuid'
      let user_id = quizData.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...quizData,
        user_id
      };
      
      const response = await API.post('/quiz/start', dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to start quiz');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submit',
  async (submissionData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Ensure user_id is set - could be 'id', 'user_id', or 'uuid'
      let user_id = submissionData.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...submissionData,
        user_id
      };
      
      const response = await API.post('/quiz/submit', dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit quiz');
    }
  }
);

export const startSubjectQuiz = createAsyncThunk(
  'quiz/startSubject',
  async (quizConfig, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      let user_id = quizConfig.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }

      const dataToSend = {
        user_id,
        subject_id: quizConfig.subject_id,
        question_type: quizConfig.question_type.toLowerCase() || 'easy',
        limit: quizConfig.limit || 20
      };

      const response = await API.post('/subject-quiz/start', dataToSend);
      
      
      
      // Backend returns: { success, attempt: { id, started_at, ... }, questions: [] }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to start subject quiz');
    }
  }
);

export const submitSubjectQuiz = createAsyncThunk(
  'quiz/submitSubject',
  async (submissionData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      let user_id = submissionData.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...submissionData,
        user_id
      };
      
      const response = await API.post('/subject-quiz/submit', dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit subject quiz');
    }
  }
);

export const resetQuiz = createAsyncThunk(
  'quiz/reset',
  async (resetData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Ensure user_id is set - could be 'id', 'user_id', or 'uuid'
      let user_id = resetData.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...resetData,
        user_id
      };
      
      const response = await API.post('/quiz/reset', dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reset quiz');
    }
  }
);

export const fetchQuizHistory = createAsyncThunk(
  'quiz/fetchHistory',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Use provided userId or fallback to auth state
      let user_id = userId;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const response = await API.post('/quiz-history', { user_id });
      
      
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch quiz history');
    }
  }
);

export const fetchRankings = createAsyncThunk(
  'quiz/fetchRankings',
  async (rankingsData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Ensure user_id is set - could be 'id', 'user_id', or 'uuid'
      let user_id = rankingsData.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...rankingsData,
        user_id
      };
      
      const response = await API.post('/quiz/rankings', dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch rankings');
    }
  }
);

export const fetchAttemptDetails = createAsyncThunk(
  'quiz/fetchAttemptDetails',
  async (attemptData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Get valid user_id from auth state if not provided in attemptData
      let user_id = attemptData.user_id;
      if (!user_id) {
        // Try to get from auth state - could be 'id', 'user_id', or 'uuid'
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...attemptData,
        user_id
      };
      
      const response = await API.post('/quiz-attempt/details', dataToSend);
      
      
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch attempt details');
    }
  }
);

export const resetQuizProgress = createAsyncThunk(
  'quiz/reset',
  async ({ scope, subjectId, questionType }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      
      const response = await API.post('/quiz/reset', {
        user_id,
        scope,
        subject_id: subjectId,
        question_type: questionType
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reset quiz progress');
    }
  }
);

export const fetchQuizResults = createAsyncThunk(
  'quiz/fetchResults',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/quiz/results/${quizId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch quiz results');
    }
  }
);

export const fetchChapterQuiz = createAsyncThunk(
  'quiz/fetchChapterQuiz',
  async (quizData, { rejectWithValue, getState }) => {
    try {
      // Use new endpoint: /amc/chapter-quiz
      // Body should be: { chapter_id, limit, user_id, question_type }
      const state = getState();
      const user_id = quizData.user_id || state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      
      const dataToSend = {
        chapter_id: quizData.chapter_id,
        limit: quizData.limit || 15,
        user_id,
        question_type: (quizData.question_type || 'easy').toLowerCase()
      };
      
      
      
      

      const response = await API.post(`/amc/chapter-quiz`, dataToSend);

      
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch chapter quiz');
    }
  }
);

export const fetchTopicQuiz = createAsyncThunk(
  'quiz/fetchTopicQuiz',
  async (quizData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Ensure user_id is set - could be 'id', 'user_id', or 'uuid'
      let user_id = quizData.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...quizData,
        user_id
      };
      
      const response = await API.post('/topic-quizzes', dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch topic quiz');
    }
  }
);

export const fetchMixedQuiz = createAsyncThunk(
  'quiz/fetchMixedQuiz',
  async (quizData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Ensure user_id is set - could be 'id', 'user_id', or 'uuid'
      let user_id = quizData.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...quizData,
        user_id
      };
      
      const response = await API.post('/mixed-quiz', dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch mixed quiz');
    }
  }
);

export const startMultiChapterQuiz = createAsyncThunk(
  'quiz/startMultiChapter',
  async (quizData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      let user_id = quizData.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...quizData,
        user_id
      };
      
      // AMC multi-chapter quiz endpoint 
      const response = await API.post('/amc/multi-chapter-quiz', dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to start multi-chapter quiz');
    }
  }
);

// AMC Quiz thunks
export const startAMCQuiz = createAsyncThunk(
  'quiz/startAMC',
  async (quizData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Ensure user_id is set - could be 'id', 'user_id', or 'uuid'
      let user_id = quizData.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...quizData,
        user_id
      };
      
      const response = await API.post('/amc-quiz/start', dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to start AMC quiz');
    }
  }
);

export const submitAMCQuiz = createAsyncThunk(
  'quiz/submitAMC',
  async (submissionData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Ensure user_id is set - could be 'id', 'user_id', or 'uuid'
      let user_id = submissionData.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...submissionData,
        user_id
      };
      
      const response = await API.post('/amc-quiz/submit', dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit AMC quiz');
    }
  }
);

export const resetAMCQuiz = createAsyncThunk(
  'quiz/resetAMC',
  async (resetData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Ensure user_id is set - could be 'id', 'user_id', or 'uuid'
      let user_id = resetData.user_id;
      if (!user_id) {
        user_id = state.auth.user?.user_id || state.auth.user?.id || state.auth.user?.uuid;
      }
      
      const dataToSend = {
        ...resetData,
        user_id
      };
      
      const response = await API.post('/quiz/reset', { ...dataToSend, scope: 'AMC' });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reset AMC quiz');
    }
  }
);

// Initial state
const initialState = {
  currentQuiz: null,
  quizResult: null,
  history: [],
  rankings: [],
  attemptDetails: null,
  loading: false,
  error: null,
};

// Quiz slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
      state.quizResult = null;
    },
    clearQuizResult: (state) => {
      state.quizResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start quiz
      .addCase(startQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Submit quiz
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizResult = action.payload;
        state.currentQuiz = null;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Submit subject quiz
      .addCase(submitSubjectQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSubjectQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizResult = action.payload;
        state.currentQuiz = null;
      })
      .addCase(submitSubjectQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Start subject quiz
      .addCase(startSubjectQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startSubjectQuiz.fulfilled, (state, action) => {
        state.loading = false;
        // The API returns questions in action.payload.questions (array)
        const transformedQuiz = {
          ...action.payload,
          subject_id: action.payload.subject_id || action.payload.attempt?.subject_id,
          question_type: action.payload.question_type || action.payload.attempt?.question_type,
          questions: action.payload.questions?.map(q => ({
            ...q,
            id: q.id || q.question_id,
            question: q.question_text || q.question,
            options: q.options || [],
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            male_explanation_audio_url: q.male_explanation_audio_url,
            female_explanation_audio_url: q.female_explanation_audio_url,
          })) || []
        };
        state.currentQuiz = transformedQuiz;
      })
      .addCase(startSubjectQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Reset quiz
      .addCase(resetQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetQuiz.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch history
      .addCase(fetchQuizHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.data || action.payload;
      })
      .addCase(fetchQuizHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch rankings
      .addCase(fetchRankings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRankings.fulfilled, (state, action) => {
        state.loading = false;
        state.rankings = action.payload;
      })
      .addCase(fetchRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch attempt details
      .addCase(fetchAttemptDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttemptDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.attemptDetails = action.payload;
        // Also set as currentQuiz if it has questions
        if (action.payload?.questions) {
          state.currentQuiz = action.payload;
        }
      })
      .addCase(fetchAttemptDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch quiz results
      .addCase(fetchQuizResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.loading = false;
        state.quizResult = action.payload;
      })
      .addCase(fetchQuizResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Chapter quiz
      .addCase(fetchChapterQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChapterQuiz.fulfilled, (state, action) => {
        state.loading = false;
        // The new API response format: { success, attempt_id, total, data: [...] }
        const transformedQuiz = {
          ...action.payload,
          id: action.payload.attempt_id, // Important: Store attempt_id as the quiz ID
          attempt_id: action.payload.attempt_id,
          questions: action.payload.data?.map(q => ({
            ...q,
            id: q.id || q.question_id,
            question: q.question_text || q.question,
            options: q.options || [], // Preserve objects with option_key and content
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            explanation_audio_urls: q.explanation_audio_urls,
            question_type: q.question_type,
            question_image_url: q.question_image_url
          })) || []
        };
        
        
        
        state.currentQuiz = transformedQuiz;
      })
      .addCase(fetchChapterQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Topic quiz
      .addCase(fetchTopicQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopicQuiz.fulfilled, (state, action) => {
        state.loading = false;
        // Transform API response to match expected format
        const transformedQuiz = {
          ...action.payload,
          questions: action.payload.data?.map(q => ({
            ...q,
            id: q.id,
            male_explanation_audio_url: q.male_explanation_audio_url,
            female_explanation_audio_url: q.female_explanation_audio_url,
            question: q.question_text,
            options: q.options || [],
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            question_type: q.question_type,
            question_image_url: q.question_image_url
          })) || []
        };
        state.currentQuiz = transformedQuiz;
      })
      .addCase(fetchTopicQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mixed quiz
      .addCase(fetchMixedQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMixedQuiz.fulfilled, (state, action) => {
        state.loading = false;
        // Transform API response to match expected format
        const transformedQuiz = {
          ...action.payload,
          questions: action.payload.data?.map(q => ({
            ...q,
            id: q.id,
            male_explanation_audio_url: q.male_explanation_audio_url,
            female_explanation_audio_url: q.female_explanation_audio_url,
            question: q.question_text,
            options: q.options || [],
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            question_type: q.question_type,
            question_image_url: q.question_image_url
          })) || []
        };
        state.currentQuiz = transformedQuiz;
      })
      .addCase(fetchMixedQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Multi-chapter quiz
      .addCase(startMultiChapterQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startMultiChapterQuiz.fulfilled, (state, action) => {
        state.loading = false;
        // Transform API response to match expected format
        const transformedQuiz = {
          ...action.payload,
          questions: action.payload.data?.map(q => ({
            id: q.id,
            question: q.question_text,
            options: q.options || [],
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            question_type: q.question_type,
            question_image_url: q.question_image_url
          })) || []
        };
        state.currentQuiz = transformedQuiz;
      })
      .addCase(startMultiChapterQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // AMC Quiz
      .addCase(startAMCQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startAMCQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(startAMCQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(submitAMCQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAMCQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizResult = action.payload;
        state.currentQuiz = null;
      })
      .addCase(submitAMCQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(resetAMCQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetAMCQuiz.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetAMCQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentQuiz, clearQuizResult } = quizSlice.actions;

// Selectors
export const selectCurrentQuiz = (state) => state.quiz.currentQuiz;
export const selectQuizResult = (state) => state.quiz.quizResult;
export const selectQuizResults = (state) => state.quiz.quizResult; // Alias for compatibility
export const selectQuizHistory = (state) => state.quiz.history;
export const selectRankings = (state) => state.quiz.rankings;
export const selectAttemptDetails = (state) => state.quiz.attemptDetails;
export const selectQuizLoading = (state) => state.quiz.loading;
export const selectQuizError = (state) => state.quiz.error;

export default quizSlice.reducer;
