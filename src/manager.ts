import { ClaimCodeT, ClaimCodeSetsT } from './types';
import generateClaimCodes from './codeGeneration';

export enum ClaimCodeStatusEnum {
  CLAIMED = 'CLAIMED',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_USED = 'ALREADY_USED'
}

export interface ClaimCodeStatus {
  status: ClaimCodeStatusEnum;
  message: string;
  claimCodes: ClaimCodeT[];
  groupID?: BigInt;
}

const emptyClaimCodeSet: ClaimCodeSetsT = {
  '0': {
    claimCodes: [],
    groupID: BigInt(0),
    generationTime: Date.now(),
    name: 'UNASSIGNED'
  }
};

export default class ClaimCodeManager {
  claimCodeSets: ClaimCodeSetsT;

  constructor(claimCodeSetInput: ClaimCodeSetsT = emptyClaimCodeSet) {
    this.claimCodeSets = claimCodeSetInput;
  }

  private static markClaimCodeAsUsed(code: string, claimCodes: ClaimCodeT[]): ClaimCodeStatus {
    let message = 'Successfully claimed code';
    let status = ClaimCodeStatusEnum.NOT_FOUND;
    for (let claimCode of claimCodes) {
      if (claimCode.code === code) {
        if (claimCode.used) {
          message = `Claim code ${code} has already been used`;
          status = ClaimCodeStatusEnum.ALREADY_USED;
          return { status, message, claimCodes };
        }
        claimCode.used = true;
        status = ClaimCodeStatusEnum.CLAIMED;
        return { status, message, claimCodes };
      }
    }
    message = `Claim code ${code} does not exist`;
    status = ClaimCodeStatusEnum.NOT_FOUND;
    return { status, message, claimCodes };
  }

  public generateClaimCodeSet(
    count: number,
    groupID: bigint = BigInt(0),
    name: string = '',
    codeWordLength: number = 5
  ) {
    const groupIDstr = groupID.toString();
    if (this.claimCodeSets[groupIDstr]) {
      this.claimCodeSets[groupIDstr].claimCodes = generateClaimCodes(
        count,
        codeWordLength,
        this.claimCodeSets[groupIDstr].claimCodes
      );
    } else {
      this.claimCodeSets[groupIDstr] = {
        claimCodes: generateClaimCodes(count),
        groupID: BigInt(groupID),
        generationTime: Date.now(),
        name: name
      };
    }
    this.claimCodeSets[groupIDstr].groupID = BigInt(groupID);
    this.claimCodeSets[groupIDstr].generationTime = Date.now();
    if (name) {
      this.claimCodeSets[groupIDstr].name = name;
    }
    return this.claimCodeSets[groupIDstr];
  }

  public claimCode(code: string): ClaimCodeStatus {
    for (let claimCodeSet in this.claimCodeSets) {
      let result = ClaimCodeManager.markClaimCodeAsUsed(
        code,
        this.claimCodeSets[claimCodeSet].claimCodes
      );
      if (result.status === ClaimCodeStatusEnum.CLAIMED) {
        result.groupID = BigInt(claimCodeSet);
        return result;
      } else if (result.status === ClaimCodeStatusEnum.ALREADY_USED) {
        result.groupID = BigInt(claimCodeSet);
        return result;
      } else {
        continue;
      }
    }
    return {
      status: ClaimCodeStatusEnum.NOT_FOUND,
      message: `Claim code ${code} does not exist`,
      claimCodes: []
    };
  }

  public getClaimCodeSets(): ClaimCodeSetsT {
    return this.claimCodeSets;
  }

  public getClaimCodeSet(groupID: number | string): ClaimCodeSetsT {
    groupID = groupID.toString();
    const o = { groupID: this.claimCodeSets[groupID] };
    return o;
  }

  public getUsedCount(groupID: number | string): {
    usedCount: number;
    unusedCount: number;
    totalCount: number;
  } {
    groupID = groupID.toString();
    let usedCount = 0;
    const totalCount = this.claimCodeSets[groupID].claimCodes.length;
    for (let claimCode of this.claimCodeSets[groupID].claimCodes) {
      if (claimCode.used) {
        usedCount++;
      }
    }
    const unusedCount = totalCount - usedCount;
    return { usedCount, unusedCount, totalCount };
  }

  public getGroupIdFromName(name: string): BigInt | undefined {
    for (const claimCodeSet of Object.values(this.claimCodeSets)) {
      if (claimCodeSet.name === name) {
        return claimCodeSet.groupID;
      }
    }
    return undefined;
  }
}
