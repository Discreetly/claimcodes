import bip39ish, { bip39 } from './bip39ish';
import { ClaimCodeT } from './types';

export function generateRandomClaimCode(length: number = 2) {
  if (length < 1) throw new Error('length must be greater than 0');
  if (length > 24) throw new Error('length must be less than 24');

  let code: string[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * bip39ish.length);

    code.push(bip39ish[randomIndex]);
  }
  return code.join('-');
}

export default function generateClaimCodes(
  count: number,
  claimCodes: ClaimCodeT[] = []
): ClaimCodeT[] {
  let codes: string[] = [];
  for (let i = 0; i < count; i++) {
    let pass = false;
    while (pass == false) {
      let code: string = generateRandomClaimCode();
      if (codes.includes(code)) {
        continue;
      }
      pass = true;
    }
    claimCodes.push({
      code: generateRandomClaimCode(),
      used: false
    });
  }
  return claimCodes;
}
