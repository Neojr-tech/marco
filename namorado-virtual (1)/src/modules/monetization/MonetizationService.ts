import { PLANS_CONFIG } from '../../data/initialData';
import { PlanType, UsageCredits } from '../../types';

export class MonetizationService {
  private usage: UsageCredits;

  constructor(initialUsage?: Partial<UsageCredits>) {
    this.usage = {
      plan: initialUsage?.plan || 'free',
      messagesUsedToday: initialUsage?.messagesUsedToday || 0,
      dailyMessageLimit: initialUsage?.dailyMessageLimit || 50,
      imageCredits: initialUsage?.imageCredits ?? 5,
      videoCredits: initialUsage?.videoCredits ?? 3,
      bonusCredits: initialUsage?.bonusCredits || 10,
      lastResetDate: initialUsage?.lastResetDate || new Date().toISOString().split('T')[0],
    };
    this.checkDailyReset();
  }

  private checkDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    if (this.usage.lastResetDate !== today) {
      this.usage.lastResetDate = today;
      this.usage.messagesUsedToday = 0;
      const planConfig = PLANS_CONFIG[this.usage.plan];
      if (typeof planConfig.dailyMessagesLimit === 'number') {
        this.usage.dailyMessageLimit = planConfig.dailyMessagesLimit;
      }
      this.usage.imageCredits = Math.max(this.usage.imageCredits, planConfig.imageGenerationDaily);
    }
  }

  public getUsage(): UsageCredits {
    return { ...this.usage };
  }

  public canSendMessage(): boolean {
    if (this.usage.plan !== 'free') return true;
    return this.usage.messagesUsedToday < this.usage.dailyMessageLimit;
  }

  public consumeMessage(): boolean {
    if (!this.canSendMessage()) return false;
    this.usage.messagesUsedToday += 1;
    return true;
  }

  public canGenerateImage(): boolean {
    if (this.usage.plan === 'vip') return true;
    return this.usage.imageCredits > 0 || this.usage.bonusCredits > 0;
  }

  public consumeImageCredit(): boolean {
    if (this.usage.plan === 'vip') return true;
    if (this.usage.imageCredits > 0) {
      this.usage.imageCredits -= 1;
      return true;
    }
    if (this.usage.bonusCredits > 0) {
      this.usage.bonusCredits -= 1;
      return true;
    }
    return false;
  }

  public canUnlockVideo(cost = 2): boolean {
    if (this.usage.plan === 'vip') return true;
    return (this.usage.videoCredits + this.usage.bonusCredits) >= cost;
  }

  public consumeVideoCredit(cost = 2): boolean {
    if (this.usage.plan === 'vip') return true;
    if (this.usage.videoCredits >= cost) {
      this.usage.videoCredits -= cost;
      return true;
    }
    const rem = cost - this.usage.videoCredits;
    this.usage.videoCredits = 0;
    this.usage.bonusCredits = Math.max(0, this.usage.bonusCredits - rem);
    return true;
  }

  public upgradePlan(newPlan: PlanType) {
    this.usage.plan = newPlan;
    const planConfig = PLANS_CONFIG[newPlan];
    if (newPlan === 'free') {
      this.usage.dailyMessageLimit = 50;
    } else {
      this.usage.dailyMessageLimit = 999999;
      this.usage.imageCredits += 30;
      this.usage.videoCredits += 15;
      this.usage.bonusCredits += 50;
    }
  }

  public addBonusCredits(amount: number) {
    this.usage.bonusCredits += amount;
  }
}
