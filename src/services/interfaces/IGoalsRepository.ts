import { Goal, GoalMilestone, GoalTimeframe } from '@/types';

/**
 * Goals Repository Interface
 */
export interface IGoalsRepository {
  /**
   * Create a new goal
   */
  createGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal>;

  /**
   * Get all goals for a user
   */
  getGoals(userId: string, timeframe?: GoalTimeframe): Promise<Goal[]>;

  /**
   * Get a single goal by ID
   */
  getGoal(goalId: string): Promise<Goal | null>;

  /**
   * Update a goal
   */
  updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal>;

  /**
   * Delete a goal
   */
  deleteGoal(goalId: string): Promise<void>;

  /**
   * Create a milestone for a goal
   */
  createMilestone(milestone: Omit<GoalMilestone, 'id' | 'createdAt'>): Promise<GoalMilestone>;

  /**
   * Get milestones for a goal
   */
  getMilestones(goalId: string): Promise<GoalMilestone[]>;

  /**
   * Update a milestone
   */
  updateMilestone(milestoneId: string, updates: Partial<GoalMilestone>): Promise<GoalMilestone>;

  /**
   * Delete a milestone
   */
  deleteMilestone(milestoneId: string): Promise<void>;

  /**
   * Get weekly focus (nearest milestones across all timeframes)
   */
  getWeeklyFocus(userId: string, limit?: number): Promise<Array<{ goal: Goal; milestone: GoalMilestone }>>;
}