/** Tipos de domínio do aplicativo "Mimos da Fofinha". */

export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  role: UserRole
  displayName: string
  onboardingCompletedAt: string | null
  createdAt: string
}

export interface Treat {
  id: string
  name: string
  description: string
  icon: string
  costCredits: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TreatWithStats extends Treat {
  redemptionCount: number
}

export interface Redemption {
  id: string
  treatId: string
  userId: string
  costCredits: number
  redeemedAt: string
  note: string | null
}

export interface RedemptionWithTreat extends Redemption {
  treat: Pick<Treat, 'id' | 'name' | 'icon' | 'description'>
}

export type CreditTransactionReason =
  | 'grant'
  | 'redemption'
  | 'adjustment'
  | 'custom_request_approved'

export interface CreditTransaction {
  id: string
  userId: string
  amount: number
  reason: CreditTransactionReason
  note: string | null
  createdBy: string
  createdAt: string
}

export type CustomRequestStatus = 'pending' | 'approved' | 'rejected'

export interface CustomRequest {
  id: string
  userId: string
  message: string
  status: CustomRequestStatus
  approvedCostCredits: number | null
  adminNote: string | null
  createdAt: string
  resolvedAt: string | null
  resolvedBy: string | null
}
