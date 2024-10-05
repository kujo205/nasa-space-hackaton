import type {DB as SupabaseDatabase} from './generated'
import type {KyselifyDatabase} from 'kysely-supabase'

export type Database = KyselifyDatabase<SupabaseDatabase>
