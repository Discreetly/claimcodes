import bip39ish from './bip39ish';
import { ClaimCodeT } from './types';

export function generateRandomClaimCode(length: number = 4) {
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
  numberOfCodes: number,
  codeWordLength: number = 4,
  claimCodes: ClaimCodeT[] = []
): ClaimCodeT[] {
  let codes: string[] = [];
  for (let i = 0; i < numberOfCodes; i++) {
    let pass = false;
    while (pass == false) {
      let code: string = generateRandomClaimCode(codeWordLength);
      if (codes.includes(code)) {
        continue;
      }
      codes.push(code);
      pass = true;
    }
  }
  codes.forEach((code) => {
    console.log(code);
    claimCodes.push({
      code: code,
      used: false
    });
  });

  return claimCodes;
}
