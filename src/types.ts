export type ClaimCodeT = {
  code: string;
  used: boolean;
};

export type ClaimCodeSetT = {
  claimCodes: ClaimCodeT[];
  groupID: bigint;
  generationTime?: number;
  name?: string;
};

export type ClaimCodeSetsT = {
  [key: number | string]: ClaimCodeSetT;
};
