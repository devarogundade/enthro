import { AccountType, WalletType, type Account } from '@/types';
import { defineStore } from 'pinia';

export const useWalletStore = defineStore('address', {
  state: () => ({
    address: null as string | null,
    walletType: WalletType.AptosConnect,
    account: null as Account | null,
    accountType: AccountType.Google
  }),
  actions: {
    setAddress(newAddress: string | null) {
      if (!newAddress) {
        this.address = null;
        return;
      }
      this.address = newAddress;
    },
    setWalletType(newWalletType: WalletType) {
      this.walletType = newWalletType;
    },
    setAccount(newAccount: Account | null) {
      this.account = newAccount;
    },
    setAccountType(newAccountType: AccountType) {
      this.accountType = newAccountType;
    },
  }
});
