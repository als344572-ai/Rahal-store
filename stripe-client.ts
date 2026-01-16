
import { loadStripe } from '@stripe/stripe-js';

// Using the provided publishable key for secure transactions
export const STRIPE_PUBLISHABLE_KEY = 'sb_ublishable_tdILDK1ICVepPCOoagARqQ_EVB1X';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
