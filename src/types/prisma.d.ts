import { Prisma } from '@prisma/client';

// Étendre le type sellers pour inclure is_approved
declare module '@prisma/client' {
  export namespace Prisma {
    export interface sellersCreateInput {
      is_approved?: boolean;
    }
    
    export interface sellersUpdateInput {
      is_approved?: boolean | Prisma.BoolFieldUpdateOperationsInput;
    }
    
    export interface sellersUncheckedUpdateInput {
      is_approved?: boolean | Prisma.BoolFieldUpdateOperationsInput;
    }
  }
} 