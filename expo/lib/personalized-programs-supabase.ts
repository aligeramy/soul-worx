import { supabase } from './supabase';
import type { PersonalizedProgram, ProgramChecklistItem } from './types';

const toDateStr = (v: unknown): string =>
  typeof v === 'string' ? v : (v as Date)?.toISOString?.() ?? '';

function mapChecklistItem(i: any): ProgramChecklistItem {
  return {
    id: i.id,
    programId: i.programId ?? i.program_id,
    dueDate: toDateStr(i.dueDate ?? i.due_date),
    completed: i.completed ?? false,
    completedAt: i.completedAt ?? i.completed_at ? toDateStr(i.completedAt ?? i.completed_at) : null,
    enjoymentRating: i.enjoymentRating ?? i.enjoyment_rating ?? null,
    difficultyRating: i.difficultyRating ?? i.difficulty_rating ?? null,
    daysLate: i.daysLate ?? i.days_late ?? 0,
  };
}

function mapProgram(p: any, checklistItems: ProgramChecklistItem[]): PersonalizedProgram {
  return {
    id: p.id,
    userId: p.userId ?? p.user_id,
    createdBy: p.createdBy ?? p.created_by,
    title: p.title,
    description: p.description,
    videoUrl: p.videoUrl ?? p.video_url ?? '',
    thumbnailUrl: p.thumbnailUrl ?? p.thumbnail_url ?? null,
    trainingDays: p.trainingDays ?? p.training_days ?? [],
    startDate: toDateStr(p.startDate ?? p.start_date),
    endDate: toDateStr(p.endDate ?? p.end_date),
    status: (p.status ?? 'active') as PersonalizedProgram['status'],
    checklistItems,
  };
}

/**
 * Fetch all personalized programs for a user from Supabase (works with app auth).
 */
export async function fetchPersonalizedProgramsFromSupabase(
  userId: string
): Promise<PersonalizedProgram[]> {
  const { data: programsData, error: programsError } = await supabase
    .from('personalized_program')
    .select('*')
    .eq('userId', userId)
    .order('startDate', { ascending: true });

  if (programsError) throw programsError;
  if (!programsData?.length) return [];

  const programsWithChecklist = await Promise.all(
    programsData.map(async (p) => {
      const { data: items } = await supabase
        .from('program_checklist_item')
        .select('*')
        .eq('programId', p.id)
        .order('dueDate', { ascending: true });
      const checklistItems: ProgramChecklistItem[] = (items || []).map(mapChecklistItem);
      return mapProgram(p, checklistItems);
    })
  );
  return programsWithChecklist;
}

/**
 * Fetch a single personalized program by id for a user from Supabase.
 */
export async function fetchPersonalizedProgramFromSupabase(
  userId: string,
  programId: string
): Promise<PersonalizedProgram | null> {
  const { data: programData, error: programError } = await supabase
    .from('personalized_program')
    .select('*')
    .eq('id', programId)
    .eq('userId', userId)
    .single();

  if (programError || !programData) return null;

  const { data: items } = await supabase
    .from('program_checklist_item')
    .select('*')
    .eq('programId', programId)
    .order('dueDate', { ascending: true });
  const checklistItems: ProgramChecklistItem[] = (items || []).map(mapChecklistItem);

  return mapProgram(programData, checklistItems);
}

/**
 * Check off a checklist item and save ratings (Supabase – works with app auth).
 * Caller must ensure the item belongs to a program owned by the current user (e.g. RLS).
 */
export async function completeChecklistItemSupabase(
  itemId: string,
  payload: { enjoymentRating: number; difficultyRating: number }
): Promise<void> {
  const { data: item, error: fetchError } = await supabase
    .from('program_checklist_item')
    .select('dueDate, due_date')
    .eq('id', itemId)
    .single();

  if (fetchError || !item) throw new Error('Checklist item not found');

  const dueDate = new Date((item.dueDate ?? item.due_date) as string);
  const completedAt = new Date();
  const daysLate = Math.max(0, Math.floor((completedAt.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000)));

  const updatePayload: Record<string, unknown> = {
    completed: true,
    completedAt: completedAt.toISOString(),
    enjoymentRating: payload.enjoymentRating,
    difficultyRating: payload.difficultyRating,
    daysLate,
    updatedAt: completedAt.toISOString(),
  };

  const { error: updateError } = await supabase
    .from('program_checklist_item')
    .update(updatePayload)
    .eq('id', itemId);

  if (updateError) throw updateError;
}

/**
 * Uncheck a checklist item (Supabase – works with app auth).
 */
export async function uncompleteChecklistItemSupabase(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('program_checklist_item')
    .update({
      completed: false,
      completedAt: null,
      enjoymentRating: null,
      difficultyRating: null,
      daysLate: 0,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', itemId);

  if (error) throw error;
}
