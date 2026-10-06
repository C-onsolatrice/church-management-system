export class CreateTitheDto {
  amount: number;
  paymentMethod: string;
  description?: string;
  note?: string;
  userId?: string;
  memberId?: string;
  branchId: string;
}