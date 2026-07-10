import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Pencil, Star, Trophy } from 'lucide-react';
import { CHARACTER_COLORS, CHARACTER_IDS, loadProfiles, renameProfile, updateProfileAppearance } from '../../state/profiles';
import { loadProgress, totalPoints, totalStars } from '../../state/progress';
import { useLocale } from '../../i18n/LocaleContext';
import { LangToggle } from '../ui/LangToggle';
import { SoundToggles } from '../ui/SoundToggles';
import { StarPawn } from '../ui/StarPawn';
import { earnedRewardItems } from '../../data/rewards';

export function PlayerSelect() {
  const navigate = useNavigate();
  const { ui, uiLocale } = useLocale();
  const [profiles, setProfiles] = useState(loadProfiles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setDraftName(currentName);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setProfiles(renameProfile(editingId, draftName));
    setEditingId(null);
  };

  const characterNames = uiLocale === 'fr'
    ? ['Classique', 'Pousse', 'Couronne', 'Magicien', 'Pirate', 'Astronaute', 'Artiste', 'Diplômé', 'Papillon', 'Super étoile']
    : ['Classic', 'Sprout', 'Crown', 'Wizard', 'Pirate', 'Astronaut', 'Artist', 'Scholar', 'Butterfly', 'Superstar'];
  const colorNames = uiLocale === 'fr'
    ? ['Lagon', 'Baie', 'Raisin', 'Océan', 'Mandarine', 'Soleil', 'Feuille', 'Fruit du dragon']
    : CHARACTER_COLORS.map(({ name }) => name);

  const updateAppearance = (id: string, characterId: typeof CHARACTER_IDS[number], color: string) => {
    setProfiles(updateProfileAppearance(id, characterId, color));
  };

  return (
    <main className="min-h-full flex flex-col items-center justify-center px-5 py-10">
      <header className="mb-8 w-full max-w-xl text-center">
        <h1 className="text-balance font-display text-4xl font-bold leading-tight text-grape sm:text-6xl">
          {ui.appTitle}
        </h1>
        <p className="mt-2 font-display text-xl text-ink/70">{ui.appTagline}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <LangToggle />
          <SoundToggles />
        </div>
      </header>

      <h2 className="font-display text-2xl text-ink mb-6">{ui.choosePlayer}</h2>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
        {profiles.map((profile) => {
          const progress = loadProgress(profile.id);
          const rewardItems = earnedRewardItems(progress);
          const points = totalPoints(progress);
          const stars = totalStars(progress);
          const isEditing = editingId === profile.id;
          return (
            <div
              key={profile.id}
              className="relative rounded-(--radius-blob) bg-white p-7 text-center shadow-(--shadow-pop)"
            >
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => startEdit(profile.id, profile.name)}
                  aria-label={`${ui.customizeCharacter}: ${profile.name}`}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center
                             rounded-full bg-cream-deep text-ink/60 transition-colors hover:text-grape"
                >
                  <Pencil size={18} aria-hidden="true" />
                </button>
              )}

              {isEditing ? (
                <div className="flex flex-col items-center">
                  <div
                    className="mb-4 flex h-28 w-28 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${profile.color}22` }}
                  >
                    <StarPawn size={96} color={profile.color} characterId={profile.characterId} label={profile.name} items={rewardItems} />
                  </div>
                  <input
                    autoFocus
                    value={draftName}
                    maxLength={20}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    aria-label={ui.editName}
                    className="w-full max-w-52 rounded-2xl border-3 border-grape bg-cream px-3 py-2
                               text-center font-display text-xl font-bold text-ink outline-none"
                  />
                  <fieldset className="mt-5 w-full border-0 p-0">
                    <legend className="mb-2 font-display text-base font-bold text-ink">{ui.chooseCharacter}</legend>
                    <div className="grid grid-cols-5 gap-2">
                      {CHARACTER_IDS.map((characterId, index) => {
                        const selected = profile.characterId === characterId;
                        return (
                          <button
                            key={characterId}
                            type="button"
                            aria-label={characterNames[index]}
                            aria-pressed={selected}
                            title={characterNames[index]}
                            onClick={() => updateAppearance(profile.id, characterId, profile.color)}
                            className={`flex aspect-square items-center justify-center rounded-xl border-3 bg-cream transition-transform hover:-translate-y-0.5 ${selected ? 'border-grape shadow-(--shadow-nub)' : 'border-transparent'}`}
                          >
                            <StarPawn size={42} color={profile.color} characterId={characterId} label={characterNames[index]} />
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                  <fieldset className="mt-5 w-full border-0 p-0">
                    <legend className="mb-2 font-display text-base font-bold text-ink">{ui.chooseColor}</legend>
                    <div className="flex flex-wrap justify-center gap-3">
                      {CHARACTER_COLORS.map(({ value }, index) => {
                        const selected = profile.color.toLowerCase() === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            aria-label={colorNames[index]}
                            aria-pressed={selected}
                            title={colorNames[index]}
                            onClick={() => updateAppearance(profile.id, profile.characterId, value)}
                            className={`relative h-11 w-11 rounded-full border-4 transition-transform hover:scale-110 ${selected ? 'border-grape' : 'border-white shadow-(--shadow-nub)'}`}
                            style={{ backgroundColor: value }}
                          >
                            {selected ? <Check className="absolute inset-0 m-auto text-white drop-shadow-sm" size={22} strokeWidth={4} aria-hidden="true" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-lagoon px-5 py-2
                               font-display font-semibold text-white shadow-(--shadow-nub)
                               active:translate-y-0.5 active:shadow-none"
                  >
                    <Check size={18} aria-hidden="true" />
                    {ui.save}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(`/play/${profile.id}`)}
                  className="group w-full transition-transform duration-150 hover:-translate-y-1 active:translate-y-0"
                >
                  <div
                    className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${profile.color}22` }}
                  >
                    <StarPawn size={96} color={profile.color} characterId={profile.characterId} label={profile.name} items={rewardItems} />
                  </div>
                  <div className="font-display text-2xl font-bold text-ink">{profile.name}</div>
                  <div className="mt-2 flex items-center justify-center gap-4 text-sm font-semibold text-ink/60">
                    <span className="inline-flex items-center gap-1">
                      <Star
                        size={16}
                        className="text-sunshine"
                        fill="var(--color-sunshine)"
                        aria-hidden="true"
                      />
                      {stars}
                    </span>
                    <span className="font-display text-base font-bold text-grape">
                      {points} {ui.points}
                    </span>
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate('/leaderboard')}
        className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-sunshine px-6 py-3 font-display
                   text-lg font-semibold text-ink shadow-[0_6px_0_#e0a500] transition-transform
                   duration-100 active:translate-y-1 active:shadow-none"
      >
        <Trophy size={22} aria-hidden="true" />
        {ui.leaderboard}
      </button>
    </main>
  );
}
