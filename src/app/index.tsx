import { Redirect } from 'expo-router';

import { LEGAL_VERSION } from '@/content/legal';
import { useSettings } from '@/store/settings';

/** Decide a primeira tela: concordância → onboarding → início. */
export default function Gate() {
  const consent = useSettings((s) => s.consent);
  const onboardingDone = useSettings((s) => s.onboarding.done);

  if (!consent || consent.legalVersion !== LEGAL_VERSION || !consent.ageConfirmed) {
    return <Redirect href="/boas-vindas" />;
  }
  if (!onboardingDone) return <Redirect href="/onboarding" />;
  return <Redirect href="/hoje" />;
}
