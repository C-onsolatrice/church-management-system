export class CreateEventDto {
  title: string;
  description?: string;
  type?: string;
  date: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  capacity?: number;
  isPublic?: boolean;
  branchId: string;
}