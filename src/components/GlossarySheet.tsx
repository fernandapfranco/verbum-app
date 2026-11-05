import { router } from 'expo-router';

import type { GlossaryTerm } from '@/content/glossary';
import { useTheme } from '@/theme';

import { Sheet } from './Sheet';
import { Button, ReviewTag, T } from './ui';

export function GlossarySheet({ term, onClose }: { term: GlossaryTerm | null; onClose: () => void }) {
  const { c } = useTheme();
  return (
    <Sheet visible={!!term} onClose={onClose} title={term?.termo}>
      {term && (
        <>
          {term.antiga && (
            <T variant="label" color={c.goldText}>
              Palavra antiga
            </T>
          )}
          <T>{term.definicao}</T>
          {term.fontes && term.fontes.length > 0 && (
            <T variant="caption" muted>
              Para aprofundar: {term.fontes.join(' · ')}
            </T>
          )}
          <ReviewTag status={term.status} />
          <Button
            title="Ver glossário completo"
            kind="ghost"
            onPress={() => {
              onClose();
              router.push('/glossario');
            }}
          />
        </>
      )}
    </Sheet>
  );
}
